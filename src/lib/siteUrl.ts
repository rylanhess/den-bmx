/** Canonical public site URL for auth redirects (OAuth, email links). */
export function getSiteUrl(): string {
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

export function authCallbackUrl(next = '/forum'): string {
  return `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
}
