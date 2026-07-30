import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import TrackHeader from '@/components/forum/TrackHeader';
import { FbSignalFeed } from '@/components/forum/FbSignalCard';
import ThreadTable from '@/components/forum/ThreadTable';
import { attachAuthors } from '@/lib/forum';
import type { Track, FbPostSignal } from '@/lib/supabase';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: track } = await supabase.from('tracks').select('name').eq('slug', slug).single();
  return { title: track?.name ?? 'Track' };
}

export default async function TrackPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: track } = await supabase
    .from('tracks')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!track) notFound();

  const typedTrack = track as Track;

  let moderatorName: string | null = null;
  if (typedTrack.claimed_by) {
    const { data: mod } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', typedTrack.claimed_by)
      .single();
    moderatorName = mod?.display_name ?? null;
  }

  const { data: signals } = await supabase
    .from('fb_post_signals')
    .select('*, track:tracks(*)')
    .eq('track_id', typedTrack.id)
    .order('detected_at', { ascending: false })
    .limit(10);

  const { data: category } = await supabase
    .from('forum_categories')
    .select('id, slug')
    .eq('slug', `${slug}-comms`)
    .single();

  let threads: Parameters<typeof ThreadTable>[0]['threads'] = [];
  if (category) {
    const { data } = await supabase
      .from('forum_threads')
      .select('*')
      .eq('category_id', category.id)
      .order('is_pinned', { ascending: false })
      .order('last_post_at', { ascending: false })
      .limit(10);
    threads = (await attachAuthors(supabase, data ?? [])) as Parameters<typeof ThreadTable>[0]['threads'];
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <TrackHeader track={typedTrack} moderatorName={moderatorName} />

      <div className="grid gap-8 lg:grid-cols-2 mb-8">
        <FbSignalFeed signals={(signals as FbPostSignal[]) ?? []} />
      </div>

      {category && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-[#00ff0c]">Track Discussion</h2>
            <Link
              href={`/forum/${category.slug}`}
              className="text-sm text-[#00ff0c] font-bold hover:underline"
            >
              View all →
            </Link>
          </div>
          <ThreadTable threads={threads} categorySlug={category.slug} />
        </div>
      )}
    </div>
  );
}
