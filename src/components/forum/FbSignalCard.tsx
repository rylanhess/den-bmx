import { formatRelativeDate } from '@/lib/forum';
import type { FbPostSignal, Track } from '@/lib/supabase';
import { coPrimaryChip } from '@/lib/coloradoUi';
import { formatTrackShortName } from '@/lib/trackDisplay';
import { SocialPlatformIcon } from '@/components/forum/SocialPostLink';

interface SignalWithTrack extends FbPostSignal {
  track?: Track;
}

function platformLabel(platform: FbPostSignal['platform']): string {
  return platform === 'instagram' ? 'Instagram' : 'Facebook';
}

export default function FbSignalCard({ signal }: { signal: SignalWithTrack }) {
  const platform = signal.platform ?? 'facebook';
  const label = platformLabel(platform);

  return (
    <a
      href={signal.fb_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border-2 border-[#00ff0c]/30 bg-[#00ff0c]/5 rounded-lg p-4 hover:border-[#00ff0c]/60 hover:bg-[#00ff0c]/10 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
              platform === 'instagram' ? 'bg-[#E1306C]' : 'bg-[#1877F2]'
            }`}
          >
            <SocialPlatformIcon platform={platform} className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="font-bold text-white">
              New {label} post — {signal.track ? formatTrackShortName(signal.track.name) : 'Track'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Detected {formatRelativeDate(signal.detected_at)}
            </p>
          </div>
        </div>
        <span className={`${coPrimaryChip} shrink-0`}>View on {label} →</span>
      </div>
    </a>
  );
}

export function FbSignalFeed({ signals }: { signals: SignalWithTrack[] }) {
  if (signals.length === 0) {
    return (
      <p className="text-gray-500 text-sm">No recent social posts detected yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-black text-[#00ff0c] text-sm uppercase tracking-wide">Recent Social Activity</h3>
      {signals.map((signal) => (
        <FbSignalCard key={signal.id} signal={signal} />
      ))}
    </div>
  );
}
