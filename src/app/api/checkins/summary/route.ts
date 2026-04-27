import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { TRACK_OPTIONS, TrackChoice, addDays, startOfDayIso } from '@/lib/checkins';

type Submission = {
  id: string;
  checkin_date: string;
  track_choice: TrackChoice;
  other_track_name: string | null;
};

type Rider = {
  submission_id: string;
  experience_level: string | null;
};

type EventNote = {
  checkin_date: string;
  track_choice: TrackChoice;
  note_text: string;
};

function baseCounts() {
  return {
    mile_high: 0,
    dacono: 0,
    county_line: 0,
    twin_silos: 0,
    other: 0,
  };
}

function baseMainTrackRiderScoreboard() {
  return {
    mile_high: 0,
    dacono: 0,
    county_line: 0,
    twin_silos: 0,
  };
}

function baseExperienceCounts() {
  return {
    novice: 0,
    intermediate: 0,
    expert: 0,
    pro: 0,
    unknown: 0,
  };
}

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams;
    const mode = search.get('mode') ?? 'home';

    const today = new Date();
    const start = search.get('start_date') ?? startOfDayIso(today);
    const end = search.get('end_date') ?? startOfDayIso(addDays(today, mode === 'home' ? 2 : 14));

    const { data: submissions, error: submissionError } = await supabase
      .from('checkin_submissions')
      .select('id, checkin_date, track_choice, other_track_name')
      .eq('status', 'active')
      .gte('checkin_date', start)
      .lte('checkin_date', end)
      .order('checkin_date', { ascending: true });

    if (submissionError) {
      return NextResponse.json({ error: 'Unable to fetch check-ins.' }, { status: 500 });
    }

    const typedSubmissions = (submissions ?? []) as Submission[];
    const submissionIds = typedSubmissions.map((submission) => submission.id);

    let riders: Rider[] = [];
    if (submissionIds.length > 0) {
      const { data: riderData, error: riderError } = await supabase
        .from('checkin_riders')
        .select('submission_id, experience_level')
        .in('submission_id', submissionIds);

      if (riderError) {
        return NextResponse.json({ error: 'Unable to fetch rider details.' }, { status: 500 });
      }
      riders = (riderData ?? []) as Rider[];
    }

    let eventNotes: EventNote[] = [];
    const { data: notesData, error: notesError } = await supabase
      .from('checkin_event_notes')
      .select('checkin_date, track_choice, note_text')
      .gte('checkin_date', start)
      .lte('checkin_date', end)
      .order('created_at', { ascending: false })
      .limit(200);

    if (notesError) {
      return NextResponse.json({ error: 'Unable to fetch event notes.' }, { status: 500 });
    }
    eventNotes = (notesData ?? []) as EventNote[];

    const notesByDay = new Map<string, string[]>();
    for (const note of eventNotes) {
      const label = TRACK_OPTIONS.find((track) => track.value === note.track_choice)?.label ?? 'Other';
      const bucket = notesByDay.get(note.checkin_date) ?? [];
      if (bucket.length < 5) {
        bucket.push(`${label}: ${note.note_text}`);
      }
      notesByDay.set(note.checkin_date, bucket);
    }

    const riderBySubmission = new Map<string, Rider[]>();
    for (const rider of riders) {
      const bucket = riderBySubmission.get(rider.submission_id) ?? [];
      bucket.push(rider);
      riderBySubmission.set(rider.submission_id, bucket);
    }

    const byDay = new Map<
      string,
      {
        date: string;
        submissions: number;
        riders: number;
        tracks: ReturnType<typeof baseCounts>;
        experience: ReturnType<typeof baseExperienceCounts>;
        notes: string[];
      }
    >();

    for (const [date, notes] of notesByDay.entries()) {
      byDay.set(date, {
        date,
        submissions: 0,
        riders: 0,
        tracks: baseCounts(),
        experience: baseExperienceCounts(),
        notes,
      });
    }

    for (const submission of typedSubmissions) {
      const day = byDay.get(submission.checkin_date) ?? {
        date: submission.checkin_date,
        submissions: 0,
        riders: 0,
        tracks: baseCounts(),
        experience: baseExperienceCounts(),
        notes: notesByDay.get(submission.checkin_date) ?? [],
      };

      day.submissions += 1;
      day.tracks[submission.track_choice] += 1;

      const riderRows = riderBySubmission.get(submission.id) ?? [];
      day.riders += riderRows.length;

      for (const rider of riderRows) {
        const level = rider.experience_level;
        if (!level) {
          day.experience.unknown += 1;
          continue;
        }
        if (level in day.experience) {
          day.experience[level as keyof ReturnType<typeof baseExperienceCounts>] += 1;
        } else {
          day.experience.unknown += 1;
        }
      }

      byDay.set(submission.checkin_date, day);
    }

    const days = Array.from(byDay.values());
    if (mode === 'home') {
      const requiredDays = [0, 1, 2].map((offset) => startOfDayIso(addDays(new Date(start), offset)));
      const withGaps = requiredDays.map(
        (date) =>
          days.find((entry) => entry.date === date) ?? {
            date,
            submissions: 0,
            riders: 0,
            tracks: baseCounts(),
            experience: baseExperienceCounts(),
            notes: notesByDay.get(date) ?? [],
          }
      );

      const riderScoreboard = baseMainTrackRiderScoreboard();
      for (const submission of typedSubmissions) {
        if (!(submission.track_choice in riderScoreboard)) {
          continue;
        }

        const riderRows = riderBySubmission.get(submission.id) ?? [];
        riderScoreboard[submission.track_choice as keyof ReturnType<typeof baseMainTrackRiderScoreboard>] +=
          riderRows.length;
      }

      return NextResponse.json({
        mode: 'home',
        tracks: TRACK_OPTIONS,
        days: withGaps,
        rider_scoreboard: riderScoreboard,
      });
    }

    return NextResponse.json({
      mode: 'detail',
      tracks: TRACK_OPTIONS,
      start_date: start,
      end_date: end,
      totals: {
        submissions: typedSubmissions.length,
        riders: riders.length,
      },
      days,
    });
  } catch (error) {
    console.error('Check-in summary GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
