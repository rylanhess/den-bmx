# Supabase Setup Guide

Complete guide to connecting your scrapers to Supabase database.

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in details:
   - **Name**: `denbmx` (or your choice)
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to Denver (e.g., `us-west-1`)
4. Wait ~2 minutes for project to initialize

## Step 2: Create Database Tables

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. **Copy and paste this entire SQL script:**

```sql
-- Create tracks table
create table tracks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  city text,
  tz text default 'America/Denver' not null,
  fb_page_url text,
  usabmx_url text,
  lat double precision,
  lon double precision,
  created_at timestamptz default now()
);

-- Create sources table
create table sources (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references tracks(id) on delete cascade,
  type text check (type in ('facebook','usabmx')) not null,
  url text not null,
  last_checked_at timestamptz
);

-- Create events table
create table events (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references tracks(id) on delete cascade,
  source_id uuid references sources(id) on delete set null,
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz,
  status text default 'scheduled' check (status in ('scheduled','updated','cancelled')),
  url text,
  gate_fee text,
  class text,
  raw_html text,
  hash text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for events
create index on events (track_id, start_at);
create index on events (start_at);
create unique index if not exists events_dedupe_idx
  on events (track_id, start_at, coalesce(title,''));

-- Create alerts table
create table alerts (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references tracks(id) on delete cascade,
  posted_at timestamptz not null,
  text text not null,
  url text
);

-- Create index for alerts
create index on alerts (track_id, posted_at desc);

-- Enable Row Level Security
alter table tracks enable row level security;
alter table events enable row level security;
alter table alerts enable row level security;
alter table sources enable row level security;

-- Public read policies (everyone can read)
create policy "public read tracks" on tracks for select using (true);
create policy "public read events" on events for select using (true);
create policy "public read alerts" on alerts for select using (true);
create policy "public read sources" on sources for select using (true);

-- Admin writes via service role (no public policy needed)
-- The service role key bypasses RLS automatically

-- Seed initial tracks
insert into tracks (name, slug, city, fb_page_url) values
('Mile High BMX', 'mile-high-bmx', 'Lakewood, CO', 'https://www.facebook.com/MileHighBmx/'),
('Dacono BMX', 'dacono-bmx', 'Dacono, CO', 'https://www.facebook.com/DaconoBMXTrack/'),
('County Line BMX', 'county-line-bmx', 'Highlands Ranch, CO', 'https://www.facebook.com/CountyLineBMX/');

-- Create Facebook sources for each track
insert into sources (track_id, type, url)
select id, 'facebook', fb_page_url
from tracks
where fb_page_url is not null;
```

4. Click **Run** (or press Cmd+Enter)
5. You should see: ✅ Success. 3 rows affected.

## Step 3: Get Track UUIDs

1. In SQL Editor, run this query:

```sql
SELECT id, name, slug FROM tracks ORDER BY name;
```

2. **Copy the UUIDs** - you'll need them in the next step

Example output:
```
id                                   | name            | slug
-------------------------------------|-----------------|------------------
a1b2c3d4-e5f6-7890-abcd-ef1234567890 | County Line BMX | county-line-bmx
b2c3d4e5-f6a7-8901-bcde-f12345678901 | Dacono BMX      | dacono-bmx
c3d4e5f6-a7b8-9012-cdef-123456789012 | Mile High BMX   | mile-high-bmx
```

## Step 4: Get API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these two values:

**Project URL:**
```
https://your-project.supabase.co
```

**Service Role Key** (secret key - keep secure!):
```
eyJhbGc...very-long-key...xyz
```

⚠️ **IMPORTANT**: Use the **service_role** key, NOT the anon key! 
The service role key allows writes and bypasses RLS.

## Step 5: Set Up Environment Variables

### Option A: .env.local (Recommended for Local Development)

1. Create `.env.local` in your project root:

```bash
cd /Users/rylanhess/Documents/Github/den-bmx
```

2. Add these variables (replace with your values):

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...xyz

# Next.js Public (optional, for frontend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Verify `.env.local` is in `.gitignore` (it already is!)

### Option B: GitHub Secrets (For GitHub Actions)

1. Go to your repo: Settings → Secrets and variables → Actions
2. Add these secrets:
   - `SUPABASE_URL` = https://your-project.supabase.co
   - `SUPABASE_SERVICE_ROLE_KEY` = your-service-role-key

