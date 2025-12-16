import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // SEO Redirects - Redirect old URLs to new SEO-friendly URLs
  const redirects: Record<string, string> = {
    '/tracks': '/bmx-tracks-denver',
    '/freestyle': '/bmx-parks-denver',
    '/calendar': '/denver-bmx-races',
    '/new-rider': '/kids-bmx-denver',
    '/shop': '/denver-bmx-merch',
    '/merch': '/denver-bmx-merch',
    '/volunteer': '/volunteer-bmx-denver',
  };

  // Check if this path should be redirected
  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url), 301);
  }

  const response = NextResponse.next();

  // Don't cache HTML pages - always fetch fresh
  if (pathname === '/' || pathname.startsWith('/denver-bmx-races') || pathname.startsWith('/bmx-tracks-denver') || 
      pathname.startsWith('/contact') || pathname.startsWith('/kids-bmx-denver') || 
      pathname.startsWith('/denver-bmx-merch') || pathname.startsWith('/volunteer-bmx-denver') || 
      pathname.startsWith('/about') || pathname.startsWith('/track-pack') || 
      pathname.startsWith('/bmx-parks-denver') ||
      // Legacy paths (for redirects)
      pathname.startsWith('/calendar') || pathname.startsWith('/tracks') || 
      pathname.startsWith('/new-rider') || pathname.startsWith('/merch') || 
      pathname.startsWith('/shop') || pathname.startsWith('/volunteer') || 
      pathname.startsWith('/freestyle')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // Cache static assets with version-based cache busting
  if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Don't cache API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // Don't cache service worker or version file
  if (pathname === '/sw.js' || pathname === '/version.json') {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

