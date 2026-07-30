/**
 * Colorado track social URLs loaded from Supabase (source of truth).
 */

import { COLORADO_BMX_TRACK_SLUGS } from '../../src/lib/coloradoTracks';
import { supabase } from '../config';

export type SocialPlatform = 'facebook' | 'instagram';

export interface TrackSocialSource {
  id: string;
  slug: string;
  name: string;
  fbPageUrl: string | null;
  instagramUrl: string | null;
}

export function urlNeedleFromSocialUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    return (parts[0] ?? '').toLowerCase();
  } catch {
    return url.toLowerCase().replace(/[^a-z0-9]/g, '');
  }
}

export async function loadColoradoTrackSources(): Promise<TrackSocialSource[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select('id, slug, name, fb_page_url, instagram_url')
    .in('slug', [...COLORADO_BMX_TRACK_SLUGS])
    .order('name');

  if (error) {
    throw new Error(`Failed to load Colorado tracks: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    fbPageUrl: row.fb_page_url,
    instagramUrl: row.instagram_url,
  }));
}

export async function getTrackSourceBySlug(slug: string): Promise<TrackSocialSource | null> {
  const { data, error } = await supabase
    .from('tracks')
    .select('id, slug, name, fb_page_url, instagram_url')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    fbPageUrl: data.fb_page_url,
    instagramUrl: data.instagram_url,
  };
}
