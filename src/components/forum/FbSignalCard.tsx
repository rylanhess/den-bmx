import { formatRelativeDate } from '@/lib/forum';
import type { FbPostSignal, Track } from '@/lib/supabase';
import { coPrimaryChip } from '@/lib/coloradoUi';

interface SignalWithTrack extends FbPostSignal {
  track?: Track;
}

function platformLabel(platform: FbPostSignal['platform']): string {
  return platform === 'instagram' ? 'Instagram' : 'Facebook';
}

export default function FbSignalCard({ signal }: { signal: SignalWithTrack }) {
  const label = platformLabel(signal.platform ?? 'facebook');

  return (
    <div className="border-2 border-[#00ff0c]/30 bg-[#00ff0c]/5 rounded-lg p-4 flex items-center justify-between gap-4">
      <div>
        <p className="font-bold text-white">
          New {label} post — {signal.track?.name ?? 'Track'}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Detected {formatRelativeDate(signal.detected_at)}
        </p>
      </div>
      <a
        href={signal.fb_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${coPrimaryChip} shrink-0`}
      >
        View on {label} →
      </a>
    </div>
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
