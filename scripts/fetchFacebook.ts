/**
 * Shared Facebook Scraper Functions
 * 
 * Centralized logic for scraping Facebook pages for BMX tracks
 * Used by: Mile High BMX, Dacono BMX, County Line BMX
 */

import { chromium, Browser, Page } from 'playwright';

export interface FacebookPost {
  readonly text: string;
  readonly timestamp: Date | null;
  readonly timestampText?: string;
  readonly url: string | null;
  readonly image: string | null;
  readonly isEvent: boolean;
  readonly hasAlertKeywords: boolean;
}

export interface ScraperResult {
  success: boolean;
  trackName: string;
  trackSlug: string;
  posts: FacebookPost[];
  error?: string;
}

export interface TrackConfig {
  name: string;
  slug: string;
  facebookUrl: string;
}

// Configuration constants
export const SCRAPER_CONFIG = {
  MAX_POSTS: 10,
  SCROLL_PAUSE_MS: 2000,
  MAX_SCROLLS: 3,
  NAVIGATION_TIMEOUT: 30000,
  WAIT_AFTER_LOAD: 3000,
};

// Keywords that indicate important alerts
export const ALERT_KEYWORDS = [
  'cancel',
  'cancelled',
  'postponed',
  'weather',
  'closed',
  'delayed',
  'rescheduled',
  'update',
  'important',
  'notice',
  'alert',
  'rain',
  'storm',
  'wind',
] as const;

// Keywords that indicate event-related posts
export const EVENT_KEYWORDS = [
  'race',
  'practice',
  'event',
  'gate',
  'registration',
  'sign up',
  'signup',
  'tonight',
  'today',
  'tomorrow',
  'this weekend',
  'sunday',
  'saturday',
] as const;

/**
 * Check if post text contains alert keywords
 */
export const containsAlertKeywords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return ALERT_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

/**
 * Check if post mentions an event (race, practice, etc.)
 */
export const isEventRelated = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return EVENT_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

/**
 * Parse timestamp (relative like "2h ago" or absolute like "October 8 at 4:09 PM") to Date
 */
export const parseRelativeTimestamp = (timestampText: string): Date | null => {
  const now = new Date();
  
  // Handle "Just now"
  if (timestampText.toLowerCase().includes('just now')) {
    return now;
  }
  
  // Try to parse absolute dates first (e.g., "October 8 at 4:09 PM", "Sept 30 at 2:51 PM")
  // Facebook shows these for posts older than ~7 days
  const absoluteMatch = timestampText.match(/([A-Za-z]+)\s+(\d{1,2})(?:\s+at\s+(\d{1,2}):(\d{2})\s*(AM|PM)?)?/i);
  if (absoluteMatch) {
    const [, monthStr, dayStr, hourStr, minuteStr, ampm] = absoluteMatch;
    
    const months: Record<string, number> = {
      'jan': 0, 'january': 0,
      'feb': 1, 'february': 1,
      'mar': 2, 'march': 2,
      'apr': 3, 'april': 3,
      'may': 4,
      'jun': 5, 'june': 5,
      'jul': 6, 'july': 6,
      'aug': 7, 'august': 7,
      'sep': 8, 'sept': 8, 'september': 8,
      'oct': 9, 'october': 9,
      'nov': 10, 'november': 10,
      'dec': 11, 'december': 11
    };
    
    const monthLower = monthStr.toLowerCase();
    const month = months[monthLower];
    const day = parseInt(dayStr, 10);
    
    if (month !== undefined && day > 0 && day <= 31) {
      // Determine the year (if post is from this year or last year)
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      
      // If the month is in the future, assume it's from last year
      const year = month > currentMonth ? currentYear - 1 : currentYear;
      
      // Parse time if available
      let hour = 0;
      let minute = 0;
      
      if (hourStr && minuteStr) {
        hour = parseInt(hourStr, 10);
        minute = parseInt(minuteStr, 10);
        
        // Convert to 24-hour format if AM/PM specified
        if (ampm) {
          if (ampm.toUpperCase() === 'PM' && hour !== 12) {
            hour += 12;
          } else if (ampm.toUpperCase() === 'AM' && hour === 12) {
            hour = 0;
          }
        }
      }
      
      // Create date in Denver timezone (America/Denver = Mountain Time)
      // Facebook timestamps are in the page's timezone
      const date = new Date(year, month, day, hour, minute);
      return date;
    }
  }
  
  // Match patterns like "2h", "3d", "1w", "2 hrs", "3 days", etc.
  const relativeMatch = timestampText.match(/(\d+)\s*(m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days|w|week|weeks)/i);
  
  if (!relativeMatch) {
    return null;
  }
  
  const value = parseInt(relativeMatch[1], 10);
  const unit = relativeMatch[2].toLowerCase();
  
  if (unit.startsWith('m')) {
    now.setMinutes(now.getMinutes() - value);
  } else if (unit.startsWith('h')) {
    now.setHours(now.getHours() - value);
  } else if (unit.startsWith('d')) {
    now.setDate(now.getDate() - value);
  } else if (unit.startsWith('w')) {
    now.setDate(now.getDate() - (value * 7));
  }
  
  return now;
};

