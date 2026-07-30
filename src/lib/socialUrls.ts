/** Normalize user-entered Instagram handle or URL to a canonical profile URL. */
export function normalizeInstagramUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  try {
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      const parsed = new URL(raw);
      if (!parsed.hostname.includes('instagram.com')) return null;
      const handle = parsed.pathname.replace(/^\/+|\/+$/g, '').split('/')[0];
      if (!handle || ['p', 'reel', 'stories', 'explore'].includes(handle)) return null;
      return `https://www.instagram.com/${handle}/`;
    }
  } catch {
    return null;
  }

  const handle = raw.replace(/^@+/, '').replace(/\/+$/g, '');
  if (!handle || !/^[a-zA-Z0-9._]+$/.test(handle)) return null;
  return `https://www.instagram.com/${handle}/`;
}

/** Normalize user-entered Facebook profile/page URL. */
export function normalizeFacebookUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  try {
    const withProtocol = raw.startsWith('http') ? raw : `https://${raw}`;
    const parsed = new URL(withProtocol);
    if (!parsed.hostname.includes('facebook.com') && !parsed.hostname.includes('fb.com')) {
      return null;
    }
    // Strip tracking params, keep path
    const path = parsed.pathname.replace(/\/+$/, '') || '/';
    if (path === '/' && !parsed.search) return null;
    return `https://www.facebook.com${path}${parsed.search || ''}`;
  } catch {
    return null;
  }
}

export function instagramHandleFromUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const handle = new URL(url).pathname.replace(/^\/+|\/+$/g, '').split('/')[0];
    return handle ? `@${handle}` : null;
  } catch {
    return null;
  }
}
