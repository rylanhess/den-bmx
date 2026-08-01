import { createClient } from '@supabase/supabase-js';

let adminClient: ReturnType<typeof createClient> | null = null;

/** Service-role Supabase client for server-side jobs (emails, admin). Never expose to the browser. */
export function createAdminClient() {
  if (adminClient) return adminClient;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL for admin client');
  }

  adminClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return adminClient;
}

/** Returns null when service role is not configured (e.g. local dev without key). */
export function tryCreateAdminClient() {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}
