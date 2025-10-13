/**
 * County Line BMX Facebook Scraper
 * 
 * Scrapes public Facebook posts from County Line BMX page
 * URL: https://www.facebook.com/CountyLineBMX/
 */

import { scrapeFacebookPage, printResults, type TrackConfig } from './fetchFacebook';

const COUNTY_LINE_CONFIG: TrackConfig = {
  name: 'County Line BMX',
  slug: 'county-line-bmx',
  facebookUrl: 'https://www.facebook.com/CountyLineBMX/'
};

/**
 * Main scraper function for County Line BMX
 */
export const scrapeCountyLineBmxFacebook = async () => {
  return await scrapeFacebookPage(COUNTY_LINE_CONFIG);
};

// Run if executed directly
if (require.main === module) {
  scrapeCountyLineBmxFacebook()
    .then(result => {
      printResults(result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

