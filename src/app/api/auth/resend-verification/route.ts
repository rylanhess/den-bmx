import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: 'Sign in to resend verification' }, { status: 401 });
  }

  if (user.email_confirmed_at) {
    return NextResponse.json({ message: 'Email already verified' });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/forum`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Verification email sent' });
}
