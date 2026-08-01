import Link from 'next/link';
import NewBadge from '@/components/forum/NewBadge';
import { getCategoryStats } from '@/lib/forum';
import { createClient } from '@/lib/supabase/server';
import { COLORADO_BMX_TRACK_SLUGS } from '@/lib/coloradoTracks';
import { hasRecentBoardActivity } from '@/lib/recentPostWindow';
import type { Track } from '@/lib/supabase';

export const metadata = { title: 'Colorado BMX Tracks' };

export default async function TracksIndexPage() {
  const supabase = await createClient();
  const [tracksResult, categoryStats] = await Promise.all([
    supabase
      .from('tracks')
      .select('*')
      .in('slug', [...COLORADO_BMX_TRACK_SLUGS])
      .order('name'),
    getCategoryStats(),
  ]);
  const { data: tracks } = tracksResult;

  const recentTrackIds = new Set(
    categoryStats
      .filter((cat) => cat.track_id && hasRecentBoardActivity(cat.latest_post_at))
      .map((cat) => cat.track_id as string)
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-black text-[#00ff0c] mb-2">COLORADO BMX TRACKS</h1>
      <p className="text-gray-400 text-sm mb-8">
        Race tracks across Colorado — each with its own page and discussion board
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {(tracks as Track[] ?? []).map((track) => (
          <Link
            key={track.id}
            href={`/tracks/${track.slug}`}
            className="border-2 border-[#00ff0c]/30 rounded-lg p-5 hover:border-[#00ff0c] hover:bg-[#00ff0c]/5 transition-all"
          >
            <h2 className="font-black text-white text-lg leading-snug">
              {track.name}
              {recentTrackIds.has(track.id) && (
                <>
                  {' '}
                  <NewBadge />
                </>
              )}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{track.city}, CO</p>
            {track.claimed_by ? (
              <span className="inline-block mt-2 text-xs text-[#00ff0c] font-bold">Claimed</span>
            ) : (
              <span className="inline-block mt-2 text-xs text-yellow-400 font-bold">Unclaimed</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
