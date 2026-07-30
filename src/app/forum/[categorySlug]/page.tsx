import { notFound } from 'next/navigation';
import { getCategoryBySlug, getThreadsByCategory, getCategoryPostCount } from '@/lib/forum';
import ThreadTable from '@/components/forum/ThreadTable';
import NewThreadForm from '@/components/forum/NewThreadForm';
import BreadcrumbNav from '@/components/forum/BreadcrumbNav';

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

  const { threads, count } = await getThreadsByCategory(category.id, page);
  const postCount = await getCategoryPostCount(category.id);
  const totalPages = Math.ceil(count / 25);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <BreadcrumbNav
        items={[
          { label: 'Forum', href: '/forum' },
          { label: category.name },
        ]}
      />

      <h1 className="text-2xl font-black text-[#00ff0c] mb-1">{category.name.replace(' — Track Comms', '')}</h1>
      <p className="text-gray-500 text-sm mb-2">
        {count} topic{count !== 1 ? 's' : ''} · {postCount} post{postCount !== 1 ? 's' : ''}
      </p>
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
    </div>
  );
}
