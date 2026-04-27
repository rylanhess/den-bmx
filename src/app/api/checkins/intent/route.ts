import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { TrackChoice } from '@/lib/checkins';
import { checkRateLimit } from '@/lib/rateLimit';

function getIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function isValidTrack(value: string): value is TrackChoice {
  return ['mile_high', 'dacono', 'county_line', 'twin_silos', 'other'].includes(value);
}

export async function POST(request: NextRequest) {
  try {
    const ipHash = hashIp(getIp(request));
    const rate = checkRateLimit(`checkins:intent:create:${ipHash}`, 25, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many check-in attempts. Please try again shortly.' }, { status: 429 });
    }

    const body = await request.json();
    const { checkin_date, track_choice, other_track_name } = body;

    if (!checkin_date || !/^\d{4}-\d{2}-\d{2}$/.test(String(checkin_date))) {
      return NextResponse.json({ error: 'Valid check-in date is required.' }, { status: 400 });
    }
    if (!track_choice || !isValidTrack(String(track_choice))) {
      return NextResponse.json({ error: 'Valid track choice is required.' }, { status: 400 });
    }
    if (String(track_choice) === 'other' && (!other_track_name || String(other_track_name).trim().length < 2)) {
      return NextResponse.json({ error: 'Please provide a track name for Other.' }, { status: 400 });
    }

    const nonce = crypto.randomBytes(12).toString('hex');
    const anonymousEmail = `anon+${nonce}@checkin.local`;
    const ownershipToken = crypto.randomBytes(24).toString('hex');
    const ownershipTokenHash = hashToken(ownershipToken);

    const { data: submission, error: submissionError } = await supabase
      .from('checkin_submissions')
      .insert({
        contact_email: anonymousEmail,
        checkin_date: String(checkin_date),
        track_choice: String(track_choice),
        other_track_name: String(track_choice) === 'other' ? String(other_track_name).trim() : null,
        human_test_passed: true,
        source_ip_hash: ipHash,
        delete_token_hash: ownershipTokenHash,
        status: 'active',
        suspicion_score: 0,
      })
      .select('id, checkin_date, track_choice')
      .single();

    if (submissionError) {
      return NextResponse.json({ error: 'Unable to register check-in intent.' }, { status: 500 });
    }

    const { error: riderError } = await supabase.from('checkin_riders').insert({
      submission_id: submission.id,
      display_name: 'Anonymous rider',
      age: null,
      experience_level: null,
    });

    if (riderError) {
      await supabase.from('checkin_submissions').delete().eq('id', submission.id);
      return NextResponse.json({ error: 'Unable to save check-in intent.' }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        intent: submission,
        ownership_token: ownershipToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Check-in intent POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const ipHash = hashIp(getIp(request));
    const rate = checkRateLimit(`checkins:intent:patch:${ipHash}`, 30, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many updates. Please try again shortly.' }, { status: 429 });
    }

    const body = await request.json();
    const { submission_id, ownership_token, contact_email, riders } = body;

    if (!submission_id || !ownership_token) {
      return NextResponse.json({ error: 'submission_id and ownership_token are required.' }, { status: 400 });
    }

    const { data: submission, error: fetchError } = await supabase
      .from('checkin_submissions')
      .select('id, delete_token_hash')
      .eq('id', submission_id)
      .maybeSingle();

    if (fetchError || !submission) {
      return NextResponse.json({ error: 'Check-in intent not found.' }, { status: 404 });
    }

    const expected = Buffer.from(submission.delete_token_hash, 'hex');
    const actual = Buffer.from(hashToken(String(ownership_token)), 'hex');
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
      return NextResponse.json({ error: 'Invalid ownership token.' }, { status: 403 });
    }

    const normalizedEmail =
      typeof contact_email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email.trim())
        ? contact_email.trim().toLowerCase()
        : null;

    if (normalizedEmail) {
      await supabase.from('checkin_submissions').update({ contact_email: normalizedEmail }).eq('id', submission_id);
    }

    if (Array.isArray(riders) && riders.length > 0) {
      await supabase.from('checkin_riders').delete().eq('submission_id', submission_id);

      const cleaned = riders
        .map((rider: { display_name?: string; age?: number | null; experience_level?: string | null }) => ({
          submission_id,
          display_name: (rider.display_name ?? '').trim() || 'Anonymous rider',
          age: typeof rider.age === 'number' ? rider.age : null,
          experience_level: rider.experience_level ?? null,
        }))
        .slice(0, 6);

      await supabase.from('checkin_riders').insert(cleaned);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Check-in intent PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
