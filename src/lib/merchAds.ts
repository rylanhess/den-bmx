import type { CommunitySlide } from '@/lib/adSpaces';

const BASE = '/ads/merch';
const STORE = 'https://store.bmxdenver.com/product';

/** BMX Denver store product ads — linked to live merch listings. */
export const merchAdSlides: CommunitySlide[] = [
  {
    imageUrl: `${BASE}/colorado-bmx-tee-grey.png`,
    alt: 'Colorado BMX T-Shirt — Retro State Flag Logo Tee in Grey',
    headline: 'Colorado BMX Tee',
    subline: 'Shop now · $36.02',
    href: `${STORE}/30597476`,
    label: 'MERCH',
    isMerch: true,
    objectPosition: 'center center',
  },
  {
    imageUrl: `${BASE}/colorado-bmx-tee-olive.png`,
    alt: 'Colorado BMX T-Shirt — Retro State Flag Logo Tee in Olive',
    headline: 'Colorado BMX Tee',
    subline: 'Shop now · $36.02',
    href: `${STORE}/30597476`,
    label: 'MERCH',
    isMerch: true,
    objectPosition: 'center 20%',
  },
  {
    imageUrl: `${BASE}/colorado-bmx-tee-navy.png`,
    alt: 'Colorado BMX T-Shirt — Retro State Flag Logo Tee in Navy',
    headline: 'Colorado BMX Tee',
    subline: 'Shop now · $36.02',
    href: `${STORE}/30597476`,
    label: 'MERCH',
    isMerch: true,
    objectPosition: 'center center',
  },
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
