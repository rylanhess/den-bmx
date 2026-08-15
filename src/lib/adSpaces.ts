/**
 * Ad slot configuration for BMX Colorado.
 *
 * Empty slots auto-fill with rotating community photos (see communityAds.ts).
 * Override with `content` for a static sponsor/merch ad, or `carousel` for custom slides.
 */

export type AdSlotSize = 'banner' | 'rectangle' | 'sidebar';

export type CommunitySlide = {
  imageUrl?: string;
  alt: string;
  headline: string;
  subline?: string;
  /** CSS object-position to crop focus away from watermarks / UI chrome. */
  objectPosition?: string;
  label?: string;
  href?: string;
  isCta?: boolean;
  /** Product shots on white — use contain + light background instead of cover crop. */
  isMerch?: boolean;
};

export type AdContent = {
  /** Display label above the creative (e.g. "SPONSORED", "FEATURED MERCH"). */
  label?: string;
  href: string;
  imageUrl?: string;
  alt?: string;
  cta?: string;
  external?: boolean;
};

export type AdSlotConfig = {
  id: string;
  size: AdSlotSize;
  content?: AdContent;
  /** Rotating community / partner slides (client-side carousel). */
  carousel?: CommunitySlide[];
};

/** Contact page for ad inquiries. */
export const AD_CONTACT_PATH = '/contact';

/** Global ad cycle: one random slot advances every 7–9 seconds. */
export const AD_CYCLE_MIN_MS = 7000;
export const AD_CYCLE_MAX_MS = 9000;

/** Horizontal banner slots below the nav. */
export const bannerAdSlots: AdSlotConfig[] = [
  { id: 'banner-1', size: 'banner' },
  { id: 'banner-2', size: 'banner' },
  { id: 'banner-3', size: 'banner' },
];

/** Right sidebar slots on forum / tracks pages. */
export const rightSidebarAdSlots: AdSlotConfig[] = [
  { id: 'sidebar-right-1', size: 'sidebar' },
  { id: 'sidebar-right-2', size: 'rectangle' },
];

/** Left sidebar slots on forum / tracks pages. */
export const leftSidebarAdSlots: AdSlotConfig[] = [
  { id: 'sidebar-left-1', size: 'sidebar' },
  { id: 'sidebar-left-2', size: 'rectangle' },
];

/** Mobile-only mid-roll slots — banner height matches top ad strip (hidden on lg+). */
export const mobileMidroll1: AdSlotConfig = { id: 'mobile-midroll-1', size: 'banner' };
export const mobileMidroll2: AdSlotConfig = { id: 'mobile-midroll-2', size: 'banner' };
export const mobileMidroll3: AdSlotConfig = { id: 'mobile-midroll-3', size: 'banner' };
export const mobileMidroll4: AdSlotConfig = { id: 'mobile-midroll-4', size: 'banner' };

/**
 * Example — uncomment and assign to a slot when ready:
 *
 * const merchPromo: AdContent = {
 *   label: 'FEATURED MERCH',
 *   href: 'https://store.bmxdenver.com',
 *   imageUrl: '/BMX_sweatshirt.jpg',
 *   alt: 'BMX Crewneck Sweatshirt',
 *   cta: 'Shop Now',
 *   external: true,
 * };
 */
