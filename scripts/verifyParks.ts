/**
 * Verify Parks Script
 * 
 * Shows all tracks in the database
 */

import { supabase } from './config';

async function verifyParks() {
  console.log('🔍 Verifying tracks in database...\n');

  try {
    const { data: tracks, error } = await supabase
      .from('tracks')
      .select('name, city, slug')
      .order('name');

    if (error) {
      console.error('❌ Error fetching tracks:', error.message);
      return;
    }

    console.log(`✅ Total tracks: ${tracks?.length || 0}\n`);
    console.log('All tracks:');
    tracks?.forEach(track => {
      console.log(`  - ${track.name} (${track.city})`);
    });

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  verifyParks()
    .then(() => {
      console.log('\n✨ Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { verifyParks };

