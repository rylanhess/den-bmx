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

function isValidTrack(value: string): value is TrackChoice {
  return ['mile_high', 'dacono', 'county_line', 'twin_silos', 'other'].includes(value);
}

export async function POST(request: NextRequest) {
  try {
    const ipHash = hashIp(getIp(request));
    const rate = checkRateLimit(`checkins:event-notes:${ipHash}`, 20, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many event notes. Please try again shortly.' }, { status: 429 });
    }

    const body = await request.json();
    const { checkin_date, track_choice, note_text } = body;

    if (!checkin_date || !/^\d{4}-\d{2}-\d{2}$/.test(String(checkin_date))) {
      return NextResponse.json({ error: 'Valid check-in date is required.' }, { status: 400 });
    }
    if (!track_choice || !isValidTrack(String(track_choice))) {
      return NextResponse.json({ error: 'Valid track choice is required.' }, { status: 400 });
    }
    if (!note_text || String(note_text).trim().length < 3) {
      return NextResponse.json({ error: 'Please include a short note about the event.' }, { status: 400 });
    }

    const { error } = await supabase.from('checkin_event_notes').insert({
      checkin_date: String(checkin_date),
      track_choice: String(track_choice),
      note_text: String(note_text).trim().slice(0, 400),
      source_ip_hash: ipHash,
    });

    if (error) {
      return NextResponse.json({ error: 'Unable to save event note.' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Check-in event-notes POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
