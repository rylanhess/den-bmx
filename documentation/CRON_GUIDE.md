# Cron Scheduling Guide for Facebook Scrapers

This guide explains how to schedule the Facebook scrapers to run automatically using various methods.

## Available Scrapers

### Individual Track Scrapers
```bash
npm run scrape:milehigh     # Mile High BMX only
npm run scrape:dacono       # Dacono BMX only
npm run scrape:countyline   # County Line BMX only
```

### Master Scraper (All Tracks)
```bash
npm run scrape:all                # All tracks (parallel, fast)
npm run scrape:all:sequential     # All tracks (one at a time)
npm run scrape:all:verbose        # All tracks with detailed output
```

## Scheduling Methods

### Option 1: GitHub Actions (Recommended for MVP)

Create `.github/workflows/scrape-facebook.yml`:

```yaml
name: Scrape Facebook Posts

on:
  schedule:
    # Run every 3 hours
    - cron: '0 */3 * * *'
  
  # Allow manual trigger
  workflow_dispatch:

jobs:
  scrape-milehigh:
    name: Mile High BMX
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install chromium --with-deps
      
      - name: Scrape Mile High BMX
        run: npm run scrape:milehigh
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}

  scrape-dacono:
    name: Dacono BMX
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install chromium --with-deps
      - name: Scrape Dacono BMX
        run: npm run scrape:dacono
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}

  scrape-countyline:
    name: County Line BMX
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install chromium --with-deps
      - name: Scrape County Line BMX
        run: npm run scrape:countyline
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

**Or, simpler version (all tracks at once):**

```yaml
name: Scrape All Tracks

on:
  schedule:
    - cron: '0 */3 * * *'  # Every 3 hours
  workflow_dispatch:

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

**GitHub Secrets Setup:**
1. Go to your repo → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Option 2: Vercel Cron

Update `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/scrape/milehigh",
      "schedule": "0 */3 * * *"
    },
    {
      "path": "/api/scrape/dacono",
      "schedule": "0 */3 * * *"
    },
    {
      "path": "/api/scrape/countyline",
      "schedule": "0 */3 * * *"
    }
  ]
}
```

Create API routes:

**`app/api/scrape/milehigh/route.ts`:**
```typescript
import { scrapeMileHighBmxFacebook } from '@/scripts/fetchMileHighBmxFacebook';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await scrapeMileHighBmxFacebook();
    
    // TODO: Save to Supabase here
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Scraping failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

Repeat for `/dacono/route.ts` and `/countyline/route.ts`.

**Or, single endpoint for all tracks:**

**`app/api/scrape/all/route.ts`:**
```typescript
import { scrapeAllTracks } from '@/scripts/scrapeAllTracks';
import { NextResponse } from 'next/server';

