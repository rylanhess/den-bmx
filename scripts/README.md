# DENBMX Scrapers

This directory contains Facebook scrapers for fetching event and alert data from all Denver BMX tracks:

- **Mile High BMX** - Lakewood, CO
- **Dacono BMX** - Dacono, CO  
- **County Line BMX** - Highlands Ranch, CO

## Quick Start

```bash
# Install dependencies
npm install

# Install Chromium browser
npx playwright install chromium

# Test a single track
npm run scrape:milehigh

# Scrape all tracks
npm run scrape:all
```

## Available Commands

### Individual Track Scrapers
```bash
npm run scrape:milehigh     # Mile High BMX only
npm run scrape:dacono       # Dacono BMX only
npm run scrape:countyline   # County Line BMX only
```

### Master Scraper (All Tracks)
```bash
npm run scrape:all                # All tracks in parallel (fastest)
npm run scrape:all:sequential     # All tracks one-by-one
npm run scrape:all:verbose        # All tracks with detailed output
```

### Testing
```bash
npm run scrape:test         # Simple Playwright test
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `playwright` - Headless browser for scraping dynamic content
- `cheerio` - HTML parsing (optional, for static pages)
- `tsx` - TypeScript execution

### 2. Install Playwright Browsers

```bash
npx playwright install chromium
```

This downloads the Chromium browser that Playwright uses for scraping.

## Architecture

### Shared Logic (`fetchFacebook.ts`)

All scrapers use centralized functions from `fetchFacebook.ts`:
- `scrapeFacebookPage()` - Main scraping logic
- `containsAlertKeywords()` - Detects urgent alerts
- `isEventRelated()` - Identifies event posts
- `parseRelativeTimestamp()` - Converts "2h ago" to Date
- `printResults()` - Pretty console output
- `printMultiTrackSummary()` - Summary for multiple tracks

### Individual Track Scrapers

Each track has its own scraper file:
- `fetchMileHighBmxFacebook.ts` - https://www.facebook.com/MileHighBmx/
- `fetchDaconoBmxFacebook.ts` - https://www.facebook.com/DaconoBMXTrack/
- `fetchCountyLineBmxFacebok.ts` - https://www.facebook.com/CountyLineBMX/

### Master Scraper (`scrapeAllTracks.ts`)

Runs all track scrapers:
- **Parallel mode** (default): Scrapes all tracks simultaneously
- **Sequential mode**: Scrapes tracks one at a time
- Provides combined summary and statistics

## How The Scrapers Work

### Overview

The Facebook scrapers extract posts from public BMX track pages to capture:
- Race/practice announcements
- Cancellations and weather alerts
- Important updates
- Event information

### Usage Examples

**Single track:**
```bash
# Mile High BMX
npm run scrape:milehigh

# Dacono BMX
npm run scrape:dacono

# County Line BMX
npm run scrape:countyline
```

**All tracks:**
```bash
# Fast parallel execution (recommended)
npm run scrape:all

# Sequential execution (easier to debug)
npm run scrape:all:sequential

# Verbose output with full post details
npm run scrape:all:verbose
```

**Direct execution:**
```bash
npx tsx scripts/fetchMileHighBmxFacebook.ts
npx tsx scripts/scrapeAllTracks.ts --verbose
```

### How It Works

1. **Launches Browser**: Uses Playwright to launch a headless Chromium browser
2. **Navigates to Page**: Goes to https://www.facebook.com/MileHighBmx/
3. **Scrolls to Load Posts**: Scrolls the page multiple times to load recent posts
4. **Extracts Content**: Finds post elements and extracts:
   - Post text content
   - Timestamps
   - Post URLs
5. **Classifies Posts**: Identifies:
   - **Alert posts**: Contain keywords like "cancel", "postponed", "weather", "closed"
   - **Event posts**: Mention "race", "practice", "gate", "registration"
6. **Returns Structured Data**: Provides clean JSON data for database insertion

### Output Format

```typescript
interface FacebookPost {
  text: string;              // Full post text
  timestamp: Date | null;    // When the post was made
  url: string | null;        // Direct link to the post
  isEvent: boolean;          // Is this event-related?
  hasAlertKeywords: boolean; // Contains urgent keywords?
}
```

### Example Output

**Single Track:**
```
🚀 Starting Facebook scraper for Mile High BMX...
📄 Navigating to https://www.facebook.com/MileHighBmx/...
📜 Scrolling to load posts...
🔍 Extracting posts...
✅ Extracted 10 posts
✨ Processed 10 valid posts
🚨 Found 2 posts with alert keywords
🏁 Found 7 event-related posts

================================================================================
MILE HIGH BMX FACEBOOK SCRAPER RESULTS
================================================================================

📌 POST 1
────────────────────────────────────────────────────────────────────────────────
🕒 Timestamp: 10/13/2025, 6:30:00 PM MDT
🔗 URL: https://www.facebook.com/MileHighBmx/posts/...
🏁 Event-related: Yes
🚨 Has alerts: No

📝 Content:
Practice tonight from 6-8 PM! Gates open at 5:30. $10 gate fee. 
Come get your laps in before Sunday's race! 🏁
────────────────────────────────────────────────────────────────────────────────
```

**All Tracks (Master Scraper):**
```
╔═══════════════════════════════════════════════════════════════════════════╗
║                    DENVER BMX - FACEBOOK SCRAPER                          ║
║                         All Tracks Collection                             ║
╚═══════════════════════════════════════════════════════════════════════════╝

