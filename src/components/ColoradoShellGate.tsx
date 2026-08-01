'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import ColoradoShell from './ColoradoShell';
import { isColoradoExperience } from '@/lib/coloradoTheme';

export default function ColoradoShellGate() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const host = typeof window !== 'undefined' ? window.location.host : '';
  if (!isColoradoExperience(host, pathname, searchParams)) return null;
  return <ColoradoShell />;
}
