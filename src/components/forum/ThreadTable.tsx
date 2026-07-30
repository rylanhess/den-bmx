import Link from 'next/link';
import { formatRelativeDate } from '@/lib/forum';
import UserProfileLink from '@/components/profile/UserProfileLink';
import type { ForumThread, Profile } from '@/lib/supabase';

interface ThreadWithAuthor extends ForumThread {
  author?: Profile;
}

export default function ThreadTable({
  threads,
  categorySlug,
}: {
  threads: ThreadWithAuthor[];
  categorySlug: string;
}) {
  if (threads.length === 0) {
    return (
      <div className="border-2 border-[#00ff0c]/30 rounded-lg p-8 text-center text-gray-400">
        No threads yet. Be the first to start a discussion!
      </div>
    );
  }

  return (
    <div className="border-2 border-[#00ff0c]/30 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#00ff0c]/10 border-b border-[#00ff0c]/30">
            <th className="text-left px-4 py-3 font-black text-[#00ff0c]">Topic</th>
            <th className="text-center px-4 py-3 font-black text-[#00ff0c] hidden sm:table-cell">Replies</th>
            <th className="text-center px-4 py-3 font-black text-[#00ff0c] hidden sm:table-cell">Posts</th>
            <th className="text-left px-4 py-3 font-black text-[#00ff0c] hidden md:table-cell">Author</th>
            <th className="text-right px-4 py-3 font-black text-[#00ff0c] hidden sm:table-cell">Last Post</th>
          </tr>
        </thead>
        <tbody>
          {threads.map((thread) => (
            <tr
              key={thread.id}
              className={`border-b border-[#00ff0c]/10 hover:bg-[#00ff0c]/5 transition-colors ${
                thread.is_pinned ? 'bg-[#00ff0c]/5' : ''
              }`}
            >
              <td className="px-4 py-3">
                <div className="flex items-start gap-2">
                  {thread.is_pinned && (
                    <span className="text-[#00ff0c] text-xs font-black shrink-0">PIN</span>
                  )}
                  {thread.is_system && (
                    <span className="bg-blue-900/50 text-blue-300 text-xs px-1.5 py-0.5 rounded font-bold shrink-0">
                      FB
                    </span>
                  )}
                  {thread.is_locked && (
                    <span className="text-gray-500 text-xs shrink-0">🔒</span>
                  )}
                  <Link
                    href={`/forum/${categorySlug}/${thread.id}`}
                    className="font-bold text-white hover:text-[#00ff0c] transition-colors"
                  >
                    {thread.title}
                  </Link>
                </div>
              </td>
              <td className="text-center px-4 py-3 text-gray-400 hidden sm:table-cell">
                {thread.reply_count}
              </td>
              <td className="text-center px-4 py-3 text-gray-400 hidden sm:table-cell">
                {thread.reply_count + 1}
              </td>
              <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                <UserProfileLink
                  userId={thread.author_id}
                  displayName={thread.author?.display_name ?? 'System'}
                />
              </td>
              <td className="text-right px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">
                {formatRelativeDate(thread.last_post_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
