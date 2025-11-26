/**
 * Create Test Events Script
 * 
 * Creates fake test events in the Supabase events table
 * All event titles are prefixed with "[TEST]"
 */

import { supabase, TRACK_MAPPINGS } from './config';

interface TestEvent {
  track_id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  status: 'scheduled' | 'updated' | 'cancelled';
  url: string | null;
  image: string | null;
  gate_fee: string | null;
  class: string | null;
}

// Generate test events for the next 30 days
function generateTestEvents(): TestEvent[] {
  const events: TestEvent[] = [];
  const today = new Date();
  const trackSlugs = Object.keys(TRACK_MAPPINGS);
  
  // Event types
  const eventTypes = [
    'Gate Practice',
    'Race Day',
    'State Qualifier',
    'Practice Session',
    'Special Event',
    'Championship Race',
    'Open Practice',
  ];
  
  // Generate events over the next 30 days
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + dayOffset);
    
    // Randomly decide if this day should have events (70% chance)
    if (Math.random() > 0.3) {
      // 1-3 events per day
      const numEvents = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numEvents; i++) {
        const trackSlug = trackSlugs[Math.floor(Math.random() * trackSlugs.length)];
        const track = TRACK_MAPPINGS[trackSlug];
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        // Set time (some events have times, some don't)
        const hasTime = Math.random() > 0.3; // 70% have times
        const hour = hasTime ? Math.floor(Math.random() * 8) + 9 : 0; // 9 AM - 5 PM or midnight (TBD)
        const minute = hasTime ? (Math.random() > 0.5 ? 30 : 0) : 0;
        
        const startDate = new Date(eventDate);
        startDate.setHours(hour, minute, 0, 0);
        
        const endDate = hasTime ? new Date(startDate.getTime() + 2 * 60 * 60 * 1000) : null; // 2 hours later
        
        const gateFee = Math.random() > 0.5 ? `$${Math.floor(Math.random() * 15) + 5}` : null;
        const eventClass = Math.random() > 0.6 ? ['Novice', 'Intermediate', 'Expert', 'Open'][Math.floor(Math.random() * 4)] : null;
        
        events.push({
          track_id: track.id,
          title: `[TEST] ${eventType}`,
          description: `[TEST] ${eventType} at ${track.name}. Join us for an exciting day of BMX racing!`,
          start_at: startDate.toISOString(),
          end_at: endDate ? endDate.toISOString() : null,
          status: 'scheduled',
          url: track.facebookUrl,
          image: null,
          gate_fee: gateFee,
          class: eventClass,
        });
      }
    }
  }
  
  return events;
}

async function main() {
  console.log('🚀 Creating test events...\n');
  
  try {
    const testEvents = generateTestEvents();
    console.log(`📅 Generated ${testEvents.length} test events\n`);
    
    // Insert events in batches of 10
    const batchSize = 10;
    let inserted = 0;
    let errors = 0;
    
    for (let i = 0; i < testEvents.length; i += batchSize) {
      const batch = testEvents.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('events')
        .insert(batch)
        .select();
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        errors += batch.length;
      } else {
        inserted += data?.length || 0;
        console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(testEvents.length / batchSize)} (${inserted}/${testEvents.length} events)`);
      }
    }
    
    console.log(`\n✨ Done!`);
    console.log(`   ✅ Inserted: ${inserted} events`);
    if (errors > 0) {
      console.log(`   ❌ Errors: ${errors} events`);
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { generateTestEvents };

