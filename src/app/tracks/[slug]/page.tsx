import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import TrackHeader from '@/components/forum/TrackHeader';
import TrackScheduleEditor from '@/components/forum/TrackScheduleEditor';
import BoardSubscribeButton from '@/components/forum/BoardSubscribeButton';
import { FbSignalFeed } from '@/components/forum/FbSignalCard';
import ThreadTable from '@/components/forum/ThreadTable';
import { attachAuthors, flattenThreadSignalUrl } from '@/lib/forum';
import { trackBoardDisplayName } from '@/lib/userPreferences';
import type { Track, FbPostSignal } from '@/lib/supabase';
import ColoradoContentLayout from '@/components/ads/ColoradoContentLayout';

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
  let canEditTrack = false;
  const currentUser = await getCurrentUser();

  if (typedTrack.claimed_by) {
    const { data: mod } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', typedTrack.claimed_by)
      .single();
    moderatorName = mod?.display_name ?? null;
  }

  if (currentUser?.user) {
    const isAdmin = currentUser.profile?.role === 'admin';
    const { data: modRow } = await supabase
      .from('track_moderators')
      .select('user_id')
      .eq('user_id', currentUser.user.id)
      .eq('track_id', typedTrack.id)
      .single();
    canEditTrack = isAdmin || !!modRow;
  }

  const { data: signals } = await supabase
    .from('fb_post_signals')
    .select('*, track:tracks(*)')
    .eq('track_id', typedTrack.id)
    .order('detected_at', { ascending: false })
    .limit(10);

  const { data: category } = await supabase
    .from('forum_categories')
    .select('id, slug, name')
    .eq('slug', `${slug}-comms`)
    .single();

  let threads: Parameters<typeof ThreadTable>[0]['threads'] = [];
  if (category) {
    const { data } = await supabase
      .from('forum_threads')
      .select('*, fb_post_signals(fb_url)')
      .eq('category_id', category.id)
      .order('is_pinned', { ascending: false })
      .order('last_post_at', { ascending: false })
      .limit(10);
    threads = (await attachAuthors(supabase, flattenThreadSignalUrl((data ?? []) as Parameters<typeof flattenThreadSignalUrl>[0]))) as Parameters<typeof ThreadTable>[0]['threads'];
  }

  return (
    <ColoradoContentLayout className="py-8">
      <TrackHeader track={typedTrack} moderatorName={moderatorName} />
      {category && (
        <div className="mb-4">
          <BoardSubscribeButton
            categoryId={category.id}
            boardName={trackBoardDisplayName(category.name)}
          />
        </div>
      )}
      <TrackScheduleEditor track={typedTrack} canEdit={canEditTrack} />

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
    </ColoradoContentLayout>
  );
}
