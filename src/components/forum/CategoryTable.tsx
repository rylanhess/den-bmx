import Link from 'next/link';
import NewBadge from '@/components/forum/NewBadge';
import { formatRelativeDate } from '@/lib/forumFormat';
import { hasRecentBoardActivity } from '@/lib/recentPostWindow';

export interface CategoryStat {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  track_id: string | null;
  created_at: string;
  thread_count: number;
  post_count: number;
  new_post_count?: number;
  latest_thread_title: string | null;
  latest_post_at: string | null;
}

interface CategoryTableProps {
  categories: CategoryStat[];
  title?: string;
  subtitle?: string;
  /** When true (default), only discussion boards. Set false for full table preview (e.g. auth blur). */
  discussionOnly?: boolean;
}

export default function CategoryTable({
  categories,
  title = 'Discussion Boards',
  subtitle,
  discussionOnly = true,
}: CategoryTableProps) {
  if (discussionOnly) {
    return (
      <CategorySection title={title} subtitle={subtitle} categories={categories} />
    );
  }

  const trackBoards = categories.filter((c) => c.track_id);
  const general = categories.filter((c) => !c.track_id);

  return (
    <div className="space-y-8">
      <CategorySection title="Track Message Boards" categories={trackBoards} />
      <CategorySection title="Discussion Boards" categories={general} />
    </div>
  );
}

function CategorySection({
  title,
  subtitle,
  categories,
}: {
  title: string;
  subtitle?: string;
  categories: CategoryStat[];
}) {
  if (categories.length === 0) return null;

  return (
    <div>
      <h2 className="font-black text-[#00ff0c] uppercase tracking-wide text-lg">
        {title}
      </h2>
      {subtitle && <p className="text-gray-500 text-xs mt-0.5 mb-3">{subtitle}</p>}
      {!subtitle && <div className="mb-3" />}
      <div className="border-2 border-[#00ff0c]/30 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00ff0c]/10 border-b border-[#00ff0c]/30">
              <th className="text-left px-4 py-3 font-black text-[#00ff0c]">Board</th>
              <th className="text-center px-4 py-3 font-black text-[#00ff0c] hidden sm:table-cell">Posts</th>
              <th className="text-center px-4 py-3 font-black text-[#00ff0c] hidden sm:table-cell">Replies</th>
              <th className="text-left px-4 py-3 font-black text-[#00ff0c] hidden md:table-cell">Last Post</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-[#00ff0c]/10 hover:bg-[#00ff0c]/5 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/forum/${cat.slug}`}
                    className="co-text-link font-bold text-white hover:text-[#00ff0c] transition-colors leading-snug inline"
                  >
                    {cat.name}
                    {hasRecentBoardActivity(cat.latest_post_at) && (
                      <>
                        {' '}
                        <NewBadge />
                      </>
                    )}
                  </Link>
                  {cat.description && (
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{cat.description}</p>
                  )}
                </td>
                <td className="text-center px-4 py-3 text-gray-400 hidden sm:table-cell">
                  {cat.thread_count}
                </td>
                <td className="text-center px-4 py-3 text-gray-400 hidden sm:table-cell">
                  {Math.max(0, cat.post_count - cat.thread_count)}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {cat.latest_thread_title ? (
                    <div>
                      <p className="text-gray-300 text-xs line-clamp-1">{cat.latest_thread_title}</p>
                      <p className="text-gray-500 text-xs">{formatRelativeDate(cat.latest_post_at!)}</p>
                    </div>
                  ) : (
                    <span className="text-gray-600 text-xs">No posts yet</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
