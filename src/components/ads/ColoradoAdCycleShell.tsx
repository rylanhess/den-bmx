'use client';

import { AdCycleProvider } from '@/components/ads/AdCycleProvider';

export default function ColoradoAdCycleShell({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return <AdCycleProvider enabled={enabled}>{children}</AdCycleProvider>;
}
