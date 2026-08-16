import type { Track } from '@/lib/supabase';

/** Normalize track city strings that may already include state (e.g. "Dacono, CO"). */
export function formatTrackLocation(
  city: string | null | undefined,
  state: 'CO' | 'Colorado' = 'CO'
): string {
  if (!city?.trim()) return state === 'Colorado' ? 'Colorado' : 'CO';
  const place = city.trim().replace(/,?\s*(Colorado|CO)\s*$/i, '').trim();
  return place ? `${place}, ${state}` : state;
}

/** Display name without redundant "BMX" / "Park" suffixes (e.g. "Dacono BMX" → "Dacono"). */
export function formatTrackShortName(name: string): string {
  return name
    .replace(/\s*—\s*Track Comms$/i, '')
    .replace(/\s+BMX\s+Park$/i, '')
    .replace(/\s+BMX$/i, '')
    .replace(/\s+Park$/i, '')
    .trim();
}

type WebsiteFields = Pick<Track, 'website' | 'fb_page_url'>;
type MapsFields = Pick<Track, 'address' | 'lat' | 'lon'>;

/** Dedicated website, otherwise the Facebook page. */
export function trackWebsiteUrl(track: WebsiteFields): string | null {
  return track.website?.trim() || track.fb_page_url?.trim() || null;
}

export function hasTrackCoordinates(
  track: Pick<Track, 'lat' | 'lon'>
): track is Pick<Track, 'lat' | 'lon'> & { lat: number; lon: number } {
  return track.lat != null && track.lon != null && Number.isFinite(track.lat) && Number.isFinite(track.lon);
}

export const TRACK_SATELLITE_ZOOM = 17;

/** Mapbox Static Images API URL for a satellite preview (index cards). */
export function trackSatelliteStaticUrl(
  track: Pick<Track, 'lat' | 'lon'>,
  opts: { width: number; height: number; zoom?: number } = { width: 640, height: 256 }
): string | null {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token || !hasTrackCoordinates(track)) return null;
  const zoom = opts.zoom ?? TRACK_SATELLITE_ZOOM;
  const pin = `pin-s+bf0a30(${track.lon},${track.lat})`;
  return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${pin}/${track.lon},${track.lat},${zoom},0/${opts.width}x${opts.height}@2x?access_token=${token}`;
}

export function trackMapsUrl(track: MapsFields): string | null {
  if (track.address?.trim()) {
    return `https://maps.google.com/?q=${encodeURIComponent(track.address.trim())}`;
  }
  if (track.lat != null && track.lon != null) {
    return `https://maps.google.com/?q=${track.lat},${track.lon}`;
  }
  return null;
}

export function trackTelHref(phone: string | null | undefined): string | null {
  const digits = phone?.replace(/[^\d+]/g, '') ?? '';
  return digits.length >= 7 ? `tel:${digits}` : null;
}
