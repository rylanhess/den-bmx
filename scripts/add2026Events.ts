/**
 * Add 2026 BMX Events Script
 * 
 * Adds manually curated 2026 BMX events to the Supabase events table
 * Includes:
 * - USA BMX State/Gold Cup qualifiers
 * - Local race series dates (Mile High, County Line)
 * - Jump park events (Valmont)
 */

import { supabase, TRACK_MAPPINGS } from './config';

interface EventToAdd {
  trackSlug: string; // slug from TRACK_MAPPINGS or 'new-track'
  trackName: string; // full name for new tracks
  title: string;
  description: string | null;
  start_at: string; // ISO timestamp
  end_at: string | null;
  status: 'scheduled' | 'updated' | 'cancelled';
  url: string | null;
  image: string | null;
  gate_fee: string | null;
  class: string | null;
}

/**
 * Get track ID by slug, or create new track if needed
 */
async function getOrCreateTrack(slug: string, name: string): Promise<string | null> {
  // Check if track exists in mappings
  if (TRACK_MAPPINGS[slug]) {
    return TRACK_MAPPINGS[slug].id;
  }

  // Check if track exists in database
  const { data: existingTrack } = await supabase
    .from('tracks')
    .select('id')
    .eq('slug', slug)
    .single();

  if (existingTrack) {
    return existingTrack.id;
  }

  // Create new track
  console.log(`Creating new track: ${name} (${slug})`);
  const { data: newTrack, error } = await supabase
    .from('tracks')
    .insert({
      name,
      slug,
      city: extractCity(name),
      tz: 'America/Denver',
      fb_page_url: null,
      usabmx_url: null,
      lat: null,
      lon: null,
      logo: null,
      wallpaper: null,
    })
    .select('id')
    .single();

  if (error) {
    console.error(`Error creating track ${name}:`, error.message);
    return null;
  }

  return newTrack?.id || null;
}

function extractCity(trackName: string): string {
  const cityMap: Record<string, string> = {
    'Grand Valley BMX': 'Grand Junction',
    'Durango BMX': 'Durango',
    'Valmont Bike Park': 'Boulder',
  };
  return cityMap[trackName] || trackName.replace(' BMX', '').replace(' Bike Park', '');
}

/**
 * Create ISO timestamp for a date in Denver timezone
 */
function createDenverTimestamp(year: number, month: number, day: number, hour: number = 0, minute: number = 0): string {
  // Create date string in ISO format
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
  
  // Create date object assuming Denver timezone
  const date = new Date(`${dateStr}-07:00`); // Mountain Time UTC-7 (or UTC-6 for DST, but we'll use -7 as base)
  
  return date.toISOString();
}

/**
 * Define all 2026 events to add
 */
