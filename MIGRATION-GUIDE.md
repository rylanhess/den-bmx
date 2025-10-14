# Migration Guide - Image Support

## Database Migration Required

To support Facebook post images in alerts and events, you need to run a database migration.

### Option 1: Via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `scripts/migrations/add-image-column.sql`
4. Run the migration

### Option 2: Via Command Line (if you have psql)

```bash
psql $DATABASE_URL < scripts/migrations/add-image-column.sql
```

### What This Does

Adds an `image` column (type: TEXT, nullable) to:
- `public.alerts` table
- `public.events` table

## After Migration

### 1. Re-scrape with Images

Run the scraper to capture post images:

```bash
cd /Users/rylanhess/Documents/Github/den-bmx

# Test scraping with images
npx tsx scripts/scrapeAllTracks.ts --verbose --dry-run

# Save to database
npx tsx scripts/scrapeAllTracks.ts --save
```

### 2. Process Alerts to Events

Convert alerts to events (this will include images):

```bash
# Dry run to preview
npx tsx scripts/processEvents.ts --dry-run --hours=168

# Process last 7 days
npx tsx scripts/processEvents.ts --hours=168
```

## What's New

### Scraper
- Now extracts the main image from Facebook posts
- Filters out profile pictures and icons
- Only captures images larger than 100x100 pixels

### Database
- `alerts.image` - Stores Facebook post image URL
- `events.image` - Inherits image from the alert

### UI
- **This Week's Events** - Displays post images on the right side of each event card
- Images are responsive (full width on mobile, 256px on desktop)
- Images use `object-cover` to maintain aspect ratio

## Rollback

If you need to remove the image columns:

```sql
ALTER TABLE public.alerts DROP COLUMN IF EXISTS image;
ALTER TABLE public.events DROP COLUMN IF EXISTS image;
```

## Notes

- The `image` column is nullable - not all posts have images
- Images are stored as URLs pointing to Facebook's CDN
- Facebook image URLs may expire or change over time
- Consider implementing a image caching/proxy service if needed

