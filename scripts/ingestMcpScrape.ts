#!/usr/bin/env npx tsx
/**
 * Ingest MCP scrape JSON → Supabase alerts → process events
 */

import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import type { FacebookPost, ScraperResult } from './fetchFacebook';
import {
  containsAlertKeywords,
  isEventRelated,
  parseRelativeTimestamp,
} from './fetchFacebook';
import type { McpScrapePayload } from './types/mcpScrape';
import { upsertMultipleResults } from './upsert';
import { TRACK_MAPPINGS } from './config';

const DEFAULT_FILE = path.join(__dirname, 'output', 'latest-mcp-scrape.json');

const parseArgs = (): { file: string; hours: number; dryRun: boolean } => {
  const args = process.argv.slice(2);
  const fileIdx = args.findIndex((a) => a === '--file');
  const file =
    fileIdx >= 0 && args[fileIdx + 1]
      ? path.resolve(args[fileIdx + 1])
      : DEFAULT_FILE;
  const hoursArg = args.find((a) => a.startsWith('--hours='));
  const hours = hoursArg ? parseInt(hoursArg.split('=')[1], 10) : 240;
  const dryRun = args.includes('--dry-run');
  return { file, hours, dryRun };
};

const revivePost = (raw: Record<string, unknown>): FacebookPost => {
  const text = String(raw.text ?? '');
  const timestampText = raw.timestampText as string | undefined;
  const timestamp = raw.timestamp
    ? new Date(String(raw.timestamp))
    : timestampText
      ? parseRelativeTimestamp(timestampText)
      : null;
  const comments = (raw.comments as FacebookPost['comments']) ?? [];
  const commentAlert = comments.some((c) => containsAlertKeywords(c.text));
  const hasAlertKeywords =
    Boolean(raw.hasAlertKeywords) || containsAlertKeywords(text) || commentAlert;
  const isEvent = Boolean(raw.isEvent) || isEventRelated(text);

  return {
    text,
    timestamp,
    timestampText,
    url: (raw.url as string) ?? null,
    image: (raw.image as string) ?? null,
    isEvent,
    hasAlertKeywords,
    comments,
    liked: Boolean(raw.liked),
    expandFailed: Boolean(raw.expandFailed),
  };
};

const reviveResults = (payload: McpScrapePayload): ScraperResult[] =>
  payload.results.map((r) => ({
    success: r.success,
    trackName: r.trackName,
    trackSlug: r.trackSlug,
    error: r.error,
    posts: (r.posts as unknown as Record<string, unknown>[]).map(revivePost),
  }));

const loadPayload = (file: string): McpScrapePayload => {
  if (!fs.existsSync(file)) {
    throw new Error(`Scrape file not found: ${file}`);
  }
  const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as McpScrapePayload;
  if (!raw.results || !Array.isArray(raw.results)) {
    throw new Error('Invalid scrape JSON: missing results array');
  }
  return raw;
};

const main = async (): Promise<number> => {
  const { file, hours, dryRun } = parseArgs();
  console.log(`\n📥 Ingesting MCP scrape from ${file}\n`);

  const payload = loadPayload(file);
  const results = reviveResults(payload);

  const expectedSlugs = Object.keys(TRACK_MAPPINGS);
  const failed = results.filter((r) => !r.success);
  const empty = results.filter((r) => r.success && r.posts.length === 0);

  if (failed.length > 0) {
    console.warn(`⚠️  ${failed.length} track(s) failed scrape:`);
    failed.forEach((r) => console.warn(`   - ${r.trackSlug}: ${r.error ?? 'unknown'}`));
  }
  if (empty.length > 0) {
    console.warn(`⚠️  ${empty.length} track(s) returned zero posts`);
  }

  await upsertMultipleResults(results, {
    dryRun,
    deduplicateFirst: true,
  });

  if (!dryRun) {
    const proc = spawnSync(
      'npx',
      ['tsx', path.join(__dirname, 'processEvents.ts'), `--hours=${hours}`],
      { stdio: 'inherit', cwd: path.join(__dirname, '..') }
    );
    if (proc.status !== 0) {
      console.error('❌ processEvents failed');
      return 1;
    }
  }

  const allFailed = results.every((r) => !r.success);
  const anyFailed = failed.length > 0;

  if (allFailed) {
    return 2;
  }
  if (anyFailed || empty.length === expectedSlugs.length) {
    return 1;
  }
  return 0;
};

main()
  .then((code) => {
    if (code !== 0) {
      console.log('\n💡 On failure, run: tsx scripts/notifyScraperEscalation.ts --reason "ingest failed"\n');
    }
    process.exit(code);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
