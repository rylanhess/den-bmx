import AdSlot from '@/components/ads/AdSlot';
import { hydrateAdSlots } from '@/lib/communityAds';
import type { AdSlotConfig } from '@/lib/adSpaces';

interface ColoradoMobileAdProps {
  slot: AdSlotConfig;
  className?: string;
}

/** Full-width mid-roll ad shown on mobile/tablet only — same banner slot as the top strip. */
export default function ColoradoMobileAd({ slot, className = '' }: ColoradoMobileAdProps) {
  const [hydrated] = hydrateAdSlots([slot]);

  return (
    <div className={`co-mobile-midroll co-ad-slot-banner lg:hidden ${className}`} aria-label="Advertising">
      <AdSlot
        id={hydrated.id}
        size="banner"
        content={hydrated.content}
        carousel={hydrated.carousel}
        className="h-full min-h-[var(--co-banner-height)] w-full"
      />
    </div>
  );
}
