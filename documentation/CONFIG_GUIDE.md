# Configuration Guide - Quick Reference

## 📍 Where to Set Configuration

### 1. Supabase API Keys (.env.local)

**Location:** `/Users/rylanhess/Documents/Github/den-bmx/.env.local`

Create this file and add:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-key...
```

**How to get:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy **Project URL** and **service_role** key

---

### 2. Track Database IDs (config.ts)

**Location:** `scripts/config.ts`

**Lines 38-60:** Update the `id` fields

```typescript
export const TRACK_MAPPINGS: Record<string, TrackMapping> = {
  'mile-high-bmx': {
    id: '',  // ← PASTE UUID HERE
    name: 'Mile High BMX',
    slug: 'mile-high-bmx',
    facebookUrl: 'https://www.facebook.com/MileHighBmx/'
  },
  'dacono-bmx': {
    id: '',  // ← PASTE UUID HERE
    name: 'Dacono BMX',
    slug: 'dacono-bmx',
    facebookUrl: 'https://www.facebook.com/DaconoBMXTrack/'
  },
  'county-line-bmx': {
    id: '',  // ← PASTE UUID HERE
    name: 'County Line BMX',
    slug: 'county-line-bmx',
    facebookUrl: 'https://www.facebook.com/CountyLineBMX/'
  }
};
```

**How to get UUIDs:**

Run this in Supabase SQL Editor:
```sql
SELECT id, name, slug FROM tracks ORDER BY name;
```

Copy the `id` values into `config.ts`

---

### 3. Scraper Settings (fetchFacebook.ts)

**Location:** `scripts/fetchFacebook.ts`

**Lines 30-36:** Adjust scraping behavior

```typescript
export const SCRAPER_CONFIG = {
  MAX_POSTS: 10,              // Posts per track (1-20)
  SCROLL_PAUSE_MS: 2000,      // Wait between scrolls (ms)
  MAX_SCROLLS: 3,             // Number of scroll iterations
  NAVIGATION_TIMEOUT: 30000,  // Page load timeout (ms)
  WAIT_AFTER_LOAD: 3000,      // Wait for JS to load (ms)
};
```

**Lines 40-57:** Alert & Event Keywords

```typescript
export const ALERT_KEYWORDS = [
  'cancel', 'cancelled', 'postponed', 'weather',
  'closed', 'delayed', 'rescheduled', 'update',
  // Add more keywords here
];

export const EVENT_KEYWORDS = [
  'race', 'practice', 'event', 'gate',
  'registration', 'sign up', 'tonight',
  // Add more keywords here
];
```

---

## 🚀 Setup Checklist

### Initial Setup (One-Time)

- [ ] 1. Create Supabase project
- [ ] 2. Run database SQL (create tables)
- [ ] 3. Get Supabase API keys
- [ ] 4. Create `.env.local` with API keys
- [ ] 5. Get track UUIDs from database
- [ ] 6. Update `scripts/config.ts` with UUIDs
- [ ] 7. Run `npm install`
- [ ] 8. Run `npm run scrape:config` (test)
- [ ] 9. Run `npm run scrape:all:dry-run` (preview)
- [ ] 10. Run `npm run scrape:all:save` (save data!)

### Verify Setup

```bash
# 1. Test configuration
npm run scrape:config

# Expected: ✅ Supabase connection successful
#           ✅ All track UUIDs configured
```

```bash
# 2. Preview data (doesn't save)
npm run scrape:all:dry-run

# Expected: Shows what would be inserted
```

```bash
# 3. Save to database (for real)
npm run scrape:all:save

# Expected: ✅ Inserted: XX posts
```

---

## 📂 File Reference

| File | Purpose | What to Configure |
|------|---------|-------------------|
| `.env.local` | API keys | Supabase URL & service key |
| `scripts/config.ts` | Database IDs | Track UUIDs (lines 38-60) |
| `scripts/fetchFacebook.ts` | Scraper settings | Keywords, timeouts (lines 30-57) |
| `scripts/normalize.ts` | Data transformation | Filtering logic (no config needed) |
| `scripts/upsert.ts` | Database insertion | Uses config from config.ts |

---

## ⚙️ Common Adjustments

### Change Scraping Frequency

**For local testing:**
- Increase `MAX_POSTS` to get more posts
- Increase `MAX_SCROLLS` to load more content

**For production:**
- Keep defaults (10 posts, 3 scrolls is usually enough)

### Add Alert Keywords

Edit `scripts/fetchFacebook.ts`:

```typescript
export const ALERT_KEYWORDS = [
  'cancel', 'cancelled', 'postponed', 'weather',
  'closed', 'delayed', 'rescheduled', 'update',
  'lightning',  // ← Add new keywords here
  'mud',
  'track closed'
];
```

Changes apply to all scrapers automatically.

### Filter What Gets Saved

**Save only alerts:**
```bash
npx tsx scripts/scrapeAllTracks.ts --save --alerts-only
```

**Code location:** `scripts/scrapeAllTracks.ts` line 113-118

---

## 🔍 Validation Commands

```bash
# Test Supabase connection
npm run scrape:config

# Preview without saving
npm run scrape:all:dry-run

# Test single track
npm run scrape:milehigh

# Save to database
npm run scrape:all:save
```

---

## 🆘 Troubleshooting

### Issue: "Missing SUPABASE_URL"

**Fix:** Create `.env.local` file with your Supabase URL

**Location:** Project root (`/Users/rylanhess/Documents/Github/den-bmx/.env.local`)

### Issue: "Track is missing database UUID"

**Fix:** Update `scripts/config.ts` with UUIDs from database

**Get UUIDs:** Run `SELECT id, name, slug FROM tracks;` in Supabase

### Issue: "Cannot find module '@supabase/supabase-js'"

**Fix:** Run `npm install`

### Issue: Posts inserted multiple times

**Fix:** Run scrapers less frequently or add unique constraint:

```sql
create unique index alerts_dedupe_idx 
  on alerts (track_id, posted_at, substring(text, 1, 100));
```

---

## 📖 Full Documentation

| Guide | Purpose |
|-------|---------|
| `SUPABASE_SETUP.md` | Complete Supabase setup (start here!) |
| `CONFIG_GUIDE.md` | Quick reference (this file) |
| `QUICKSTART.md` | Getting started with scrapers |
| `README.md` | Technical documentation |
| `CRON_GUIDE.md` | Scheduling automation |

---

## 💡 Pro Tips

1. **Always test with dry-run first**
   ```bash
   npm run scrape:all:dry-run
   ```

2. **Use verbose mode for debugging**
   ```bash
   npx tsx scripts/scrapeAllTracks.ts --verbose --save
   ```

3. **Check Supabase Table Editor** to see your data

4. **Add .env.local to .gitignore** (already done!)

5. **Keep service role key secret** - never commit it

---

## ✅ Quick Start (TL;DR)

```bash
# 1. Setup
# - Create Supabase project
# - Run SQL to create tables
# - Get API keys & track UUIDs

# 2. Configure
# - Create .env.local with API keys
# - Update scripts/config.ts with track UUIDs

# 3. Install
npm install

# 4. Test
npm run scrape:config           # Validate setup
npm run scrape:all:dry-run      # Preview data

# 5. Run
npm run scrape:all:save         # Save to database!
```

Done! 🎉

