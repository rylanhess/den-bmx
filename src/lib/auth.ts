import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/supabase';

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile: profile as Profile | null };
}

export async function requireAuth() {
  const result = await getCurrentUser();
  if (!result?.user) return null;
  return result;
}

export async function requireAdmin() {
  const result = await getCurrentUser();
  if (!result?.profile || result.profile.role !== 'admin') return null;
  return result;
}

export async function isTrackModerator(userId: string, trackId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('track_moderators')
    .select('user_id')
    .eq('user_id', userId)
    .eq('track_id', trackId)
    .single();
  return !!data;
}
