# Quick Fixes Applied - Oct 14, 2025

## Issues Fixed

### 1. ✅ Removed Blinking Animation on Alerts Banner
**Problem**: The blinking banner was too hard to read.

**Solution**: Removed `animate-blink` class from the AlertsBanner component.

**File**: `src/components/AlertsBanner.tsx`

---

### 2. ✅ Track Alerts Only Show Yesterday/Today Posts
**Problem**: Alerts from 7 days ago were showing as recent.

**Solution**: Updated alerts API to only fetch posts from yesterday and today (in Denver timezone).

**File**: `src/app/api/alerts/route.ts`

---

### 3. ✅ Added Facebook Post Image Scraping
**Problem**: No images were being captured from Facebook posts.

**Solution**: 
- Enhanced scraper to extract post images (filters out profile pics and icons)
- Added `image` field to database types and scraper interfaces
- Images are displayed on the right side of event cards in "This Week's Events"
- Images use `object-contain` to show the full image without cropping
- Images are clickable - opens full-size image in new tab
- Fixed height (256px on desktop, 192px on mobile) prevents overflow

**Files Updated**:
- `scripts/fetchFacebook.ts` - Image extraction logic
- `scripts/normalize.ts` - Image field in AlertRecord
- `scripts/processEvents.ts` - Image field in EventRecord
- `src/lib/supabase.ts` - Added image to Event and Alert types
- `src/components/ThisWeeksEvents.tsx` - Display images in UI with proper sizing

**Migration Required**: See `MIGRATION-GUIDE.md`

---

### 4. ✅ Fixed Incorrect Post Dates in Alerts
**Problem**: September 30th post showing as "Posted 10 min ago" because scraper was storing scrape time instead of actual Facebook post date.

**Solution**: Enhanced the timestamp parser to handle **both relative and absolute dates**:

#### Relative Formats (Recent Posts)
- "2h", "3d", "1w" → Calculates actual date/time
- "Just now" → Current time

#### Absolute Formats (Older Posts)
- "September 30 at 2:51 PM" → Sept 30, 2024 2:51 PM
- "Oct 8 at 4:09 PM" → Oct 8, 2024 4:09 PM
- Handles abbreviated months (Sept, Oct, Dec, etc.)
- Smart year detection (current year vs. last year)

**Files Updated**:
- `scripts/fetchFacebook.ts` - Enhanced `parseRelativeTimestamp()` function
- `scripts/fetchFacebook.ts` - Improved browser timestamp extraction

---

## Next Steps

### Re-scrape the Data
To fix the existing alerts in your database with incorrect timestamps, run:

```bash
cd /Users/rylanhess/Documents/Github/den-bmx

# Test the scraper (preview mode)
npx tsx scripts/scrapeAllTracks.ts --verbose --dry-run

# Save to database
npx tsx scripts/scrapeAllTracks.ts --save
```

This will:
1. Scrape all tracks with the improved timestamp parsing
2. Deduplicate posts (won't create duplicates)
3. Store alerts with **accurate Facebook post dates**

### Verify the Fix
After re-scraping, the alerts banner should show:
- ✅ Accurate "Posted X days ago" text
- ✅ Old posts (like Sept 30) won't appear if they're older than 7 days
- ✅ Only recent, relevant cancellations

### Test Timestamp Parsing
You can test the timestamp parser anytime:

```bash
npx tsx scripts/test-timestamp-parsing.ts
```

---

## Technical Details

### How It Works Now

1. **Browser Scraping**: Playwright extracts timestamp text from Facebook (e.g., "September 30 at 2:51 PM")
2. **Smart Parsing**: `parseRelativeTimestamp()` function parses both formats:
   - Relative: "2h" → 2 hours before current time
   - Absolute: "Sept 30 at 2:51 PM" → Sept 30, 2024 14:51:00
3. **Database Storage**: Stores actual post date in `alerts.posted_at` field
4. **Display**: AlertsBanner shows accurate "time ago" based on real post date

### Files Modified
- ✅ `src/components/AlertsBanner.tsx` - Removed blink animation
- ✅ `scripts/fetchFacebook.ts` - Enhanced timestamp parsing
- ✅ `documentation/ALERTS.md` - Updated documentation
- ✅ `scripts/test-timestamp-parsing.ts` - New test script

---

## Notes

- The timestamp parser handles Mountain Time (America/Denver)
- Posts without parseable timestamps fall back to scrape time (rare)
- The alerts API filters out posts older than 7 days automatically
- Duplicate detection works by URL and text+timestamp matching

