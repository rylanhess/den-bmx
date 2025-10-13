/**
 * Simple test to verify Playwright is working
 * Run: npx tsx scripts/test-simple.ts
 */

import { chromium } from 'playwright';

async function testPlaywright() {
  console.log('🧪 Testing Playwright setup...\n');
  
  try {
    console.log('1️⃣  Launching browser...');
    const browser = await chromium.launch({ headless: true });
    console.log('   ✅ Browser launched successfully\n');
    
    console.log('2️⃣  Creating page...');
    const page = await browser.newPage();
    console.log('   ✅ Page created\n');
    
    console.log('3️⃣  Navigating to Facebook...');
    await page.goto('https://www.facebook.com/MileHighBmx/', { timeout: 30000 });
    console.log('   ✅ Page loaded\n');
    
    console.log('4️⃣  Getting page title...');
    const title = await page.title();
    console.log(`   ✅ Title: ${title}\n`);
    
    console.log('5️⃣  Looking for posts...');
    const articles = await page.locator('div[role="article"]').count();
    console.log(`   ✅ Found ${articles} article elements\n`);
    
    await browser.close();
    
    console.log('━'.repeat(60));
    console.log('✨ All tests passed! Playwright is working correctly.');
    console.log('━'.repeat(60));
    console.log('\n👉 Now run: npm run scrape:milehigh\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error(error);
    console.log('\n💡 Troubleshooting:');
    console.log('   • Run: npm install');
    console.log('   • Run: npx playwright install chromium');
    console.log('   • Check your internet connection');
    process.exit(1);
  }
}

testPlaywright();

