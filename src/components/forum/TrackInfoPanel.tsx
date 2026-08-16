import type { ReactNode } from 'react';
import { coChipLink } from '@/lib/coloradoUi';
import {
  trackMapsUrl,
  trackTelHref,
  trackWebsiteUrl,
} from '@/lib/trackDisplay';
import type { Track } from '@/lib/supabase';

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-bold text-white mb-1">{label}</dt>
      <dd className="text-gray-300 text-sm leading-relaxed">{children}</dd>
    </div>
  );
}

export default function TrackInfoPanel({
  track,
  showEmpty = false,
}: {
  track: Track;
  showEmpty?: boolean;
}) {
  const website = trackWebsiteUrl(track);
  const mapsUrl = trackMapsUrl(track);
  const telHref = trackTelHref(track.phone);
  const rows: { label: string; content: ReactNode }[] = [];

  if (website || showEmpty) {
    rows.push({
      label: 'Website',
      content: website ? (
        <a href={website} target="_blank" rel="noopener noreferrer" className={coChipLink}>
          {track.website?.trim() ? 'Visit site →' : 'Facebook →'}
        </a>
      ) : (
        <span className="text-gray-500">Not set</span>
      ),
    });
  }

  if (track.phone?.trim() || showEmpty) {
    rows.push({
      label: 'Phone',
      content: track.phone?.trim() ? (
        telHref ? (
          <a href={telHref} className="hover:text-[#00ff0c]">
            {track.phone.trim()}
          </a>
        ) : (
          track.phone.trim()
        )
      ) : (
        <span className="text-gray-500">Not set</span>
      ),
    });
  }

  if (track.operator_name?.trim() || showEmpty) {
    rows.push({
      label: 'Operator',
      content: track.operator_name?.trim() || <span className="text-gray-500">Not set</span>,
    });
  }

  if (track.address?.trim() || showEmpty) {
    rows.push({
      label: 'Address',
      content: track.address?.trim() ? (
        mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00ff0c] whitespace-pre-wrap"
          >
            {track.address.trim()}
          </a>
        ) : (
          <span className="whitespace-pre-wrap">{track.address.trim()}</span>
        )
      ) : (
        <span className="text-gray-500">Not set</span>
      ),
    });
  }

  if (track.open_hours?.trim() || showEmpty) {
    rows.push({
      label: 'Operating Hours',
      content: track.open_hours?.trim() ? (
        <span className="whitespace-pre-wrap">{track.open_hours.trim()}</span>
      ) : (
        <span className="text-gray-500">Not set</span>
      ),
    });
  }

  if (track.schedule?.trim() || showEmpty) {
    rows.push({
      label: 'Practice & Race Schedule',
      content: track.schedule?.trim() ? (
        <span className="whitespace-pre-wrap">{track.schedule.trim()}</span>
      ) : (
        <span className="text-gray-500">Not set</span>
      ),
    });
  }

  if (rows.length === 0) return null;

  return (
    <dl className="grid gap-4 sm:grid-cols-2 text-sm">
      {rows.map((row) => (
        <InfoRow key={row.label} label={row.label}>
          {row.content}
        </InfoRow>
      ))}
    </dl>
  );
}
