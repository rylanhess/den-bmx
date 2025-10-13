#!/bin/bash

# Data Refresh Script
# Scrapes Facebook posts and creates events from last 10 days

set -e  # Exit on error

echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                    DENBMX DATA REFRESH                                    ║"
echo "║              Scrape Facebook + Create Events                              ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Scrape Facebook
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: Scraping Facebook posts from all tracks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run scrape:all:save

echo ""
echo "✅ Facebook scraping complete!"
echo ""

# Step 2: Process events
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: Creating events from alerts (last 10 days = 240 hours)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npx tsx scripts/processEvents.ts --hours=240

echo ""
echo "✅ Event processing complete!"
echo ""

# Step 3: Show stats
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3: Database Statistics"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run events:stats

echo ""
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                         ✨ REFRESH COMPLETE! ✨                           ║"
echo "║                                                                           ║"
echo "║  Your website now has the latest data from all tracks!                   ║"
echo "║  View at: http://localhost:3000                                          ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

