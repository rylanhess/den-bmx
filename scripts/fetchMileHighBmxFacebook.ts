/**
 * Mile High BMX Facebook Scraper
 * 
 * Scrapes public Facebook posts from Mile High BMX page
 * URL: https://www.facebook.com/MileHighBmx/
 */

import { scrapeFacebookPage, printResults, type TrackConfig } from './fetchFacebook';

const MILE_HIGH_CONFIG: TrackConfig = {
  name: 'Mile High BMX',
  slug: 'mile-high-bmx',
  facebookUrl: 'https://www.facebook.com/MileHighBmx/'
};

/**
 * Main scraper function for Mile High BMX
 */
export const scrapeMileHighBmxFacebook = async () => {
  return await scrapeFacebookPage(MILE_HIGH_CONFIG);
};

// Run if executed directly
if (require.main === module) {
  scrapeMileHighBmxFacebook()
    .then(result => {
      printResults(result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

