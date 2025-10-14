/**
 * Test Script for Timestamp Parsing
 * 
 * Verifies that the parseRelativeTimestamp function correctly handles
 * both relative and absolute timestamp formats from Facebook
 */

import { parseRelativeTimestamp } from './fetchFacebook';

interface TestCase {
  input: string;
  description: string;
}

const testCases: TestCase[] = [
  // Relative timestamps
  { input: 'Just now', description: 'Just now (should be current time)' },
  { input: '5m', description: '5 minutes ago' },
  { input: '30 mins', description: '30 minutes ago' },
  { input: '2h', description: '2 hours ago' },
  { input: '5 hrs', description: '5 hours ago' },
  { input: '3d', description: '3 days ago' },
  { input: '1 day', description: '1 day ago' },
  { input: '1w', description: '1 week ago' },
  { input: '2 weeks', description: '2 weeks ago' },
  
  // Absolute timestamps - full format
  { input: 'September 30 at 2:51 PM', description: 'Sept 30 at 2:51 PM' },
  { input: 'October 8 at 4:09 PM', description: 'Oct 8 at 4:09 PM' },
  { input: 'October 14 at 10:13 AM', description: 'Oct 14 at 10:13 AM' },
  { input: 'December 25 at 12:00 PM', description: 'Dec 25 at noon' },
  
  // Absolute timestamps - abbreviated months
  { input: 'Sept 30 at 2:51 PM', description: 'Sept 30 (abbreviated)' },
  { input: 'Oct 8 at 4:09 PM', description: 'Oct 8 (abbreviated)' },
  { input: 'Dec 1 at 8:00 AM', description: 'Dec 1 (abbreviated)' },
  
  // Absolute timestamps - without time
  { input: 'October 8', description: 'Oct 8 (no time specified)' },
  { input: 'September 30', description: 'Sept 30 (no time specified)' },
];

console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
console.log('║               TIMESTAMP PARSING TEST                                      ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');

const now = new Date();
console.log(`Current time: ${now.toLocaleString('en-US', { timeZone: 'America/Denver' })} MDT\n`);
console.log('─'.repeat(80) + '\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.description}`);
  console.log(`Input: "${testCase.input}"`);
  
  const result = parseRelativeTimestamp(testCase.input);
  
  if (result) {
    console.log(`✅ Parsed successfully`);
    console.log(`   Result: ${result.toLocaleString('en-US', { timeZone: 'America/Denver' })} MDT`);
    console.log(`   ISO: ${result.toISOString()}`);
    passed++;
  } else {
    console.log(`❌ Failed to parse`);
    failed++;
  }
  
  console.log('');
});

console.log('─'.repeat(80));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests\n`);

if (failed === 0) {
  console.log('✅ All tests passed!\n');
  process.exit(0);
} else {
  console.log(`⚠️  ${failed} test(s) failed\n`);
  process.exit(1);
}

