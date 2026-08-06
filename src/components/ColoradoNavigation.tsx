'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  ShoppingBagIcon,
  EnvelopeIcon,
  UserCircleIcon,
  HomeIcon,
  ShareIcon,
} from '@heroicons/react/24/solid';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { CO_LOGO } from '@/lib/coloradoUi';

const publicNavItems = [
  { href: '/forum', label: 'FORUM', icon: ChatBubbleLeftRightIcon },
  { href: '/tracks', label: 'TRACKS', icon: MapPinIcon },
  { href: 'https://store.bmxdenver.com', label: 'MERCH', icon: ShoppingBagIcon, external: true },
  { href: '/contact?co=1', label: 'CONTACT', icon: EnvelopeIcon },
  { href: '/share', label: 'SHARE', icon: ShareIcon },
];
export default function ColoradoNavigation() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
      if (!user) return;
      supabase.from('profiles').select('role').eq('id', user.id).single().then(({ data }) => {
        if (data?.role === 'admin') setIsAdmin(true);
      });
    });
  }, [pathname]);

  const navItems = isLoggedIn
    ? [...publicNavItems, { href: '/account', label: 'ACCOUNT', icon: UserCircleIcon, external: false }]
    : publicNavItems;

  return (
    <nav className="co-day-nav border-b-4 border-[#FFC72C] bg-[#002868] sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-2 lg:px-4">
        <div className="co-nav-row flex items-center gap-2 py-1.5 lg:py-2 min-h-[44px]">
          <Link
            href="/forum"
            className="co-nav-logo flex shrink-0 items-center justify-center mr-1 hover:opacity-90 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CO_LOGO}
              alt="BMX Colorado"
              className="h-8 sm:h-9 w-auto object-contain object-center block"
            />
          </Link>
          <div className="flex items-center flex-1 gap-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href.split('?')[0] + '/') ||
              (item.href.startsWith('/contact') && pathname.startsWith('/contact'));
              const base =
                'co-nav-item inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 rounded-lg text-xs font-black leading-none whitespace-nowrap transition-all flex-shrink-0 border-2';
              const classes = isActive
                ? `${base} bg-[#BF0A30] text-white border-[#BF0A30]`
                : `${base} bg-transparent text-white border-white/30 hover:border-white hover:bg-white/10`;

              if (item.external) {
                return (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={classes}>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline relative -top-px">{item.label}</span>
                  </a>
                );
              }

              return (
                <Link key={item.href} href={item.href} className={classes}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline relative -top-px">{item.label}</span>
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className={`co-nav-item inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 rounded-lg text-xs font-black leading-none whitespace-nowrap border-2 ${
                  pathname.startsWith('/admin')
                    ? 'bg-[#BF0A30] text-white border-[#BF0A30]'
                    : 'bg-transparent text-white border-white/30 hover:border-white'
                }`}
              >
                <HomeIcon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline relative -top-px">ADMIN</span>
              </Link>
            )}
          </div>

          {!isLoggedIn && (
            <div className="flex items-center gap-1.5 shrink-0 ml-1">
              <Link
                href="/login"
                className="co-nav-item hidden sm:inline-flex items-center justify-center h-8 sm:h-9 px-2.5 rounded-lg text-xs font-bold leading-none border-2 border-white/40 text-white hover:border-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="co-nav-item inline-flex items-center justify-center h-8 sm:h-9 px-2.5 rounded-lg text-xs font-black leading-none bg-[#BF0A30] text-white hover:bg-[#9E0828] transition-colors border-2 border-[#BF0A30]"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
