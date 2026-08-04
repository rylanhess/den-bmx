#!/usr/bin/env npx tsx
/**
 * Cloud Facebook scanner — no Chrome required.
 *
 * Fetches Colorado track Facebook pages over plain HTTP using a session
 * cookie (GitHub secret `FB_COOKIE`), extracts post URL + timestamp from
 * embedded page JSON (`creation_time` unix seconds paired with post
 * permalinks), then POSTs the standard SocialScrapeOutput shape to the
 * Vercel ingest API. Runs once daily in GitHub Actions; idempotent via
 * Supabase `fb_post_signals` dedup on the ingest side.
 *
 * Cookie lifecycle: `FB_COOKIE` is a raw Cookie header exported from a
 * logged-in Chrome session. Facebook rotates session cookies via set-cookie
 * on normal responses, so after each run the merged jar is written to
 * scripts/output/.fb-cookie-next — the workflow pushes it back into the
 * `FB_COOKIE` secret, which is the daily refresh. If the session dies
 * (login wall on every track), an escalation email asks for a re-export.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import {
  loadColoradoTrackSources,
  type SocialPlatform,
  type TrackSocialSource,
} from './lib/coloradoTrackSources';
import type { MetadataPost, PlatformResult, ScrapeOutput } from './lib/ingestSocialSignals';
import { isWithinRecentWindow, RECENT_CALENDAR_DAYS_PRIOR } from './lib/recentSocialWindow';
import { randomDelayMs } from './lib/humanize';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const MAX_POSTS_PER_PAGE = 12;
const FETCH_TIMEOUT_MS = 30_000;
const repoRoot = path.join(__dirname, '..');
const jsonPath = path.join(repoRoot, 'scripts/output/latest-social-metadata.json');
const cookieOutPath = path.join(repoRoot, 'scripts/output/.fb-cookie-next');

const d = new Date();
const runId =
  process.env.RUN_ID ||
  `${d.toISOString().slice(0, 10)}T${String(d.getHours()).padStart(2, '0')}${String(
    d.getMinutes()
  ).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;

interface TrackResult extends PlatformResult {
  error?: string;
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

/** Session cookies Facebook rotates during the run — never logged or archived. */
const cookieJar = new Map<string, string>();

function loadCookieJar(): void {
  const raw = process.env.FB_COOKIE?.trim();
  if (!raw) {
    throw new Error(
      'FB_COOKIE is not set. Export the Cookie header for facebook.com from a logged-in Chrome session (DevTools → Network → any request) and add it to .env.local or the GitHub repo secrets.'
    );
  }
  for (const pair of raw.split(';')) {
    const eq = pair.indexOf('=');
    if (eq > 0) cookieJar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
  }
  if (!cookieJar.has('c_user') || !cookieJar.has('xs')) {
    throw new Error('FB_COOKIE is missing c_user/xs — re-export the full Cookie header.');
  }
}

