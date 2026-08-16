import Link from 'next/link';
import NewBadge from '@/components/forum/NewBadge';
import TrackSatellitePreview from '@/components/forum/TrackSatellitePreview';
import { getCategoryStats } from '@/lib/forum';
import { createClient } from '@/lib/supabase/server';
import { COLORADO_BMX_TRACK_SLUGS } from '@/lib/coloradoTracks';
import { hasRecentTrackPost } from '@/lib/recentPostWindow';
import { coChipLink } from '@/lib/coloradoUi';
import {
  formatTrackLocation,
  formatTrackShortName,
  hasTrackCoordinates,
  trackTelHref,
  trackWebsiteUrl,
} from '@/lib/trackDisplay';
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
          <TrackIndexCard
            key={track.id}
            track={track}
            hasRecentPost={recentTrackIds.has(track.id)}
          />
        ))}
      </div>
    </ColoradoContentLayout>
  );
}

function TrackIndexCard({
  track,
  hasRecentPost,
}: {
  track: Track;
  hasRecentPost: boolean;
}) {
  const website = trackWebsiteUrl(track);
  const telHref = trackTelHref(track.phone);
  const showMap = hasTrackCoordinates(track);

  return (
    <article className="border-2 border-[#00ff0c]/30 rounded-lg overflow-hidden hover:border-[#00ff0c] hover:bg-[#00ff0c]/5 transition-all">
      {showMap && (
        <Link href={`/tracks/${track.slug}`} className="block">
          <TrackSatellitePreview track={track} className="h-40 w-full" />
        </Link>
      )}
      <div className="p-5">
        <Link href={`/tracks/${track.slug}`} className="block group">
          <h2 className="font-black text-white text-lg leading-snug group-hover:text-[#00ff0c] transition-colors">
            {formatTrackShortName(track.name)}
            {hasRecentPost && (
              <>
                {' '}
                <NewBadge />
              </>
            )}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{formatTrackLocation(track.city)}</p>
        </Link>

        <dl className="mt-3 space-y-1.5 text-sm">
          {track.address?.trim() && (
            <div>
              <dt className="sr-only">Address</dt>
              <dd className="text-gray-300">{track.address.trim()}</dd>
            </div>
          )}
          {track.operator_name?.trim() && (
            <div>
              <dt className="sr-only">Operator</dt>
              <dd className="text-gray-300">Operator: {track.operator_name.trim()}</dd>
            </div>
          )}
          {track.phone?.trim() && (
            <div>
              <dt className="sr-only">Phone</dt>
              <dd>
                {telHref ? (
                  <a href={telHref} className="text-gray-300 hover:text-[#00ff0c]">
                    {track.phone.trim()}
                  </a>
                ) : (
                  <span className="text-gray-300">{track.phone.trim()}</span>
                )}
              </dd>
            </div>
          )}
          {track.open_hours?.trim() && (
            <div>
              <dt className="sr-only">Hours</dt>
              <dd className="text-gray-300 whitespace-pre-wrap">{track.open_hours.trim()}</dd>
            </div>
          )}
        </dl>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3">
          {track.claimed_by ? (
            <span className="text-xs text-[#00ff0c] font-bold">Claimed</span>
          ) : (
            <span className="text-xs text-yellow-400 font-bold">Unclaimed</span>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className={coChipLink}
            >
              Website →
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
