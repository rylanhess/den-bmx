'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdCycle } from '@/components/ads/AdCycleProvider';
import { fullAdPool } from '@/lib/communityAds';
import type { AdSlotSize } from '@/lib/adSpaces';

interface CommunityAdCarouselProps {
  id: string;
  size: AdSlotSize;
  className?: string;
}

const sizeStyles: Record<AdSlotSize, string> = {
  banner: 'min-h-[88px] sm:min-h-[96px]',
  rectangle: 'min-h-[200px] sm:min-h-[250px]',
  sidebar: 'min-h-[160px] sm:min-h-[200px]',
};

export default function CommunityAdCarousel({
  id,
  size,
  className = '',
}: CommunityAdCarouselProps) {
  const cycle = useAdCycle(id);
  const slideIndex = cycle ? cycle.getSlideIndex(id) : 0;
  const slide = fullAdPool[slideIndex] ?? fullAdPool[0];
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!cycle) return;

    if (cycle.activeSlotId !== id) {
      setVisible(true);
      return;
    }

    setVisible(false);
    const fadeTimer = window.setTimeout(() => setVisible(true), 280);
    return () => {
      clearTimeout(fadeTimer);
      setVisible(true);
    };
  }, [cycle?.cycleGeneration, cycle?.activeSlotId, id, cycle]);

  const isCta = slide.isCta;
  const isMerch = slide.isMerch;
  const isBanner = size === 'banner';

  const visibility = visible ? 'opacity-100' : 'opacity-0';

  const label = slide.label && !isCta && (
    <span className="co-ad-label absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10">
      {slide.label}
    </span>
  );

  const photoCaption = (
    <div className={`co-ad-caption co-ad-caption-photo${isBanner ? ' co-ad-caption-banner' : ''}`}>
      <p className={`co-ad-headline ${isBanner ? 'line-clamp-1' : 'line-clamp-2'}`}>{slide.headline}</p>
      {slide.subline && (
        <p className={`co-ad-subline ${isBanner ? 'line-clamp-1' : ''}`}>{slide.subline}</p>
      )}
    </div>
  );

  const merchFooter = (
    <div className={`co-ad-merch-footer${isBanner ? ' co-ad-merch-footer-banner' : ''}`}>
      <p className={`co-ad-headline ${isBanner ? 'line-clamp-1' : 'line-clamp-2'}`}>{slide.headline}</p>
      {slide.subline && (
        <p className={`co-ad-subline ${isBanner ? 'line-clamp-1' : ''}`}>{slide.subline}</p>
      )}
    </div>
  );

  const ctaContent = (
    <div
      className={`co-ad-caption-cta absolute inset-0 flex flex-col items-center justify-center px-3 text-center ${
        isBanner ? 'py-1' : 'py-3'
      }`}
    >
      <p
        className={`font-black text-[#002868] leading-tight ${
          isBanner ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
        } ${isBanner ? 'line-clamp-1' : 'line-clamp-2'}`}
      >
        {slide.headline}
      </p>
      {slide.subline && (
        <p
          className={`font-black text-[#BF0A30] mt-1 group-hover:underline underline-offset-2 ${
            isBanner ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
          }`}
        >
          {slide.subline}
        </p>
      )}
    </div>
  );

  let frame: ReactNode;

  if (isCta) {
    frame = (
      <div
        className={`relative w-full h-full flex-1 min-h-[inherit] overflow-hidden rounded-none border-0 bg-white transition-opacity duration-300 ${visibility} ${sizeStyles[size]} ${className}`}
      >
        {ctaContent}
      </div>
    );
  } else if (isMerch) {
    frame = (
      <div
        className={`flex flex-col w-full h-full min-h-[inherit] overflow-hidden rounded-none border-0 bg-white transition-opacity duration-300 ${visibility} ${sizeStyles[size]} ${className}`}
      >
        <div className="relative flex-1 min-h-0 w-full">
          {slide.imageUrl && (
            <Image
              src={slide.imageUrl}
              alt={slide.alt}
              fill
              className="object-contain p-1 sm:p-1.5"
              style={{ objectPosition: slide.objectPosition ?? 'center center' }}
              unoptimized
              priority
            />
          )}
          {label}
        </div>
        {merchFooter}
      </div>
    );
  } else {
    frame = (
      <div
        className={`relative w-full h-full flex-1 min-h-[inherit] overflow-hidden rounded-none border-0 bg-gray-200 transition-opacity duration-300 ${visibility} ${sizeStyles[size]} ${className}`}
      >
        {slide.imageUrl && (
          <Image
            src={slide.imageUrl}
            alt={slide.alt}
            fill
            className="object-cover scale-105"
            style={{ objectPosition: slide.objectPosition ?? 'center center' }}
            unoptimized
            priority
          />
        )}
        {label}
        {photoCaption}
      </div>
    );
  }

  if (slide.href) {
    const isExternal = slide.href.startsWith('http');
    if (isExternal) {
      return (
        <a
          id={id}
          href={slide.href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block group min-h-[inherit] h-full w-full"
          aria-label={slide.alt}
        >
          {frame}
        </a>
      );
    }
    return (
      <Link id={id} href={slide.href} className="block group min-h-[inherit] h-full w-full" aria-label={slide.alt}>
        {frame}
      </Link>
    );
  }

  return (
    <div id={id} className="min-h-[inherit] h-full w-full" role="img" aria-label={slide.alt}>
      {frame}
    </div>
  );
}
