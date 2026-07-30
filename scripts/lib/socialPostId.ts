/**
 * Stable external IDs parsed from Facebook / Instagram post URLs.
 */

import type { SocialPlatform } from './coloradoTrackSources';

export function externalPostIdFromUrl(url: string, platform: SocialPlatform): string | null {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;

    if (platform === 'instagram') {
      const m = path.match(/\/(p|reel|tv)\/([^/]+)/i);
      return m ? m[2].toLowerCase() : null;
    }

    // Facebook: /posts/123, /permalink.php?story_fbid=, /photos/...
    const postsMatch = path.match(/\/posts\/(\d+)/i);
    if (postsMatch) return postsMatch[1];

    const photoMatch = path.match(/\/photos\/[^/]+\/(\d+)/i);
    if (photoMatch) return photoMatch[1];

    const fbid = parsed.searchParams.get('story_fbid');
    if (fbid) return fbid;

    const permalinkId = parsed.searchParams.get('fbid');
    if (permalinkId) return permalinkId;

    return null;
  } catch {
    return null;
  }
}

export function normalizeSocialPostUrl(url: string): string {
  return url.split('?')[0].replace(/\/$/, '');
}
