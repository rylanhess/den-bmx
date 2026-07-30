/**
 * Ingest Facebook post metadata (URL + timestamp only) into fb_post_signals
 * and auto-create forum notification threads. Does NOT store FB post content.
 *
 * Usage: tsx scripts/ingestFbSignals.ts [path-to-json]
 * Default input: scripts/output/latest-fb-metadata.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { supabase, getTrackMapping } from './config';

interface MetadataPost {
  url: string | null;
  timestampText: string;
}

interface TrackResult {
  trackSlug: string;
  trackName: string;
  success: boolean;
  posts: MetadataPost[];
}

interface ScrapeOutput {
  results: TrackResult[];
  scrapedAt: string;
}

async function getCategoryIdForTrack(trackSlug: string): Promise<string | null> {
  const { data } = await supabase
    .from('forum_categories')
    .select('id')
    .eq('slug', `${trackSlug}-comms`)
    .single();
  return data?.id ?? null;
}

async function ingestTrack(result: TrackResult): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  if (!result.success || result.posts.length === 0) {
    return { inserted, skipped };
  }

  const mapping = getTrackMapping(result.trackSlug);
  const categoryId = await getCategoryIdForTrack(result.trackSlug);

  if (!categoryId) {
    console.warn(`⚠️  No comms category for ${result.trackSlug}`);
    return { inserted, skipped };
  }

  for (const post of result.posts) {
    if (!post.url) {
      skipped++;
      continue;
    }

    const normalizedUrl = post.url.split('?')[0];

    const { data: existing } = await supabase
      .from('fb_post_signals')
      .select('id')
      .eq('fb_url', normalizedUrl)
      .single();

    if (existing) {
      skipped++;
      continue;
    }

    const detectedAt = new Date().toISOString();
    const dateLabel = post.timestampText || new Date().toLocaleDateString('en-US', { timeZone: 'America/Denver' });
    const title = `New Facebook post — ${mapping.name}`;
    const body = `${mapping.name} posted on Facebook on ${dateLabel}. [View the latest post on Facebook →](${normalizedUrl})`;

    const { data: thread, error: threadError } = await supabase
      .from('forum_threads')
      .insert({
        category_id: categoryId,
        track_id: mapping.id,
        author_id: null,
        title,
        is_system: true,
        reply_count: 0,
        last_post_at: detectedAt,
      })
      .select('id')
      .single();

    if (threadError) {
      console.error(`❌ Thread insert failed for ${normalizedUrl}:`, threadError.message);
      skipped++;
      continue;
    }

    const { error: postError } = await supabase
      .from('forum_posts')
      .insert({
        thread_id: thread.id,
        author_id: null,
        body,
        fb_url: normalizedUrl,
      });

    if (postError) {
      console.error(`❌ Post insert failed:`, postError.message);
      await supabase.from('forum_threads').delete().eq('id', thread.id);
      skipped++;
      continue;
    }

    const { error: signalError } = await supabase
      .from('fb_post_signals')
      .insert({
        track_id: mapping.id,
        fb_url: normalizedUrl,
        detected_at: detectedAt,
        forum_thread_id: thread.id,
      });

    if (signalError) {
      console.error(`❌ Signal insert failed:`, signalError.message);
      skipped++;
      continue;
    }

    console.log(`✅ New FB signal: ${mapping.name} → ${normalizedUrl}`);
    inserted++;
  }

  await supabase
    .from('sources')
    .update({ last_checked_at: new Date().toISOString() })
    .eq('track_id', mapping.id)
    .eq('type', 'facebook');

  return { inserted, skipped };
}

async function main() {
  const inputPath = process.argv[2] || path.join(__dirname, 'output', 'latest-fb-metadata.json');

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    console.error('   Run: tsx scripts/runCdpFacebookScrape.ts --metadata-only');
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, 'utf-8');
  const data: ScrapeOutput = JSON.parse(raw);

  console.log(`\n📥 Ingesting FB metadata from ${inputPath}`);
  console.log(`   Scraped at: ${data.scrapedAt}`);
  console.log(`   Tracks: ${data.results.length}\n`);

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const result of data.results) {
    const { inserted, skipped } = await ingestTrack(result);
    totalInserted += inserted;
    totalSkipped += skipped;
    console.log(`   ${result.trackName}: ${inserted} new, ${skipped} skipped`);
  }

  console.log(`\n✅ Done: ${totalInserted} new signals, ${totalSkipped} skipped`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