function get2026Events(): EventToAdd[] {
  const events: EventToAdd[] = [];

  // USA BMX State/Gold Cup Qualifiers
  events.push({
    trackSlug: 'grand-valley-bmx',
    trackName: 'Grand Valley BMX',
    title: 'Gold Cup / State Championship Qualifier',
    description: 'TRIPLE points - State Championship Qualifier at Grand Valley BMX',
    start_at: createDenverTimestamp(2026, 5, 30, 0, 0), // May 30, 2026
    end_at: null,
    status: 'scheduled',
    url: null, // TODO: Add USA BMX event page URL
    image: null,
    gate_fee: null,
    class: null,
  });

  events.push({
    trackSlug: 'durango-bmx',
    trackName: 'Durango BMX',
    title: 'State Championship Qualifier',
    description: 'DOUBLE points - State Championship Qualifier at Durango BMX',
    start_at: createDenverTimestamp(2026, 6, 6, 0, 0), // Jun 6, 2026
    end_at: null,
    status: 'scheduled',
    url: null,
    image: null,
    gate_fee: null,
    class: null,
  });

  events.push({
    trackSlug: 'dacono-bmx',
    trackName: 'Dacono BMX',
    title: 'State Championship Qualifier',
    description: 'DOUBLE points - State Championship Qualifier at Dacono BMX',
    start_at: createDenverTimestamp(2026, 6, 27, 0, 0), // Jun 27, 2026
    end_at: null,
    status: 'scheduled',
    url: null,
    image: null,
    gate_fee: null,
    class: null,
  });

  events.push({
    trackSlug: 'twin-silo-bmx',
    trackName: 'Twin Silo BMX',
    title: 'State Championship Qualifier',
    description: 'DOUBLE points - State Championship Qualifier at Twin Silo BMX',
    start_at: createDenverTimestamp(2026, 6, 28, 0, 0), // Jun 28, 2026
    end_at: null,
    status: 'scheduled',
    url: null,
    image: null,
    gate_fee: null,
    class: null,
  });

  // Valmont Bike Park camps
  events.push({
    trackSlug: 'valmont-bike-park',
    trackName: 'Valmont Bike Park',
    title: 'BMX Camp',
    description: 'BMX camp at Valmont Bike Park',
    start_at: createDenverTimestamp(2026, 6, 8, 0, 0), // Jun 8, 2026
    end_at: createDenverTimestamp(2026, 6, 12, 23, 59), // Jun 12, 2026
    status: 'scheduled',
    url: null,
    image: null,
    gate_fee: null,
    class: null,
  });

  events.push({
    trackSlug: 'valmont-bike-park',
    trackName: 'Valmont Bike Park',
    title: 'BMX Camp',
    description: 'BMX camp at Valmont Bike Park',
    start_at: createDenverTimestamp(2026, 8, 3, 0, 0), // Aug 3, 2026
    end_at: createDenverTimestamp(2026, 8, 7, 23, 59), // Aug 7, 2026
    status: 'scheduled',
    url: null,
    image: null,
    gate_fee: null,
    class: null,
  });

  // Mile High BMX - Local races/practices (typically weekends, starting early April)
  // Adding typical weekend dates for April 2026
  const april2026Weekends = [
    { month: 4, day: 5 },   // Saturday, April 5
    { month: 4, day: 6 },   // Sunday, April 6
    { month: 4, day: 12 },  // Saturday, April 12
    { month: 4, day: 13 },  // Sunday, April 13
    { month: 4, day: 19 },  // Saturday, April 19
    { month: 4, day: 20 },  // Sunday, April 20
    { month: 4, day: 26 },  // Saturday, April 26
    { month: 4, day: 27 },  // Sunday, April 27
  ];

  for (const date of april2026Weekends) {
    events.push({
      trackSlug: 'mile-high-bmx',
      trackName: 'Mile High BMX',
      title: 'Local Race / Practice',
      description: 'Local race or practice session at Mile High BMX',
      start_at: createDenverTimestamp(2026, date.month, date.day, 0, 0),
      end_at: null,
      status: 'scheduled',
      url: TRACK_MAPPINGS['mile-high-bmx']?.facebookUrl || null,
      image: null,
      gate_fee: null,
      class: null,
    });
  }

  // County Line BMX - Local races/practices (typically Sundays, starting early April)
  // County Line typically races on Sundays
  const april2026Sundays = [
    { month: 4, day: 6 },   // Sunday, April 6
    { month: 4, day: 13 },  // Sunday, April 13
    { month: 4, day: 20 },  // Sunday, April 20
    { month: 4, day: 27 },  // Sunday, April 27
  ];

  for (const date of april2026Sundays) {
    events.push({
      trackSlug: 'county-line-bmx',
      trackName: 'County Line BMX',
      title: 'Local Race',
      description: 'Local race at County Line BMX',
      start_at: createDenverTimestamp(2026, date.month, date.day, 0, 0),
      end_at: null,
      status: 'scheduled',
      url: TRACK_MAPPINGS['county-line-bmx']?.facebookUrl || null,
      image: null,
      gate_fee: null,
      class: null,
    });
  }

  return events;
}

/**
 * Add events to database
 */
async function addEvents() {
  console.log('🚀 Adding 2026 BMX events...\n');

  try {
    const eventsToAdd = get2026Events();
    console.log(`📅 Found ${eventsToAdd.length} events to add\n`);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const event of eventsToAdd) {
      // Get or create track
      const trackId = await getOrCreateTrack(event.trackSlug, event.trackName);
      
      if (!trackId) {
        console.error(`❌ Could not get/create track for ${event.trackName}`);
        errors++;
        continue;
      }

      // Prepare event record
      const eventRecord = {
        track_id: trackId,
        title: event.title,
        description: event.description,
        start_at: event.start_at,
        end_at: event.end_at,
        status: event.status,
        url: event.url,
        image: event.image,
        gate_fee: event.gate_fee,
        class: event.class,
      };

      // Insert event (will skip duplicates due to unique constraint)
      const { data, error } = await supabase
        .from('events')
        .insert(eventRecord)
        .select();

      if (error) {
        if (error.code === '23505') {
          // Duplicate - this is okay
          console.log(`⏭️  Skipped duplicate: ${event.title} at ${event.trackName}`);
          skipped++;
        } else {
          console.error(`❌ Error inserting ${event.title} at ${event.trackName}:`, error.message);
          errors++;
        }
      } else {
        console.log(`✅ Added: ${event.title} at ${event.trackName} (${new Date(event.start_at).toLocaleDateString()})`);
        inserted++;
      }
    }

    console.log(`\n✨ Done!`);
    console.log(`   ✅ Inserted: ${inserted} events`);
    console.log(`   ⏭️  Skipped (duplicates): ${skipped} events`);
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
  addEvents();
}

export { addEvents, get2026Events };

