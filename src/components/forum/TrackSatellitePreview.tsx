import Image from 'next/image';
import { formatTrackShortName, hasTrackCoordinates, trackSatelliteStaticUrl } from '@/lib/trackDisplay';
import type { Track } from '@/lib/supabase';

export default function TrackSatellitePreview({
  track,
  className = '',
}: {
  track: Pick<Track, 'name' | 'lat' | 'lon'>;
  className?: string;
}) {
  const src = trackSatelliteStaticUrl(track, { width: 640, height: 256 });
  if (!src || !hasTrackCoordinates(track)) return null;

  return (
    <div className={`relative overflow-hidden bg-[#002868]/10 ${className}`}>
      <Image
        src={src}
        alt={`Satellite view of ${formatTrackShortName(track.name)}`}
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover"
        unoptimized
      />
    </div>
  );
}
