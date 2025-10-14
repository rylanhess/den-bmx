/**
 * Database Upsert Functions
 * 
 * Handles saving scraped data to Supabase
 */

import { supabase, getTrackMapping } from './config';
import { normalizeToAlert, normalizePosts, validateAlert, filterPosts, deduplicatePosts } from './normalize';
import type { ScraperResult } from './fetchFacebook';
import type { AlertRecord } from './normalize';

/**
 * Upsert options
 */
export interface UpsertOptions {
  dryRun?: boolean;        // If true, don't actually insert
  alertsOnly?: boolean;    // Only save posts with alert keywords
  eventsOnly?: boolean;    // Only save event-related posts
  deduplicateFirst?: boolean;  // Remove duplicates before inserting
}

/**
 * Result of upsert operation
 */
export interface UpsertResult {
  success: boolean;
  trackName: string;
  trackSlug: string;
  inserted: number;
  skipped: number;
  errors: number;
  errorMessages: string[];
}

/**
 * Save scraper results to database
 */
export const upsertScraperResults = async (
  result: ScraperResult,
  options: UpsertOptions = {}
): Promise<UpsertResult> => {
  const startTime = Date.now();
  
  console.log(`\n💾 Saving ${result.trackName} posts to database...`);
  
  const upsertResult: UpsertResult = {
    success: false,
    trackName: result.trackName,
    trackSlug: result.trackSlug,
    inserted: 0,
    skipped: 0,
    errors: 0,
    errorMessages: []
  };
  
  // Skip if scraping failed
  if (!result.success) {
    console.log(`⚠️  Skipping ${result.trackName} - scraping failed`);
    upsertResult.skipped = result.posts.length;
    return upsertResult;
  }
  
  // Get track mapping
  let trackMapping;
  try {
    trackMapping = getTrackMapping(result.trackSlug);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ ${errorMsg}`);
    upsertResult.errorMessages.push(errorMsg);
    return upsertResult;
  }
  
  let posts = result.posts;
  
  // Apply filters
  if (options.alertsOnly || options.eventsOnly) {
    const originalCount = posts.length;
    posts = filterPosts(posts, {
      alertsOnly: options.alertsOnly,
      eventsOnly: options.eventsOnly
    });
    console.log(`   Filtered ${originalCount} posts → ${posts.length} posts`);
  }
  
  // Deduplicate
  if (options.deduplicateFirst) {
    const originalCount = posts.length;
    posts = deduplicatePosts(posts);
    console.log(`   Deduplicated ${originalCount} posts → ${posts.length} posts`);
  }
  
  if (posts.length === 0) {
    console.log('   No posts to insert');
    return upsertResult;
  }
  
  // Normalize to alert records
  const alerts = normalizePosts(posts, trackMapping.id);
  
  // Validate alerts
  const validAlerts = alerts.filter(alert => {
    if (!validateAlert(alert)) {
      upsertResult.skipped++;
      return false;
    }
    return true;
  });
  
  console.log(`   ${validAlerts.length} valid alerts to insert`);
  
  if (options.dryRun) {
    console.log('   🔍 DRY RUN - Not inserting to database');
    console.log('   Would insert:', JSON.stringify(validAlerts, null, 2));
    upsertResult.inserted = validAlerts.length;
    upsertResult.success = true;
    return upsertResult;
  }
  
  // Check for existing alerts BEFORE attempting to insert (batched for performance)
  const alertsToInsert: AlertRecord[] = [];
  
  // Step 1: Batch check by URLs (most reliable identifier)
  const alertsWithUrls = validAlerts.filter(a => a.url);
  const alertsWithoutUrls = validAlerts.filter(a => !a.url);
  
  let existingUrlSet = new Set<string>();
  
  if (alertsWithUrls.length > 0) {
    const urls = alertsWithUrls.map(a => a.url!);
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('url')
        .eq('track_id', trackMapping.id)
        .in('url', urls);
      
      if (!error && data) {
        existingUrlSet = new Set(data.map((row: any) => row.url));
      }
    } catch (error) {
      console.warn(`   ⚠️  Error checking existing URLs:`, error);
    }
  }
  
  // Step 2: Filter out alerts with existing URLs
  for (const alert of alertsWithUrls) {
    if (existingUrlSet.has(alert.url!)) {
      upsertResult.skipped++;
    } else {
      alertsToInsert.push(alert);
    }
  }
  
  // Step 3: For alerts without URLs, check by text + timestamp
  // Get recent alerts for text-based comparison
  let recentAlerts: any[] = [];
  
  if (alertsWithoutUrls.length > 0) {
    try {
      // Get all recent alerts from past 7 days for comparison
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('alerts')
        .select('posted_at, text')
        .eq('track_id', trackMapping.id)
        .gte('posted_at', sevenDaysAgo.toISOString())
        .order('posted_at', { ascending: false })
        .limit(500); // Reasonable limit for recent alerts
      
      if (!error && data) {
        recentAlerts = data;
      }
    } catch (error) {
      console.warn(`   ⚠️  Error fetching recent alerts:`, error);
    }
    
    // Compare each alert without URL against recent alerts
    for (const alert of alertsWithoutUrls) {
      let isDuplicate = false;
      const postedAt = new Date(alert.posted_at);
      const textPrefix = alert.text.substring(0, 100).toLowerCase();
      
      for (const existing of recentAlerts) {
        const existingPostedAt = new Date(existing.posted_at);
        const timeDiff = Math.abs(postedAt.getTime() - existingPostedAt.getTime());
        
        // Consider duplicate if:
        // - Within 1 hour of each other AND
        // - Text starts with same 100 characters (case-insensitive)
        if (timeDiff < 3600000) {
          const existingPrefix = existing.text.substring(0, 100).toLowerCase();
          if (textPrefix === existingPrefix) {
            isDuplicate = true;
            break;
          }
        }
      }
      
      if (isDuplicate) {
        upsertResult.skipped++;
      } else {
        alertsToInsert.push(alert);
      }
    }
  }
  
  console.log(`   💡 Pre-check: ${alertsToInsert.length} new alerts, ${upsertResult.skipped} duplicates skipped`);
  
  // Batch insert all new alerts
  if (alertsToInsert.length > 0) {
    try {
      const { error } = await supabase
        .from('alerts')
        .insert(alertsToInsert);
      
      if (error) {
        // If batch insert fails, fall back to individual inserts
        console.warn(`   ⚠️  Batch insert failed, trying individual inserts: ${error.message}`);
        
        for (const alert of alertsToInsert) {
          try {
            const { error: individualError } = await supabase
              .from('alerts')
              .insert(alert);
            
            if (individualError) {
              if (individualError.code === '23505') {
                upsertResult.skipped++;
              } else {
                upsertResult.errors++;
                upsertResult.errorMessages.push(`${individualError.code}: ${individualError.message}`);
              }
            } else {
              upsertResult.inserted++;
            }
          } catch (e) {
            upsertResult.errors++;
            const errorMsg = e instanceof Error ? e.message : 'Unknown error';
            upsertResult.errorMessages.push(errorMsg);
          }
        }
      } else {
        upsertResult.inserted = alertsToInsert.length;
      }
    } catch (error) {
      upsertResult.errors++;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      upsertResult.errorMessages.push(errorMsg);
      console.error(`   ❌ Exception during insert:`, errorMsg);
    }
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  upsertResult.success = upsertResult.errors === 0;
  
  console.log(`   ✅ Inserted: ${upsertResult.inserted}`);
  console.log(`   ⏭️  Skipped: ${upsertResult.skipped}`);
  if (upsertResult.errors > 0) {
    console.log(`   ❌ Errors: ${upsertResult.errors}`);
  }
  console.log(`   ⏱️  Duration: ${duration}s`);
  
  // Update last_checked_at for this track's Facebook source
  await updateLastChecked(trackMapping.id);
  
  return upsertResult;
};

/**
 * Save multiple scraper results to database
 */
export const upsertMultipleResults = async (
  results: ScraperResult[],
  options: UpsertOptions = {}
): Promise<UpsertResult[]> => {
  console.log('\n' + '='.repeat(80));
  console.log('💾 SAVING ALL TRACKS TO DATABASE');
  console.log('='.repeat(80));
  
  const upsertResults: UpsertResult[] = [];
  
  for (const result of results) {
    const upsertResult = await upsertScraperResults(result, options);
    upsertResults.push(upsertResult);
  }
  
  // Print summary
  console.log('\n' + '━'.repeat(80));
  console.log('💾 DATABASE UPSERT SUMMARY');
  console.log('━'.repeat(80) + '\n');
  
  upsertResults.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.trackName}`);
    console.log(`   Inserted: ${result.inserted} | Skipped: ${result.skipped} | Errors: ${result.errors}`);
    if (result.errorMessages.length > 0) {
      console.log(`   Errors: ${result.errorMessages.slice(0, 3).join(', ')}`);
    }
  });
  
  const totals = upsertResults.reduce((acc, r) => ({
    inserted: acc.inserted + r.inserted,
    skipped: acc.skipped + r.skipped,
    errors: acc.errors + r.errors
  }), { inserted: 0, skipped: 0, errors: 0 });
  
  console.log('\n' + '─'.repeat(80));
  console.log(`📊 TOTALS: ${upsertResults.filter(r => r.success).length}/${upsertResults.length} tracks successful`);
  console.log(`   Inserted: ${totals.inserted} | Skipped: ${totals.skipped} | Errors: ${totals.errors}`);
  console.log('━'.repeat(80) + '\n');
  
  return upsertResults;
};