export const maxDuration = 60; // 60 seconds timeout

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await scrapeAllTracks({ parallel: true, verbose: false });
    
    // TODO: Save to Supabase here
    
    return NextResponse.json({
      success: results.every(r => r.success),
      results
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Scraping failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

### Option 3: Local Cron (Development/Self-Hosted)

Edit your crontab:
```bash
crontab -e
```

Add these lines:
```cron
# Scrape Mile High BMX every 3 hours
0 */3 * * * cd /Users/rylanhess/Documents/Github/den-bmx && npm run scrape:milehigh >> /var/log/denbmx-milehigh.log 2>&1

# Scrape Dacono BMX every 3 hours (offset by 1 hour)
0 1-23/3 * * * cd /Users/rylanhess/Documents/Github/den-bmx && npm run scrape:dacono >> /var/log/denbmx-dacono.log 2>&1

# Scrape County Line BMX every 3 hours (offset by 2 hours)
0 2-23/3 * * * cd /Users/rylanhess/Documents/Github/den-bmx && npm run scrape:countyline >> /var/log/denbmx-countyline.log 2>&1

# Or, run all tracks at once every 3 hours
0 */3 * * * cd /Users/rylanhess/Documents/Github/den-bmx && npm run scrape:all >> /var/log/denbmx-all.log 2>&1
```

**Staggered schedule (recommended for individual scrapers):**
```cron
# Spread out requests to avoid rate limiting
0 */3 * * * cd /path/to/den-bmx && npm run scrape:milehigh >> /var/log/denbmx.log 2>&1
10 */3 * * * cd /path/to/den-bmx && npm run scrape:dacono >> /var/log/denbmx.log 2>&1
20 */3 * * * cd /path/to/den-bmx && npm run scrape:countyline >> /var/log/denbmx.log 2>&1
```

### Option 4: Supabase Edge Functions

Create `supabase/functions/scrape-facebook/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  // Verify auth
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || authHeader !== `Bearer ${Deno.env.get('FUNCTION_SECRET')}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Call your scrapers (you'd need to port the logic to Deno or use an HTTP endpoint)
    const results = await scrapeAllTracks()
    
    return new Response(JSON.stringify({ success: true, results }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

Schedule with Supabase cron:
```sql
select cron.schedule(
  'scrape-facebook',
  '0 */3 * * *',
  $$
  select net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/scrape-facebook',
    headers := '{"Authorization": "Bearer YOUR_SECRET"}'::jsonb
  );
  $$
);
```

## Recommended Schedule

### Development/Testing
- **Frequency:** Once per hour
- **Method:** Local cron or manual runs
- **Scrapers:** Individual track scrapers for easier debugging

### Production
- **Frequency:** Every 3 hours
- **Method:** GitHub Actions (most reliable) or Vercel Cron
- **Scrapers:** All tracks in parallel via `scrape:all`

### High-Activity Days (Race Days)
- **Frequency:** Every 30-60 minutes
- **Tracks:** All tracks
- **Method:** Temporarily adjust cron schedule

## Cron Schedule Examples

```
# Every 3 hours
0 */3 * * *

# Every hour
0 * * * *

# Every 30 minutes
*/30 * * * *

# Every hour during race day (8 AM - 8 PM on Sundays)
0 8-20 * * 0

# Weekdays at 6 PM (practice nights)
0 18 * * 1-5

# Saturdays and Sundays only, every 2 hours
0 */2 * * 0,6
```

## Monitoring & Alerts

### Log Parsing
```bash
# View logs
tail -f /var/log/denbmx.log

# Check for errors
grep "❌" /var/log/denbmx.log

# Count successful scrapes today
grep "✅" /var/log/denbmx.log | grep "$(date +%Y-%m-%d)" | wc -l
```

### GitHub Actions Notifications
Add to your workflow:
```yaml
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Facebook scraper failed!'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## Testing Cron Jobs

### Test Individual Scrapers
```bash
npm run scrape:milehigh
npm run scrape:dacono
npm run scrape:countyline
```

### Test All Tracks
```bash
# Parallel (faster)
npm run scrape:all

# Sequential (easier to debug)
npm run scrape:all:sequential

# Verbose output
npm run scrape:all:verbose
```

### Test GitHub Action Locally
```bash
# Install act
brew install act

# Run workflow
act schedule
```

## Troubleshooting

### "No posts found"
- Facebook may have changed their HTML structure
- Check if the page requires login (unlikely for public pages)
- Increase `WAIT_AFTER_LOAD` timeout

### Rate Limiting
- Reduce scraping frequency
- Add delays between tracks (use staggered cron)
- Consider Facebook Graph API

### GitHub Actions Timeout
- Default timeout is 6 hours, should be plenty
- If needed, add to job: `timeout-minutes: 30`

### Playwright Installation Fails
- Ensure system dependencies: `npx playwright install-deps`
- Use Docker container with pre-installed browsers

## Next Steps

1. ✅ Test all scrapers individually
2. ✅ Test master scraper
3. ⬜ Set up GitHub Actions workflow
4. ⬜ Add Supabase integration to save posts
5. ⬜ Monitor for 1 week
6. ⬜ Adjust frequency based on post patterns
7. ⬜ Add alerting for failed scrapes

