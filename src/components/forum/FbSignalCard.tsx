import { formatRelativeDate } from '@/lib/forum';
import type { FbPostSignal, Track } from '@/lib/supabase';

interface SignalWithTrack extends FbPostSignal {
  track?: Track;
}

export default function FbSignalCard({ signal }: { signal: SignalWithTrack }) {
  return (
    <div className="border-2 border-blue-500/30 bg-blue-900/10 rounded-lg p-4 flex items-center justify-between gap-4">
      <div>
        <p className="font-bold text-white">
          New Facebook post — {signal.track?.name ?? 'Track'}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Detected {formatRelativeDate(signal.detected_at)}
        </p>
      </div>
      <a
        href={signal.fb_url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 px-4 py-2 bg-[#00ff0c] text-black font-black text-sm rounded hover:bg-[#00cc0a] transition-colors"
      >
        View on Facebook →
      </a>
    </div>
  );
}

export function FbSignalFeed({ signals }: { signals: SignalWithTrack[] }) {
  if (signals.length === 0) {
    return (
      <p className="text-gray-500 text-sm">No recent Facebook posts detected yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-black text-[#00ff0c] text-sm uppercase tracking-wide">Recent Facebook Activity</h3>
      {signals.map((signal) => (
        <FbSignalCard key={signal.id} signal={signal} />
      ))}
    </div>
  );
}
