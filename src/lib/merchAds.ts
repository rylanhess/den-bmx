import type { CommunitySlide } from '@/lib/adSpaces';

const BASE = '/ads/merch';
const STORE = 'https://store.bmxdenver.com/product';

/** BMX Denver store product ads — linked to live merch listings. */
export const merchAdSlides: CommunitySlide[] = [
  {
    imageUrl: `${BASE}/toddler-sweatshirt.png`,
    alt: 'BMX Toddler Sweatshirt – Retro 3D Stunt Bike Crewneck',
    headline: 'BMX Toddler Sweatshirt',
    subline: 'Shop now · $33.99',
    href: `${STORE}/25218829`,
    label: 'MERCH',
    isMerch: true,
    objectPosition: 'center center',
  },
  {
    imageUrl: `${BASE}/crewneck-sweatshirt.png`,
    alt: 'BMX Crewneck Sweatshirt – Retro 3D BMX Rider Graphic',
    headline: 'BMX Crewneck Sweatshirt',
    subline: 'Shop now · $39.99',
    href: `${STORE}/25013632`,
    label: 'MERCH',
    isMerch: true,
    objectPosition: 'center center',
  },
  {
    imageUrl: `${BASE}/send-it-toddler-tee.png`,
    alt: "Toddler Tee Neon SEND IT Skate Skull Shirt",
    headline: "SEND IT Toddler Tee",
    subline: 'Shop now · $21.99',
    href: `${STORE}/24978460`,
    label: 'MERCH',
    isMerch: true,
    objectPosition: 'center center',
  },
  {
    imageUrl: `${BASE}/denver-grands-tee.png`,
    alt: 'BMX Denver GRANDS T-Shirt – Retro Red White & Blue Riders',
    headline: 'BMX Denver GRANDS Tee',
    subline: 'Shop now · $24.99',
    href: `${STORE}/25218973`,
    label: 'MERCH',
    isMerch: true,
    objectPosition: 'center center',
  },
];
