import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const COLORADO_HOSTS = ['bmxcolorado.com', 'www.bmxcolorado.com', 'coloradobmx.com', 'www.coloradobmx.com'];

const AUTH_REQUIRED_PREFIXES = ['/account', '/admin'];

const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/auth/callback', '/contact'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') ?? '';

  if (host.includes('coloradobmx.com')) {
    const url = request.nextUrl.clone();
    url.host = 'bmxcolorado.com';
    return NextResponse.redirect(url, 301);
  }

  const redirects: Record<string, string> = {
    '/freestyle': '/bmx-parks-denver',
    '/calendar': '/denver-bmx-races',
    '/new-rider': '/kids-bmx-denver',
    '/shop': '/denver-bmx-merch',
    '/merch': '/denver-bmx-merch',
    '/volunteer': '/volunteer-bmx-denver',
  };

  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url), 301);
  }

  const { supabaseResponse, user } = await updateSession(request);

  const isColoradoHost = COLORADO_HOSTS.some((h) => host.includes(h.replace('www.', '')));
  const isClaimPage = /\/tracks\/[^/]+\/claim/.test(pathname);
  const requiresAuth =
    AUTH_REQUIRED_PREFIXES.some((p) => pathname.startsWith(p)) || isClaimPage;

  if (isColoradoHost && pathname === '/') {
    return NextResponse.redirect(new URL('/forum', request.url));
  }

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
    pathname.startsWith('/riders') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/denver-bmx-races') ||
    pathname.startsWith('/bmx-tracks-denver') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/kids-bmx-denver') ||
    pathname.startsWith('/denver-bmx-merch') ||
    pathname.startsWith('/volunteer-bmx-denver') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/track-pack') ||
    pathname.startsWith('/bmx-parks-denver')
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
