#!/usr/bin/env npx tsx
/**
 * Facebook scrape against an existing Chrome instance (CDP :9222).
 * Mirrors scripts/agents/facebook-scrape.md when MCP cannot attach (e.g. autoConnect + DevToolsActivePort).
 */

import * as fs from 'fs';
import * as path from 'path';
import puppeteer, { type Page } from 'puppeteer-core';
import {
  containsAlertKeywords,
  isEventRelated,
  parseRelativeTimestamp,
  type FacebookComment,
  type FacebookPost,
  type ScraperResult,
} from './fetchFacebook';
import { TRACK_MAPPINGS } from './config';
import { chromeDebugUrl } from './lib/chromeDebug';
import { getExtractPostsEvaluateScript, getExtractPostMetadataScript } from './lib/facebookInteractions';
import {
  HUMANIZE,
  LIKE_CAPS,
  randomDelayMs,
  randomInt,
  getMouseMoveEvaluateScript,
  getScrollEvaluateScript,
} from './lib/humanize';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const METADATA_ONLY = process.argv.includes('--metadata-only');

const TRACK_ORDER = METADATA_ONLY
  ? ([
      'mile-high-bmx',
      'dacono-bmx',
      'county-line-bmx',
      'twin-silo-bmx',
      'durango-bmx',
      'grand-valley-bmx',
    ] as const)
  : ([
      'mile-high-bmx',
      'dacono-bmx',
      'county-line-bmx',
      'twin-silo-bmx',
    ] as const);

const URL_NEEDLE: Record<string, string> = {
  'mile-high-bmx': 'milehighbmx',
  'dacono-bmx': 'daconobmxtrack',
  'county-line-bmx': 'countylinebmx',
  'twin-silo-bmx': 'twinsilobmx',
  'durango-bmx': 'durangobmx',
  'grand-valley-bmx': 'grandvalleybmx',
};

