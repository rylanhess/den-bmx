'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isColoradoExperience } from '@/lib/coloradoTheme';

const THEME_CLASS = 'theme-colorado-day';

/** Keeps Colorado Day on <body> in sync for local path-based Colorado routes. */
export default function ColoradoThemeSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const host = typeof window !== 'undefined' ? window.location.host : '';
    const on = isColoradoExperience(host, pathname, searchParams);
    document.body.classList.toggle(THEME_CLASS, on);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', on ? '#002868' : '#00ff0c');
  }, [pathname, searchParams]);

  return null;
}
