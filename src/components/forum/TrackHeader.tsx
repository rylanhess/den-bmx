import Link from 'next/link';
import type { Track } from '@/lib/supabase';
import { coChipLink, coMutedChip, coPrimaryChip } from '@/lib/coloradoUi';
import { formatTrackLocation, formatTrackShortName } from '@/lib/trackDisplay';

interface TrackHeaderProps {
  track: Track;
  moderatorName?: string | null;
  isModerator?: boolean;
}

export default function TrackHeader({ track, moderatorName, isModerator }: TrackHeaderProps) {
  return (
    <div className="border-2 border-[#00ff0c]/30 rounded-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#00ff0c]">{formatTrackShortName(track.name)}</h1>
          <p className="text-gray-400 mt-1">{formatTrackLocation(track.city, 'Colorado')}</p>
          {track.description && (
            <p className="text-gray-300 mt-3 text-sm leading-relaxed">{track.description}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {moderatorName ? (
            <span className="inline-flex items-center gap-2 bg-[#00ff0c]/10 border border-[#00ff0c]/40 rounded px-3 py-1.5 text-sm text-[#00ff0c] font-bold leading-none">
              Moderated by {moderatorName}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 bg-[#FFC72C]/20 border border-[#FFC72C]/50 rounded px-3 py-1.5 text-sm text-[#002868] font-bold leading-none">
              Unclaimed — Track operators can claim this page
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {track.usabmx_url && (
          <a
            href={track.usabmx_url}
            target="_blank"
            rel="noopener noreferrer"
            className={coChipLink}
          >
            USA BMX Page →
          </a>
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
        {track.instagram_url && (
          <a
            href={track.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className={coChipLink}
          >
            Instagram →
          </a>
        )}
        {track.lat && track.lon && (
          <a
            href={`https://maps.google.com/?q=${track.lat},${track.lon}`}
            target="_blank"
            rel="noopener noreferrer"
            className={coMutedChip}
          >
            Map →
          </a>
        )}
        {!moderatorName && !isModerator && (
          <Link href={`/tracks/${track.slug}/claim`} className={coPrimaryChip}>
            Claim This Track
          </Link>
        )}
        {track.slug && (
          <Link href={`/forum/${track.slug}-comms`} className={coChipLink}>
            Track Message Board →
          </Link>
        )}
      </div>
    </div>
  );
}
