import { createClient } from '@/lib/supabase/server';
import { trackBoardDisplayName } from '@/lib/userPreferences';
import type { ForumCategory, ForumThread, ForumPost, Profile, RecentForumPost } from '@/lib/supabase';

type WithAuthorId = { author_id: string | null };

export async function attachAuthors<T extends WithAuthorId>(
  supabase: Awaited<ReturnType<typeof createClient>>,
  items: T[]
): Promise<(T & { author?: Pick<Profile, 'id' | 'display_name' | 'avatar_url'> })[]> {
  const ids = [...new Set(items.map((i) => i.author_id).filter(Boolean))] as string[];
  if (ids.length === 0) {
    return items.map((i) => ({ ...i, author: undefined }));
  }
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url')
    .in('id', ids);
  const map = new Map(profiles?.map((p) => [p.id, p]) ?? []);
  return items.map((i) => ({
    ...i,
    author: i.author_id ? map.get(i.author_id) : undefined,
  }));
}

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('forum_categories')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data as ForumCategory[];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('forum_categories')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data as ForumCategory;
}

export async function getThreadsByCategory(categoryId: string, page = 1, perPage = 25) {
  const supabase = await createClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabase
    .from('forum_threads')
    .select('*', { count: 'exact' })
    .eq('category_id', categoryId)
    .order('is_pinned', { ascending: false })
    .order('last_post_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  const threads = await attachAuthors(supabase, data ?? []);
  return { threads: threads as (ForumThread & { author?: Profile })[], count: count ?? 0 };
}

export async function getThread(threadId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('forum_threads')
    .select('*, category:forum_categories(*)')
    .eq('id', threadId)
    .single();
  if (error || !data) return null;
  const [withAuthor] = await attachAuthors(supabase, [data]);
  return withAuthor as ForumThread & { category?: ForumCategory; author?: Profile };
}

export async function getPostsByThread(threadId: string, page = 1, perPage = 20) {
  const supabase = await createClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabase
    .from('forum_posts')
    .select('*', { count: 'exact' })
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })
    .range(from, to);

  if (error) throw error;
  const posts = await attachAuthors(supabase, data ?? []);
  return { posts: posts as (ForumPost & { author?: Profile })[], count: count ?? 0 };
}

export async function getCategoryStats(options?: { boardLastSeen?: Record<string, string> }) {
  const boardLastSeen = options?.boardLastSeen ?? {};
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from('forum_categories')
    .select('id, slug, name, description, sort_order, track_id, created_at');

  if (!categories) return [];

  const stats = await Promise.all(
    categories.map(async (cat) => {
      const { count: threadCount } = await supabase
        .from('forum_threads')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id);

      const { data: threadIds } = await supabase
        .from('forum_threads')
        .select('id')
        .eq('category_id', cat.id);

      let postCount = 0;
      if (threadIds && threadIds.length > 0) {
        const ids = threadIds.map((t) => t.id);
        const { count } = await supabase
          .from('forum_posts')
          .select('*', { count: 'exact', head: true })
          .in('thread_id', ids);
        postCount = count ?? 0;
      }

      const { data: latest } = await supabase
        .from('forum_threads')
        .select('last_post_at, title')
        .eq('category_id', cat.id)
        .order('last_post_at', { ascending: false })
        .limit(1)
        .single();

      let newPostCount = 0;
      const lastSeen = boardLastSeen[cat.id];
      if (lastSeen && threadIds && threadIds.length > 0) {
        const ids = threadIds.map((t) => t.id);
        const { count: newCount } = await supabase
          .from('forum_posts')
          .select('*', { count: 'exact', head: true })
          .in('thread_id', ids)
          .gt('created_at', lastSeen);
        newPostCount = newCount ?? 0;
      }

      return {
        ...cat,
        thread_count: threadCount ?? 0,
        post_count: postCount,
        new_post_count: newPostCount,
        latest_thread_title: latest?.title ?? null,
        latest_post_at: latest?.last_post_at ?? null,
      };
    })
  );

  return stats.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getCategoryPostCount(categoryId: string) {
  const supabase = await createClient();
  const { data: threadIds } = await supabase
    .from('forum_threads')
    .select('id')
    .eq('category_id', categoryId);
  if (!threadIds?.length) return 0;
  const { count } = await supabase
    .from('forum_posts')
    .select('*', { count: 'exact', head: true })
    .in('thread_id', threadIds.map((t) => t.id));
  return count ?? 0;
}

export async function getRecentForumPosts(limit = 4): Promise<RecentForumPost[]> {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from('forum_posts')
    .select(
      `
      id,
      thread_id,
      body,
      fb_url,
      created_at,
      author_id,
      thread:forum_threads!inner (
        id,
        title,
        category:forum_categories!inner (
          slug,
          name
        )
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !posts?.length) return [];

  const authorIds = [...new Set(posts.map((p) => p.author_id).filter(Boolean))] as string[];
  let authorMap = new Map<string, string>();
  if (authorIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', authorIds);
    authorMap = new Map(profiles?.map((p) => [p.id, p.display_name]) ?? []);
  }

  const mapped = posts
    .map((post) => {
      const threadRaw = post.thread;
      const thread = (Array.isArray(threadRaw) ? threadRaw[0] : threadRaw) as {
        id: string;
        title: string;
        category: { slug: string; name: string } | { slug: string; name: string }[];
      } | null;
      if (!thread) return null;
      const categoryRaw = thread.category;
      const category = Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw;
      if (!category) return null;
      return {
        id: post.id,
        thread_id: thread.id,
        thread_title: thread.title,
        category_slug: category.slug,
        category_name: trackBoardDisplayName(category.name),
        body: post.body ?? '',
        fb_url: post.fb_url,
        created_at: post.created_at,
        author_name: post.author_id ? authorMap.get(post.author_id) ?? null : null,
      };
    })
    .filter((p): p is RecentForumPost => p !== null)
    .filter((p) => p.body.trim().length > 0 || p.fb_url);

  return mapped.slice(0, limit);
}

export { formatRelativeDate, renderMarkdownLite } from '@/lib/forumFormat';
