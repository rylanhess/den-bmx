import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { authCallbackUrl } from '@/lib/siteUrl';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: 'Sign in to resend verification' }, { status: 401 });
  }

  if (user.email_confirmed_at) {
    return NextResponse.json({ message: 'Email already verified' });
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email,
    options: {
      emailRedirectTo: authCallbackUrl('/forum'),
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Verification email sent' });
}
