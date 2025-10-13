/**
 * Event Processor
 * 
 * Processes alerts and creates events in the events table
 * Extracts event information from alert text and prevents duplicates
 */

import { supabase } from './config';
import type { AlertRecord } from './normalize';

/**
 * Event record for database
 */
interface EventRecord {
  track_id: string;
  title: string;
  description: string | null;
  start_at: string;  // ISO timestamp
  end_at: string | null;
  status: 'scheduled' | 'updated' | 'cancelled';
  url: string | null;
  gate_fee?: string | null;
  class?: string | null;
}

/**
 * Extracted event information from text
 */
interface ExtractedEvent {
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  status: 'scheduled' | 'updated' | 'cancelled';
  gateFee: string | null;
  eventClass: string | null;
}

/**
 * Keywords that indicate cancellation
 */
const CANCELLATION_KEYWORDS = [
  'cancel',
  'cancelled',
  'canceled',
  'postponed',
  'closed',
  'no practice',
  'no race'
];

/**
 * Event type keywords
 */
const EVENT_TYPE_KEYWORDS = {
  practice: ['practice', 'gate practice', 'clinic'],
  race: ['race', 'racing', 'state race', 'national'],
  registration: ['registration', 'sign up', 'signup']
};

/**
 * Extract event type from text
 */
const extractEventType = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  for (const [type, keywords] of Object.entries(EVENT_TYPE_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
  
  return 'Event';
};

/**
 * Check if text is likely event-related (more permissive check)
 */
const isLikelyEvent = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  
  // Event indicators
  const eventIndicators = [
    // Explicit events
    'practice', 'race', 'racing', 'event', 'clinic', 'registration',
    // Time indicators (strong signal)
    'tonight', 'today', 'tomorrow', 'this weekend', 'sunday', 'saturday',
    // Time patterns
    /\d{1,2}:\d{2}/,  // 5:30, 6:00
    /\d{1,2}\s*(am|pm)/i,  // 5pm, 6 PM
    /\d{1,2}-\d{1,2}\s*(pm|am)/i,  // 5-7pm
    // Gate/venue indicators
    'gate', 'gates open', 'see you', 'come out',
  ];
  
  return eventIndicators.some(indicator => {
    if (typeof indicator === 'string') {
      return lowerText.includes(indicator);
    } else {
      return indicator.test(text);
    }
  });
};

/**
 * Extract gate fee from text
 */
const extractGateFee = (text: string): string | null => {
  // Look for patterns like "$10", "$5 gate", "gate fee $10", etc.
  const feePatterns = [
    /\$\d+(?:\.\d{2})?(?:\s+gate)?/i,
    /gate\s+fee[:\s]+\$\d+/i,
    /\d+\s+dollars?/i
  ];
  
  for (const pattern of feePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  return null;
};

/**
 * Extract class/division from text
 */
const extractClass = (text: string): string | null => {
  const lowerText = text.toLowerCase();
  
  // Common BMX classes
  const classes = [
    'strider',
    'novice',
    'intermediate',
    'expert',
    'cruiser',
    'all classes',
    'open'
  ];
  
  for (const className of classes) {
    if (lowerText.includes(className)) {
      return className.charAt(0).toUpperCase() + className.slice(1);
    }
  }
  
  return null;
};

/**
 * Parse time from text (e.g., "6-8 PM", "5:30pm", "7pm")
 */
const parseTimeFromText = (text: string, baseDate: Date = new Date()): Date | null => {
  // Ensure baseDate is valid
  if (!baseDate || isNaN(baseDate.getTime())) {
    baseDate = new Date();
  }
  
  // Patterns: "6-8 PM", "5:30-7:30", "7pm", "5:30pm"
  const timePatterns = [
    /(\d{1,2}):(\d{2})\s*(am|pm)/i,
    /(\d{1,2})\s*(am|pm)/i,
    /(\d{1,2}):(\d{2})/,
  ];
  
  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      const meridiem = match[3]?.toLowerCase();
      
      // Validate hours and minutes
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        continue;
      }
      
      // Convert to 24-hour format
      if (meridiem === 'pm' && hours !== 12) {
        hours += 12;
      } else if (meridiem === 'am' && hours === 12) {
        hours = 0;
      }
      
      const date = new Date(baseDate);
      date.setHours(hours, minutes, 0, 0);
      
      // Verify the date is valid
      if (isNaN(date.getTime())) {
        continue;
      }
      
      return date;
    }
  }
  
  return null;
};

/**
 * Parse date from text (e.g., "tonight", "today", "tomorrow", "Sunday", "10/13")
 */
