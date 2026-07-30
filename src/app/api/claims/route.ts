import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

  if (resend) {
    const trackName = (claim as { track?: { name: string } }).track?.name ?? 'Unknown';
    await resend.emails.send({
      from: 'BMX Colorado <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'rylan@bmxdenver.com',
      subject: `Track claim request: ${trackName}`,
      text: `${contact_name} (${contact_email}) wants to claim ${trackName}.\n\nMessage: ${message || '(none)'}\n\nReview at /admin/claims`,
    });
  }

  return NextResponse.json({ claim });
}
