'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import ColoradoNavigation from './ColoradoNavigation';

function isColoradoPath(pathname: string): boolean {
  return (
    pathname.startsWith('/forum') ||
    pathname.startsWith('/tracks') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account') ||
    pathname === '/login' ||
    pathname === '/signup'
  );
}

export default function SiteNavigation() {
  const pathname = usePathname();

  if (typeof window !== 'undefined') {
    const host = window.location.host.toLowerCase();
    if (host.includes('bmxcolorado') || host.includes('coloradobmx') || isColoradoPath(pathname)) {
      return <ColoradoNavigation />;
    }
  } else if (isColoradoPath(pathname)) {
    return <ColoradoNavigation />;
  }

  return <Navigation />;
}