function cookieHeader(): string {
  return [...cookieJar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

function absorbSetCookies(res: Response): void {
  for (const sc of res.headers.getSetCookie()) {
    const pair = sc.split(';', 1)[0];
    const eq = pair.indexOf('=');
    if (eq <= 0) continue;
    const name = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();
    // Expired cookies come back with past Expires — drop from jar instead.
    if (/expires=Thu, 01 Jan 1970/i.test(sc)) cookieJar.delete(name);
    else cookieJar.set(name, value);
  }
}

function pagePath(fbPageUrl: string): string {
  try {
    return new URL(fbPageUrl).pathname.replace(/\/+$/, '') || '/';
  } catch {
    return fbPageUrl;
  }
}

class LoginWallError extends Error {}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      'User-Agent': UA,
      Cookie: cookieHeader(),
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  absorbSetCookies(res);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const finalUrl = res.url.toLowerCase();
  if (finalUrl.includes('/login') || finalUrl.includes('checkpoint')) {
    throw new LoginWallError('session expired — redirected to login');
  }
  return res.text();
}

/**
 * Pull (post URL, creation_time) pairs out of Facebook's embedded page JSON.
 * Heuristic: post permalinks appear as escaped URLs; `creation_time` sits in
 * the same story object, so we scan a character window around each URL match.
 */
function extractPosts(html: string, fbPageUrl: string): MetadataPost[] {
  const text = html.replace(/\\\//g, '/').replace(/&amp;/g, '&');
  const path = pagePath(fbPageUrl).replace(/^\//, '');
  const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const urlPattern = new RegExp(
    `https?://www\\.facebook\\.com/(?:${escapedPath}/(?:posts|videos|photos)/[^"\\s]+|permalink\\.php\\?story_fbid=[0-9]+[^"\\s]*)`,
    'g'
  );

  const seen = new Set<string>();
  const posts: MetadataPost[] = [];

  for (const match of text.matchAll(urlPattern)) {
    if (posts.length >= MAX_POSTS_PER_PAGE) break;
    const rawUrl = match[0].split('?')[0].replace(/\/+$/, '');
    if (seen.has(rawUrl)) continue;

    const idx = match.index ?? 0;
    const windowStart = Math.max(0, idx - 4000);
    const windowText = text.slice(windowStart, idx + 4000);
    const timeMatches = [...windowText.matchAll(/"creation_time"\s*:\s*(\d{9,11})/g)];
    if (timeMatches.length === 0) continue;

    const unixSeconds = Number(timeMatches[timeMatches.length - 1][1]);
    const ts = new Date(unixSeconds * 1000);
    if (Number.isNaN(ts.getTime())) continue;

    seen.add(rawUrl);
    posts.push({
      url: rawUrl,
      timestampText: ts.toLocaleDateString('en-US', { timeZone: 'America/Denver' }),
      timestamp: ts.toISOString(),
    });
  }

  return posts;
}

async function scanTrack(track: TrackSocialSource, referenceDate: Date): Promise<TrackResult> {
  const base: Omit<TrackResult, 'success'> = {
    trackSlug: track.slug,
    trackName: track.name,
    platform: 'facebook' as SocialPlatform,
    posts: [],
  };
  if (!track.fbPageUrl) return { ...base, success: true };

  try {
    const html = await fetchHtml(`https://www.facebook.com${pagePath(track.fbPageUrl)}`);
    if (!/"creation_time"/.test(html)) {
      if (/you must log in|log in to continue/i.test(html)) {
        throw new LoginWallError('session expired — login wall HTML');
      }
      throw new Error('no post data in HTML (blocked or layout change)');
    }
    const posts = extractPosts(html, track.fbPageUrl).filter((p) =>
      isWithinRecentWindow(p.timestamp ? new Date(p.timestamp) : null, p.timestamp, referenceDate)
    );
    return { ...base, success: true, posts };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ...base, success: false, error: msg };
  }
}

async function postToVercel(payload: ScrapeOutput): Promise<boolean> {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.log('\nCRON_SECRET not set — skipping Vercel ingest POST (JSON written locally)');
    return false;
  }
  const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bmxcolorado.com').replace(/\/$/, '');
  const endpoint = `${site}/api/cron/social-ingest`;
  console.log(`\nPOST latest-social-metadata.json → ${endpoint}`);

  const res = await fetch(endpoint, {
    method: 'POST',
    signal: AbortSignal.timeout(60_000),
    headers: {
      Authorization: `Bearer ${cronSecret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  if (!res.ok) {
    console.error(`Vercel ingest failed (${res.status}): ${body}`);
    return false;
  }
  console.log(`Vercel ingest OK (${res.status})`);
  console.log(body);
  return true;
}

function escalate(reason: string, failedTracks: string[]): void {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set — skipping escalation email');
    return;
  }
  try {
    execFileSync(
      'npx',
      [
        'tsx',
        'scripts/notifyScraperEscalation.ts',
        '--reason',
        reason,
        '--run-id',
        runId,
        '--failed-tracks',
        failedTracks.join(','),
      ],
      { cwd: repoRoot, stdio: 'inherit' }
    );
  } catch (err) {
    console.error('Escalation email failed:', err);
  }
}

function persistCookieJar(): void {
  const updated = cookieHeader();
  if (updated === process.env.FB_COOKIE?.trim()) return;
  fs.mkdirSync(path.dirname(cookieOutPath), { recursive: true });
  fs.writeFileSync(cookieOutPath, updated, { encoding: 'utf8', mode: 0o600 });
  console.log('Session cookies rotated — wrote .fb-cookie-next for secret refresh');
}

async function main(): Promise<void> {
  loadCookieJar();

  const referenceDate = new Date();
  const tracks = (await loadColoradoTrackSources()).filter((t) => t.fbPageUrl);

  console.log(`\n🔍 Cloud Facebook scan — ${tracks.length} Colorado track pages`);
  console.log(`   Recent window: today + prior ${RECENT_CALENDAR_DAYS_PRIOR} calendar days (MT)\n`);

  const results: TrackResult[] = [];
  for (const track of tracks) {
    const result = await scanTrack(track, referenceDate);
    results.push(result);
    console.log(
      `   FB  ${track.name}: ${result.success ? `${result.posts.length} recent` : `failed: ${result.error}`}`
    );
    await sleep(randomDelayMs(3000, 8000));
  }

  const payload: ScrapeOutput = {
    scrapedAt: referenceDate.toISOString(),
    results,
  };
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify({ ...payload, runId }, null, 2), 'utf8');
  console.log(`\n✅ Wrote ${jsonPath}`);

  const failed = results.filter((r) => !r.success);
  const sessionDead =
    failed.length === results.length &&
    results.length > 0 &&
    failed.every((r) => r.error && /login|expired|checkpoint/i.test(r.error));

  if (sessionDead) {
    escalate(
      'Cloud scan: FB session cookie expired — re-export the facebook.com Cookie header from logged-in Chrome and update the FB_COOKIE repo secret',
      results.map((r) => r.trackSlug)
    );
    process.exit(1);
  }
  if (failed.length === results.length && results.length > 0) {
    escalate(
      'Cloud scan: all Facebook track fetches failed (possible FB block of runner IPs)',
      results.map((r) => r.trackSlug)
    );
    process.exit(1);
  }

  persistCookieJar();

  const posted = await postToVercel(payload);
  if (!posted && process.env.CRON_SECRET) {
    escalate(
      'Cloud scan: Vercel ingest POST failed',
      failed.map((r) => r.trackSlug)
    );
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
