export const COLORADO_CANONICAL_HOST = 'www.cobmx.com';
export const COLORADO_CANONICAL_ORIGIN = `https://${COLORADO_CANONICAL_HOST}`;
/** Short public link (apex 301s to www). */
export const COLORADO_SHORT_LINK = 'https://cobmx.com';

/** Canonical HTTPS origin (no trailing slash). */
export function canonicalOrigin(): string {
  return COLORADO_CANONICAL_ORIGIN;
}

export function canonicalUrl(pathname = '/'): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${COLORADO_CANONICAL_ORIGIN}${path}`;
}
