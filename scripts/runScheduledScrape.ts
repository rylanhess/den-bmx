#!/usr/bin/env npx tsx
/**
 * @deprecated Deep Facebook scrape (full post text + alerts pipeline).
 * Sunset for bmxcolorado.com — use runSocialMetadataScrape.ts instead.
 *
 * Scheduled / ad-hoc Facebook scrape via Cursor SDK + Chrome DevTools MCP.
 * Requires CURSOR_API_KEY and Chrome with --autoConnect remote debugging.
 */

import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import * as dotenv from 'dotenv';
import { chromeDebugUrl, isChromeRemoteDebuggingReady } from './lib/chromeDebug';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const REPO_ROOT = path.join(__dirname, '..');
const RUNBOOK = path.join(__dirname, 'agents', 'facebook-scrape.md');
const OUTPUT_JSON = path.join(__dirname, 'output', 'latest-mcp-scrape.json');
const HEAL_LOG = path.join(__dirname, 'output', 'last-heal-log.json');

const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 15);

const escalate = (reason: string, failedTracks = ''): void => {
  spawnSync(
    'npx',
    [
      'tsx',
      path.join(__dirname, 'notifyScraperEscalation.ts'),
      '--reason',
      reason,
      '--run-id',
      runId,
      '--failed-tracks',
      failedTracks,
      '--heal-log',
      HEAL_LOG,
      '--vision-log',
      path.join(__dirname, 'output', 'screenshots', runId, '_vision-log.jsonl'),
    ],
    { stdio: 'inherit', cwd: REPO_ROOT }
  );
};

const runIngest = (): number => {
  const proc = spawnSync(
    'npx',
    ['tsx', path.join(__dirname, 'ingestMcpScrape.ts'), '--file', OUTPUT_JSON],
    { stdio: 'inherit', cwd: REPO_ROOT }
  );
  return proc.status ?? 1;
};

const summarizeScrapeFailures = (): { allFailed: boolean; failedSlugs: string } => {
  try {
    const payload = JSON.parse(fs.readFileSync(OUTPUT_JSON, 'utf8')) as {
      results?: { success: boolean; trackSlug: string }[];
    };
    const results = payload.results ?? [];
    const failed = results.filter((r) => !r.success);
    return {
      allFailed: results.length > 0 && failed.length === results.length,
      failedSlugs: failed.map((r) => r.trackSlug).join(','),
    };
  } catch {
    return { allFailed: false, failedSlugs: '' };
  }
};

const main = async (): Promise<void> => {
  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    console.error('CURSOR_API_KEY is not set. Add it to .env.local for scheduled runs.');
    escalate('CURSOR_API_KEY missing');
    process.exit(1);
  }

  if (!fs.existsSync(RUNBOOK)) {
    console.error(`Runbook not found: ${RUNBOOK}`);
    process.exit(1);
  }

  const prompt = [
    fs.readFileSync(RUNBOOK, 'utf8'),
    '',
    `Run ID for this session: ${runId}`,
    `Write scrape output to: ${OUTPUT_JSON}`,
    `Screenshot directory: scripts/output/screenshots/${runId}/`,
    'After scrape completes, say whether ingest is needed and if any track failed.',
  ].join('\n');

  console.log(`\n🏁 Starting Facebook scrape (runId=${runId})\n`);

  const chromeReady = await isChromeRemoteDebuggingReady();
  if (!chromeReady) {
    console.error(
      '❌ Chrome remote debugging is not reachable.\n' +
        '   1. Open Google Chrome (your normal profile)\n' +
        '   2. Visit chrome://inspect/#remote-debugging → enable "Allow remote debugging"\n' +
        '   3. Confirm it shows: Server running at 127.0.0.1:9222\n' +
        '   4. Keep Chrome open with your four Facebook track tabs\n' +
        '   5. Re-run: npm run scrape:now\n'
    );
    escalate('Chrome remote debugging not reachable on ' + chromeDebugUrl());
    process.exit(1);
  }
  console.log(`✓ Chrome CDP ready at ${chromeDebugUrl()}\n`);

  try {
    const { Agent } = await import('@cursor/sdk');

    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: 'composer-2' },
      local: {
        cwd: REPO_ROOT,
        settingSources: ['project'],
      },
      mcpServers: {
        'chrome-devtools': {
          command: 'npx',
          args: ['-y', 'chrome-devtools-mcp@latest', '--autoConnect'],
        },
        supabase: {
          type: 'http',
          url: 'https://mcp.supabase.com/mcp',
        },
      },
    });

    console.log('\nAgent status:', result.status);

    if (result.status === 'error') {
      console.error('Agent error:', result.result);
      escalate('Cursor agent scrape failed');
      process.exit(1);
    }

    if (!fs.existsSync(OUTPUT_JSON)) {
      console.warn('⚠️  latest-mcp-scrape.json not found — agent may not have finished write step.');
      escalate('Scrape JSON missing after agent run');
      process.exit(1);
    }

    const { allFailed, failedSlugs } = summarizeScrapeFailures();
    if (allFailed) {
      console.error('❌ All tracks failed — skipping ingest.');
      escalate('All tracks failed scrape (check Chrome MCP)', failedSlugs);
      process.exit(2);
    }

    const ingestCode = runIngest();
    if (ingestCode !== 0) {
      escalate('Ingest failed after scrape');
      process.exit(ingestCode);
    }

    console.log('\n✅ Scrape + ingest complete\n');
    process.exit(0);
  } catch (err) {
    console.error('Fatal:', err);
    escalate(err instanceof Error ? err.message : 'Scrape runner crashed');
    process.exit(1);
  }
};

main();
