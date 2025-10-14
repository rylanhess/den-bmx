# Alerts & Cancellations System

## Overview

The alerts system automatically displays track cancellations, weather updates, and schedule changes in a prominent banner at the top of the homepage.

## How It Works

### 1. **Data Source**
- Alerts are scraped from Facebook posts and stored in the `alerts` table
- The scraper captures the post text, timestamp, and URL
- Data is refreshed automatically by the scraper

### 2. **Keyword Detection**
The system scans alert text for cancellation-related keywords:
- `no practice`, `no gate`
- `cancel`, `cancelled`, `canceled`
- `rain`, `weather`
- `postpone`, `postponed`
- `reschedule`, `rescheduled`
- `closed`, `will not have`, `won't have`
- `transition to`, `change`, `moved to`
- `due to`, `staffing`

### 3. **Components**

#### AlertsBanner Component
- **Location**: `src/components/AlertsBanner.tsx`
- **Purpose**: Displays recent alerts at the top of the homepage
- **Features**:
  - Blinking animation for high visibility
  - Shows up to 5 most recent alerts
  - Displays track name, alert text, and post link
  - Shows "time ago" for each alert
  - Fallback to "No cancellations" message when no alerts

#### Alerts API Endpoint
- **Location**: `src/app/api/alerts/route.ts`
- **Endpoint**: `GET /api/alerts`
- **Query Window**: Last 7 days
- **Returns**: Filtered alerts containing cancellation keywords

### 4. **Event Filtering**
The events API (`src/app/api/events/route.ts`) also filters out cancelled events:
- Scans event title and description for cancellation keywords
- Removes cancelled events from the "This Week's Events" section
- Ensures only active events are displayed

## Database Schema

### alerts table
```sql
- id: uuid (primary key)
- track_id: uuid (foreign key to tracks)
- posted_at: timestamptz (when posted on Facebook)
- text: text (post content)
- url: text (Facebook post URL)
```

## Usage

The system works automatically once the scraper populates the `alerts` table:

1. Scraper captures Facebook posts → `alerts` table
2. Alerts API filters for cancellation keywords
3. AlertsBanner displays active alerts on homepage
4. Events API filters out cancelled events from schedule

## Customization

### Adding New Keywords
Edit the `CANCELLATION_KEYWORDS` array in:
- `src/app/api/alerts/route.ts` (for alert banner)
- `src/app/api/events/route.ts` (for event filtering)

### Adjusting Time Window
Change the `sevenDaysAgo` calculation in `src/app/api/alerts/route.ts`:
```typescript
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Change 7 to desired days
```

### Max Alerts Displayed
Edit in `src/app/api/alerts/route.ts`:
```typescript
const recentAlerts = cancellationAlerts.slice(0, 5); // Change 5 to desired count
```

## Testing

To test the alerts system:
1. Ensure the `alerts` table has recent data
2. Visit the homepage
3. Look for the alerts banner at the top
4. Verify that cancelled events don't appear in "This Week's Events"

## Scraper Improvements

### Timestamp Parsing (Fixed Oct 2024)

The scraper now correctly parses **both relative and absolute timestamps**:

**Relative Timestamps** (recent posts):
- "2h" → 2 hours ago
- "3d" → 3 days ago  
- "1w" → 1 week ago
- "Just now" → current time

**Absolute Timestamps** (older posts):
- "September 30 at 2:51 PM" → Sept 30, 2024 at 2:51 PM
- "October 8 at 4:09 PM" → Oct 8, 2024 at 4:09 PM
- Handles abbreviated month names (Sept, Oct, Dec, etc.)
- Properly determines year (current year or last year based on context)

This ensures the `posted_at` field in the database reflects the **actual Facebook post date**, not the scrape time.

### Updated Files
- `scripts/fetchFacebook.ts` - Enhanced `parseRelativeTimestamp()` function
- `scripts/fetchFacebook.ts` - Improved timestamp extraction in browser context

## Notes

- Alerts older than 7 days are not shown in the banner
- The banner only appears when cancellation keywords are detected
- The scraper must be running to populate new alerts
- All times are in Mountain Time (America/Denver)
- The `posted_at` field now accurately reflects when the post was made on Facebook, not when it was scraped

