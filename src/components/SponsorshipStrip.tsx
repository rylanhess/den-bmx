'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Configuration for the sponsorship strip
// To switch to a sponsor, update this configuration
const sponsorshipConfig = {
  type: 'merchandise' as 'merchandise' | 'sponsor',
  
  // Featured merchandise items - randomly selected on each page load
  featuredItems: [
    {
      image: '/BMX_sweatshirt.jpg',
      alt: 'BMX Crewneck Sweatshirt',
      link: 'https://store.bmxdenver.com',
      cta: 'SHOP NOW',
      label: 'FEATURED MERCH',
    },
    {
      image: '/bmx-denver-hoodie-mountain-gear-logo-fleece-pullover.jpg',
      alt: 'BMX Denver Hoodie',
      link: 'https://store.bmxdenver.com',
      cta: 'SHOP NOW',
      label: 'FEATURED MERCH',
    },
    {
      image: '/DEN_BMX_tshirt.jpg',
      alt: 'DEN BMX T-Shirt',
      link: 'https://store.bmxdenver.com',
      cta: 'SHOP NOW',
      label: 'FEATURED MERCH',
    },
    {
      image: '/sendit_kid.jpg',
      alt: 'Send It Kid Tee',
      link: 'https://store.bmxdenver.com',
      cta: 'SHOP NOW',
      label: 'FEATURED MERCH',
    },
  ],
  
  // Sponsor configuration (for future use)
  sponsor: {
    logo: '/logos/DEN_BMX_FINAL_Green.png', // Replace with sponsor logo
    alt: 'Sponsor Name',
    link: 'https://example.com', // Replace with sponsor URL
    cta: 'VISIT WEBSITE', // Optional CTA text
    label: 'PRESENTED BY', // Can be customized
  },
};

export default function SponsorshipStrip() {
  const [selectedItem, setSelectedItem] = useState(sponsorshipConfig.featuredItems[0]);

  // Randomly select a featured item on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sponsorshipConfig.featuredItems.length);
    setSelectedItem(sponsorshipConfig.featuredItems[randomIndex]);
  }, []);

  return (
    <div className="bg-black border-b-2 border-[#00ff0c]/40 sticky z-40 shadow-sm md:top-[64px] top-[48px]">
      <div className="container mx-auto px-4">
        <Link
          href={sponsorshipConfig.type === 'merchandise' ? selectedItem.link : sponsorshipConfig.sponsor.link}
          target={(sponsorshipConfig.type === 'merchandise' ? selectedItem.link : sponsorshipConfig.sponsor.link).startsWith('http') ? '_blank' : undefined}
          rel={(sponsorshipConfig.type === 'merchandise' ? selectedItem.link : sponsorshipConfig.sponsor.link).startsWith('http') ? 'noopener noreferrer' : undefined}
          className="flex items-center justify-center gap-3 sm:gap-4 py-2 sm:py-2.5 hover:bg-[#00ff0c]/5 transition-colors group"
        >
          {/* Label */}
          <span className="text-[#00ff0c] font-black text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap">
            {sponsorshipConfig.type === 'merchandise' ? selectedItem.label : sponsorshipConfig.sponsor.label}
          </span>
          
          {/* Divider */}
          <div className="h-4 w-px bg-[#00ff0c]/40"></div>
          
          {/* Image/Logo */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 border-2 border-[#00ff0c]/40 rounded group-hover:border-[#00ff0c] transition-colors overflow-hidden">
            {sponsorshipConfig.type === 'merchandise' ? (
              <Image
                src={selectedItem.image}
                alt={selectedItem.alt}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <Image
                src={sponsorshipConfig.sponsor.logo}
                alt={sponsorshipConfig.sponsor.alt}
                fill
                className="object-contain p-1"
                unoptimized
              />
            )}
          </div>
          
          {/* CTA Text */}
          <span className="text-white font-bold text-xs sm:text-sm group-hover:text-[#00ff0c] transition-colors whitespace-nowrap">
            {sponsorshipConfig.type === 'merchandise' ? selectedItem.cta : sponsorshipConfig.sponsor.cta}
          </span>
          
          {/* Arrow icon */}
          <svg 
            className="w-4 h-4 text-[#00ff0c] group-hover:translate-x-1 transition-transform flex-shrink-0" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

