/**
 * Browser-side extraction for public Instagram profile grids.
 * Stories are not supported (login-gated, 24h expiry).
 */

export const getExtractInstagramMetadataScript = (maxPosts: number): string => `
(() => {
  const posts = [];
  const seen = new Set();
  const links = document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]');

  for (const a of links) {
    const href = (a.href || '').split('?')[0];
    if (!href || seen.has(href)) continue;
    seen.add(href);

    let timestampText = '';
    let isoTimestamp = null;
    const article = a.closest('article') || a.closest('div');
    const timeEl = article?.querySelector('time[datetime]');
    if (timeEl) {
      isoTimestamp = timeEl.getAttribute('datetime');
      timestampText = (timeEl.textContent || '').trim();
    }

    posts.push({
      url: href,
      timestampText,
      isoTimestamp,
    });

    if (posts.length >= ${maxPosts}) break;
  }

  return { count: posts.length, posts };
})()
`;
