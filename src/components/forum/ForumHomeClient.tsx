'use client';

import Link from 'next/link';
import DiscussionBoardsPanel from '@/components/forum/DiscussionBoardsPanel';
import ForumWelcomeModal from '@/components/forum/ForumWelcomeModal';
import TrackBoardGrid from '@/components/forum/TrackBoardGrid';
import RecentPostsSection from '@/components/forum/RecentPostsSection';
import EmailVerificationPrompt from '@/components/auth/EmailVerificationPrompt';
import { FORUM_TAGLINE, parsePreferences, type UserPreferences } from '@/lib/userPreferences';
import type { CategoryStat } from '@/components/forum/CategoryTable';
import type { RecentForumPost } from '@/lib/supabase';
import { coChipLink, coPrimaryChip } from '@/lib/coloradoUi';

interface ForumHomeClientProps {
  categories: CategoryStat[];
  recentPosts: RecentForumPost[];
  isLoggedIn: boolean;
  emailVerified?: boolean;
  userEmail?: string | null;
  serverPreferences?: unknown;
}

export default function ForumHomeClient({
  categories,
  recentPosts,
  isLoggedIn,
  emailVerified = false,
  userEmail,
  serverPreferences,
}: ForumHomeClientProps) {
  const preferences: UserPreferences = parsePreferences(serverPreferences);
  const trackBoards = categories.filter((c) => c.track_id);

  return (
    <>
      <ForumWelcomeModal />

      {isLoggedIn && !emailVerified && (
        <div className="mb-4">
          <EmailVerificationPrompt email={userEmail} action="post or start boards" />
        </div>
      )}

      {!isLoggedIn && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-2 border-[#00ff0c]/30 rounded-lg px-4 py-3 bg-[#00ff0c]/5">
          <p className="text-gray-300 text-sm">Browsing as guest — sign in to post and reply.</p>
          <div className="flex gap-2 shrink-0">
            <Link href="/signup" className={coPrimaryChip}>
              Create Account
            </Link>
            <Link href="/login" className={coChipLink}>
              Sign In
            </Link>
          </div>
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-black text-[#00ff0c] leading-tight mb-4">
        {FORUM_TAGLINE}
      </h1>

      <RecentPostsSection posts={recentPosts} />

      <TrackBoardGrid
        categories={trackBoards}
        initialPreferences={preferences}
        isLoggedIn={isLoggedIn}
      />

      <DiscussionBoardsPanel categories={categories} />
    </>
  );
}
