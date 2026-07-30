'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  ShoppingBagIcon,
  EnvelopeIcon,
  UserCircleIcon,
  HomeIcon,
} from '@heroicons/react/24/solid';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

const publicNavItems = [
  { href: '/forum', label: 'FORUM', icon: ChatBubbleLeftRightIcon },
  { href: '/tracks', label: 'TRACKS', icon: MapPinIcon },
  { href: 'https://store.bmxdenver.com', label: 'MERCH', icon: ShoppingBagIcon, external: true },
  { href: '/contact', label: 'CONTACT', icon: EnvelopeIcon },
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
    <nav className="border-b-4 border-[#00ff0c] bg-black sticky top-0 z-50 shadow-2xl">
      <div className="container mx-auto px-2 lg:px-4">
        <div className="flex items-center gap-2 py-2 lg:py-3">
          <Link href="/forum" className="flex-shrink-0 mr-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logos/DEN_BMX_FINAL_Green.png"
              alt="BMX Colorado"
              width={60}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <span className="hidden sm:block font-black text-[#00ff0c] text-sm mr-2">BMX COLORADO</span>
          <div className="flex items-center flex-1 gap-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const base = `flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-black whitespace-nowrap transition-all flex-shrink-0 border-2`;
              const classes = isActive
                ? `${base} bg-[#00ff0c] text-black border-[#00ff0c]`
                : `${base} bg-black text-[#00ff0c] border-[#00ff0c]/40 hover:border-[#00ff0c]`;

              if (item.external) {
                return (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={classes}>
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </a>
                );
              }
              return (
                <Link key={item.href} href={item.href} className={classes}>
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-black whitespace-nowrap border-2 ${
                  pathname.startsWith('/admin')
                    ? 'bg-[#00ff0c] text-black border-[#00ff0c]'
                    : 'bg-black text-[#00ff0c] border-[#00ff0c]/40'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">ADMIN</span>
              </Link>
            )}
          </div>

          {/* Guest auth buttons — always visible top-right */}
          {!isLoggedIn && (
            <div className="flex items-center gap-1.5 shrink-0 ml-1">
              <Link
                href="/login"
                className="hidden sm:flex items-center px-2.5 py-2 rounded-lg text-xs font-bold border-2 border-[#00ff0c]/40 text-[#00ff0c] hover:border-[#00ff0c] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex items-center px-2.5 py-2 rounded-lg text-xs font-black bg-[#00ff0c] text-black hover:bg-[#00cc0a] transition-colors"
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
