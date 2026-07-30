import { createClient } from '@/lib/supabase/server';
import type { ForumCategory, ForumThread, ForumPost, Profile } from '@/lib/supabase';

type WithAuthorId = { author_id: string | null };

export async function attachAuthors<T extends WithAuthorId>(
  supabase: Awaited<ReturnType<typeof createClient>>,
  items: T[]
): Promise<(T & { author?: Pick<Profile, 'id' | 'display_name'> })[]> {
  const ids = [...new Set(items.map((i) => i.author_id).filter(Boolean))] as string[];
  if (ids.length === 0) {
    return items.map((i) => ({ ...i, author: undefined }));
  }
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name')
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

export async function getCategoryStats() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from('forum_categories')
    .select('id, slug, name, description, sort_order, track_id');

  if (!categories) return [];

  const stats = await Promise.all(
    categories.map(async (cat) => {
      const { count } = await supabase
        .from('forum_threads')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id);

      const { data: latest } = await supabase
        .from('forum_threads')
        .select('last_post_at, title')
        .eq('category_id', cat.id)
        .order('last_post_at', { ascending: false })
        .limit(1)
        .single();

      return {
        ...cat,
        thread_count: count ?? 0,
        latest_thread_title: latest?.title ?? null,
        latest_post_at: latest?.last_post_at ?? null,
      };
    })
  );

  return stats.sort((a, b) => a.sort_order - b.sort_order);
}

export function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function renderMarkdownLite(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#00ff0c] underline">$1</a>')
    .replace(/\n/g, '<br />');
}
