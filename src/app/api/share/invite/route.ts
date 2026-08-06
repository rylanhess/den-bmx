import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendShareInviteEmail } from '@/lib/shareInviteEmail';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in to send invites' }, { status: 401 });
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  if (email === user.email?.toLowerCase()) {
    return NextResponse.json({ error: 'You cannot invite yourself' }, { status: 400 });
  }

  const displayName =
    (typeof user.user_metadata?.display_name === 'string' && user.user_metadata.display_name.trim()) ||
    user.email?.split('@')[0] ||
    null;

  const result = await sendShareInviteEmail(email, displayName);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? 'Failed to send invite' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    sandboxMode: result.sandboxRedirected ?? false,
  });
}
