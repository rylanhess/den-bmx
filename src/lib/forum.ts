import { createClient } from '@/lib/supabase/server';
import type { ForumCategory, ForumThread, ForumPost, Profile } from '@/lib/supabase';

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
    .select('*, author:profiles!forum_threads_author_id_fkey(id, display_name)', { count: 'exact' })
    .eq('category_id', categoryId)
    .order('is_pinned', { ascending: false })
    .order('last_post_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { threads: data as (ForumThread & { author?: Profile })[], count: count ?? 0 };
}

export async function getThread(threadId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('forum_threads')
    .select('*, category:forum_categories(*), author:profiles!forum_threads_author_id_fkey(id, display_name)')
    .eq('id', threadId)
    .single();
  if (error) return null;
  return data as ForumThread & { category?: ForumCategory; author?: Profile };
}

export async function getPostsByThread(threadId: string, page = 1, perPage = 20) {
  const supabase = await createClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabase
    .from('forum_posts')
    .select('*, author:profiles!forum_posts_author_id_fkey(id, display_name)', { count: 'exact' })
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })
    .range(from, to);

  if (error) throw error;
  return { posts: data as (ForumPost & { author?: Profile })[], count: count ?? 0 };
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