/**
 * Extract posts from a Facebook page
 */
const extractPostsFromPage = async (page: Page, maxPosts: number): Promise<any[]> => {
  return await page.evaluate((maxPosts: number) => {
    const postElements: any[] = [];
    
    // Facebook uses div[role="article"] for posts
    const articles = document.querySelectorAll('div[role="article"]');
    
    console.log(`Found ${articles.length} article elements`);
    
    for (let i = 0; i < Math.min(articles.length, maxPosts); i++) {
      const article = articles[i];
      
      try {
        // Extract post text - look for various text containers
        let text = '';
        
        // Try different selectors for post content
        const textSelectors = [
          '[data-ad-comet-preview="message"]',
          '[data-ad-preview="message"]',
          'div[dir="auto"]',
          '[data-ad-rendering-role="body"]'
        ];
        
        for (const selector of textSelectors) {
          const textElements = article.querySelectorAll(selector);
          for (const elem of textElements) {
            const elemText = elem.textContent?.trim() || '';
            if (elemText.length > text.length) {
              text = elemText;
            }
          }
        }
        
        // Skip if no meaningful text
        if (!text || text.length < 10) {
          continue;
        }
        
        // Extract timestamp - look for both relative (2h, 3d) and absolute (October 8 at 4:09 PM) formats
        let timestampText = '';
        const timeElements = article.querySelectorAll('a[href*="/posts/"], a[href*="story_fbid"]');
        for (const timeElem of timeElements) {
          const spanText = timeElem.textContent?.trim() || '';
          // Check for relative times (2h, 3d, 1w, etc.) or absolute dates (month names)
          if (spanText && (
            spanText.includes('h') || 
            spanText.includes('d') || 
            spanText.includes('w') || 
            spanText.includes('min') ||
            /January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec/i.test(spanText)
          )) {
            timestampText = spanText;
            break;
          }
        }
        
        // Extract post URL
        let postUrl = null;
        for (const timeElem of timeElements) {
          const href = (timeElem as HTMLAnchorElement).href;
          if (href && (href.includes('/posts/') || href.includes('story_fbid'))) {
            postUrl = href;
            break;
          }
        }
        
        // Extract post image (look for the main post image)
        let imageUrl = null;
        const images = article.querySelectorAll('img');
        for (const img of images) {
          const src = (img as HTMLImageElement).src;
          // Filter out profile pics, icons, and very small images
          const width = (img as HTMLImageElement).naturalWidth || (img as HTMLImageElement).width;
          const height = (img as HTMLImageElement).naturalHeight || (img as HTMLImageElement).height;
          
          // Look for actual post images (not profile pics or icons)
          if (src && 
              !src.includes('profile') && 
              !src.includes('emoji') &&
              !src.includes('static') &&
              width > 100 && 
              height > 100) {
            imageUrl = src;
            break;
          }
        }
        
        postElements.push({
          text,
          timestamp: null, // Will parse on server side
          timestampText,
          url: postUrl,
          image: imageUrl,
          isEvent: false, // Will determine on server side
          hasAlertKeywords: false // Will determine on server side
        });
        
      } catch (err) {
        console.error('Error extracting post:', err);
      }
    }
    
    return postElements;
  }, maxPosts);
};

/**
 * Main Facebook scraper function - works for any public Facebook page
 */
