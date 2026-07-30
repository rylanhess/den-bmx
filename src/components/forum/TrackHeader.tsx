import Link from 'next/link';
import type { Track } from '@/lib/supabase';

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
          <h1 className="text-2xl font-black text-[#00ff0c]">{track.name}</h1>
          <p className="text-gray-400 mt-1">{track.city}, Colorado</p>
          {track.description && (
            <p className="text-gray-300 mt-3 text-sm leading-relaxed">{track.description}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {moderatorName ? (
            <span className="inline-flex items-center gap-2 bg-[#00ff0c]/10 border border-[#00ff0c]/40 rounded px-3 py-1.5 text-sm text-[#00ff0c] font-bold">
              Moderated by {moderatorName}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 bg-yellow-900/30 border border-yellow-500/40 rounded px-3 py-1.5 text-sm text-yellow-300 font-bold">
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
            className="px-3 py-1.5 border border-[#00ff0c]/40 text-[#00ff0c] text-sm font-bold rounded hover:bg-[#00ff0c]/10 transition-colors"
          >
            USA BMX Page →
          </a>
        )}
        {track.fb_page_url && (
          <a
            href={track.fb_page_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 border border-blue-500/40 text-blue-300 text-sm font-bold rounded hover:bg-blue-900/20 transition-colors"
          >
            Facebook Page →
          </a>
        )}
        {track.lat && track.lon && (
          <a
            href={`https://maps.google.com/?q=${track.lat},${track.lon}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 border border-gray-600 text-gray-300 text-sm font-bold rounded hover:bg-gray-800 transition-colors"
          >
            Map →
          </a>
        )}
        {!moderatorName && !isModerator && (
          <Link
            href={`/tracks/${track.slug}/claim`}
            className="px-3 py-1.5 bg-[#00ff0c] text-black text-sm font-black rounded hover:bg-[#00cc0a] transition-colors"
          >
            Claim This Track
          </Link>
        )}
        {track.slug && (
          <Link
            href={`/forum/${track.slug}-comms`}
            className="px-3 py-1.5 border border-[#00ff0c]/40 text-[#00ff0c] text-sm font-bold rounded hover:bg-[#00ff0c]/10 transition-colors"
          >
            Track Comms Board →
          </Link>
        )}
      </div>
    </div>
  );
}