## Step 6: Configure Track UUIDs

1. Open `scripts/config.ts`
2. Find the `TRACK_MAPPINGS` object
3. **Update the `id` fields** with your UUIDs from Step 3:

```typescript
export const TRACK_MAPPINGS: Record<string, TrackMapping> = {
  'mile-high-bmx': {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',  // ← Paste your UUID here
    name: 'Mile High BMX',
    slug: 'mile-high-bmx',
    facebookUrl: 'https://www.facebook.com/MileHighBmx/'
  },
  'dacono-bmx': {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',  // ← Paste your UUID here
    name: 'Dacono BMX',
    slug: 'dacono-bmx',
    facebookUrl: 'https://www.facebook.com/DaconoBMXTrack/'
  },
  'county-line-bmx': {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  // ← Paste your UUID here
    name: 'County Line BMX',
    slug: 'county-line-bmx',
    facebookUrl: 'https://www.facebook.com/CountyLineBMX/'
  }
};
```

4. Save the file

## Step 7: Install Dependencies

```bash
cd /Users/rylanhess/Documents/Github/den-bmx
npm install
```

This installs `@supabase/supabase-js` which is now in your `package.json`.

## Step 8: Validate Configuration

Test your setup:

```bash
npm run scrape:config
```

Expected output:
```
🔍 Validating configuration...

✅ Supabase connection successful
✅ All track UUIDs configured

🎉 Configuration is valid!
```

If you see errors:
- ❌ Check your `.env.local` file
- ❌ Verify API keys are correct
- ❌ Ensure track UUIDs are set in `config.ts`

## Step 9: Test with Dry Run

Preview what would be saved without actually inserting:

```bash
npm run scrape:all:dry-run
```

This will:
1. Scrape all tracks
2. Show you what would be saved
3. NOT insert into database

Example output:
```
🔍 Validating configuration...
✅ Supabase connection successful
✅ All track UUIDs configured

🚀 Starting Facebook scraper for Mile High BMX...
...

💾 Saving Mile High BMX posts to database...
   🔍 DRY RUN - Not inserting to database
   Would insert: [
     {
       "track_id": "c3d4e5f6-...",
       "posted_at": "2025-10-13T20:30:00.000Z",
       "text": "Practice tonight 6-8 PM...",
       "url": "https://facebook.com/..."
     }
   ]
```

## Step 10: Save to Database (For Real!)

Once you're confident:

```bash
npm run scrape:all:save
```

This will:
1. Validate configuration
2. Scrape all 3 tracks
3. **Save posts to Supabase**

Expected output:
```
╔═══════════════════════════════════════════════════════════════════════════╗
║                    DENVER BMX - FACEBOOK SCRAPER                          ║
║                         All Tracks Collection                             ║
╚═══════════════════════════════════════════════════════════════════════════╝

Mode: 🚀 Parallel
Verbose: No
Save to DB: Yes

🔍 Validating configuration...
✅ Supabase connection successful
✅ All track UUIDs configured

... scraping ...

════════════════════════════════════════════════════════════════════════════
💾 SAVING ALL TRACKS TO DATABASE
════════════════════════════════════════════════════════════════════════════

💾 Saving Mile High BMX posts to database...
   10 valid alerts to insert
   ✅ Inserted: 10
   ⏭️  Skipped: 0
   ⏱️  Duration: 1.23s

💾 Saving Dacono BMX posts to database...
   8 valid alerts to insert
   ✅ Inserted: 8
   ⏭️  Skipped: 0
   ⏱️  Duration: 0.98s

💾 Saving County Line BMX posts to database...
   12 valid alerts to insert
   ✅ Inserted: 12
   ⏭️  Skipped: 0
   ⏱️  Duration: 1.45s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 DATABASE UPSERT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Mile High BMX
   Inserted: 10 | Skipped: 0 | Errors: 0

✅ Dacono BMX
   Inserted: 8 | Skipped: 0 | Errors: 0

✅ County Line BMX
   Inserted: 12 | Skipped: 0 | Errors: 0

────────────────────────────────────────────────────────────────────────────────
📊 TOTALS: 3/3 tracks successful
   Inserted: 30 | Skipped: 0 | Errors: 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All tracks scraped successfully!
```

