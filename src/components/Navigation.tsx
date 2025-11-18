'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FlagIcon,
  HeartIcon,
  EnvelopeIcon,
  ShoppingBagIcon,
  HandRaisedIcon,
  BoltIcon,
  HomeIcon,
} from '@heroicons/react/24/solid';

const navItems = [
  { href: '/', label: 'HOME', icon: HomeIcon },
  { href: '/tracks', label: 'TRACKS', icon: FlagIcon },
  { href: '/new-rider', label: 'NEW RIDER', icon: BoltIcon },
  { href: '/volunteer', label: 'VOLUNTEER', icon: HeartIcon },
  { href: '/shop', label: 'MERCH', icon: ShoppingBagIcon },
  { href: '/about', label: 'ABOUT', icon: HandRaisedIcon },
  { href: '/contact', label: 'CONTACT', icon: EnvelopeIcon },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation - Horizontal */}
      <nav className="hidden md:block border-b-4 border-[#00ff0c] bg-black sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-2 lg:px-4">
          <div className="flex items-center gap-1 lg:gap-2 py-2 lg:py-3">
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
                        py-2 lg:py-3 px-1 lg:px-2 border-2 border-[#00ff0c]
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
                      py-2 lg:py-3 px-1 lg:px-2 border-2 border-[#00ff0c]
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
        <div className="text-center pb-2">
          <p className="text-[#00ff0c] text-base sm:text-lg md:text-xl font-bold py-1 px-4 flex items-center justify-center gap-2">
            MILE HIGH • DACONO • COUNTY LINE • TWIN SILO
          </p>
        </div>
      </nav>

      {/* Mobile Navigation - Vertical (shown in page.tsx as action buttons) */}
      {/* This component only handles desktop nav */}
    </>
  );
}

