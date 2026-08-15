export const COLORADO_CANONICAL_ORIGIN = 'https://www.bmxcolorado.com';

/** Canonical HTTPS origin (no trailing slash). */
export function canonicalOrigin(): string {
  return COLORADO_CANONICAL_ORIGIN;
}

export function canonicalUrl(pathname = '/'): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${COLORADO_CANONICAL_ORIGIN}${path}`;
}
