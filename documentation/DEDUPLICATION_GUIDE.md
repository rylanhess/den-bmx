# 🔄 Alert Deduplication Guide

## Problem

When running Facebook scrapers multiple times, you can end up with duplicate alerts in your database. This happens because:

1. Facebook shows the same posts on each scrape
2. The scraper doesn't know which posts have already been saved
3. Without proper checks, the same alert gets inserted multiple times

## Solution

The scraper now uses **smart pre-check deduplication** that checks for existing alerts BEFORE attempting to insert them.

### How It Works

#### 1. **URL-Based Deduplication (Most Reliable)**

For posts with URLs, the scraper:
- Batches all URLs from the current scrape
- Queries the database for existing alerts with those URLs
- Only inserts alerts with URLs that don't already exist

```typescript
// Check if URL already exists in database
const { data } = await supabase
  .from('alerts')
  .select('url')
  .eq('track_id', trackId)
  .in('url', [array_of_urls]);
```

**Why URLs are best:** Facebook post URLs are unique and stable identifiers. Even if the post text is edited, the URL stays the same.

#### 2. **Text + Timestamp Deduplication (Fallback)**

For posts without URLs, the scraper:
- Fetches recent alerts from the past 7 days
- Compares the first 100 characters of text (case-insensitive)
- Considers posts within 1 hour of each other as duplicates

```typescript
// Consider duplicate if:
// - Within 1 hour timestamp difference AND
// - First 100 characters of text match (case-insensitive)
const isDuplicate = 
  timeDiff < 3600000 && 
  textPrefix === existingTextPrefix;
```

**Why this works:** Facebook posts rarely change their core message. The first 100 characters capture the essence of the post, and the 1-hour window accounts for timestamp parsing variations.

### Performance Optimizations

1. **Batched Database Queries**
   - Single query for all URLs instead of one-by-one
   - Fetches recent alerts once, then compares in-memory
   - Reduces database round trips from N to 2-3 queries

2. **Limited Lookback Period**
   - Only checks alerts from past 7 days
   - Limits result set to 500 most recent alerts
   - Old posts won't match anyway due to timestamp filter

3. **Batch Insert**
   - Inserts all new alerts in a single query
   - Falls back to individual inserts if batch fails
   - Much faster than one-at-a-time inserts

## Usage

### Default Behavior (Recommended)

```bash
# Run any scraper - deduplication is automatic
npm run scrape:all
```

The scraper now automatically:
- ✅ Checks for duplicates before inserting
- ✅ Skips alerts that already exist
- ✅ Reports how many were skipped vs inserted

### Optional: Add Database Constraints

For additional protection at the database level:

```bash
# Run the SQL migration (optional but recommended)
psql -h your-db-host -U postgres -d your-db < scripts/add-unique-constraint.sql
```

This adds unique indexes that prevent duplicates even if the code check fails.

## Expected Output

### Before (Insert-then-Catch Approach)
```
💾 Saving Mile High BMX posts to database...
   10 valid alerts to insert
   ❌ Error inserting alert: duplicate key value violates unique constraint
   ❌ Error inserting alert: duplicate key value violates unique constraint
   ❌ Error inserting alert: duplicate key value violates unique constraint
   ✅ Inserted: 2
   ⏭️  Skipped: 8
```

### After (Pre-Check Approach)
```
💾 Saving Mile High BMX posts to database...
   10 valid alerts to insert
   💡 Pre-check: 2 new alerts, 8 duplicates skipped
   ✅ Inserted: 2
   ⏭️  Skipped: 8
```

## Benefits

### 1. **Reduced Database Bloat**
- No wasted insert attempts
- Fewer error logs
- Cleaner database operations

### 2. **Better Performance**
- Fewer database round trips
- Batch operations instead of one-by-one
- Faster overall scraping process

### 3. **Accurate Reporting**
- See exactly how many alerts are new vs duplicates
- Better visibility into scraper effectiveness
- Easier to spot issues

