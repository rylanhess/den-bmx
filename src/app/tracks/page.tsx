import Link from 'next/link';
import NewBadge from '@/components/forum/NewBadge';
import { getCategoryStats } from '@/lib/forum';
import { createClient } from '@/lib/supabase/server';
import { COLORADO_BMX_TRACK_SLUGS } from '@/lib/coloradoTracks';
import { hasRecentTrackPost } from '@/lib/recentPostWindow';
import { coChipLink } from '@/lib/coloradoUi';
import { formatTrackLocation, formatTrackShortName } from '@/lib/trackDisplay';
import ColoradoContentLayout from '@/components/ads/ColoradoContentLayout';
import ColoradoMobileAd from '@/components/ads/ColoradoMobileAd';
import JsonLd from '@/components/JsonLd';
import { trackListJsonLd } from '@/lib/structuredData';
import { mobileMidroll1 } from '@/lib/adSpaces';
import type { Track } from '@/lib/supabase';

export const metadata = {
  title: 'Colorado BMX Tracks',
  description:
    'Every BMX race track in Colorado — Mile High, Dacono, County Line, Twin Silo, Durango, and more. Schedules, directions, and each track’s message board.',
};

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
      .filter((cat) => cat.track_id && hasRecentTrackPost(cat.latest_post_at))
      .map((cat) => cat.track_id as string)
  );

  return (
    <ColoradoContentLayout className="py-8">
      <JsonLd
        data={trackListJsonLd(
          (tracks as Track[] ?? []).map((t) => ({ name: t.name, slug: t.slug }))
        )}
      />
      <h1 className="text-3xl font-black text-[#00ff0c] mb-2">COLORADO BMX TRACKS</h1>
      <p className="text-gray-400 text-sm mb-8">
        Race tracks across Colorado — each with its own page and discussion board
      </p>

      <ColoradoMobileAd slot={mobileMidroll1} />

      <div className="grid gap-4 sm:grid-cols-2">
        {(tracks as Track[] ?? []).map((track) => (
          <div
            key={track.id}
            className="border-2 border-[#00ff0c]/30 rounded-lg p-5 hover:border-[#00ff0c] hover:bg-[#00ff0c]/5 transition-all"
          >
            <Link href={`/tracks/${track.slug}`} className="block group">
              <h2 className="font-black text-white text-lg leading-snug group-hover:text-[#00ff0c] transition-colors">
                {formatTrackShortName(track.name)}
                {recentTrackIds.has(track.id) && (
                  <>
                    {' '}
                    <NewBadge />
                  </>
                )}
              </h2>
              <p className="text-gray-400 text-sm mt-1">{formatTrackLocation(track.city)}</p>
            </Link>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
              {track.claimed_by ? (
                <span className="text-xs text-[#00ff0c] font-bold">Claimed</span>
              ) : (
                <span className="text-xs text-yellow-400 font-bold">Unclaimed</span>
              )}
              {track.fb_page_url && (
                <a
                  href={track.fb_page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={coChipLink}
                >
                  Facebook →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </ColoradoContentLayout>
  );
}
