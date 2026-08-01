'use client';

import Link from 'next/link';
import { coChipLink, coPrimaryChip } from '@/lib/coloradoUi';

export default function GuestPostPrompt({ action = 'post' }: { action?: string }) {
  return (
    <div className="border-2 border-[#00ff0c]/30 rounded-lg p-6 text-center bg-[#00ff0c]/5">
      <p className="text-gray-500 mb-4">
        Sign in or create an account to {action}.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/signup" className={coPrimaryChip}>
          Create Account
        </Link>
        <Link href="/login" className={coChipLink}>
          Sign In
        </Link>
      </div>
    </div>
  );
}
