import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  DELETE_WINDOW_HOURS,
  EXPERIENCE_LEVELS,
  MAX_RIDERS_PER_SUBMISSION,
  TRACK_OPTIONS,
  isValidEmail,
  normalizeEmail,
} from '@/lib/checkins';
import { HumanChallenge, verifyChallenge } from '@/lib/humanCheck';
import { checkRateLimit } from '@/lib/rateLimit';

type RiderInput = {
  display_name: string;
  age?: number | null;
  experience_level?: string | null;
};

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

function hashDeleteToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function validDateInput(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function scoreSuspicion(ipBurst: number, riderCount: number): number {
  let score = 0;
  if (ipBurst > 4) score += 2;
  if (riderCount > 3) score += 1;
  return score;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getIp(request);
    const ipHash = hashIp(ip);

    const rate = checkRateLimit(`checkins:create:${ipHash}`, 20, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many submissions. Please wait a few minutes.' }, { status: 429 });
    }

    const body = await request.json();
    const {
      contact_email,
      checkin_date,
      track_choice,
      other_track_name,
      riders,
      challenge,
      finalPosition,
      sliderStartedAt,
      website,
    } = body;

    if (website) {
      return NextResponse.json({ error: 'Submission rejected' }, { status: 400 });
    }

    if (!isValidEmail(contact_email ?? '')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    if (!validDateInput(checkin_date ?? '')) {
      return NextResponse.json({ error: 'A valid check-in date is required.' }, { status: 400 });
    }

    const trackValues = TRACK_OPTIONS.map((item) => item.value);
    if (!trackValues.includes(track_choice)) {
      return NextResponse.json({ error: 'Please select a valid track option.' }, { status: 400 });
    }

    if (track_choice === 'other' && !(other_track_name ?? '').trim()) {
      return NextResponse.json({ error: 'Please provide a track name for Other.' }, { status: 400 });
    }

    if (!Array.isArray(riders) || riders.length < 1 || riders.length > MAX_RIDERS_PER_SUBMISSION) {
      return NextResponse.json(
        { error: `Please include between 1 and ${MAX_RIDERS_PER_SUBMISSION} riders.` },
        { status: 400 }
      );
    }

    const allowedExperience = new Set<string>(EXPERIENCE_LEVELS.map((item) => item.value));
    const cleanedRiders: RiderInput[] = riders.map((rider: RiderInput) => ({
      display_name: (rider.display_name ?? '').trim(),
      age: rider.age ?? null,
      experience_level: rider.experience_level ?? null,
    }));

    if (cleanedRiders.some((rider) => !rider.display_name)) {
      return NextResponse.json({ error: 'Each rider needs a name.' }, { status: 400 });
    }

    if (
      cleanedRiders.some(
        (rider) =>
          rider.age !== null &&
          (typeof rider.age !== 'number' || Number.isNaN(rider.age) || rider.age < 1 || rider.age > 99)
      )
    ) {
      return NextResponse.json({ error: 'Rider age must be between 1 and 99.' }, { status: 400 });
    }

    if (
      cleanedRiders.some(
        (rider) =>
          rider.experience_level !== null &&
          !allowedExperience.has(String(rider.experience_level))
      )
    ) {
      return NextResponse.json({ error: 'Invalid experience level.' }, { status: 400 });
    }

    if (!challenge || typeof finalPosition !== 'number') {
      return NextResponse.json({ error: 'Please complete the human test.' }, { status: 400 });
    }

    const isHuman = verifyChallenge(challenge as HumanChallenge, finalPosition, sliderStartedAt);
    if (!isHuman) {
      return NextResponse.json({ error: 'Human test verification failed. Try again.' }, { status: 400 });
    }

    const today = new Date();
    const incomingDate = new Date(`${checkin_date}T00:00:00`);
    const isOldDate = incomingDate.getTime() < new Date(today.toDateString()).getTime() - 24 * 60 * 60 * 1000;
    if (isOldDate) {
      return NextResponse.json({ error: 'Check-ins for past dates are not allowed.' }, { status: 400 });
    }

    const email = normalizeEmail(contact_email);
    const deleteToken = crypto.randomBytes(24).toString('hex');
    const deleteTokenHash = hashDeleteToken(deleteToken);

    const suspicionScore = scoreSuspicion(20 - rate.remaining, cleanedRiders.length);
    const status = suspicionScore >= 3 ? 'suspicious' : 'active';

    const { data: submission, error: submissionError } = await supabase
      .from('checkin_submissions')
      .insert({
        contact_email: email,
        checkin_date,
        track_choice,
        other_track_name: track_choice === 'other' ? String(other_track_name).trim() : null,
        human_test_passed: true,
        source_ip_hash: ipHash,
        delete_token_hash: deleteTokenHash,
        status,
        suspicion_score: suspicionScore,
      })
      .select('id, checkin_date, track_choice, status')
      .single();

    if (submissionError) {
      const duplicate = submissionError.code === '23505';
      return NextResponse.json(
        { error: duplicate ? 'You already checked in for this track/date with that email.' : 'Unable to save check-in.' },
        { status: duplicate ? 409 : 500 }
      );
    }

    const ridersPayload = cleanedRiders.map((rider) => ({
      submission_id: submission.id,
      display_name: rider.display_name,
      age: rider.age,
      experience_level: rider.experience_level,
    }));

    const { error: ridersError } = await supabase.from('checkin_riders').insert(ridersPayload);
    if (ridersError) {
      await supabase.from('checkin_submissions').delete().eq('id', submission.id);
      return NextResponse.json({ error: 'Unable to save rider details.' }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        submission: {
          id: submission.id,
          checkin_date: submission.checkin_date,
          track_choice: submission.track_choice,
          rider_count: cleanedRiders.length,
          status: submission.status,
        },
        delete_token: deleteToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Check-in POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const ip = getIp(request);
    const ipHash = hashIp(ip);
    const rate = checkRateLimit(`checkins:delete:${ipHash}`, 15, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many removal attempts. Try again shortly.' }, { status: 429 });
    }

    const body = await request.json();
    const { submission_id, delete_token } = body;

    if (!submission_id || !delete_token) {
      return NextResponse.json({ error: 'submission_id and delete_token are required.' }, { status: 400 });
    }

    const { data: submission, error: loadError } = await supabase
      .from('checkin_submissions')
      .select('id, checkin_date, delete_token_hash, status')
      .eq('id', submission_id)
      .maybeSingle();

    if (loadError || !submission) {
      return NextResponse.json({ error: 'Check-in not found.' }, { status: 404 });
    }

    const tokenHash = hashDeleteToken(String(delete_token));
    const expected = Buffer.from(submission.delete_token_hash, 'hex');
    const actual = Buffer.from(tokenHash, 'hex');
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
      return NextResponse.json({ error: 'Invalid removal token.' }, { status: 403 });
    }

    if (submission.status === 'removed') {
      return NextResponse.json({ success: true, alreadyRemoved: true });
    }

    const deleteDeadline = new Date(`${submission.checkin_date}T00:00:00`);
    deleteDeadline.setHours(deleteDeadline.getHours() + DELETE_WINDOW_HOURS + 24);
    if (Date.now() > deleteDeadline.getTime()) {
      return NextResponse.json({ error: 'Removal window has expired for this check-in.' }, { status: 403 });
    }

    const { error: updateError } = await supabase
      .from('checkin_submissions')
      .update({ status: 'removed', removed_at: new Date().toISOString() })
      .eq('id', submission_id);

    if (updateError) {
      return NextResponse.json({ error: 'Unable to remove check-in.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Check-in DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
