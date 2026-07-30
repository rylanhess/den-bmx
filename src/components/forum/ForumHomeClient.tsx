'use client';

import Link from 'next/link';
import CategoryTable, { type CategoryStat } from '@/components/forum/CategoryTable';
import ForumWelcomeModal from '@/components/forum/ForumWelcomeModal';
import TrackBoardGrid from '@/components/forum/TrackBoardGrid';
import { FORUM_TAGLINE, parsePreferences, type UserPreferences } from '@/lib/userPreferences';

interface ForumHomeClientProps {
  categories: CategoryStat[];
  isLoggedIn: boolean;
  serverPreferences?: unknown;
}

export default function ForumHomeClient({
  categories,
  isLoggedIn,
  serverPreferences,
}: ForumHomeClientProps) {
  const preferences: UserPreferences = parsePreferences(serverPreferences);
  const trackBoards = categories.filter((c) => c.track_id);
  const general = categories.filter((c) => !c.track_id);

  return (
    <>
      <ForumWelcomeModal />

      {!isLoggedIn && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-2 border-[#00ff0c]/30 rounded-lg px-4 py-3 bg-[#00ff0c]/5">
          <p className="text-gray-300 text-sm">Browsing as guest — sign in to post and reply.</p>
          <div className="flex gap-2 shrink-0">
            <Link
              href="/signup"
              className="px-4 py-2 bg-[#00ff0c] text-black font-black text-sm rounded hover:bg-[#00cc0a]"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 border-2 border-[#00ff0c] text-[#00ff0c] font-bold text-sm rounded hover:bg-[#00ff0c]/10"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#00ff0c] leading-tight">
            {FORUM_TAGLINE}
          </h1>
          <p className="text-gray-400 mt-2 text-sm max-w-xl">
            Colorado&apos;s home for BMX racing talk — track boards, race strategy, and rider community.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href="/tracks"
            className="px-4 py-2 border-2 border-[#00ff0c] text-[#00ff0c] font-bold text-sm rounded hover:bg-[#00ff0c]/10 transition-colors"
          >
            TRACKS
          </Link>
          <Link
            href="https://store.bmxdenver.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border-2 border-[#00ff0c] text-[#00ff0c] font-bold text-sm rounded hover:bg-[#00ff0c]/10 transition-colors"
          >
            MERCH
          </Link>
        </div>
      </div>

      <TrackBoardGrid
        categories={trackBoards}
        initialPreferences={preferences}
        isLoggedIn={isLoggedIn}
      />

      <CategoryTable categories={general} />
    </>
  );
}