export const scrapeFacebookPage = async (config: TrackConfig): Promise<ScraperResult> => {
  let browser: Browser | null = null;
  
  try {
    console.log(`🚀 Starting Facebook scraper for ${config.name}...`);
    
    // Launch browser in headless mode
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'America/Denver'
    });
    
    const page = await context.newPage();
    
    console.log(`📄 Navigating to ${config.facebookUrl}...`);
    
    // Navigate to the page with extended timeout
    await page.goto(config.facebookUrl, {
      waitUntil: 'networkidle',
      timeout: SCRAPER_CONFIG.NAVIGATION_TIMEOUT
    });
    
    // Wait a bit for dynamic content to load
    await page.waitForTimeout(SCRAPER_CONFIG.WAIT_AFTER_LOAD);
    
    // Try to close any login dialogs or popups
    try {
      const closeButtons = await page.locator('[aria-label="Close"]').all();
      for (const button of closeButtons) {
        await button.click({ timeout: 1000 }).catch(() => {});
      }
    } catch (e) {
      // Ignore if no close buttons found
    }
    
    // Scroll to load more posts
    console.log('📜 Scrolling to load posts...');
    for (let i = 0; i < SCRAPER_CONFIG.MAX_SCROLLS; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(SCRAPER_CONFIG.SCROLL_PAUSE_MS);
    }
    
    console.log('🔍 Extracting posts...');
    
    // Extract posts from the page
    const posts = await extractPostsFromPage(page, SCRAPER_CONFIG.MAX_POSTS);
    
    console.log(`✅ Extracted ${posts.length} posts`);
    
    // Process posts on the server side
    const processedPosts: FacebookPost[] = posts.map((post: any) => {
      const timestamp = post.timestampText ? parseRelativeTimestamp(post.timestampText) : null;
      const hasAlertKeywords = containsAlertKeywords(post.text);
      const isEvent = isEventRelated(post.text);
      
      return {
        text: post.text,
        timestamp,
        timestampText: post.timestampText,
        url: post.url,
        image: post.image,
        isEvent,
        hasAlertKeywords
      };
    });
    
    // Filter out posts without meaningful content
    const validPosts = processedPosts.filter(post => post.text.length > 20);
    
    console.log(`✨ Processed ${validPosts.length} valid posts`);
    console.log(`🚨 Found ${validPosts.filter(p => p.hasAlertKeywords).length} posts with alert keywords`);
    console.log(`🏁 Found ${validPosts.filter(p => p.isEvent).length} event-related posts`);
    
    await browser.close();
    
    return {
      success: true,
      trackName: config.name,
      trackSlug: config.slug,
      posts: validPosts
    };
    
  } catch (error) {
    console.error(`❌ Error scraping Facebook for ${config.name}:`, error);
    
    if (browser) {
      await browser.close();
    }
    
    return {
      success: false,
      trackName: config.name,
      trackSlug: config.slug,
      posts: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Pretty print scraper results
 */
export const printResults = (result: ScraperResult): void => {
  console.log('\n' + '='.repeat(80));
  console.log(`${result.trackName.toUpperCase()} FACEBOOK SCRAPER RESULTS`);
  console.log('='.repeat(80) + '\n');
  
  if (!result.success) {
    console.log('❌ Scraping failed:', result.error);
    return;
  }
  
  if (result.posts.length === 0) {
    console.log('⚠️  No posts found');
    return;
  }
  
  result.posts.forEach((post, index) => {
    console.log(`\n📌 POST ${index + 1}`);
    console.log('─'.repeat(80));
    console.log(`🕒 Timestamp: ${post.timestamp?.toLocaleString('en-US', { timeZone: 'America/Denver' }) || 'Unknown'}`);
    console.log(`🔗 URL: ${post.url || 'N/A'}`);
    console.log(`🏁 Event-related: ${post.isEvent ? 'Yes' : 'No'}`);
    console.log(`🚨 Has alerts: ${post.hasAlertKeywords ? 'Yes' : 'No'}`);
    console.log(`\n📝 Content:\n${post.text}`);
    console.log('─'.repeat(80));
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`Total posts: ${result.posts.length}`);
  console.log(`Alert posts: ${result.posts.filter(p => p.hasAlertKeywords).length}`);
  console.log(`Event posts: ${result.posts.filter(p => p.isEvent).length}`);
  console.log('='.repeat(80) + '\n');
};

/**
 * Print summary for multiple track results
 */
export const printMultiTrackSummary = (results: ScraperResult[]): void => {
  console.log('\n' + '━'.repeat(80));
  console.log('🏁 ALL TRACKS SUMMARY');
  console.log('━'.repeat(80) + '\n');
  
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    const totalPosts = result.posts.length;
    const alertPosts = result.posts.filter(p => p.hasAlertKeywords).length;
    const eventPosts = result.posts.filter(p => p.isEvent).length;
    
    console.log(`${icon} ${result.trackName}`);
    console.log(`   Posts: ${totalPosts} | Alerts: ${alertPosts} | Events: ${eventPosts}`);
    if (!result.success) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  });
  
  const totalPosts = results.reduce((sum, r) => sum + r.posts.length, 0);
  const totalAlerts = results.reduce((sum, r) => sum + r.posts.filter(p => p.hasAlertKeywords).length, 0);
  const totalEvents = results.reduce((sum, r) => sum + r.posts.filter(p => p.isEvent).length, 0);
  const successCount = results.filter(r => r.success).length;
  
  console.log('─'.repeat(80));
  console.log(`📊 TOTALS: ${successCount}/${results.length} tracks successful`);
  console.log(`   Total Posts: ${totalPosts} | Alerts: ${totalAlerts} | Events: ${totalEvents}`);
  console.log('━'.repeat(80) + '\n');
};
