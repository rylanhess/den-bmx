import Link from 'next/link';
import { formatRelativeDate } from '@/lib/forum';

interface CategoryStat {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  track_id: string | null;
  thread_count: number;
  latest_thread_title: string | null;
  latest_post_at: string | null;
}

export default function CategoryTable({ categories }: { categories: CategoryStat[] }) {
  const general = categories.filter((c) => !c.track_id);
  const trackComms = categories.filter((c) => c.track_id);

  return (
    <div className="space-y-8">
      <CategorySection title="Discussion Boards" categories={general} />
      <CategorySection title="Track Communications" categories={trackComms} />
    </div>
  );
}

function CategorySection({ title, categories }: { title: string; categories: CategoryStat[] }) {
  if (categories.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-black text-[#00ff0c] mb-3 uppercase tracking-wide">{title}</h2>
      <div className="border-2 border-[#00ff0c]/30 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00ff0c]/10 border-b border-[#00ff0c]/30">
              <th className="text-left px-4 py-3 font-black text-[#00ff0c]">Board</th>
              <th className="text-center px-4 py-3 font-black text-[#00ff0c] hidden sm:table-cell">Topics</th>
              <th className="text-left px-4 py-3 font-black text-[#00ff0c] hidden md:table-cell">Last Post</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-[#00ff0c]/10 hover:bg-[#00ff0c]/5 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/forum/${cat.slug}`} className="font-bold text-white hover:text-[#00ff0c] transition-colors">
                    {cat.name}
                  </Link>
                  {cat.description && (
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{cat.description}</p>
                  )}
                </td>
                <td className="text-center px-4 py-3 text-gray-400 hidden sm:table-cell">
                  {cat.thread_count}
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
