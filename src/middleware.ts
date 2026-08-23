import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { COLORADO_CANONICAL_HOST, COLORADO_CANONICAL_ORIGIN } from '@/lib/canonicalSite';

const AUTH_REQUIRED_PREFIXES = ['/account', '/admin'];
const DENVER_HOSTS = ['bmxdenver.com', 'denverbmx.com'];
const PATH_PRESERVE_ALIASES = ['bmxcolorado.com', 'coloradobmx.com'];

function hostname(hostHeader: string): string {
  return hostHeader.split(':')[0].toLowerCase();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = hostname(request.headers.get('host') ?? '');

  if (DENVER_HOSTS.some((h) => host === h || host === `www.${h}`)) {
    return NextResponse.redirect(`${COLORADO_CANONICAL_ORIGIN}/forum`, 301);
  }

  const isPathPreserveAlias =
    host === 'cobmx.com' ||
    PATH_PRESERVE_ALIASES.some((h) => host === h || host === `www.${h}`);

  if (isPathPreserveAlias) {
    const url = request.nextUrl.clone();
    url.host = COLORADO_CANONICAL_HOST;
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/forum', request.url), 301);
  }

  const { supabaseResponse, user } = await updateSession(request);

  const isClaimPage = /\/tracks\/[^/]+\/claim/.test(pathname);
  const requiresAuth =
    AUTH_REQUIRED_PREFIXES.some((p) => pathname.startsWith(p)) || isClaimPage;

  if (requiresAuth && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/forum', request.url));
  }

  const response = supabaseResponse;
  response.headers.set('x-pathname', pathname);

  if (
    pathname === '/' ||
    pathname.startsWith('/forum') ||
    pathname.startsWith('/tracks') ||
    pathname.startsWith('/users') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/share') ||
    pathname.startsWith('/contact')
  ) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  if (pathname === '/sw.js' || pathname === '/version.json') {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
