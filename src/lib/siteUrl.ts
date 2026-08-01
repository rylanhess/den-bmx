function isLocalHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function isLocalOrigin(origin: string): boolean {
  try {
    return isLocalHost(new URL(origin).hostname);
  } catch {
    return false;
  }
}

/** Canonical public site URL for auth redirects (OAuth, email links). */
export function getSiteUrl(): string {
  // When developing on localhost, always use the current origin — not production NEXT_PUBLIC_SITE_URL.
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (isLocalOrigin(origin)) return origin;
  }

  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

/** Origin for auth callback redirects on the incoming request (server). */
export function getRequestSiteOrigin(request: Request): string {
  const origin = new URL(request.url).origin;
  if (isLocalOrigin(origin)) return origin;
  return getSiteUrl();
}

export function authCallbackUrl(next = '/forum'): string {
  return `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
}