const runId =
  process.env.RUN_ID ||
  (() => {
    const d = new Date();
    return `${d.toISOString().slice(0, 10)}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;
  })();

const repoRoot = path.join(__dirname, '..');
const outDir = path.join(repoRoot, 'scripts/output/screenshots', runId);
const jsonPath = METADATA_ONLY
  ? path.join(repoRoot, 'scripts/output/latest-fb-metadata.json')
  : path.join(repoRoot, 'scripts/output/latest-mcp-scrape.json');
const healLogPath = path.join(repoRoot, 'scripts/output/last-heal-log.json');

type VisionEntry = {
  step: string;
  ok: boolean;
  expected: string;
  observed: string;
  at?: string;
};

const appendVision = (entry: VisionEntry): void => {
  const line = JSON.stringify({
    ...entry,
    at: entry.at ?? new Date().toISOString(),
  });
  fs.mkdirSync(outDir, { recursive: true });
  fs.appendFileSync(path.join(outDir, '_vision-log.jsonl'), line + '\n', 'utf8');
};

const visionObserved = async (page: Page, extra?: string): Promise<string> => {
  const title = await page.title().catch(() => '');
  const loginWall = /log into facebook|log in to facebook/i.test(title);
  return [
    `title=${title.substring(0, 120)}`,
    loginWall ? 'possible_login_wall' : 'feed_ok',
    extra ?? '',
  ]
    .filter(Boolean)
    .join('; ');
};

const detectCaptchaInterstitial = async (page: Page): Promise<boolean> => {
  const url = page.url().toLowerCase();
  if (
    url.includes('facebook.com/checkpoint') ||
    url.includes('facebook.com/captcha') ||
    url.includes('web_checkpoint')
  ) {
    return true;
  }
  const title = (await page.title().catch(() => '')).toLowerCase();
  return (
    title.includes('security check') ||
    title.includes('captcha') ||
    title.includes('confirm your identity')
  );
};

async function findTrackPage(
  pages: Page[],
  slug: string
): Promise<Page | null> {
  const needle = URL_NEEDLE[slug];
  const p = pages.find((pg) => pg.url().toLowerCase().includes(needle));
  return p ?? null;
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

async function shot(page: Page, name: string): Promise<void> {
  fs.mkdirSync(outDir, { recursive: true });
  await page.screenshot({
    path: path.join(outDir, `${name}.png`),
    fullPage: false,
  });
}

type ExtractedFeed = {
  count: number;
  posts: Array<{
    text: string;
    timestampText: string;
    url: string | null;
    image: string | null;
    hasSeeMore: boolean;
    comments: FacebookComment[];
  }>;
  articleCount: number;
};

async function evalExtract(page: Page): Promise<ExtractedFeed> {
  const code = METADATA_ONLY
    ? getExtractPostMetadataScript(10)
    : getExtractPostsEvaluateScript(10);
  return page.evaluate((c: string) => {
    // eslint-disable-next-line no-eval
    return eval(c);
  }, code);
}

async function scrapeOneTrackMetadata(
  page: Page,
  slug: string
): Promise<ScraperResult> {
  const mapping = TRACK_MAPPINGS[slug];
  try {
    await page.bringToFront();
    if (slug === 'twin-silo-bmx') await ensureTwinSiloPostsTab(page);
    await sleep(randomDelayMs(HUMANIZE.afterTabFocusMs.min, HUMANIZE.afterTabFocusMs.max));

    const scrolls = randomInt(HUMANIZE.scrollsPerTab.min, HUMANIZE.scrollsPerTab.max);
    for (let s = 0; s < scrolls; s++) {
      await page.evaluate(
        (snippet: string) => { return eval(snippet); },
        getScrollEvaluateScript(0.5)
      );
      await sleep(randomDelayMs(HUMANIZE.betweenScrollsMs.min, HUMANIZE.betweenScrollsMs.max));
    }

    const extracted = await evalExtract(page);
    const posts: FacebookPost[] = extracted.posts.map((base) => ({
      text: '',
      timestamp: base.timestampText ? parseRelativeTimestamp(base.timestampText) : null,
      timestampText: base.timestampText || undefined,
      url: base.url,
      image: null,
      isEvent: false,
      hasAlertKeywords: false,
      comments: [],
    }));

    return { success: true, trackName: mapping.name, trackSlug: slug, posts };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, trackName: mapping.name, trackSlug: slug, posts: [], error: msg };
  }
}

async function scrapeOneTrack(
  page: Page,
  slug: string,
  likeState: { run: number; track: number }
): Promise<ScraperResult> {
  if (METADATA_ONLY) return scrapeOneTrackMetadata(page, slug);

  const mapping = TRACK_MAPPINGS[slug];
  const slugSafe = slug.replace(/[^a-z0-9-]/gi, '-');

  try {
    await page.bringToFront();

    if (slug === 'twin-silo-bmx') {
      await ensureTwinSiloPostsTab(page);
    }

    await sleep(randomDelayMs(HUMANIZE.afterTabFocusMs.min, HUMANIZE.afterTabFocusMs.max));

    await shot(page, `${slugSafe}-00-tab-focused`);
    appendVision({
      step: `${slugSafe}-00-tab-focused`,
      ok: true,
      expected: 'Correct page, Posts column, logged in',
      observed: await visionObserved(page),
    });

    const moves = randomInt(HUMANIZE.mouseMovesPerTab.min, HUMANIZE.mouseMovesPerTab.max);
    await page.evaluate(
      (snippet: string) => {
        // eslint-disable-next-line no-eval
        return eval(snippet);
      },
      getMouseMoveEvaluateScript(moves)
    );
    await sleep(randomDelayMs(400, 900));

    const scrolls = randomInt(HUMANIZE.scrollsPerTab.min, HUMANIZE.scrollsPerTab.max);
    for (let s = 0; s < scrolls; s++) {
      const frac = randomInt(
        Math.round(HUMANIZE.scrollViewportFraction.min * 100),
        Math.round(HUMANIZE.scrollViewportFraction.max * 100)
      ) / 100;
      await page.evaluate(
        (snippet: string) => {
          // eslint-disable-next-line no-eval
          return eval(snippet);
        },
        getScrollEvaluateScript(frac)
      );
      await sleep(randomDelayMs(HUMANIZE.betweenScrollsMs.min, HUMANIZE.betweenScrollsMs.max));
    }

    await shot(page, `${slugSafe}-01-after-scroll`);
    appendVision({
      step: `${slugSafe}-01-after-scroll`,
      ok: true,
      expected: 'Posts feed with posts',
      observed: await visionObserved(page, `scrolls=${scrolls}`),
    });

    const extracted = await evalExtract(page);
    if (await detectCaptchaInterstitial(page)) {
      throw new Error('CAPTCHA or checkpoint interstitial');
    }

    const posts: FacebookPost[] = [];

    const n = Math.min(10, extracted.posts.length, extracted.articleCount);
    for (let i = 0; i < n; i++) {
      const base = extracted.posts[i];

      await page.evaluate((idx: number) => {
        const articles = document.querySelectorAll('div[role="article"]');
        const el = articles[idx] as HTMLElement | undefined;
        el?.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior });
      }, i);
      await sleep(randomDelayMs(300, 700));

      await shot(page, `${slugSafe}-post${i + 1}-before-expand`);
      appendVision({
        step: `${slugSafe}-post${i + 1}-before-expand`,
        ok: true,
        expected: 'Post in view',
        observed: `article ${i + 1}/${n}`,
      });

      let expandFailed = false;
      if (base.hasSeeMore) {
        const clicked = await page.evaluate((idx: number) => {
          const a = document.querySelectorAll('div[role="article"]')[idx];
          if (!a) return false;
          const cand = [...a.querySelectorAll('div[role="button"], span')].find((el) =>
            /see more/i.test((el.textContent || '').trim())
          );
          if (cand) {
            (cand as HTMLElement).click();
            return true;
          }
          return false;
        }, i);
        expandFailed = !clicked;
        await sleep(randomDelayMs(HUMANIZE.afterSeeMoreMs.min, HUMANIZE.afterSeeMoreMs.max));
        if (clicked) {
          await shot(page, `${slugSafe}-post${i + 1}-after-expand`);
          appendVision({
            step: `${slugSafe}-post${i + 1}-after-expand`,
            ok: true,
            expected: 'Expanded caption',
            observed: 'see more clicked',
          });
        }
      }

      await page.evaluate((idx: number) => {
        const a = document.querySelectorAll('div[role="article"]')[idx];
        if (!a) return;
        const btns = [...a.querySelectorAll('[role="button"]')];
        for (const b of btns) {
          const t = (b.textContent || '').replace(/\s+/g, ' ').trim();
          if (/^\d+\s*comments?$/i.test(t) || /^comment$/i.test(t) || /comment/i.test(t)) {
            (b as HTMLElement).click();
            return;
          }
        }
      }, i);
      await sleep(
        randomDelayMs(HUMANIZE.afterOpenCommentsMs.min, HUMANIZE.afterOpenCommentsMs.max)
      );

      const commentScrolls = randomInt(1, 2);
      for (let cs = 0; cs < commentScrolls; cs++) {
        await page.evaluate(() => {
          const dlg = document.querySelector('div[role="dialog"]');
          const root = dlg || document.querySelector('[role="main"]');
          (root as HTMLElement | null)?.scrollBy?.(0, Math.floor(window.innerHeight * 0.5));
        });
        await sleep(
          randomDelayMs(HUMANIZE.commentScrollPauseMs.min, HUMANIZE.commentScrollPauseMs.max)
        );
      }

      let comments: FacebookComment[] = await page.evaluate(() => {
        const dlg = document.querySelector('div[role="dialog"]');
        const scope = dlg || document.body;
        const rows = [...scope.querySelectorAll('[data-ad-comet-preview="message"], span[dir="auto"]')];
        const out: FacebookComment[] = [];
        for (const el of rows) {
          const text = (el.textContent || '').trim();
          if (text.length < 2 || text.length > 8000) continue;
          if (/see more|^like$|^reply$/i.test(text)) continue;
          out.push({ text });
          if (out.length >= 8) break;
        }
        return out;
      });
      comments = comments.slice(0, 8);

      await page.keyboard.press('Escape').catch(() => {});
      await sleep(400);

      let liked = false;
      const priority = containsAlertKeywords(base.text) || isEventRelated(base.text);
      if (
        priority &&
        likeState.run < LIKE_CAPS.perRun &&
        likeState.track < LIKE_CAPS.perTrack
      ) {
        const likeRes = await page.evaluate((idx: number) => {
          const a = document.querySelectorAll('div[role="article"]')[idx];
          if (!a) return { ok: false as const, reason: 'no_article' };
          const labels = [...a.querySelectorAll('[aria-label*="Like"], [aria-label*="like"]')];
          for (const el of labels) {
            const pressed = el.getAttribute('aria-pressed');
            if (pressed === 'true') return { ok: false as const, reason: 'already' };
            (el as HTMLElement).click();
            return { ok: true as const, reason: 'clicked' };
          }
          return { ok: false as const, reason: 'no_control' };
        }, i);
        if (likeRes.ok) {
          liked = true;
          likeState.run += 1;
          likeState.track += 1;
          await sleep(randomDelayMs(HUMANIZE.afterLikeMs.min, HUMANIZE.afterLikeMs.max));
        }
      }

      const tsText = base.timestampText || '';
      const post: FacebookPost = {
        text: base.text,
        timestamp: tsText ? parseRelativeTimestamp(tsText) : null,
        timestampText: tsText || undefined,
        url: base.url,
        image: base.image,
        isEvent: isEventRelated(base.text),
        hasAlertKeywords: containsAlertKeywords(base.text),
        comments,
        liked,
        expandFailed,
      };
      posts.push(post);

      await sleep(randomDelayMs(HUMANIZE.betweenPostsMs.min, HUMANIZE.betweenPostsMs.max));
    }

    return {
      success: true,
      trackName: mapping.name,
      trackSlug: slug,
      posts,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      trackName: mapping.name,
      trackSlug: slug,
      posts: [],
      error: msg,
    };
  }
}

const appendHeal = (entry: Record<string, unknown>): void => {
  let arr: Record<string, unknown>[] = [];
  try {
    if (fs.existsSync(healLogPath)) {
      arr = JSON.parse(fs.readFileSync(healLogPath, 'utf8')) as Record<string, unknown>[];
      if (!Array.isArray(arr)) arr = [];
    }
  } catch {
    arr = [];
  }
  arr.push({ at: new Date().toISOString(), ...entry });
  fs.writeFileSync(healLogPath, JSON.stringify(arr, null, 2), 'utf8');
};

async function main(): Promise<void> {
  if (!process.argv.includes('--legacy-deep')) {
    console.warn(
      'runCdpFacebookScrape.ts is deprecated. Use: npm run scrape:social\n'
    );
    const { spawnSync } = await import('child_process');
    const proc = spawnSync(
      'npx',
      ['tsx', path.join(__dirname, 'runSocialMetadataScrape.ts')],
      { stdio: 'inherit', cwd: repoRoot }
    );
    process.exit(proc.status ?? 1);
  }
  const scrapedAt = new Date().toISOString();
  fs.mkdirSync(outDir, { recursive: true });

  appendHeal({
    symptom: 'MCP chrome-devtools used DevToolsActivePath with --autoConnect',
    retryOutcome:
      'Patched .cursor/mcp.json to --browserUrl; Playwright connectOverCDP hits shared_worker assert on Facebook, so runCdpFacebookScrape uses puppeteer-core connect instead',
    filesChanged: ['.cursor/mcp.json', 'scripts/runCdpFacebookScrape.ts', 'package.json'],
  });

  const cdp = chromeDebugUrl();
  const browser = await puppeteer.connect({
    browserURL: cdp,
    defaultViewport: null,
  });
  const pages = await browser.pages();
  const likeState = { run: 0, track: 0 };
  const results: ScraperResult[] = [];

  for (const slug of TRACK_ORDER) {
    likeState.track = 0;
    const p = await findTrackPage(pages, slug);
    if (!p) {
      results.push({
        success: false,
        trackName: TRACK_MAPPINGS[slug].name,
        trackSlug: slug,
        posts: [],
        error: `No open tab matching ${URL_NEEDLE[slug]}`,
      });
      continue;
    }
    results.push(await scrapeOneTrack(p, slug, likeState));
  }

  await browser.disconnect();

  const payload = {
    scrapedAt,
    runId,
    results,
    visionLogPath: `scripts/output/screenshots/${runId}/_vision-log.jsonl`,
    healLogPath: 'scripts/output/last-heal-log.json',
  };
  fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`Wrote ${jsonPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
