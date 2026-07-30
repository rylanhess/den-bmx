import type { Profile } from '@/lib/supabase';

/** Site admins and track moderators may pin posts on track boards. */
export function canPinForumPost(
  profile: Pick<Profile, 'role'> | null | undefined,
  isTrackModerator: boolean
): boolean {
  if (!profile) return false;
  if (profile.role === 'admin') return true;
  return isTrackModerator;
}
