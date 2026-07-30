import { createClient } from '@/lib/supabase/server';
import type { Profile, Track } from '@/lib/supabase';

export type PublicProfile = Profile & {
  home_track?: Pick<Track, 'id' | 'name' | 'slug' | 'city'> | null;
};

export async function getProfileById(id: string): Promise<PublicProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error || !data) return null;

  const profile = data as Profile;
  if (!profile.home_track_id) return profile;

  const { data: track } = await supabase
    .from('tracks')
    .select('id, name, slug, city')
    .eq('id', profile.home_track_id)
    .single();

  return { ...profile, home_track: track ?? null };
}

export async function getRiderLeaderboard(limit = 50): Promise<PublicProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .not('usabmx_points', 'is', null)
    .order('usabmx_points', { ascending: true })
    .order('usabmx_points_rank', { ascending: true })
    .limit(limit);

  if (!data?.length) return [];

  const trackIds = [...new Set(data.map((p) => p.home_track_id).filter(Boolean))] as string[];
  const trackMap = new Map<string, Pick<Track, 'id' | 'name' | 'slug' | 'city'>>();
  if (trackIds.length > 0) {
    const { data: tracks } = await supabase
      .from('tracks')
      .select('id, name, slug, city')
      .in('id', trackIds);
    for (const t of tracks ?? []) trackMap.set(t.id, t);
  }

  return data.map((p) => ({
    ...(p as Profile),
    home_track: p.home_track_id ? trackMap.get(p.home_track_id) ?? null : null,
  }));
}

export async function getProfilePostCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('forum_posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', userId);
  return count ?? 0;
}
