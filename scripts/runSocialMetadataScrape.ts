#!/usr/bin/env npx tsx
/**
 * Light social metadata scan for all Colorado BMX tracks.
 * Facebook + Instagram: post URL and timestamp only (no content).
 * Navigates sequentially in CDP Chrome — no need to pre-open every tab.
 */

import * as fs from 'fs';
import * as path from 'path';
import puppeteer, { type Page } from 'puppeteer-core';
import { parseRelativeTimestamp } from './fetchFacebook';
import { chromePuppeteerConnectOptions } from './lib/chromeDebug';
import {
  loadColoradoTrackSources,
  type SocialPlatform,
  type TrackSocialSource,
} from './lib/coloradoTrackSources';
import { getExtractPostMetadataScript } from './lib/facebookInteractions';
import { getExtractInstagramMetadataScript } from './lib/instagramInteractions';
import {
  HUMANIZE,
  randomDelayMs,
  randomInt,
  getScrollEvaluateScript,
} from './lib/humanize';
import { isWithinRecentWindow } from './lib/recentSocialWindow';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const MAX_POSTS_PER_SOURCE = 8;
const repoRoot = path.join(__dirname, '..');
const jsonPath = path.join(repoRoot, 'scripts/output/latest-social-metadata.json');
const legacyJsonPath = path.join(repoRoot, 'scripts/output/latest-fb-metadata.json');

