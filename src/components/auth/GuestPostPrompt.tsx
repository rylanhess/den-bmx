'use client';

import Link from 'next/link';

export default function GuestPostPrompt({ action = 'post' }: { action?: string }) {
  return (
    <div className="border-2 border-[#00ff0c]/30 rounded-lg p-6 text-center bg-[#00ff0c]/5">
      <p className="text-gray-300 mb-4">
        Sign in or create an account to {action}.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/signup"
          className="px-6 py-2 bg-[#00ff0c] text-black font-black rounded hover:bg-[#00cc0a] transition-colors"
        >
          CREATE ACCOUNT
        </Link>
        <Link
          href="/login"
          className="px-6 py-2 border-2 border-[#00ff0c] text-[#00ff0c] font-bold rounded hover:bg-[#00ff0c]/10 transition-colors"
        >
          SIGN IN
        </Link>
      </div>
    </div>
  );
}