Mode: 🚀 Parallel
Verbose: No

🏁 Scraping all tracks in parallel...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏁 ALL TRACKS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Mile High BMX
   Posts: 10 | Alerts: 2 | Events: 7

✅ Dacono BMX
   Posts: 8 | Alerts: 1 | Events: 5

✅ County Line BMX
   Posts: 12 | Alerts: 0 | Events: 9

────────────────────────────────────────────────────────────────────────────────
📊 TOTALS: 3/3 tracks successful
   Total Posts: 30 | Alerts: 3 | Events: 21
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️  Total time: 18.45s

✅ All tracks scraped successfully!
```

### Configuration

You can adjust these constants in `fetchFacebook.ts`:

```typescript
export const SCRAPER_CONFIG = {
  MAX_POSTS: 10,              // Maximum posts to extract
  SCROLL_PAUSE_MS: 2000,      // Milliseconds to wait between scrolls
  MAX_SCROLLS: 3,             // Number of times to scroll
  NAVIGATION_TIMEOUT: 30000,  // Page load timeout (ms)
  WAIT_AFTER_LOAD: 3000,      // Wait for dynamic content (ms)
};
```

### Alert Keywords

The scraper automatically flags posts containing these keywords:
- cancel, cancelled
- postponed
- weather
- closed
- delayed
- rescheduled
- update
- important
- notice
- alert

### Event Keywords

Posts are marked as event-related if they mention:
- race
- practice
- event
- gate
- registration
- sign up

## Troubleshooting

### "Cannot find module 'playwright'"

Run: `npm install`

### "Executable doesn't exist"

Run: `npx playwright install chromium`

### "Navigation timeout"

- Facebook may be blocking the request
- Try increasing the timeout in the code
- Check your internet connection

### No Posts Found

- Facebook's HTML structure may have changed
- The page may require login (use mobile view URL as alternative)
- Try running with `headless: false` to see what's happening:
  ```typescript
  browser = await chromium.launch({ headless: false });
  ```

### Rate Limiting

If Facebook blocks requests:
- Increase delays between requests
- Run scraper less frequently (every 3-4 hours instead of every hour)
- Consider using Facebook Graph API instead

## Next Steps

### Integration with Database

To save posts to Supabase:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// After scraping
const { data, error } = await supabase
  .from('alerts')
  .insert({
    track_id: 'mile-high-bmx-uuid',
    posted_at: post.timestamp,
    text: post.text,
    url: post.url
  });
```

### Scheduling

Run automatically using:

1. **GitHub Actions** (recommended):
   ```yaml
   - cron: '0 */3 * * *'  # Every 3 hours
   ```

2. **Vercel Cron**:
   ```json
   {
     "crons": [{
       "path": "/api/scrape/facebook",
       "schedule": "0 */3 * * *"
     }]
   }
   ```

3. **Supabase Edge Function**:
   Deploy as a function and trigger via cron

### Facebook Graph API (Better Alternative)

For production, consider switching to the official API:

1. Create a Facebook App
2. Request page access from Mile High BMX admins
3. Use Graph API to fetch posts:
   ```javascript
   GET /{page-id}/posts?fields=message,created_time,permalink_url
   ```

Benefits:
- More reliable
- Structured data
- No scraping fragility
- Respects rate limits officially

## File Structure

```
scripts/
├── fetchFacebook.ts               # Shared scraping functions & types
├── fetchMileHighBmxFacebook.ts    # Mile High BMX scraper
├── fetchDaconoBmxFacebook.ts      # Dacono BMX scraper
├── fetchCountyLineBmxFacebok.ts   # County Line BMX scraper
├── scrapeAllTracks.ts             # Master scraper (all tracks)
├── test-simple.ts                 # Playwright setup test
├── test-scraper.sh                # Setup verification script
├── README.md                      # This file
├── QUICKSTART.md                  # Quick start guide
└── CRON_GUIDE.md                  # Scheduling guide

# Future scrapers
├── fetchUsaBmx.ts                 # USA BMX event schedules (TODO)
├── normalize.ts                   # Data normalization (TODO)
├── upsert.ts                      # Database operations (TODO)
└── cron.ts                        # Cron job orchestration (TODO)
```

## Adding New Tracks

To add a new track Facebook scraper:

1. **Create the scraper file** (e.g., `fetchNewTrackFacebook.ts`):
```typescript
import { scrapeFacebookPage, printResults, type TrackConfig } from './fetchFacebook';

const NEW_TRACK_CONFIG: TrackConfig = {
  name: 'New Track BMX',
  slug: 'new-track-bmx',
  facebookUrl: 'https://www.facebook.com/NewTrackBMX/'
};

export const scrapeNewTrackFacebook = async () => {
  return await scrapeFacebookPage(NEW_TRACK_CONFIG);
};

if (require.main === module) {
  scrapeNewTrackFacebook()
    .then(result => {
      printResults(result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
```

2. **Add to master scraper** (`scrapeAllTracks.ts`):
```typescript
import { scrapeNewTrackFacebook } from './fetchNewTrackFacebook';

// Add to both scrapeSequential and scrapeParallel functions
```

3. **Add npm script** to `package.json`:
```json
"scrape:newtrack": "tsx scripts/fetchNewTrackFacebook.ts"
```

## Support

For issues or questions:
1. Check the [Playwright documentation](https://playwright.dev/)
2. Review Facebook's [robots.txt](https://www.facebook.com/robots.txt)
3. Consider Graph API for production use

