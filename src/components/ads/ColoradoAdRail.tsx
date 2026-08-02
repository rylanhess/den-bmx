import AdSlot from '@/components/ads/AdSlot';
import { hydrateAdSlots } from '@/lib/communityAds';
import type { AdSlotConfig } from '@/lib/adSpaces';

interface ColoradoAdRailProps {
  slots: AdSlotConfig[];
}

export default function ColoradoAdRail({ slots }: ColoradoAdRailProps) {
  const hydrated = hydrateAdSlots(slots);

  return (
    <aside className="co-ad-rail space-y-3" aria-label="Advertising">
      {hydrated.map((slot) => (
        <AdSlot
          key={slot.id}
          id={slot.id}
          size={slot.size}
          content={slot.content}
          carousel={slot.carousel}
        />
      ))}
    </aside>
  );
}