const parseDateFromText = (text: string, alertPostedAt: Date): Date | null => {
  const lowerText = text.toLowerCase();
  const now = new Date(alertPostedAt);
  
  // Ensure base date is valid
  if (isNaN(now.getTime())) {
    return new Date(); // Fall back to current date
  }
  
  // "tonight" or "today"
  if (lowerText.includes('tonight') || lowerText.includes('today')) {
    return now;
  }
  
  // "tomorrow"
  if (lowerText.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  // Day of week
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < days.length; i++) {
    if (lowerText.includes(days[i])) {
      const targetDay = i;
      const currentDay = now.getDay();
      let daysUntil = targetDay - currentDay;
      if (daysUntil <= 0) daysUntil += 7; // Next occurrence
      
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + daysUntil);
      return targetDate;
    }
  }
  
  // Date patterns like "10/13", "10-13"
  const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})/);
  if (dateMatch) {
    const month = parseInt(dateMatch[1], 10) - 1; // JS months are 0-indexed
    const day = parseInt(dateMatch[2], 10);
    
    // Validate month and day
    if (month < 0 || month > 11 || day < 1 || day > 31) {
      return now; // Invalid date, return base date
    }
    
    const date = new Date(now.getFullYear(), month, day);
    
    // Verify the date is valid
    if (isNaN(date.getTime())) {
      return now;
    }
    
    // If date is in the past, assume next year
    if (date < now) {
      date.setFullYear(date.getFullYear() + 1);
    }
    
    return date;
  }
  
  // Default: use the alert posted date
  return now;
};

/**
 * Extract event information from alert text
 */
const extractEventFromAlert = (alert: AlertRecord): ExtractedEvent | null => {
  const text = alert.text;
  const lowerText = text.toLowerCase();
  
  // Check if it's event-related (use more permissive check)
  if (!isLikelyEvent(text)) {
    return null;
  }
  
  // Determine status
  let status: 'scheduled' | 'updated' | 'cancelled' = 'scheduled';
  if (CANCELLATION_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    status = 'cancelled';
  } else if (lowerText.includes('update') || lowerText.includes('change')) {
    status = 'updated';
  }
  
  // Extract event type and create title
  const eventType = extractEventType(text);
  const baseDate = new Date(alert.posted_at);
  const eventDate = parseDateFromText(text, baseDate);
  
  // Create title
  let title = eventType;
  if (eventDate) {
    const dateStr = eventDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      timeZone: 'America/Denver'
    });
    title = `${eventType} - ${dateStr}`;
  }
  
  // Extract time from text
  const extractedTime = parseTimeFromText(text, eventDate || baseDate);
  
  // Combine date and time properly
  let startDateTime: Date;
  if (extractedTime) {
    // We have a specific time from the text
    startDateTime = extractedTime;
  } else if (eventDate) {
    // We have a date but no time - set to midnight (00:00) as sentinel for "unknown time"
    startDateTime = new Date(eventDate);
    startDateTime.setHours(0, 0, 0, 0); // Midnight = unknown time
  } else {
    // No date or time found - use alert posted date with midnight
    startDateTime = new Date(baseDate);
    startDateTime.setHours(0, 0, 0, 0);
  }
  
  // Try to extract end time from range (e.g., "6-8 PM")
  const timeRangeMatch = text.match(/(\d{1,2}(?::\d{2})?)\s*-\s*(\d{1,2}(?::\d{2})?)\s*(am|pm)/i);
  let endTime: Date | null = null;
  
  if (timeRangeMatch && startDateTime) {
    const endHour = parseInt(timeRangeMatch[2].split(':')[0], 10);
    const endMinute = timeRangeMatch[2].includes(':') 
      ? parseInt(timeRangeMatch[2].split(':')[1], 10) 
      : 0;
    const meridiem = timeRangeMatch[3].toLowerCase();
    
    let adjustedEndHour = endHour;
    if (meridiem === 'pm' && endHour !== 12) {
      adjustedEndHour += 12;
    } else if (meridiem === 'am' && endHour === 12) {
      adjustedEndHour = 0;
    }
    
    endTime = new Date(startDateTime);
    endTime.setHours(adjustedEndHour, endMinute, 0, 0);
  }
  
  return {
    title,
    startDate: startDateTime,
    endDate: endTime,
    status,
    gateFee: extractGateFee(text),
    eventClass: extractClass(text)
  };
};

/**
 * Check if date is valid
 */
const isValidDate = (date: Date | null): boolean => {
  return date !== null && !isNaN(date.getTime());
};

/**
 * Convert extracted event to database record
 */
const eventToRecord = (
  extractedEvent: ExtractedEvent,
  alert: AlertRecord
): EventRecord => {
  // Use valid start date or fall back to alert posted date
  let startDate: Date;
  if (isValidDate(extractedEvent.startDate)) {
    startDate = extractedEvent.startDate!;
  } else {
    startDate = new Date(alert.posted_at);
  }
  
  // Only use end date if it's valid
  const endDate = isValidDate(extractedEvent.endDate) ? extractedEvent.endDate : null;
  
  return {
    track_id: alert.track_id,
    title: extractedEvent.title,
    description: alert.text,
    start_at: startDate.toISOString(),
    end_at: endDate ? endDate.toISOString() : null,
    status: extractedEvent.status,
    url: alert.url,
    gate_fee: extractedEvent.gateFee,
    class: extractedEvent.eventClass
  };
};

/**
 * Upsert event to database (handles duplicates via unique constraint)
 */
