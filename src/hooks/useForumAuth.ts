'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ForumAuthState {
  loading: boolean;
  isLoggedIn: boolean;
  emailVerified: boolean;
  email: string | null;
}

export function useForumAuth(): ForumAuthState {
  const [state, setState] = useState<ForumAuthState>({
    loading: true,
    isLoggedIn: false,
    emailVerified: false,
    email: null,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setState({
        loading: false,
        isLoggedIn: !!user,
        emailVerified: !!user?.email_confirmed_at,
        email: user?.email ?? null,
      });
    });
  }, []);

  return state;
}
