'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { FORUM_TAGLINE, WELCOME_SEEN_KEY } from '@/lib/userPreferences';

export default function ForumWelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(WELCOME_SEEN_KEY)) return;
    const t = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="w-full max-w-md border-2 border-[#00ff0c] rounded-xl bg-black shadow-2xl shadow-[#00ff0c]/10 p-6 sm:p-8">
        <div className="flex justify-center mb-4">
          <Image
            src="/logos/BMX_CO_MARK.png"
            alt="BMX Colorado"
            width={180}
            height={116}
            className="h-16 w-auto"
            priority
          />
        </div>
        <p className="text-[#00ff0c] text-xs font-black uppercase tracking-widest mb-2 text-center">
          BMX Colorado
        </p>
        <h2 id="welcome-title" className="text-2xl sm:text-3xl font-black text-white leading-tight text-center">
          {FORUM_TAGLINE}
        </h2>
        <p className="text-gray-400 text-sm mt-3 leading-relaxed text-center">
          Track talk, race chatter, and community boards for every Colorado BMX track. Create a free profile to post, or browse as a guest.
        </p>

        <div className="flex flex-col gap-2 mt-6">
          <GoogleSignInButton label="Continue with Google" onStart={dismiss} />
          <Link
            href="/signup"
            onClick={dismiss}
            className="w-full py-3 bg-[#00ff0c] text-black font-black text-center rounded hover:bg-[#00cc0a] transition-colors"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            onClick={dismiss}
            className="w-full py-3 border-2 border-[#00ff0c] text-[#00ff0c] font-bold text-center rounded hover:bg-[#00ff0c]/10 transition-colors"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="w-full py-2 text-gray-500 text-sm font-bold hover:text-gray-300 transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
