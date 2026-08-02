import AdSlot from '@/components/ads/AdSlot';
import { bannerAdSlots } from '@/lib/adSpaces';
import { hydrateAdSlots } from '@/lib/communityAds';

export default function ColoradoAdBanner() {
  const slots = hydrateAdSlots(bannerAdSlots);

  return (
    <aside
      className="co-ad-banner w-full border-b-2 border-[#D0D7E2] bg-[#f4f6f8] sticky z-40 overflow-hidden"
      aria-label="Advertising"
    >
      <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-0">
        {slots.map((slot, index) => (
          <div
            key={slot.id}
            className={`co-ad-slot-banner w-full ${index > 0 ? 'hidden sm:block' : ''}`}
          >
            <AdSlot
              id={slot.id}
              size={slot.size}
              content={slot.content}
              carousel={slot.carousel}
              className="h-full min-h-[var(--co-banner-height)] w-full"
            />
          </div>
        ))}
      </div>
    </aside>
  );
}
