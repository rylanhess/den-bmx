import Link from 'next/link';
import Image from 'next/image';
import CommunityAdCarousel from '@/components/ads/CommunityAdCarousel';
import { AD_CONTACT_PATH, type AdContent, type AdSlotSize, type CommunitySlide } from '@/lib/adSpaces';

interface AdSlotProps {
  id: string;
  size: AdSlotSize;
  content?: AdContent;
  carousel?: CommunitySlide[];
  className?: string;
}

const sizeStyles: Record<AdSlotSize, string> = {
  banner: 'min-h-[88px] sm:min-h-[96px]',
  rectangle: 'min-h-[200px] sm:min-h-[250px]',
  sidebar: 'min-h-[160px] sm:min-h-[200px]',
};

export default function AdSlot({
  id,
  size,
  content,
  carousel,
  className = '',
}: AdSlotProps) {
  if (carousel && carousel.length > 0) {
    return <CommunityAdCarousel id={id} size={size} className={className} />;
  }

  const base =
    'relative flex flex-col items-center justify-center rounded-none border-0 transition-colors overflow-hidden';

  if (content) {
    const isExternal = content.external ?? content.href.startsWith('http');
    const inner = (
      <>
        {content.label && (
          <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-wider text-[#002868]/60 bg-white/90 px-1.5 py-0.5 rounded">
            {content.label}
          </span>
        )}
        {content.imageUrl ? (
          <div className="relative w-full h-full flex-1 min-h-[inherit]">
            <Image
              src={content.imageUrl}
              alt={content.alt ?? 'Advertisement'}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <span className="text-[#002868] font-bold text-sm px-4 text-center">{content.alt ?? 'Advertisement'}</span>
        )}
        {content.cta && (
          <span className="absolute bottom-2 right-2 text-xs font-black uppercase bg-[#BF0A30] text-white px-2 py-1 rounded">
            {content.cta}
          </span>
        )}
      </>
    );

    const filledClasses = `${base} bg-white group ${sizeStyles[size]} ${className}`;

    if (isExternal) {
      return (
        <a
          id={id}
          href={content.href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={filledClasses}
          aria-label={content.alt ?? 'Sponsored link'}
        >
          {inner}
        </a>
      );
    }

    return (
      <Link id={id} href={content.href} className={filledClasses} aria-label={content.alt ?? 'Sponsored link'}>
        {inner}
      </Link>
    );
  }

  return (
    <div
      id={id}
      className={`${base} bg-[#002868]/[0.03] hover:bg-[#BF0A30]/[0.04] ${sizeStyles[size]} ${className}`}
      role="complementary"
      aria-label="Available advertising space"
    >
      <span className="text-[10px] font-black uppercase tracking-widest text-[#002868]/50 mb-1">Ad Space</span>
      <Link
        href={AD_CONTACT_PATH}
        className="text-xs sm:text-sm font-bold text-[#002868] hover:text-[#BF0A30] transition-colors text-center px-3 leading-snug min-h-0 min-w-0"
      >
        Want your ad here? Contact me →
      </Link>
    </div>
  );
}
