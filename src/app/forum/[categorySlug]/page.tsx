import { notFound } from 'next/navigation';
import { getCategoryBySlug, getThreadsByCategory, getCategoryPostCount } from '@/lib/forum';
import { getCurrentUser } from '@/lib/auth';
import ThreadTable from '@/components/forum/ThreadTable';
import NewThreadForm from '@/components/forum/NewThreadForm';
import BreadcrumbNav from '@/components/forum/BreadcrumbNav';
import MarkBoardSeen from '@/components/forum/MarkBoardSeen';
import BoardSubscribeButton from '@/components/forum/BoardSubscribeButton';
import { trackBoardDisplayName } from '@/lib/userPreferences';
import ColoradoContentLayout from '@/components/ads/ColoradoContentLayout';

interface Props {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  return { title: category?.name ?? 'Forum' };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categorySlug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));

  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const user = await getCurrentUser();
  const { threads, count } = await getThreadsByCategory(category.id, page);
  const postCount = await getCategoryPostCount(category.id);
  const totalPages = Math.ceil(count / 25);

  const replyCount = Math.max(0, postCount - count);

  return (
    <ColoradoContentLayout className="py-8">
      <MarkBoardSeen categoryId={category.id} isLoggedIn={!!user} />
      <BreadcrumbNav
        items={[
          { label: 'Forum', href: '/forum' },
          { label: trackBoardDisplayName(category.name) },
        ]}
      />

      <h1 className="text-2xl font-black text-[#00ff0c] mb-1">{trackBoardDisplayName(category.name)}</h1>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <p className="text-gray-500 text-sm">
          {count} post{count !== 1 ? 's' : ''} · {replyCount} repl{replyCount !== 1 ? 'ies' : 'y'} in threads
        </p>
        <BoardSubscribeButton
          categoryId={category.id}
          boardName={trackBoardDisplayName(category.name)}
        />
      </div>
      {category.description && (
        <p className="text-gray-400 text-sm mb-6">{category.description}</p>
      )}

      <NewThreadForm categoryId={category.id} categorySlug={categorySlug} />
      <ThreadTable threads={threads} categorySlug={categorySlug} />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/forum/${categorySlug}?page=${p}`}
              className={`px-3 py-1 rounded font-bold text-sm ${
                p === page
                  ? 'bg-[#00ff0c] text-black'
                  : 'border border-[#00ff0c]/40 text-[#00ff0c] hover:bg-[#00ff0c]/10'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </ColoradoContentLayout>
  );
}
