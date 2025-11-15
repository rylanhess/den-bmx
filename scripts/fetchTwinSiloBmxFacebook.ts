/**
 * Twin Silo BMX Facebook Scraper
 * 
 * Scrapes public Facebook posts from Twin Silo BMX page
 * URL: https://www.facebook.com/twinsilobmx/
 */

import { scrapeFacebookPage, printResults, type TrackConfig } from './fetchFacebook';

const TWIN_SILO_CONFIG: TrackConfig = {
  name: 'Twin Silo BMX',
  slug: 'twin-silo-bmx',
  facebookUrl: 'https://www.facebook.com/twinsilobmx/'
};

/**
 * Main scraper function for Twin Silo BMX
 */
export const scrapeTwinSiloBmxFacebook = async () => {
  return await scrapeFacebookPage(TWIN_SILO_CONFIG);
};

// Run if executed directly
if (require.main === module) {
  scrapeTwinSiloBmxFacebook()
    .then(result => {
      printResults(result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