## Step 11: Verify in Supabase

1. Go to Supabase Dashboard → **Table Editor**
2. Select `alerts` table
3. You should see your scraped posts!

Click on a row to see:
- `id` - Auto-generated UUID
- `track_id` - Links to tracks table
- `posted_at` - When post was made
- `text` - Full post content
- `url` - Link to Facebook post

## Available Commands

### Scraping Only (No Database)
```bash
npm run scrape:all              # Scrape all tracks
npm run scrape:milehigh         # Single track
```

### Database Integration
```bash
npm run scrape:config           # Test configuration
npm run scrape:all:dry-run      # Preview without saving
npm run scrape:all:save         # Scrape & save to DB
```

### Advanced Options
```bash
# Save only alert posts (filter out regular posts)
npx tsx scripts/scrapeAllTracks.ts --save --alerts-only

# Sequential + save
npx tsx scripts/scrapeAllTracks.ts --sequential --save

# Verbose + save
npx tsx scripts/scrapeAllTracks.ts --verbose --save
```

## Configuration Files

### Where Things Are Stored

```
den-bmx/
├── .env.local                    ← API keys (DO NOT COMMIT!)
├── scripts/
│   ├── config.ts                 ← Track UUIDs & Supabase client
│   ├── normalize.ts              ← Data transformation
│   ├── upsert.ts                 ← Database insertion
│   ├── scrapeAllTracks.ts        ← Master scraper (updated)
│   └── SUPABASE_SETUP.md         ← This file
```

### config.ts

**Where to set:**
- Track UUIDs from database
- Supabase client configuration

**Environment variables it uses:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### normalize.ts

**What it does:**
- Transforms FacebookPost → AlertRecord
- Filters posts by criteria
- Deduplicates posts
- Validates data

**No configuration needed** - just utility functions

### upsert.ts

**What it does:**
- Inserts alerts into Supabase
- Handles errors gracefully
- Provides detailed logs
- Supports dry-run mode

**No configuration needed** - uses config from `config.ts`

## Troubleshooting

### Error: "Missing SUPABASE_URL environment variable"

**Fix:** Create `.env.local` with your API keys (see Step 5)

### Error: "Track ... is missing database UUID"

**Fix:** Update `scripts/config.ts` with UUIDs from Step 3

### Error: "Supabase connection failed"

**Possible causes:**
1. Wrong API key
2. Wrong project URL
3. Network issue

**Fix:** 
```bash
# Test connection
npm run scrape:config
```

Verify your keys in `.env.local`

### Posts Inserted Multiple Times

**Cause:** No deduplication logic (yet)

**Temporary fix:** Manually delete duplicates in Supabase

**Permanent fix:** Add unique constraint to alerts table:
```sql
create unique index alerts_dedupe_idx 
  on alerts (track_id, posted_at, text);
```

### "23505" Error - Duplicate Key Violation

**Cause:** Post already exists (if you added unique constraint)

**This is normal** - the scraper will skip duplicates automatically

## Next Steps

### 1. Schedule Cron Jobs

See `CRON_GUIDE.md` for:
- GitHub Actions (recommended)
- Vercel Cron
- Local cron

### 2. Add Deduplication

Update SQL to prevent duplicate alerts:

```sql
create unique index alerts_dedupe_idx 
  on alerts (track_id, posted_at, substring(text, 1, 100));
```

### 3. Build Frontend

Now that data is in Supabase:
- Create calendar view
- Show recent alerts
- Add track pages
- Display on homepage

### 4. Set Up Monitoring

- Add Slack notifications for failures
- Track scraping success rate
- Alert on errors

## Summary

✅ **What You've Done:**
1. Created Supabase project
2. Created database tables
3. Seeded tracks data
4. Got API keys
5. Configured track UUIDs
6. Tested configuration
7. Saved scraped data to database

✅ **What You Can Do:**
```bash
npm run scrape:all:save     # Scrape & save all tracks
npm run scrape:all:dry-run  # Preview before saving
npm run scrape:config       # Test configuration
```

✅ **What's Next:**
- Schedule automatic scraping (CRON_GUIDE.md)
- Build frontend to display data
- Add monitoring & alerts

🎉 **Your scrapers are now connected to Supabase!**

