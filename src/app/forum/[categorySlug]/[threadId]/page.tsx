import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategoryBySlug, getThread, getPostsByThread } from '@/lib/forum';
import { getCurrentUser } from '@/lib/auth';
import { canPinForumPost } from '@/lib/forumPermissions';
import { createClient } from '@/lib/supabase/server';
import PostList from '@/components/forum/PostList';
import ReplyForm from '@/components/forum/ReplyForm';
import BreadcrumbNav from '@/components/forum/BreadcrumbNav';
import PinPostButton from '@/components/forum/PinPostButton';
import PinnedPostIcon from '@/components/forum/PinnedPostIcon';
import JsonLd from '@/components/JsonLd';
import { trackBoardDisplayName } from '@/lib/userPreferences';
import { discussionThreadJsonLd } from '@/lib/structuredData';
import { coloradoOgImage } from '@/lib/siteMetadata';
import ColoradoContentLayout from '@/components/ads/ColoradoContentLayout';

interface Props {
  params: Promise<{ categorySlug: string; threadId: string }>;
}

function excerpt(body: string | null | undefined, max = 160): string | null {
  const clean = body?.replace(/\s+/g, ' ').trim();
  if (!clean) return null;
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, threadId } = await params;
  const thread = await getThread(threadId);
  if (!thread) return { title: 'Thread' };

  const supabase = await createClient();
  const { data: firstPost } = await supabase
    .from('forum_posts')
    .select('body')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  const boardName = thread.category ? trackBoardDisplayName(thread.category.name) : 'Forum';
  const description =
    excerpt(firstPost?.body) ?? `${thread.title} — discussion in ${boardName} on BMX Colorado.`;

  return {
    title: thread.title,
    description,
    openGraph: {
      title: `${thread.title} - BMX Colorado`,
      description,
      url: `/forum/${categorySlug}/${threadId}`,
      siteName: 'BMX Colorado',
      locale: 'en_US',
      type: 'article',
      publishedTime: thread.created_at,
      modifiedTime: thread.last_post_at,
      images: coloradoOgImage(thread.title),
    },
  };
}

export default async function ThreadPage({ params }: Props) {
  const { categorySlug, threadId } = await params;

  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const thread = await getThread(threadId);
  if (!thread || thread.category_id !== category.id) notFound();

  const { posts } = await getPostsByThread(threadId);
  const currentUser = await getCurrentUser();

  let isTrackModerator = false;
  if (currentUser?.user && thread.track_id) {
    const supabase = await createClient();
    const { data: modRow } = await supabase
      .from('track_moderators')
      .select('user_id')
      .eq('user_id', currentUser.user.id)
      .eq('track_id', thread.track_id)
      .maybeSingle();
    isTrackModerator = !!modRow;
  }

  const canPin = canPinForumPost(currentUser?.profile, isTrackModerator);
  const isTrackBoard = !!thread.track_id;

  return (
    <ColoradoContentLayout className="py-8">
      <JsonLd
        data={discussionThreadJsonLd({
          threadId,
          categorySlug,
          title: thread.title,
          boardName: trackBoardDisplayName(category.name),
          createdAt: thread.created_at,
          lastPostAt: thread.last_post_at,
          replyCount: thread.reply_count,
          authorName: posts[0]?.author?.display_name ?? thread.author?.display_name,
          text: excerpt(posts[0]?.body, 500),
        })}
      />
      <BreadcrumbNav
        items={[
          { label: 'Forum', href: '/forum' },
          { label: trackBoardDisplayName(category.name), href: `/forum/${categorySlug}` },
          { label: thread.title },
        ]}
      />

      <div className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 min-w-0">
            {thread.is_pinned && isTrackBoard && (
              <PinnedPostIcon className="w-5 h-5 text-[#00ff0c] shrink-0 mt-0.5" title="Pinned" />
            )}
            {thread.is_pinned && !isTrackBoard && (
              <span className="text-[#00ff0c] text-xs font-black shrink-0">PINNED</span>
            )}
            {thread.is_system && (
              <span className="bg-[#00ff0c]/20 text-[#00ff0c] text-xs px-2 py-0.5 rounded font-bold shrink-0 leading-none inline-flex items-center">
                SOCIAL
              </span>
            )}
            {thread.is_locked && <span className="text-gray-500 text-xs shrink-0">🔒 LOCKED</span>}
          </div>
          {isTrackBoard && (
            <PinPostButton threadId={threadId} isPinned={thread.is_pinned} canPin={canPin} />
          )}
        </div>
        <h1 className="text-2xl font-black text-white mt-1">{thread.title}</h1>
      </div>

      <PostList
        posts={posts}
        boardName={trackBoardDisplayName(category.name)}
      />

      <div className="mt-6">
        <ReplyForm threadId={threadId} isLocked={thread.is_locked} />
      </div>
    </ColoradoContentLayout>
  );
}
