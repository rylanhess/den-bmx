import type { Metadata } from 'next';
import { COLORADO_CANONICAL_ORIGIN, DENVER_CANONICAL_ORIGIN } from '@/lib/canonicalSite';

const DENVER_SITE_URL = DENVER_CANONICAL_ORIGIN;
const COLORADO_SITE_URL = COLORADO_CANONICAL_ORIGIN;

const DENVER_OG_IMAGE = {
  url: '/DENBMX-og.png?v=2',
  width: 784,
  height: 472,
  alt: 'Official Denver BMX',
} as const;

const COLORADO_TAB_ICON = '/logos/cbmx_tab_icon-32.png?v=20260802';
const COLORADO_APPLE_ICON = '/logos/cbmx_tab_icon-192.png?v=20260802';

const COLORADO_OG_IMAGE = {
  url: '/logos/cbmx_og_talkbmx.png?v=20260802',
  width: 784,
  height: 472,
  alt: 'Talk BMX at BMX Colorado',
} as const;

const denverMetadata: Metadata = {
  title: {
    default: 'Home - BMX Denver',
    template: '%s - BMX Denver',
  },
  description:
    'Your hub for all things BMX in Denver. Find racing tracks, freestyle parks, events, and everything you need for BMX racing and freestyle riding in the Denver metro area.',
  metadataBase: new URL(DENVER_SITE_URL),
  alternates: {
    canonical: './',
  },
  manifest: '/manifest.json',
  themeColor: '#00ff0c',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DEN BMX',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Denver BMX',
    description:
      'Your hub for all things BMX in Denver. Find racing tracks, freestyle parks, events, and everything you need for BMX racing and freestyle riding. 🚴',
    url: DENVER_SITE_URL,
    siteName: 'Denver BMX',
    images: [DENVER_OG_IMAGE],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DEN BMX - Denver Metro BMX',
    description:
      'Your hub for all things BMX in Denver. Find racing tracks, freestyle parks, events, and everything you need for BMX racing and freestyle riding. 🚴',
    images: [DENVER_OG_IMAGE.url],
  },
  icons: {
    icon: [
      { url: '/logos/MARK_ONLY_icon_tab.png', type: 'image/png' },
      { url: '/logos/MARK_ONLY_icon_tab.png', sizes: '32x32', type: 'image/png' },
      { url: '/logos/MARK_ONLY_icon_tab.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/logos/MARK_ONLY_icon_tab.png',
    apple: '/logos/MARK_ONLY_icon_tab.png',
  },
};

const coloradoMetadata: Metadata = {
  title: {
    default: 'BMX Colorado',
    template: '%s - BMX Colorado',
  },
  description:
    "Colorado's community message board for BMX racing, freestyle, and track news. Talk BMX with riders and tracks across the state.",
  metadataBase: new URL(COLORADO_SITE_URL),
  alternates: {
    canonical: './',
  },
  manifest: '/manifest.json',
  themeColor: '#002868',
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
      "Talk BMX at bmxcolorado.com — Colorado's community message board for race tracks, freestyle, and track news.",
    url: COLORADO_SITE_URL,
    siteName: 'BMX Colorado',
    images: [COLORADO_OG_IMAGE],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMX Colorado',
    description:
      "Talk BMX at bmxcolorado.com — Colorado's community message board for race tracks, freestyle, and track news.",
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

export function siteMetadata(isColorado: boolean): Metadata {
  return isColorado ? coloradoMetadata : denverMetadata;
}
