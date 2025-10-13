#!/bin/bash

# Test script for Mile High BMX Facebook Scraper
# Run this to verify everything is set up correctly

echo "🏁 DENBMX Scraper Test Script"
echo "================================"
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
node --version
echo ""

# Check if dependencies are installed
echo "🔍 Checking dependencies..."

if [ -d "node_modules/playwright" ]; then
  echo "✅ Playwright is installed"
else
  echo "❌ Playwright is NOT installed"
  echo "   Run: npm install"
  exit 1
fi

if [ -d "node_modules/tsx" ]; then
  echo "✅ tsx is installed"
else
  echo "❌ tsx is NOT installed"
  echo "   Run: npm install"
  exit 1
fi

echo ""

# Check if Playwright browsers are installed
echo "🌐 Checking Playwright browsers..."
if npx playwright --version > /dev/null 2>&1; then
  echo "✅ Playwright CLI is working"
  npx playwright --version
else
  echo "❌ Playwright CLI is not working"
  exit 1
fi

echo ""

# Run the scraper
echo "🚀 Running Mile High BMX Facebook scraper..."
echo "   This may take 10-20 seconds..."
echo ""

npm run scrape:milehigh

echo ""
echo "================================"
echo "✨ Test complete!"

