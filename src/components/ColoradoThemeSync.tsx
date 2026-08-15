'use client';

import { useEffect } from 'react';

const THEME_CLASS = 'theme-colorado-day';

/** Keeps Colorado Day on <body> after client navigations. */
export default function ColoradoThemeSync() {
  useEffect(() => {
    document.body.classList.add(THEME_CLASS);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#002868');
  }, []);

  return null;
}
