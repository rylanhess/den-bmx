/**
 * Clean and Reprocess Events
 * 
 * Deletes all existing events and reprocesses from alerts with fixed time logic
 */

import { supabase } from './config';
import { processAlertsToEvents } from './processEvents';

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('🧹 CLEAN AND REPROCESS EVENTS');
  console.log('='.repeat(80) + '\n');
  
  // Step 1: Delete all existing events
  console.log('Step 1: Deleting all existing events...');
  const { error: deleteError } = await supabase
    .from('events')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  
  if (deleteError) {
    console.error('❌ Error deleting events:', deleteError.message);
    process.exit(1);
  }
  
  console.log('✅ All events deleted\n');
  
  // Step 2: Show alert count
  const { count: alertCount } = await supabase
    .from('alerts')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Found ${alertCount} total alerts in database\n`);
  
  // Step 3: Process alerts from last 30 days
  console.log('Step 2: Processing alerts from last 30 days (720 hours)...\n');
  const stats = await processAlertsToEvents({
    hoursBack: 720, // 30 days
    dryRun: false
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 FINAL STATS');
  console.log('='.repeat(80));
  console.log(`Alerts processed: ${stats.processed}`);
  console.log(`Events created:   ${stats.created}`);
  console.log(`Duplicates:       ${stats.duplicates}`);
  console.log(`Errors:           ${stats.errors}`);
  console.log('='.repeat(80) + '\n');
  
  // Show upcoming events
  console.log('Upcoming events:');
  const { data: events } = await supabase
    .from('events')
    .select(`
      id,
      title,
      start_at,
      track:tracks(name, slug)
    `)
    .gte('start_at', new Date().toISOString())
    .order('start_at', { ascending: true })
    .limit(10);
  
  events?.forEach((e: any) => {
    const date = new Date(e.start_at);
    const dateStr = date.toLocaleString('en-US', { 
      timeZone: 'America/Denver',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
    console.log(`  ${e.track?.name}: ${e.title} - ${dateStr}`);
  });
  
  console.log('\n✅ Done!\n');
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

