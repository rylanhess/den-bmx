import type { MetadataRoute } from 'next';
import { COLORADO_CANONICAL_ORIGIN } from '@/lib/canonicalSite';
import { COLORADO_BMX_TRACK_SLUGS } from '@/lib/coloradoTracks';
import { createClient } from '@/lib/supabase/server';

const MAX_THREAD_ENTRIES = 500;

function entry(
  origin: string,
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly',
  lastModified?: Date
): MetadataRoute.Sitemap[number] {
  return {
    url: `${origin}${path.startsWith('/') ? path : `/${path}`}`,
    changeFrequency,
    priority,
    ...(lastModified ? { lastModified } : {}),
  };
}

interface SitemapThreadRow {
  id: string;
  last_post_at: string;
  category: { slug: string } | { slug: string }[] | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = COLORADO_CANONICAL_ORIGIN;

  const supabase = await createClient();
  const [categoriesResult, threadsResult] = await Promise.all([
    supabase.from('forum_categories').select('slug').order('sort_order'),
    supabase
      .from('forum_threads')
      .select('id, last_post_at, category:forum_categories!inner(slug)')
      .order('last_post_at', { ascending: false })
      .limit(MAX_THREAD_ENTRIES),
  ]);

  const threads = (threadsResult.data ?? []) as SitemapThreadRow[];

  const boardLastPost = new Map<string, Date>();
  const threadEntries: MetadataRoute.Sitemap = [];
  let latestPostAt: Date | undefined;
  for (const thread of threads) {
    const category = Array.isArray(thread.category) ? thread.category[0] : thread.category;
    if (!category?.slug) continue;
    const lastPostAt = new Date(thread.last_post_at);
    if (!boardLastPost.has(category.slug)) {
      boardLastPost.set(category.slug, lastPostAt);
    }
    if (!latestPostAt || lastPostAt > latestPostAt) {
      latestPostAt = lastPostAt;
    }
    threadEntries.push(
      entry(origin, `/forum/${category.slug}/${thread.id}`, 0.6, 'daily', lastPostAt)
    );
  }

  return [
    entry(origin, '/forum', 1, 'hourly', latestPostAt),
    entry(origin, '/tracks', 0.9),
    entry(origin, '/contact', 0.6, 'monthly'),
    ...COLORADO_BMX_TRACK_SLUGS.map((slug) =>
      entry(origin, `/tracks/${slug}`, 0.8, 'weekly', boardLastPost.get(`${slug}-comms`))
    ),
    ...(categoriesResult.data ?? []).map((cat) =>
      entry(origin, `/forum/${cat.slug}`, 0.7, 'daily', boardLastPost.get(cat.slug))
    ),
    ...threadEntries,
  ];
}
