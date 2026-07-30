/**
 * JSON schema for MCP browser scrape output (scripts/output/latest-mcp-scrape.json)
 */

import type { ScraperResult } from '../fetchFacebook';

export interface McpScrapePayload {
  scrapedAt: string;
  runId: string;
  results: ScraperResult[];
  humanizeLog?: Record<string, unknown>;
  visionLogPath?: string;
  healLogPath?: string;
}

export interface VisionLogEntry {
  step: string;
  ok: boolean;
  expected: string;
  observed: string;
  at?: string;
}

export interface HealLogEntry {
  at: string;
  trackSlug?: string;
  symptom: string;
  filesChanged?: string[];
  retryOutcome?: string;
}
