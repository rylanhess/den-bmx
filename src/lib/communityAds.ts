import { AD_CONTACT_PATH, type AdSlotConfig, type CommunitySlide } from '@/lib/adSpaces';
import { merchAdSlides } from '@/lib/merchAds';

const BASE = '/ads/community';

/** Shared community photo slides — objectPosition crops away watermarks & social UI. */
export const communityPhotoSlides: CommunitySlide[] = [
  {
    imageUrl: `${BASE}/gates-girls-club.jpeg`,
    alt: 'Young BMX racers celebrating together at the track',
    headline: 'Girls Club at the Gates',
    subline: 'Friendships forged on two wheels',
    objectPosition: 'center 40%',
    label: 'COMMUNITY',
  },
  {
    imageUrl: `${BASE}/indoor-gates.jpeg`,
    alt: 'Racers charging the first straight at an indoor BMX race',
    headline: 'Fill the Gates!',
    subline: 'Every gate tells a story',
    objectPosition: 'center 55%',
    label: 'RACE DAY',
  },
  {
    imageUrl: `${BASE}/helmet-focus.jpeg`,
    alt: 'BMX racer in full gear ready at the gate',
    headline: 'Lock In. Line Up. Go.',
    subline: 'Colorado riders show up ready',
    objectPosition: '70% center',
    label: 'TRACK LIFE',
  },
  {
    imageUrl: `${BASE}/race-berm-action.jpeg`,
    alt: 'Racer carving a berm on a sunny race day',
    headline: 'Carve the Turn',
    subline: 'Pure Colorado BMX speed',
    objectPosition: '55% 35%',
    label: 'ACTION',
  },
  {
    imageUrl: `${BASE}/midair-send.jpeg`,
    alt: 'Young racer catching air over a BMX jump',
    headline: 'Send It!',
    subline: 'The best views are mid-flight',
    objectPosition: '50% 38%',
    label: 'SEND IT',
  },
  {
    imageUrl: `${BASE}/track-straightaway.jpeg`,
    alt: 'Racer powering down the straightaway',
    headline: 'Built at the Track',
    subline: 'Where Colorado competes',
    objectPosition: '52% 32%',
    label: 'RACE DAY',
  },
];

export const adInquirySlide: CommunitySlide = {
  alt: 'Advertise with BMX Colorado',
  headline: 'Want your ad here?',
  subline: 'Contact me →',
  href: AD_CONTACT_PATH,
  isCta: true,
};

/** Full pool shared across all ad slots — layout coordinator assigns unique slides. */
export const fullAdPool: CommunitySlide[] = [
  ...communityPhotoSlides,
  ...merchAdSlides,
  adInquirySlide,
];

export function slideKey(slide: CommunitySlide): string {
  if (slide.isCta) return 'cta:inquiry';
  return slide.imageUrl ?? slide.headline;
}

let shuffledPoolOrder: number[] | null = null;

function poolOrder(): number[] {
  if (!shuffledPoolOrder) {
    shuffledPoolOrder = [...Array(fullAdPool.length).keys()];
    for (let i = shuffledPoolOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPoolOrder[i], shuffledPoolOrder[j]] = [shuffledPoolOrder[j], shuffledPoolOrder[i]];
    }
  }
  return shuffledPoolOrder;
}

/** Pick the first pool index whose slide key is not already in use. */
export function assignUniqueSlide(usedKeys: Set<string>): number | null {
  for (const idx of poolOrder()) {
    const key = slideKey(fullAdPool[idx]);
    if (!usedKeys.has(key)) return idx;
  }
  return null;
}

/** Next pool index for a slot advance, skipping slides already shown elsewhere. */
export function advancePoolIndex(current: number, usedByOthers: Set<string>): number {
  for (let step = 1; step <= fullAdPool.length; step++) {
    const next = (current + step) % fullAdPool.length;
    const key = slideKey(fullAdPool[next]);
    if (!usedByOthers.has(key)) return next;
  }
  return current;
}

export function hydrateAdSlots(slots: AdSlotConfig[]): AdSlotConfig[] {
  return slots.map((slot) => {
    if (slot.carousel || slot.content) return slot;
    return { ...slot, carousel: fullAdPool };
  });
}