/**
 * Check for existing alerts to avoid duplicates
 */
export const checkExistingAlert = async (
  trackId: string,
  text: string,
  postedAt: Date
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('alerts')
    .select('id')
    .eq('track_id', trackId)
    .eq('text', text)
    .gte('posted_at', new Date(postedAt.getTime() - 3600000).toISOString()) // Within 1 hour
    .limit(1);
  
  if (error) {
    console.error('Error checking for existing alert:', error);
    return false;
  }
  
  return (data?.length || 0) > 0;
};

/**
 * Get recent alerts for a track
 */
export const getRecentAlerts = async (
  trackSlug: string,
  hours: number = 24
): Promise<AlertRecord[]> => {
  const trackMapping = getTrackMapping(trackSlug);
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - hours);
  
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('track_id', trackMapping.id)
    .gte('posted_at', cutoff.toISOString())
    .order('posted_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching recent alerts:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Update last_checked_at timestamp for a track's Facebook source
 * Creates the source if it doesn't exist
 */
export const updateLastChecked = async (trackId: string): Promise<void> => {
  try {
    const now = new Date().toISOString();
    
    // First, try to update existing source
    const { data: updated, error: updateError } = await supabase
      .from('sources')
      .update({ last_checked_at: now })
      .eq('track_id', trackId)
      .eq('type', 'facebook')
      .select();
    
    // If update succeeded and affected rows, we're done
    if (!updateError && updated && updated.length > 0) {
      return;
    }
    
    // If no rows were updated, the source doesn't exist - create it
    if (!updateError && (!updated || updated.length === 0)) {
      // Get track info to get the Facebook URL
      const { data: track, error: trackError } = await supabase
        .from('tracks')
        .select('fb_page_url')
        .eq('id', trackId)
        .single();
      
      if (trackError || !track?.fb_page_url) {
        console.error(`   ⚠️  Could not get Facebook URL for track:`, trackError?.message);
        return;
      }
      
      // Insert new source
      const { error: insertError } = await supabase
        .from('sources')
        .insert({
          track_id: trackId,
          type: 'facebook',
          url: track.fb_page_url,
          last_checked_at: now
        });
      
      if (insertError) {
        // If insert fails due to duplicate (race condition), that's okay
        if (insertError.code !== '23505') {
          console.error(`   ⚠️  Failed to insert source:`, insertError.message);
        }
      }
    } else if (updateError) {
      console.error(`   ⚠️  Failed to update source:`, updateError.message);
    }
  } catch (error) {
    console.error(`   ⚠️  Exception updating last_checked_at:`, error);
  }
};

/**
 * Print statistics about saved data
 */
export const printDatabaseStats = async (): Promise<void> => {
  console.log('\n📊 Database Statistics\n');
  
  const { data: alertCount } = await supabase
    .from('alerts')
    .select('count');
  
  const { data: trackCount } = await supabase
    .from('tracks')
    .select('count');
  
  console.log(`Tracks: ${trackCount?.[0]?.count || 0}`);
  console.log(`Alerts: ${alertCount?.[0]?.count || 0}`);
};

