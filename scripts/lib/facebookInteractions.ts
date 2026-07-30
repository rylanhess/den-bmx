/**
 * Facebook page interaction selectors and browser evaluate snippets for MCP scraper.
 */

import { ALERT_KEYWORDS, EVENT_KEYWORDS, SCRAPER_CONFIG } from '../fetchFacebook';

export { SCRAPER_CONFIG, ALERT_KEYWORDS, EVENT_KEYWORDS };

/** Text patterns for "See more" on truncated posts */
export const SEE_MORE_PATTERNS = ['See more', 'See More', '… See more', '... See more'];

/** Max comments to extract per post */
export const MAX_COMMENTS_PER_POST = 8;

/**
 * Browser-side extraction (paste into chrome-devtools evaluate).
 * Returns raw posts from visible feed articles.
 */
export const getExtractPostsEvaluateScript = (maxPosts: number): string => `
(() => {
  const articles = document.querySelectorAll('div[role="article"]');
  const posts = [];
  const limit = Math.min(articles.length, ${maxPosts});

  for (let i = 0; i < limit; i++) {
    const article = articles[i];
    let text = '';
    const selectors = [
      '[data-ad-comet-preview="message"]',
      '[data-ad-preview="message"]',
      'div[dir="auto"]',
      '[data-ad-rendering-role="body"]'
    ];
    for (const sel of selectors) {
      article.querySelectorAll(sel).forEach((el) => {
        const t = (el.textContent || '').trim();
        if (t.length > text.length) text = t;
      });
    }
    if (!text || text.length < 10) continue;

    let timestampText = '';
    const timeLinks = article.querySelectorAll('a[href*="/posts/"], a[href*="story_fbid"]');
    for (const a of timeLinks) {
      const spanText = (a.textContent || '').trim();
      if (spanText && (/\\d+h|\\d+d|\\d+w|min|January|February|March|April|May|June|July|August|September|October|November|December/i.test(spanText))) {
        timestampText = spanText;
        break;
      }
    }

    let postUrl = null;
    for (const a of timeLinks) {
      const href = a.href;
      if (href && (href.includes('/posts/') || href.includes('story_fbid'))) {
        postUrl = href;
        break;
      }
    }

    let imageUrl = null;
    for (const img of article.querySelectorAll('img')) {
      const src = img.src;
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (src && !src.includes('profile') && !src.includes('emoji') && w > 100 && h > 100) {
        imageUrl = src;
        break;
      }
    }

    const hasSeeMore = /see more/i.test(article.innerText || '');

    posts.push({
      text,
      timestampText,
      url: postUrl,
      image: imageUrl,
      hasSeeMore,
      comments: []
    });
  }
  return { count: posts.length, posts, articleCount: articles.length };
})()
`;

/**
 * Metadata-only extraction — URL + timestamp only, no post text/images.
 * Used for BMX Colorado FB new-post detection (ToS-safe).
 */
export const getExtractPostMetadataScript = (maxPosts: number): string => `
(() => {
  const articles = document.querySelectorAll('div[role="article"]');
  const posts = [];
  const seen = new Set();
  const limit = Math.min(articles.length, ${maxPosts});

  for (let i = 0; i < limit; i++) {
    const article = articles[i];
    const timeLinks = article.querySelectorAll('a[href*="/posts/"], a[href*="story_fbid"], a[href*="/permalink/"]');

    let timestampText = '';
    let postUrl = null;

    for (const a of timeLinks) {
      const href = a.href;
      if (href && (href.includes('/posts/') || href.includes('story_fbid') || href.includes('/permalink/'))) {
        if (!postUrl) postUrl = href.split('?')[0];
        const spanText = (a.textContent || '').trim();
        if (spanText && (/\\d+h|\\d+d|\\d+w|min|January|February|March|April|May|June|July|August|September|October|November|December/i.test(spanText))) {
          timestampText = spanText;
        }
      }
    }

    if (!postUrl || seen.has(postUrl)) continue;
    seen.add(postUrl);

    posts.push({
      text: '',
      timestampText,
      url: postUrl,
      image: null,
      hasSeeMore: false,
      comments: []
    });
  }
  return { count: posts.length, posts, articleCount: articles.length };
})()
`;
