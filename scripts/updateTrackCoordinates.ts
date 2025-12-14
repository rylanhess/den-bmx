/**
 * Update Track Coordinates Script
 * 
 * Updates lat/lon coordinates for BMX tracks and bike parks
 */

import { supabase } from './config';

interface TrackUpdate {
  slug: string;
  name: string;
  lat: number;
  lon: number;
}

// Track coordinates from the Freestyle page and verified locations
const trackCoordinates: TrackUpdate[] = [
  {
    slug: 'twin-silo-bmx',
    name: 'Twin Silo BMX',
    lat: 40.511200198946774,
    lon: -105.01271478454838,
  },
  {
    slug: 'valmont-bike-park',
    name: 'Valmont Bike Park',
    lat: 40.03160823798708,
    lon: -105.23424042526366,
  },
  {
    slug: 'durango-bmx',
    name: 'Durango BMX',
    lat: 37.2753, // Durango, CO approximate
    lon: -107.8801,
  },
  {
    slug: 'grand-valley-bmx',
    name: 'Grand Valley BMX',
    lat: 39.0639, // Grand Junction, CO approximate
    lon: -108.5506,
  },
  {
    slug: 'county-line-bmx',
    name: 'County Line BMX',
    lat: 39.56430805076575,
    lon: -104.93776458185582,
  },
  {
    slug: 'mile-high-bmx',
    name: 'Mile High BMX',
    lat: 39.65242677248604,
    lon: -105.1008732491447,
  },
  {
    slug: 'dacono-bmx',
    name: 'Dacono BMX',
    lat: 40.0833, // Dacono, CO approximate - north of Denver
    lon: -104.9333,
  },
];

async function updateCoordinates() {
  console.log('🚀 Updating track coordinates...\n');

  try {
    let updated = 0;
    let notFound = 0;
    let errors = 0;

    for (const track of trackCoordinates) {
      // Check if track exists
      const { data: existingTrack, error: fetchError } = await supabase
        .from('tracks')
        .select('id, name, lat, lon')
        .eq('slug', track.slug)
        .maybeSingle();

      if (fetchError) {
        console.error(`Error checking for track ${track.name}:`, fetchError.message);
        errors++;
        continue;
      }

      if (!existingTrack) {
        console.log(`⚠️  Track not found: ${track.name} (${track.slug})`);
        notFound++;
        continue;
      }

      // Update coordinates
      const { error } = await supabase
        .from('tracks')
        .update({
          lat: track.lat,
          lon: track.lon,
        })
        .eq('slug', track.slug);

      if (error) {
        console.error(`❌ Error updating ${track.name}:`, error.message);
        errors++;
      } else {
        const oldCoords = existingTrack.lat && existingTrack.lon 
          ? `(${existingTrack.lat}, ${existingTrack.lon})` 
          : '(none)';
        console.log(`✅ Updated: ${track.name}`);
        console.log(`   Old: ${oldCoords} → New: (${track.lat}, ${track.lon})`);
        updated++;
      }
    }

    console.log(`\n✨ Done!`);
    console.log(`   ✅ Updated: ${updated} tracks`);
    if (notFound > 0) {
      console.log(`   ⚠️  Not found: ${notFound} tracks`);
    }
    if (errors > 0) {
      console.log(`   ❌ Errors: ${errors} tracks`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  updateCoordinates();
}

export { updateCoordinates };

