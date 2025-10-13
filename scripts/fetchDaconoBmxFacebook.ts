/**
 * Dacono BMX Facebook Scraper
 * 
 * Scrapes public Facebook posts from Dacono BMX Track page
 * URL: https://www.facebook.com/DaconoBMXTrack/
 */

import { scrapeFacebookPage, printResults, type TrackConfig } from './fetchFacebook';

const DACONO_CONFIG: TrackConfig = {
  name: 'Dacono BMX',
  slug: 'dacono-bmx',
  facebookUrl: 'https://www.facebook.com/DaconoBMXTrack/'
};

/**
 * Main scraper function for Dacono BMX
 */
export const scrapeDaconoBmxFacebook = async () => {
  return await scrapeFacebookPage(DACONO_CONFIG);
};

// Run if executed directly
if (require.main === module) {
  scrapeDaconoBmxFacebook()
    .then(result => {
      printResults(result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

