/**
 * Check Events Script
 * 
 * Verifies that events exist in the database and shows their dates
 */

import { supabase } from './config';

async function checkEvents() {
  console.log('🔍 Checking events in database...\n');

  try {
    // Get all events from 2026
    const start2026 = new Date('2026-01-01T00:00:00Z').toISOString();
    const end2026 = new Date('2026-12-31T23:59:59Z').toISOString();

    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        track:tracks(name, slug)
      `)
      .gte('start_at', start2026)
      .lte('start_at', end2026)
      .in('status', ['scheduled', 'updated'])
      .order('start_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching events:', error.message);
      return;
    }

    if (!events || events.length === 0) {
      console.log('⚠️  No events found for 2026');
      console.log('\nChecking all future events...\n');
      
      // Check all future events
      const now = new Date().toISOString();
      const { data: allFutureEvents } = await supabase
        .from('events')
        .select(`
          *,
          track:tracks(name, slug)
        `)
        .gte('start_at', now)
        .in('status', ['scheduled', 'updated'])
        .order('start_at', { ascending: true })
        .limit(20);

      if (allFutureEvents && allFutureEvents.length > 0) {
        console.log(`Found ${allFutureEvents.length} future events:`);
        allFutureEvents.forEach(event => {
          const date = new Date(event.start_at);
          console.log(`  - ${date.toLocaleDateString()}: ${event.track?.name || 'Unknown'} - ${event.title}`);
        });
      } else {
        console.log('❌ No future events found at all');
      }
      return;
    }

    console.log(`✅ Found ${events.length} events for 2026:\n`);
    
    events.forEach(event => {
      const date = new Date(event.start_at);
      const trackName = event.track?.name || 'Unknown Track';
      console.log(`  📅 ${date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })}`);
      console.log(`     Track: ${trackName}`);
      console.log(`     Title: ${event.title}`);
      if (event.description) {
        console.log(`     Description: ${event.description}`);
      }
      console.log(`     Start: ${event.start_at}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  checkEvents()
    .then(() => {
      console.log('\n✨ Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { checkEvents };

