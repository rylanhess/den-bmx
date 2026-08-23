import type { Metadata } from 'next';
import { COLORADO_CANONICAL_ORIGIN } from '@/lib/canonicalSite';

const COLORADO_TAB_ICON = '/logos/cbmx_tab_icon-32.png?v=20260802';
const COLORADO_APPLE_ICON = '/logos/cbmx_tab_icon-192.png?v=20260802';

const COLORADO_OG_IMAGE = {
  url: '/logos/cbmx_og_talkbmx_1200.png?v=20260815',
  width: 1200,
  height: 630,
  alt: 'Talk BMX at BMX Colorado',
} as const;

/**
 * Page-level OpenGraph image entry. Pages that override `openGraph` must
 * re-declare images — Next.js replaces the whole openGraph object otherwise.
 */
export function coloradoOgImage(alt?: string) {
  return [{ ...COLORADO_OG_IMAGE, ...(alt ? { alt } : {}) }];
}

const coloradoMetadata: Metadata = {
  title: {
    default: 'BMX Colorado',
    template: '%s - BMX Colorado',
  },
  description:
    "Colorado's community message board for BMX racing, freestyle, and track news. Talk BMX with riders and tracks across the state.",
  metadataBase: new URL(COLORADO_CANONICAL_ORIGIN),
  alternates: {
    canonical: './',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BMX Colorado',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'BMX Colorado',
    description:
      "Talk BMX at cobmx.com — Colorado's community message board for race tracks, freestyle, and track news.",
    url: COLORADO_CANONICAL_ORIGIN,
    siteName: 'BMX Colorado',
    images: [COLORADO_OG_IMAGE],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMX Colorado',
    description:
      "Talk BMX at cobmx.com — Colorado's community message board for race tracks, freestyle, and track news.",
    images: [COLORADO_OG_IMAGE.url],
  },
  icons: {
    icon: [
      { url: COLORADO_TAB_ICON, type: 'image/png' },
      { url: COLORADO_TAB_ICON, sizes: '32x32', type: 'image/png' },
      { url: COLORADO_APPLE_ICON, sizes: '192x192', type: 'image/png' },
    ],
    shortcut: COLORADO_TAB_ICON,
    apple: COLORADO_APPLE_ICON,
  },
};

export function siteMetadata(): Metadata {
  return coloradoMetadata;
}
