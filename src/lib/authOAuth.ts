import { authCallbackUrl } from '@/lib/siteUrl';
import { createClient } from '@/lib/supabase/client';

/** Build the OAuth callback URL, preserving ?redirect= from login/signup pages. */
export function getOAuthRedirectTo(): string {
  if (typeof window === 'undefined') return authCallbackUrl();
  const params = new URLSearchParams(window.location.search);
  const next = params.get('redirect') || '/forum';
  return authCallbackUrl(next);
}

export async function signInWithGoogle(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getOAuthRedirectTo(),
      queryParams: { prompt: 'select_account' },
    },
  });
  if (error) throw error;
}
