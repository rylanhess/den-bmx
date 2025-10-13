/**
 * Master Facebook Scraper - All Denver BMX Tracks
 * 
 * Runs all track Facebook scrapers in sequence or parallel
 * Tracks: Mile High BMX, Dacono BMX, County Line BMX
 */

import { scrapeMileHighBmxFacebook } from './fetchMileHighBmxFacebook';
import { scrapeDaconoBmxFacebook } from './fetchDaconoBmxFacebook';
import { scrapeCountyLineBmxFacebook } from './fetchCountyLineBmxFacebok';
import { printResults, printMultiTrackSummary, type ScraperResult } from './fetchFacebook';

interface ScrapeOptions {
  parallel?: boolean;
  verbose?: boolean;
}

/**
 * Scrape all tracks in sequence
 */
const scrapeSequential = async (verbose: boolean = false): Promise<ScraperResult[]> => {
  const results: ScraperResult[] = [];
  
  console.log('🏁 Scraping all tracks sequentially...\n');
  
  // Mile High BMX
  console.log('1️⃣  Mile High BMX');
  const mileHighResult = await scrapeMileHighBmxFacebook();
  results.push(mileHighResult);
  if (verbose) printResults(mileHighResult);
  
  console.log('\n');
  
  // Dacono BMX
  console.log('2️⃣  Dacono BMX');
  const daconoResult = await scrapeDaconoBmxFacebook();
  results.push(daconoResult);
  if (verbose) printResults(daconoResult);
  
  console.log('\n');
  
  // County Line BMX
  console.log('3️⃣  County Line BMX');
  const countyLineResult = await scrapeCountyLineBmxFacebook();
  results.push(countyLineResult);
  if (verbose) printResults(countyLineResult);
  
  return results;
};

/**
 * Scrape all tracks in parallel (faster)
 */
const scrapeParallel = async (verbose: boolean = false): Promise<ScraperResult[]> => {
  console.log('🏁 Scraping all tracks in parallel...\n');
  
  const [mileHighResult, daconoResult, countyLineResult] = await Promise.all([
    scrapeMileHighBmxFacebook(),
    scrapeDaconoBmxFacebook(),
    scrapeCountyLineBmxFacebook()
  ]);
  
  const results = [mileHighResult, daconoResult, countyLineResult];
  
  if (verbose) {
    results.forEach(result => printResults(result));
  }
  
  return results;
};

/**
 * Main function to scrape all tracks
 */
export const scrapeAllTracks = async (options: ScrapeOptions = {}): Promise<ScraperResult[]> => {
  const { parallel = true, verbose = false } = options;
  
  const startTime = Date.now();
  
  let results: ScraperResult[];
  
  if (parallel) {
    results = await scrapeParallel(verbose);
  } else {
    results = await scrapeSequential(verbose);
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  // Print summary
  printMultiTrackSummary(results);
  
  console.log(`⏱️  Total time: ${duration}s\n`);
  
  return results;
};

// Run if executed directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const parallel = !args.includes('--sequential');
  const verbose = args.includes('--verbose') || args.includes('-v');
  
  console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    DENVER BMX - FACEBOOK SCRAPER                          ║');
  console.log('║                         All Tracks Collection                             ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');
  
  console.log(`Mode: ${parallel ? '🚀 Parallel' : '📝 Sequential'}`);
  console.log(`Verbose: ${verbose ? 'Yes' : 'No'}\n`);
  
  scrapeAllTracks({ parallel, verbose })
    .then(results => {
      const successCount = results.filter(r => r.success).length;
      const exitCode = successCount === results.length ? 0 : 1;
      
      if (exitCode === 0) {
        console.log('✅ All tracks scraped successfully!\n');
      } else {
        console.log(`⚠️  ${results.length - successCount} track(s) failed\n`);
      }
      
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

