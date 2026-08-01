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
  const INVISIBLE = /[\\u200B-\\u200D\\uFEFF\\u034F\\u180E\\u2060]/g;
  const strip = (s) => (s || '').replace(INVISIBLE, '').trim();
  const TIME_RE = /(\\d+\\s*(s|m|h|d|w|min)|ago|yesterday|January|February|March|April|May|June|July|August|September|October|November|December)/i;
  const POST_HREF_RE = /\\/posts\\/|pfbid|story_fbid|\\/permalink\\//i;
  const posts = [];
  const seen = new Set();

  const resolveLabelledBy = (el) => {
    if (!el) return '';
    const ids = (el.getAttribute('aria-labelledby') || '').split(/\\s+/).filter(Boolean);
    if (!ids.length) return '';
    return strip(ids.map((id) => document.getElementById(id)?.textContent || '').join(' '));
  };

  const timestampFromLink = (a) => {
    const nested = a.querySelector('[aria-labelledby]');
    const fromNested = resolveLabelledBy(nested);
    if (fromNested && TIME_RE.test(fromNested)) return fromNested;
    const fromSelf = resolveLabelledBy(a);
    if (fromSelf && TIME_RE.test(fromSelf)) return fromSelf;
    const aria = strip(a.getAttribute('aria-label') || '');
    if (aria && TIME_RE.test(aria)) return aria;
    const text = strip(a.textContent || '');
    if (text && TIME_RE.test(text)) return text;
    return '';
  };

  const normalizePostUrl = (href) => {
    if (!href) return null;
    const clean = href.split('?')[0];
    if (POST_HREF_RE.test(href)) return clean;
    if (href.includes('photo/?fbid=')) {
      const url = new URL(href, location.href);
      const fbid = url.searchParams.get('fbid');
      const set = url.searchParams.get('set');
      if (fbid) {
        return 'https://www.facebook.com/photo/?fbid=' + fbid + (set ? '&set=' + set : '');
      }
    }
    if (href.includes(location.hostname) && href.includes('#')) {
      return href.split('?')[0] + '#' + href.split('#').slice(1).join('#').slice(0, 32);
    }
    return null;
  };

  const postUrlIn = (root) => {
    for (const a of root.querySelectorAll('a[href]')) {
      const href = a.href || '';
      if (POST_HREF_RE.test(href)) return normalizePostUrl(href);
    }
    for (const a of root.querySelectorAll('a[href*="photo/?fbid="]')) {
      const label = strip((a.getAttribute('aria-label') || '') + ' ' + (a.textContent || ''));
      if (/cover|profile/i.test(label)) continue;
      const url = normalizePostUrl(a.href);
      if (url) return url;
    }
    return null;
  };

  const pushPost = (url, timestampText) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    posts.push({
      text: '',
      timestampText: timestampText || '',
      url,
      image: null,
      hasSeeMore: false,
      comments: []
    });
  };

  // Path A: classic feed articles (Dacono-style /posts/pfbid links)
  const articles = document.querySelectorAll('div[role="article"]');
  const articleLimit = Math.min(articles.length, ${maxPosts});
  for (let i = 0; i < articleLimit; i++) {
    const article = articles[i];
    const timeLinks = article.querySelectorAll('a[href*="/posts/"], a[href*="story_fbid"], a[href*="/permalink/"], a[href*="pfbid"]');
    let timestampText = '';
    let postUrl = null;
    for (const a of timeLinks) {
      const href = a.href;
      if (href && POST_HREF_RE.test(href)) {
        if (!postUrl) postUrl = normalizePostUrl(href);
        const ts = timestampFromLink(a);
        if (ts) timestampText = ts;
      }
    }
    if (!postUrl) postUrl = postUrlIn(article);
    if (postUrl) pushPost(postUrl, timestampText);
  }

  // Path B: page layouts where articles are empty shells (Mile High-style)
  if (posts.length < ${maxPosts}) {
    const timeLinks = document.querySelectorAll('a[href]');
    for (const a of timeLinks) {
      if (posts.length >= ${maxPosts}) break;
      const timestampText = timestampFromLink(a);
      if (!timestampText) continue;
      let el = a;
      for (let depth = 0; depth < 14 && el; depth++) {
        el = el.parentElement;
        if (!el) break;
        const text = strip(el.innerText || '');
        if (text.length < 25 || text.length > 12000) continue;
        const postUrl = postUrlIn(el);
        if (postUrl) {
          pushPost(postUrl, timestampText);
          break;
        }
      }
    }
  }

  return { count: posts.length, posts, articleCount: articles.length };
})()
`;
