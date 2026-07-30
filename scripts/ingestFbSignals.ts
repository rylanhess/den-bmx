/**
 * Ingest social post metadata (URL + timestamp only) into fb_post_signals
 * and auto-create forum notification threads via the BMX Colorado bot.
 */

import * as fs from 'fs';
import * as path from 'path';
import { ingestSocialMetadata, type ScrapeOutput } from './lib/ingestSocialSignals';

async function main() {
  const defaultPath = path.join(__dirname, 'output', 'latest-social-metadata.json');
  const fallbackPath = path.join(__dirname, 'output', 'latest-fb-metadata.json');
  const inputPath =
    process.argv[2] ||
    (fs.existsSync(defaultPath) ? defaultPath : fallbackPath);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    console.error('   Run: npm run scrape:social');
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, 'utf-8');
  const data: ScrapeOutput = JSON.parse(raw);

  console.log(`\n📥 Ingesting social metadata from ${inputPath}`);
  console.log(`   Scraped at: ${data.scrapedAt}`);
  console.log(`   Results: ${data.results.length}\n`);

  const { inserted, skipped } = await ingestSocialMetadata(data);

  for (const result of data.results) {
    const platform = result.platform ?? 'facebook';
    const label = platform === 'instagram' ? 'Instagram' : 'Facebook';
    console.log(`   ${label} ${result.trackName}: processed`);
  }

  console.log(`\n✅ Done: ${inserted} new signals, ${skipped} skipped`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
