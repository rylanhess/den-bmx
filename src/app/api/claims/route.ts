import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notifyClaimSubmitted } from '@/lib/claimNotifications';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { track_id, contact_name, contact_email, message } = await request.json();
  if (!track_id || !contact_name?.trim() || !contact_email?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from('track_claim_requests')
    .select('id')
    .eq('user_id', user.id)
    .eq('track_id', track_id)
    .eq('status', 'pending')
    .single();

  if (existing) {
    return NextResponse.json({ error: 'You already have a pending claim for this track' }, { status: 409 });
  }

  const { data: claim, error } = await supabase
    .from('track_claim_requests')
    .insert({
      user_id: user.id,
      track_id,
      contact_name: contact_name.trim(),
      contact_email: contact_email.trim(),
      message: message?.trim() || null,
    })
    .select('*, track:tracks(name, slug)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const track = claim as { track?: { name: string; slug: string } };
  const trackName = track.track?.name ?? 'Unknown';

  const emailResult = await notifyClaimSubmitted({
    trackName,
    contactName: contact_name.trim(),
    contactEmail: contact_email.trim(),
    message,
  });

  if (!emailResult.ok) {
    console.error('[claims] Failed to notify reviewer:', emailResult.error);
  }

  return NextResponse.json({ claim });
}
