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

export async function getProfilePostCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('forum_posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', userId);
  return count ?? 0;
}
