'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Navigation from './Navigation';
import ColoradoNavigation from './ColoradoNavigation';
import { isColoradoExperience } from '@/lib/coloradoTheme';

export default function SiteNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (typeof window !== 'undefined') {
    if (isColoradoExperience(window.location.host, pathname, searchParams)) {
      return <ColoradoNavigation />;
    }
  } else if (isColoradoExperience('', pathname, searchParams)) {
    return <ColoradoNavigation />;
  }

  return <Navigation />;
}
