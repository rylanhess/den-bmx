import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { claimReviewEmails } from '@/lib/email';
import { notifyClaimApproved, notifyClaimRejected } from '@/lib/claimNotifications';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const reviewers = claimReviewEmails();
  if (!reviewers.includes(user.email ?? '')) {
    return NextResponse.json({ error: 'Only the designated claim reviewer can approve claims' }, { status: 403 });
  }

  const { status, admin_notes } = await request.json();
  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const { data: claim } = await supabase
    .from('track_claim_requests')
    .select('*, track:tracks(name, slug)')
    .eq('id', id)
    .single();

  if (!claim) return NextResponse.json({ error: 'Claim not found' }, { status: 404 });

  const { data: updated, error } = await supabase
    .from('track_claim_requests')
    .update({
      status,
      admin_notes: admin_notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const track = (claim as { track?: { name: string; slug: string } }).track;
  const trackName = track?.name ?? 'the track';

  if (status === 'approved') {
    await supabase.from('track_moderators').upsert({
      user_id: claim.user_id,
      track_id: claim.track_id,
    });

    await supabase
      .from('tracks')
      .update({ claimed_by: claim.user_id })
      .eq('id', claim.track_id);

    if (track) {
      const emailResult = await notifyClaimApproved({
        track,
        contactName: claim.contact_name,
        contactEmail: claim.contact_email,
      });
      if (!emailResult.ok) {
        console.error('[claims] Failed to send approval email:', emailResult.error);
      }
    }
  } else if (status === 'rejected') {
    const emailResult = await notifyClaimRejected({
      trackName,
      contactName: claim.contact_name,
      contactEmail: claim.contact_email,
      adminNotes: admin_notes,
    });
    if (!emailResult.ok) {
      console.error('[claims] Failed to send rejection email:', emailResult.error);
    }
  }

  return NextResponse.json({ claim: updated });
}