const runId =
  process.env.RUN_ID ||
  (() => {
    const d = new Date();
    return `${d.toISOString().slice(0, 10)}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;
  })();

export interface MetadataPost {
  url: string;
  timestampText: string;
  timestamp: string | null;
}

export interface PlatformScrapeResult {
  trackSlug: string;
  trackName: string;
  platform: SocialPlatform;
  success: boolean;
  posts: MetadataPost[];
  error?: string;
}

export interface SocialScrapeOutput {
  scrapedAt: string;
  runId: string;
  results: PlatformScrapeResult[];
}

async function ensureTwinSiloPostsTab(page: Page): Promise<void> {
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('a[role="tab"], a[href*="sk="], [role="tab"]');
    for (const el of tabs) {
      const t = (el.textContent || '').trim().toLowerCase();
      if (t === 'posts' || (t.startsWith('posts') && t.length < 12)) {
        (el as HTMLElement).click();
        return;
      }
    }
  });
  await sleep(randomDelayMs(600, 1400));
}

async function gentleScroll(page: Page): Promise<void> {
  const scrolls = randomInt(HUMANIZE.scrollsPerTab.min, HUMANIZE.scrollsPerTab.max);
  for (let s = 0; s < scrolls; s++) {
    await page.evaluate(
      (snippet: string) => {
        // eslint-disable-next-line no-eval
        return eval(snippet);
      },
      getScrollEvaluateScript(0.5)
    );
    await sleep(randomDelayMs(HUMANIZE.betweenScrollsMs.min, HUMANIZE.betweenScrollsMs.max));
  }
}

function filterRecentPosts(
  posts: MetadataPost[],
  referenceDate: Date
): MetadataPost[] {
  return posts.filter((post) =>
    isWithinRecentWindow(
      post.timestamp ? new Date(post.timestamp) : null,
      post.timestamp,
      referenceDate
    )
  );
}

async function navigateTo(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await sleep(randomDelayMs(HUMANIZE.afterTabFocusMs.min, HUMANIZE.afterTabFocusMs.max));
}

async function scrapeFacebook(
  page: Page,
  track: TrackSocialSource,
  referenceDate: Date
): Promise<PlatformScrapeResult> {
  if (!track.fbPageUrl) {
    return {
      trackSlug: track.slug,
      trackName: track.name,
      platform: 'facebook',
      success: true,
      posts: [],
    };
  }

  try {
    await navigateTo(page, track.fbPageUrl);
    if (track.slug === 'twin-silo-bmx') await ensureTwinSiloPostsTab(page);
    await gentleScroll(page);

    const code = getExtractPostMetadataScript(MAX_POSTS_PER_SOURCE);
    const extracted = await page.evaluate((c: string) => {
      // eslint-disable-next-line no-eval
      return eval(c);
    }, code);

    const posts: MetadataPost[] = (extracted.posts ?? [])
      .filter((p: { url: string | null }) => p.url)
      .map((p: { url: string; timestampText?: string }) => {
        const parsed = p.timestampText ? parseRelativeTimestamp(p.timestampText) : null;
        return {
          url: p.url.split('?')[0],
          timestampText: p.timestampText || '',
          timestamp: parsed ? parsed.toISOString() : null,
        };
      });

    return {
      trackSlug: track.slug,
      trackName: track.name,
      platform: 'facebook',
      success: true,
      posts: filterRecentPosts(posts, referenceDate),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      trackSlug: track.slug,
      trackName: track.name,
      platform: 'facebook',
      success: false,
      posts: [],
      error: msg,
    };
  }
}

async function scrapeInstagram(
  page: Page,
  track: TrackSocialSource,
  referenceDate: Date
): Promise<PlatformScrapeResult> {
  if (!track.instagramUrl) {
    return {
      trackSlug: track.slug,
      trackName: track.name,
      platform: 'instagram',
      success: true,
      posts: [],
    };
  }

  try {
    await navigateTo(page, track.instagramUrl);

    const title = await page.title();
    if (/log in|login/i.test(title)) {
      return {
        trackSlug: track.slug,
        trackName: track.name,
        platform: 'instagram',
        success: false,
        posts: [],
        error: 'Instagram login wall — log into Instagram in Chrome first',
      };
    }

    await gentleScroll(page);

    const code = getExtractInstagramMetadataScript(MAX_POSTS_PER_SOURCE);
    const extracted = await page.evaluate((c: string) => {
      // eslint-disable-next-line no-eval
      return eval(c);
    }, code);

    const posts: MetadataPost[] = (extracted.posts ?? [])
      .filter((p: { url: string | null }) => p.url)
      .map((p: { url: string; timestampText?: string; isoTimestamp?: string | null }) => {
        const iso = p.isoTimestamp ?? null;
        const parsed = iso ? new Date(iso) : null;
        return {
          url: p.url.split('?')[0],
          timestampText: p.timestampText || (iso ? new Date(iso).toLocaleDateString('en-US', { timeZone: 'America/Denver' }) : ''),
          timestamp: parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : null,
        };
      });

    return {
      trackSlug: track.slug,
      trackName: track.name,
      platform: 'instagram',
      success: true,
      posts: filterRecentPosts(posts, referenceDate),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      trackSlug: track.slug,
      trackName: track.name,
      platform: 'instagram',
      success: false,
      posts: [],
      error: msg,
    };
  }
}

async function main(): Promise<void> {
  const referenceDate = new Date();
  const tracks = await loadColoradoTrackSources();
  const withFb = tracks.filter((t) => t.fbPageUrl);
  const withIg = tracks.filter((t) => t.instagramUrl);

  console.log(`\n🔍 Social metadata scan — ${tracks.length} Colorado tracks`);
  console.log(`   Facebook: ${withFb.length} | Instagram: ${withIg.length}`);
  console.log(`   Recent window: last ${2} days\n`);

  const connectOpts = await chromePuppeteerConnectOptions();
  const browser = await puppeteer.connect(connectOpts);

  const pages = await browser.pages();
  const page = pages[0] ?? (await browser.newPage());
  const results: PlatformScrapeResult[] = [];

  for (const track of tracks) {
    if (track.fbPageUrl) {
      const fb = await scrapeFacebook(page, track, referenceDate);
      results.push(fb);
      const status = fb.success ? `${fb.posts.length} recent` : `failed: ${fb.error}`;
      console.log(`   FB  ${track.name}: ${status}`);
      await sleep(randomDelayMs(HUMANIZE.betweenPostsMs.min, HUMANIZE.betweenPostsMs.max));
    }

    if (track.instagramUrl) {
      const ig = await scrapeInstagram(page, track, referenceDate);
      results.push(ig);
      const status = ig.success ? `${ig.posts.length} recent` : `failed: ${ig.error}`;
      console.log(`   IG  ${track.name}: ${status}`);
      await sleep(randomDelayMs(HUMANIZE.betweenPostsMs.min, HUMANIZE.betweenPostsMs.max));
    }
  }

  await browser.disconnect();

  const payload: SocialScrapeOutput = {
    scrapedAt: referenceDate.toISOString(),
    runId,
    results,
  };

  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2), 'utf8');
  // Back-compat for ingest scripts expecting this filename
  fs.writeFileSync(legacyJsonPath, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`\n✅ Wrote ${jsonPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
