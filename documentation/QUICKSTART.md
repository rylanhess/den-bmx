# Denver BMX Facebook Scrapers - Quick Start

## What Was Built

A complete Facebook scraping system for all Denver BMX tracks that:

✅ **Scrapes 3 tracks**: Mile High BMX, Dacono BMX, County Line BMX  
✅ Uses Playwright (headless browser) to load dynamic Facebook content  
✅ Extracts the latest 10 posts from each track's public Facebook page  
✅ Identifies **alert posts** (cancelled, weather, postponed)  
✅ Identifies **event posts** (race, practice, registration)  
✅ Extracts post text, timestamps, and URLs  
✅ Returns structured JSON data ready for database insertion  
✅ **Centralized shared logic** for easy maintenance  
✅ **Master scraper** to run all tracks in parallel or sequential  

## Installation (Run These Commands)

```bash
# Navigate to project
cd /Users/rylanhess/Documents/Github/den-bmx

# Install dependencies (playwright, tsx, cheerio)
npm install

# Install Chromium browser for Playwright
npx playwright install chromium

# Verify setup
./scripts/test-scraper.sh
```

## Run the Scrapers

### Individual Tracks
```bash
# Mile High BMX (Lakewood)
npm run scrape:milehigh

# Dacono BMX
npm run scrape:dacono

# County Line BMX (Highlands Ranch)
npm run scrape:countyline
```

### All Tracks At Once (Recommended)
```bash
# Parallel execution (fastest - runs all simultaneously)
npm run scrape:all

# Sequential execution (one at a time)
npm run scrape:all:sequential

# Verbose mode (shows all post details)
npm run scrape:all:verbose
```

### Direct Execution
```bash
# Individual
npx tsx scripts/fetchMileHighBmxFacebook.ts
npx tsx scripts/fetchDaconoBmxFacebook.ts
npx tsx scripts/fetchCountyLineBmxFacebok.ts

# All tracks
npx tsx scripts/scrapeAllTracks.ts
npx tsx scripts/scrapeAllTracks.ts --sequential
npx tsx scripts/scrapeAllTracks.ts --verbose
```

## Expected Output

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
🕒 Timestamp: 10/13/2025, 3:45:00 PM MDT
🔗 URL: https://www.facebook.com/MileHighBmx/posts/...
🏁 Event-related: Yes
🚨 Has alerts: Yes

📝 Content:
⚠️ CANCELLED - Tonight's practice is cancelled due to weather. 
We'll see you all on Sunday for race day! 🏁
────────────────────────────────────────────────────────────────────────────────
```

## Configuration Options

All scrapers share the same configuration in `fetchFacebook.ts`:

```typescript
export const SCRAPER_CONFIG = {
  MAX_POSTS: 10,              // How many posts to fetch (1-20)
  SCROLL_PAUSE_MS: 2000,      // Wait time between scrolls (ms)
  MAX_SCROLLS: 3,             // Number of scroll iterations
  NAVIGATION_TIMEOUT: 30000,  // Page load timeout
  WAIT_AFTER_LOAD: 3000,      // Wait for JavaScript to load
};
```

Changes apply to all track scrapers automatically.

## Troubleshooting

### Error: "Cannot find module 'playwright'"

**Fix:** Run `npm install`

The dependencies may not have been installed. Check `package.json` has:
```json
"devDependencies": {
  "playwright": "^1.49.1",
  "cheerio": "^1.0.0",
  "tsx": "^4.19.2"
}
```

### Error: "Executable doesn't exist"

**Fix:** Run `npx playwright install chromium`

Playwright needs to download the Chromium browser first.

### Error: "Navigation timeout"

**Possible causes:**
- Facebook is blocking the request
- Internet connection issue
- Page structure changed

**Try:**
1. Increase timeout in code: `timeout: 60000`
2. Run with visible browser: `headless: false`
3. Check if page loads in your regular browser

### No Posts Found

**Possible causes:**
- Facebook's HTML structure changed
- Page requires login (unlikely for public page)
- JavaScript didn't load properly

**Debug:**
```typescript
// Change this line:
browser = await chromium.launch({ headless: false });

// This will show you what the browser sees
```

## Next Steps

### 1. Test the Scrapers

Test individual tracks:
```bash
npm run scrape:milehigh
npm run scrape:dacono
npm run scrape:countyline
```

Test all tracks:
```bash
npm run scrape:all:verbose
```

Verify you see posts printed to console.

### 2. Set Up Supabase

Create `.env.local` file:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Add Database Integration

Create `scripts/saveToSupabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { ScraperResult } from './fetchFacebook';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Track slug to UUID mapping (get these from your tracks table)
const TRACK_IDS = {
  'mile-high-bmx': 'your-uuid-here',
  'dacono-bmx': 'your-uuid-here',
  'county-line-bmx': 'your-uuid-here',
};