### 4. **Idempotent Operations**
- Safe to run multiple times
- Won't create duplicates even if run hourly
- Tolerant of scraper crashes/retries

## Cleaning Up Existing Duplicates

If you already have duplicates in your database:

### 1. Find Duplicates by URL

```sql
select track_id, url, count(*) as cnt
from alerts
where url is not null
group by track_id, url
having count(*) > 1
order by cnt desc;
```

### 2. Find Duplicates by Text

```sql
select 
  track_id, 
  substring(text, 1, 100) as text_prefix, 
  count(*) as cnt
from alerts
group by track_id, substring(text, 1, 100)
having count(*) > 1
order by cnt desc;
```

### 3. Delete Duplicates (Keeps Oldest)

```sql
-- For URL-based duplicates
delete from alerts a
using (
  select track_id, url, min(posted_at) as first_post
  from alerts
  where url is not null
  group by track_id, url
  having count(*) > 1
) b
where a.track_id = b.track_id
  and a.url = b.url
  and a.posted_at > b.first_post;

-- For text-based duplicates
delete from alerts a
using (
  select 
    track_id, 
    substring(text, 1, 100) as text_prefix,
    min(posted_at) as first_post
  from alerts
  group by track_id, substring(text, 1, 100)
  having count(*) > 1
) b
where a.track_id = b.track_id
  and substring(a.text, 1, 100) = b.text_prefix
  and a.posted_at > b.first_post;
```

## Troubleshooting

### Issue: Still seeing duplicates

**Check 1:** Are the URLs different?
```sql
select text, url, posted_at 
from alerts 
where text ilike '%your search text%'
order by posted_at desc;
```

If URLs are different, they're considered separate posts.

**Check 2:** Are timestamps more than 1 hour apart?
```sql
select text, posted_at 
from alerts 
where text ilike '%your search text%'
order by posted_at desc;
```

Posts with >1 hour timestamp difference are not deduplicated.

### Issue: Too many alerts being skipped

**Possible causes:**
- Timestamps are being parsed incorrectly
- Text comparison is too broad (first 100 chars match different posts)
- Recent alerts query is returning too much data

**Solution:** Adjust the deduplication window:
```typescript
// In upsert.ts, change from 7 days to 3 days
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 3); // was -7
```

## Testing

### Dry Run Mode

Test deduplication without actually inserting:

```typescript
import { scrapeFacebookPage } from './fetchFacebook';
import { upsertScraperResults } from './upsert';

const result = await scrapeFacebookPage(config);
const upsertResult = await upsertScraperResults(result, {
  dryRun: true  // Won't insert to database
});

console.log(upsertResult);
```

### Check Deduplication Stats

```typescript
import { getRecentAlerts } from './upsert';

const recent = await getRecentAlerts('mile-high-bmx', 24);
console.log(`Found ${recent.length} alerts in past 24 hours`);
```

## Advanced: Custom Deduplication Logic

If you need different deduplication rules, modify `upsert.ts`:

```typescript
// Example: Match on first 50 chars instead of 100
const textPrefix = alert.text.substring(0, 50).toLowerCase();

// Example: 30-minute window instead of 1 hour
if (timeDiff < 1800000) { // 30 minutes in ms
  // ...duplicate check
}

// Example: Exact text match instead of prefix
if (alert.text.toLowerCase() === existing.text.toLowerCase()) {
  isDuplicate = true;
}
```

## Summary

✅ **What changed:**
- Pre-check deduplication before inserting
- Batched database queries for performance
- URL-based deduplication (most reliable)
- Text + timestamp fallback (for posts without URLs)

✅ **What you get:**
- No more duplicate alerts
- Faster scraping operations
- Cleaner database
- Better reporting

✅ **What to do:**
1. Update your code (already done!)
2. Optionally add database constraints (`add-unique-constraint.sql`)
3. Clean up existing duplicates if needed
4. Run scrapers as normal - deduplication is automatic!

