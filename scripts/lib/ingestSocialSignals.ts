/**
 * Shared ingest logic for social metadata → forum bot posts.
 * Used by scripts/ingestFbSignals.ts and POST /api/cron/social-ingest.
 */

import { supabase } from '../config';
import { parseRelativeTimestamp } from './parseRelativeTimestamp';
import { getTrackSourceBySlug, type SocialPlatform } from './coloradoTrackSources';
import { isWithinRecentWindow, RECENT_CALENDAR_DAYS_PRIOR } from './recentSocialWindow';
import { externalPostIdFromUrl, normalizeSocialPostUrl } from './socialPostId';
import { socialPostSentence } from '../../src/lib/socialPostDisplay';

export interface MetadataPost {
  url: string;
  timestampText?: string;
  timestamp?: string | null;
}

export interface PlatformResult {
  trackSlug: string;
  trackName: string;
  platform: SocialPlatform;
  success: boolean;
  posts: MetadataPost[];
}

export interface ScrapeOutput {
  results: PlatformResult[];
  scrapedAt: string;
}

export interface IngestSummary {
  inserted: number;
  skipped: number;
}

const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
};

function botUserId(): string | null {
  return process.env.SOCIAL_BOT_USER_ID?.trim() || null;
}

async function getCategoryIdForTrack(trackSlug: string): Promise<string | null> {
  const { data } = await supabase
    .from('forum_categories')
    .select('id')
    .eq('slug', `${trackSlug}-comms`)
    .single();
  return data?.id ?? null;
}

function resolvePostTimestamp(post: MetadataPost): Date | null {
  if (post.timestamp) {
    const d = new Date(post.timestamp);
    if (!Number.isNaN(d.getTime())) return d;
  }
  if (post.timestampText) {
    return parseRelativeTimestamp(post.timestampText);
  }
  return null;
}

async function signalExists(
  platform: SocialPlatform,
  normalizedUrl: string,
  externalPostId: string | null
): Promise<boolean> {
  const { data: byUrl } = await supabase
    .from('fb_post_signals')
    .select('id')
    .eq('platform', platform)
    .eq('fb_url', normalizedUrl)
    .maybeSingle();

  if (byUrl) return true;

  if (externalPostId) {
    const { data: byId } = await supabase
      .from('fb_post_signals')
      .select('id')
      .eq('platform', platform)
      .eq('external_post_id', externalPostId)
      .maybeSingle();
    if (byId) return true;
  }

  return false;
}

export async function ingestPlatformResult(result: PlatformResult): Promise<IngestSummary> {
  let inserted = 0;
  let skipped = 0;

  if (!result.success || result.posts.length === 0) {
    return { inserted, skipped };
  }

  const track = await getTrackSourceBySlug(result.trackSlug);
  if (!track) {
    console.warn(`⚠️  Unknown track slug: ${result.trackSlug}`);
    return { inserted, skipped };
  }

  const categoryId = await getCategoryIdForTrack(result.trackSlug);
  if (!categoryId) {
    console.warn(`⚠️  No comms category for ${result.trackSlug}`);
    return { inserted, skipped };
  }

  const platformLabel = PLATFORM_LABEL[result.platform];
  const authorId = botUserId();

  for (const post of result.posts) {
    if (!post.url) {
      skipped++;
      continue;
    }

    const normalizedUrl = normalizeSocialPostUrl(post.url);
    const externalPostId = externalPostIdFromUrl(normalizedUrl, result.platform);
    const postTime = resolvePostTimestamp(post);

    if (!isWithinRecentWindow(postTime, post.timestamp ?? null)) {
      skipped++;
      continue;
    }

    if (await signalExists(result.platform, normalizedUrl, externalPostId)) {
      skipped++;
      continue;
    }

    const detectedAt = postTime?.toISOString() ?? new Date().toISOString();
    const title = `New ${platformLabel} post — ${track.name}`;
    const body = socialPostSentence(track.name, normalizedUrl);

    const { data: thread, error: threadError } = await supabase
      .from('forum_threads')
      .insert({
        category_id: categoryId,
        track_id: track.id,
        author_id: authorId,
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
        author_id: authorId,
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
        track_id: track.id,
        fb_url: normalizedUrl,
        platform: result.platform,
        external_post_id: externalPostId,
        detected_at: detectedAt,
        forum_thread_id: thread.id,
      });

    if (signalError) {
      console.error(`❌ Signal insert failed:`, signalError.message);
      skipped++;
      continue;
    }

    inserted++;
  }

  const sourceType = result.platform === 'instagram' ? 'instagram' : 'facebook';
  await supabase
    .from('sources')
    .update({ last_checked_at: new Date().toISOString() })
    .eq('track_id', track.id)
    .eq('type', sourceType);

  return { inserted, skipped };
}

export async function ingestSocialMetadata(data: ScrapeOutput): Promise<IngestSummary> {
  let inserted = 0;
  let skipped = 0;

  for (const result of data.results) {
    const platform = result.platform ?? 'facebook';
    const summary = await ingestPlatformResult({ ...result, platform });
    inserted += summary.inserted;
    skipped += summary.skipped;
  }

  return { inserted, skipped };
}