const upsertEvent = async (event: EventRecord): Promise<{ success: boolean; isDuplicate: boolean }> => {
  try {
    // Try to insert
    const { error } = await supabase
      .from('events')
      .insert(event);
    
    if (error) {
      // Check if it's a duplicate error (unique constraint violation)
      if (error.code === '23505') {
        return { success: true, isDuplicate: true };
      }
      
      console.error('Error inserting event:', error.message);
      return { success: false, isDuplicate: false };
    }
    
    return { success: true, isDuplicate: false };
    
  } catch (error) {
    console.error('Exception upserting event:', error);
    return { success: false, isDuplicate: false };
  }
};

/**
 * Process alerts and create events
 */
export const processAlertsToEvents = async (options: {
  hoursBack?: number;
  dryRun?: boolean;
} = {}): Promise<{
  processed: number;
  created: number;
  duplicates: number;
  errors: number;
}> => {
  const { hoursBack = 24, dryRun = false } = options;
  
  console.log('\n' + '='.repeat(80));
  console.log('📅 PROCESSING ALERTS TO EVENTS');
  console.log('='.repeat(80));
  console.log(`Mode: ${dryRun ? 'Dry Run' : 'Live'}`);
  console.log(`Time range: Last ${hoursBack} hours\n`);
  
  const stats = {
    processed: 0,
    created: 0,
    duplicates: 0,
    errors: 0
  };
  
  try {
    // Fetch recent alerts
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hoursBack);
    
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select('*')
      .gte('posted_at', cutoff.toISOString())
      .order('posted_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching alerts:', error.message);
      return stats;
    }
    
    if (!alerts || alerts.length === 0) {
      console.log('⚠️  No alerts found in the specified time range');
      return stats;
    }
    
    console.log(`📊 Found ${alerts.length} alerts to process\n`);
    
    // Process each alert
    for (const alert of alerts) {
      stats.processed++;
      
      const extracted = extractEventFromAlert(alert);
      
      if (!extracted) {
        continue; // Not an event-related alert
      }
      
      const eventRecord = eventToRecord(extracted, alert);
      
      if (dryRun) {
        console.log(`📅 Would create event: ${eventRecord.title}`);
        console.log(`   Status: ${eventRecord.status}`);
        console.log(`   Start: ${eventRecord.start_at}`);
        console.log(`   Track: ${eventRecord.track_id}`);
        stats.created++;
      } else {
        const result = await upsertEvent(eventRecord);
        
        if (result.success) {
          if (result.isDuplicate) {
            stats.duplicates++;
          } else {
            stats.created++;
            console.log(`✅ Created event: ${eventRecord.title}`);
          }
        } else {
          stats.errors++;
        }
      }
    }
    
    // Print summary
    console.log('\n' + '─'.repeat(80));
    console.log('📊 PROCESSING SUMMARY');
    console.log('─'.repeat(80));
    console.log(`Alerts processed: ${stats.processed}`);
    console.log(`Events created: ${stats.created}`);
    console.log(`Duplicates skipped: ${stats.duplicates}`);
    console.log(`Errors: ${stats.errors}`);
    console.log('='.repeat(80) + '\n');
    
    return stats;
    
  } catch (error) {
    console.error('❌ Fatal error processing events:', error);
    return stats;
  }
};

/**
 * Get event statistics
 */
export const getEventStats = async (): Promise<void> => {
  console.log('\n📊 Event Statistics\n');
  
  // Total events
  const { data: totalEvents } = await supabase
    .from('events')
    .select('count');
  
  // Events by status
  const { data: scheduled } = await supabase
    .from('events')
    .select('count')
    .eq('status', 'scheduled');
  
  const { data: cancelled } = await supabase
    .from('events')
    .select('count')
    .eq('status', 'cancelled');
  
  const { data: updated } = await supabase
    .from('events')
    .select('count')
    .eq('status', 'updated');
  
  // Upcoming events
  const { data: upcoming } = await supabase
    .from('events')
    .select('count')
    .gte('start_at', new Date().toISOString())
    .eq('status', 'scheduled');
  
  console.log(`Total events: ${totalEvents?.[0]?.count || 0}`);
  console.log(`  Scheduled: ${scheduled?.[0]?.count || 0}`);
  console.log(`  Cancelled: ${cancelled?.[0]?.count || 0}`);
  console.log(`  Updated: ${updated?.[0]?.count || 0}`);
  console.log(`\nUpcoming events: ${upcoming?.[0]?.count || 0}`);
  console.log('');
};

// Run if executed directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const hoursBack = parseInt(args.find(arg => arg.startsWith('--hours='))?.split('=')[1] || '168'); // Default 7 days
  const stats = args.includes('--stats');
  
  if (stats) {
    getEventStats()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Error:', error);
        process.exit(1);
      });
  } else {
    processAlertsToEvents({ hoursBack, dryRun })
      .then(stats => {
        if (stats.errors > 0) {
          process.exit(1);
        }
        process.exit(0);
      })
      .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
      });
  }
}

