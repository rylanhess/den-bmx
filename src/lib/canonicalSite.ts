import { isColoradoHost } from '@/lib/coloradoTheme';

export const COLORADO_CANONICAL_ORIGIN = 'https://www.bmxcolorado.com';
export const DENVER_CANONICAL_ORIGIN = 'https://www.bmxdenver.com';

/** Canonical HTTPS origin for the incoming host (no trailing slash). */
export function canonicalOriginForHost(host: string): string {
  return isColoradoHost(host) ? COLORADO_CANONICAL_ORIGIN : DENVER_CANONICAL_ORIGIN;
}

export function canonicalUrlForHost(host: string, pathname = '/'): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${canonicalOriginForHost(host)}${path}`;
}