export async function savePostsToDatabase(result: ScraperResult) {
  const trackId = TRACK_IDS[result.trackSlug as keyof typeof TRACK_IDS];
  
  for (const post of result.posts) {
    await supabase.from('alerts').insert({
      track_id: trackId,
      posted_at: post.timestamp || new Date(),
      text: post.text,
      url: post.url
    });
  }
}
```

Then use in `scrapeAllTracks.ts`:
```typescript
import { savePostsToDatabase } from './saveToSupabase';

// After scraping each track:
await savePostsToDatabase(result);
```

### 4. Schedule Automatic Runs

**Option A: GitHub Actions (Recommended)** 

Create `.github/workflows/scrape-facebook.yml`:
```yaml
name: Scrape All Tracks
on:
  schedule:
    - cron: '0 */3 * * *'  # Every 3 hours
  workflow_dispatch:  # Manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install chromium --with-deps
      - run: npm run scrape:all
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

See `CRON_GUIDE.md` for more scheduling options.

**Option B: Vercel Cron** 

Update `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/scrape/all",
    "schedule": "0 */3 * * *"
  }]
}
```

Create `app/api/scrape/all/route.ts`:
```typescript
import { scrapeAllTracks } from '@/scripts/scrapeAllTracks';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = await scrapeAllTracks({ parallel: true });
  return NextResponse.json({ results });
}
```

### 5. Consider Facebook Graph API

For production, the official API is more reliable:

1. Create Facebook App: https://developers.facebook.com/
2. Ask Mile High BMX admins for page access
3. Use Graph API:
   ```
   GET /MileHighBmx/posts?fields=message,created_time,permalink_url
   ```

**Benefits:**
- No scraping fragility
- Official rate limits
- Better data structure
- More reliable

## File Structure

```
scripts/
├── fetchFacebook.ts               ← Shared logic (all scrapers)
├── fetchMileHighBmxFacebook.ts    ← Mile High BMX scraper
├── fetchDaconoBmxFacebook.ts      ← Dacono BMX scraper
├── fetchCountyLineBmxFacebok.ts   ← County Line BMX scraper
├── scrapeAllTracks.ts             ← Master scraper (all tracks)
├── test-simple.ts                 ← Playwright test
├── test-scraper.sh                ← Setup verification
├── README.md                      ← Detailed docs
├── QUICKSTART.md                  ← This file
└── CRON_GUIDE.md                  ← Scheduling guide
```

## Support

The scraper is built with:
- **Playwright** - Headless browser automation
- **TypeScript** - Type-safe JavaScript
- **Cheerio** - HTML parsing (not used in current version)

Refer to:
- [Playwright Docs](https://playwright.dev/)
- [Facebook Robots.txt](https://www.facebook.com/robots.txt)
- [Mile High BMX Page](https://www.facebook.com/MileHighBmx/)

## Testing Checklist

- [ ] Run `npm install`
- [ ] Run `npx playwright install chromium`
- [ ] Run `npm run scrape:test` (verify Playwright works)
- [ ] Run `npm run scrape:milehigh` (test Mile High)
- [ ] Run `npm run scrape:dacono` (test Dacono)
- [ ] Run `npm run scrape:countyline` (test County Line)
- [ ] Run `npm run scrape:all:verbose` (test all tracks)
- [ ] Verify posts are extracted from each track
- [ ] Check that alert keywords are detected
- [ ] Verify timestamps are parsed correctly
- [ ] Test with Supabase integration (if ready)

## MVP Complete ✅

You now have a complete Facebook scraping system for Step 8 of your plan!

### What You Have:
- ✅ **3 individual track scrapers** (Mile High, Dacono, County Line)
- ✅ **Master scraper** that runs all tracks in parallel
- ✅ **Centralized shared logic** for easy maintenance
- ✅ Focuses on actual posts (not About, Mentions, etc.)
- ✅ Extracts text, timestamps, and URLs
- ✅ Identifies important alerts automatically
- ✅ Identifies event-related posts
- ✅ Returns clean, structured data
- ✅ Ready for database integration
- ✅ Can run individual tracks or all at once
- ✅ Can be scheduled to run automatically
- ✅ Comprehensive documentation

### Quick Commands:
```bash
# Test individual tracks
npm run scrape:milehigh
npm run scrape:dacono
npm run scrape:countyline

# Run all tracks (recommended for production)
npm run scrape:all
```

**Next Steps:** Test it, integrate with Supabase, and schedule cron jobs! 🏁

See `CRON_GUIDE.md` for scheduling instructions.

