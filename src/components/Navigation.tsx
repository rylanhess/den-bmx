'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  FlagIcon,
  HeartIcon,
  EnvelopeIcon,
  ShoppingBagIcon,
  BoltIcon,
  HomeIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  MapPinIcon,
} from '@heroicons/react/24/solid';

const navItems = [
  { href: '/', label: 'HOME', icon: HomeIcon },
  { href: '/denver-bmx-races', label: 'CALENDAR', icon: CalendarIcon },
  { href: '/bmx-tracks-denver', label: 'RACE', icon: FlagIcon },
  { href: '/bmx-parks-denver', label: 'FIND', icon: MapPinIcon },
  { href: '/kids-bmx-denver', label: 'NEW RIDER', icon: BoltIcon },
  { href: '/volunteer-bmx-denver', label: 'VOLUNTEER', icon: HeartIcon },
  { href: '/track-pack', label: 'TRACK PACK', icon: ArrowDownTrayIcon },
  { href: '/denver-bmx-merch', label: 'MERCH', icon: ShoppingBagIcon },
  { href: '/contact', label: 'CONTACT', icon: EnvelopeIcon },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Navigation - Tag-like Header */}
      <nav className="md:hidden bg-black/95 backdrop-blur-sm border-b border-[#00ff0c]/30 sticky top-0 z-50 shadow-lg">
        <div className="px-2 py-1.5">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isExternal = item.href.startsWith('http');
              
              const baseClasses = `
                flex items-center gap-1.5 px-2.5 py-1.5 rounded-full
                text-xs font-bold whitespace-nowrap
                transition-all duration-200
                active:scale-95
                flex-shrink-0
              `;
              
              const activeClasses = isActive 
                ? 'bg-[#00ff0c] text-black shadow-[0_0_8px_rgba(0,255,12,0.5)]' 
                : 'bg-black/80 text-[#00ff0c] border border-[#00ff0c]/40 hover:border-[#00ff0c] hover:bg-[#00ff0c]/10';
              
              if (isExternal) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${baseClasses} ${activeClasses}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </a>
                );
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${baseClasses} ${activeClasses}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop Navigation - Horizontal */}
      <nav className="hidden md:block border-b-4 border-[#00ff0c] bg-black sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-2 lg:px-4">
          <div className="flex items-center gap-1 lg:gap-2 py-2 lg:py-3">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 mr-2 lg:mr-4 hover:opacity-80 transition-opacity">
              <Image
                src="/logos/DEN_BMX_FINAL_Green.png"
                alt="DEN BMX Logo"
                width={60}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>
            {/* Navigation items - equal width, spread across */}
            <div className="flex items-center flex-1 gap-1 lg:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isExternal = item.href.startsWith('http');
                
                if (isExternal) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        flex-1 flex flex-col items-center justify-center gap-0.5 lg:gap-1
                        py-2 lg:py-3 px-1 lg:px-2 border-2 border-[#00ff0c] rounded-lg
                        font-black
                        transition-all duration-200
                        hover:bg-[#00ff0c] hover:text-black
                        active:scale-95
                        bg-black text-[#00ff0c]
                      `}
                    >
                      <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span className="text-[10px] lg:text-xs xl:text-sm whitespace-nowrap leading-tight">{item.label}</span>
                    </a>
                  );
                }
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex-1 flex flex-col items-center justify-center gap-0.5 lg:gap-1
                      py-2 lg:py-3 px-1 lg:px-2 border-2 border-[#00ff0c] rounded-lg
                      font-black
                      transition-all duration-200
                      hover:bg-[#00ff0c] hover:text-black
                      active:scale-95
                      ${isActive ? 'bg-[#00ff0c] text-black' : 'bg-black text-[#00ff0c]'}
                    `}
                  >
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="text-[10px] lg:text-xs xl:text-sm whitespace-nowrap leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

