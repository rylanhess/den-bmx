import { notFound } from 'next/navigation';
import { getCategoryBySlug, getThread, getPostsByThread } from '@/lib/forum';
import PostList from '@/components/forum/PostList';
import ReplyForm from '@/components/forum/ReplyForm';
import BreadcrumbNav from '@/components/forum/BreadcrumbNav';

interface Props {
  params: Promise<{ categorySlug: string; threadId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { threadId } = await params;
  const thread = await getThread(threadId);
  return { title: thread?.title ?? 'Thread' };
}

export default async function ThreadPage({ params }: Props) {
  const { categorySlug, threadId } = await params;

  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const thread = await getThread(threadId);
  if (!thread || thread.category_id !== category.id) notFound();

  const { posts } = await getPostsByThread(threadId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <BreadcrumbNav
        items={[
          { label: 'Forum', href: '/forum' },
          { label: category.name, href: `/forum/${categorySlug}` },
          { label: thread.title },
        ]}
      />

      <div className="mb-6">
        <div className="flex items-start gap-2">
          {thread.is_pinned && <span className="text-[#00ff0c] text-xs font-black">PINNED</span>}
          {thread.is_system && (
            <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-0.5 rounded font-bold">FACEBOOK</span>
          )}
          {thread.is_locked && <span className="text-gray-500 text-xs">🔒 LOCKED</span>}
        </div>
        <h1 className="text-2xl font-black text-white mt-1">{thread.title}</h1>
      </div>

      <PostList posts={posts} />

      <div className="mt-6">
        <ReplyForm threadId={threadId} isLocked={thread.is_locked} />
      </div>
    </div>
  );
}
