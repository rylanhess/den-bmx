'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  EXPERIENCE_LEVELS,
  MAX_RIDERS_PER_SUBMISSION,
  TRACK_OPTIONS,
  TrackChoice,
  addDays,
  startOfDayIso,
  trackLabel,
} from '@/lib/checkins';
import {
  StoredCheckin,
  clearStoredEmail,
  readMyCheckins,
  readRememberPreference,
  readStoredEmail,
  removeStoredCheckin,
  storeCheckin,
  writeRememberPreference,
  writeStoredEmail,
} from '@/lib/checkinIdentity';

type RiderForm = {
  display_name: string;
  age: string;
  experience_level: string;
};

type DetailSummary = {
  date: string;
  submissions: number;
  riders: number;
  tracks: Record<string, number>;
  experience: Record<string, number>;
  notes: string[];
};

type EventApiItem = {
  start_at: string;
  title?: string;
  track?: {
    slug?: string;
    name?: string;
  };
};

type ActiveCheckinContext = {
  date: string;
  trackChoice: TrackChoice;
  intentSubmissionId: string;
  intentOwnershipToken: string;
  confirmedEvent: boolean;
};

const initialRider = (): RiderForm => ({
  display_name: '',
  age: '',
  experience_level: '',
});

const slugToTrackChoice: Record<string, TrackChoice> = {
  'mile-high-bmx': 'mile_high',
  'dacono-bmx': 'dacono',
  'county-line-bmx': 'county_line',
  'twin-silo-bmx': 'twin_silos',
};

export default function CheckInsPage() {
  const today = useMemo(() => startOfDayIso(new Date()), []);
  const [contactEmail, setContactEmail] = useState('');
  const [rememberIdentity, setRememberIdentity] = useState(true);
  const [riders, setRiders] = useState<RiderForm[]>([initialRider()]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [myCheckins, setMyCheckins] = useState<StoredCheckin[]>([]);
  const [summaryDays, setSummaryDays] = useState<DetailSummary[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [knownEventsByDateTrack, setKnownEventsByDateTrack] = useState<Record<string, string>>({});
  const [knownEventSummariesByDate, setKnownEventSummariesByDate] = useState<Record<string, string[]>>({});
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [submittingByKey, setSubmittingByKey] = useState<Record<string, boolean>>({});
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [activeCheckin, setActiveCheckin] = useState<ActiveCheckinContext | null>(null);
  const [missingEventNote, setMissingEventNote] = useState('');
  const [savingModal, setSavingModal] = useState(false);
  const [showAllDates, setShowAllDates] = useState(false);

  const endDate = useMemo(() => startOfDayIso(addDays(new Date(today), 14)), [today]);
  const dateOptions = useMemo(
    () => Array.from({ length: 14 }, (_, offset) => startOfDayIso(addDays(new Date(today), offset))),
    [today]
  );
  const visibleDateOptions = showAllDates ? dateOptions : dateOptions.slice(0, 6);

  const loadSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const response = await fetch(
        `/api/checkins/summary?mode=detail&start_date=${encodeURIComponent(today)}&end_date=${encodeURIComponent(endDate)}`
      );
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to load check-in summary.');
      setSummaryDays(payload.days ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSummary(false);
    }
  }, [today, endDate]);

  const loadKnownEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const response = await fetch('/api/events?days=14');
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to load events.');

      const events: EventApiItem[] = payload.events ?? [];
      const byDateTrack: Record<string, string> = {};
      const summaries: Record<string, string[]> = {};

      for (const event of events) {
        const date = startOfDayIso(new Date(event.start_at));
        const slug = event.track?.slug ?? '';
        const mapped = slugToTrackChoice[slug];
        if (!mapped) continue;

        const key = `${date}:${mapped}`;
        if (!byDateTrack[key]) {
          byDateTrack[key] = (event.title ?? event.track?.name ?? 'Known event').trim();
        }

        if (!summaries[date]) summaries[date] = [];
        const summary = `${trackLabel(mapped)}${event.title ? ` - ${event.title}` : ''}`;
        if (!summaries[date].includes(summary) && summaries[date].length < 3) {
          summaries[date].push(summary);
        }
      }

      setKnownEventsByDateTrack(byDateTrack);
      setKnownEventSummariesByDate(summaries);
    } catch (error) {
      console.error(error);
      setKnownEventsByDateTrack({});
      setKnownEventSummariesByDate({});
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    const remember = readRememberPreference();
    setRememberIdentity(remember);
    if (remember) {
      const remembered = readStoredEmail();
      if (remembered) setContactEmail(remembered);
    }
    setMyCheckins(readMyCheckins());
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadKnownEvents();
  }, [loadKnownEvents]);

  const formatRegularDate = (isoDate: string): string => {
    const date = new Date(`${isoDate}T00:00:00`);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const handleTrackTap = async (date: string, trackChoice: TrackChoice) => {
    const key = `${date}:${trackChoice}`;
    if (submittingByKey[key]) return;

    let otherTrackName: string | null = null;
    if (trackChoice === 'other') {
      const input = window.prompt('Enter the track name for "Other":');
      if (!input || input.trim().length < 2) {
        setErrorMessage('Please enter a valid track name for Other.');
        return;
      }
      otherTrackName = input.trim();
    }

    setSubmittingByKey((prev) => ({ ...prev, [key]: true }));
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/checkins/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkin_date: date,
          track_choice: trackChoice,
          other_track_name: otherTrackName,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to register check-in.');

      const stored: StoredCheckin = {
        submission_id: result.intent.id,
        delete_token: result.ownership_token,
        checkin_date: result.intent.checkin_date,
        track_choice: result.intent.track_choice,
        created_at: new Date().toISOString(),
      };
      storeCheckin(stored);
      setMyCheckins(readMyCheckins());
      setCheckedKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));

      setActiveCheckin({
        date,
        trackChoice,
        intentSubmissionId: result.intent.id,
        intentOwnershipToken: result.ownership_token,
        confirmedEvent: Boolean(knownEventsByDateTrack[key]),
      });
      setMissingEventNote('');
      setStatusMessage('Check-in saved. Want to add details so other riders know you are going?');
      await loadSummary();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to register check-in.');
    } finally {
      setSubmittingByKey((prev) => ({ ...prev, [key]: false }));
    }
  };

  const addRider = () => {
    if (riders.length >= MAX_RIDERS_PER_SUBMISSION) return;
    setRiders((prev) => [...prev, initialRider()]);
  };

  const removeRider = (index: number) => {
    if (riders.length <= 1) return;
    setRiders((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateRider = (index: number, key: keyof RiderForm, value: string) => {
    setRiders((prev) => prev.map((rider, idx) => (idx === index ? { ...rider, [key]: value } : rider)));
  };

  const saveDetailsForCheckin = async () => {
    if (!activeCheckin) return;

    setErrorMessage(null);
    setStatusMessage(null);
    setSavingModal(true);
    try {
      const patchResponse = await fetch('/api/checkins/intent', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: activeCheckin.intentSubmissionId,
          ownership_token: activeCheckin.intentOwnershipToken,
          contact_email: contactEmail.trim() || null,
          riders: riders.map((rider) => ({
            display_name: rider.display_name.trim(),
            age: rider.age ? Number(rider.age) : null,
            experience_level: rider.experience_level || null,
          })),
        }),
      });
      const patchResult = await patchResponse.json();
      if (!patchResponse.ok) throw new Error(patchResult.error ?? 'Unable to save details.');

      if (!activeCheckin.confirmedEvent && missingEventNote.trim().length >= 3) {
        const noteResponse = await fetch('/api/checkins/event-notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkin_date: activeCheckin.date,
            track_choice: activeCheckin.trackChoice,
            note_text: missingEventNote.trim(),
          }),
        });
        const noteResult = await noteResponse.json();
        if (!noteResponse.ok) throw new Error(noteResult.error ?? 'Unable to save event note.');
      }

      if (rememberIdentity && contactEmail.trim()) {
        writeStoredEmail(contactEmail.trim().toLowerCase());
      }

      setStatusMessage('Details saved. Thanks for helping riders know where to race.');
      setRiders([initialRider()]);
      setMissingEventNote('');
      setActiveCheckin(null);
      await loadSummary();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save details.');
    } finally {
      setSavingModal(false);
    }
  };

  const removeCheckin = async (record: StoredCheckin) => {
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const response = await fetch('/api/checkins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: record.submission_id,
          delete_token: record.delete_token,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to remove check-in.');

      removeStoredCheckin(record.submission_id);
      setMyCheckins(readMyCheckins());
      setStatusMessage('Check-in removed.');
      await loadSummary();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to remove check-in.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        <section className="border-2 border-[#00ff0c] rounded-2xl bg-black/70 p-5">
          <h1 className="text-2xl sm:text-3xl font-black text-[#00ff0c] mb-2">Track Check-Ins</h1>
          <p className="text-sm text-gray-300 mb-4">
            Pick a date and tap a track. Gray tracks are unconfirmed events, but you can still check in and help crowdsource event info.
          </p>
          <a
            href="#checkin-day-summaries"
            className="inline-flex items-center text-xs sm:text-sm font-bold border border-[#00ff0c]/70 rounded-lg px-3 py-1.5 text-[#00ff0c] hover:bg-[#00ff0c]/10 mb-4"
          >
            Jump to day summaries
          </a>

          {loadingEvents ? (
            <p className="text-sm text-gray-300">Loading upcoming events...</p>
          ) : (
            <div className="space-y-3">
              {visibleDateOptions.map((date) => {
                const summary = knownEventSummariesByDate[date] ?? [];
                return (
                  <div key={date} className="border border-[#00ff0c]/30 rounded-2xl p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <p className="text-lg font-black">{formatRegularDate(date)}</p>
                      <p className="text-xs sm:text-sm text-[#00ff0c] max-w-[420px] truncate">
                        {summary.length > 0 ? summary.join(' | ') : 'No confirmed events listed yet'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {TRACK_OPTIONS.map((track) => {
                        const key = `${date}:${track.value}`;
                        const known = Boolean(knownEventsByDateTrack[key]);
                        const checked = checkedKeys.includes(key);
                        const busy = Boolean(submittingByKey[key]);
                        return (
                          <button
                            type="button"
                            key={key}
                            onClick={() => handleTrackTap(date, track.value)}
                            disabled={busy}
                            className={`rounded-lg px-3 py-2 text-sm font-bold border transition ${
                              checked
                                ? 'border-[#00ff0c] bg-[#00ff0c]/20 text-[#00ff0c]'
                                : known
                                  ? 'border-[#00ff0c] bg-black text-white hover:bg-[#00ff0c]/10'
                                  : 'border-gray-600 bg-gray-800/70 text-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <span className="inline-flex items-center justify-center gap-1">
                              {busy ? '...' : checked ? <CheckCircleIcon className="w-4 h-4" /> : null}
                              {track.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-1 pt-1 border-t border-[#00ff0c]/25 flex justify-end">
                      <a
                        href={`#summary-${date}`}
                        className="text-xs font-bold text-[#00ff0c] underline underline-offset-2 whitespace-nowrap min-h-0 h-auto leading-none py-0"
                      >
                        See totals...
                      </a>
                    </div>
                  </div>
                );
              })}
              {dateOptions.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowAllDates((prev) => !prev)}
                  className="w-full border border-[#00ff0c]/60 rounded-xl py-2 text-sm font-bold text-[#00ff0c] hover:bg-[#00ff0c]/10"
                >
                  {showAllDates ? 'Show fewer dates' : `Show ${dateOptions.length - 6} more dates`}
                </button>
              )}
            </div>
          )}

          {(statusMessage || errorMessage) && (
            <p className={`mt-3 text-sm ${errorMessage ? 'text-red-400' : 'text-[#00ff0c]'}`}>
              {errorMessage ?? statusMessage}
            </p>
          )}
        </section>

        {activeCheckin && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-2xl border-2 border-[#00ff0c] bg-black p-5 space-y-4">
              <h3 className="text-xl font-black text-[#00ff0c]">Nice! You are checked in.</h3>
              <p className="text-sm text-gray-200">
                Do you want to add your name and email so other riders know you are going?
              </p>

              {!activeCheckin.confirmedEvent && (
                <div className="border border-yellow-500/50 bg-yellow-500/10 rounded-xl p-3">
                  <p className="text-sm font-semibold text-yellow-300 mb-2">
                    This track/date is currently unconfirmed on the site.
                  </p>
                  <p className="text-xs text-gray-200 mb-2">
                    If you know about an upcoming event, leave a note and we will surface it in the day summary.
                  </p>
                  <textarea
                    value={missingEventNote}
                    onChange={(event) => setMissingEventNote(event.target.value)}
                    placeholder="Example: Local race at 6pm, registration opens at 5:30."
                    className="w-full rounded-lg border border-yellow-500/60 bg-black px-3 py-2 text-white min-h-[88px]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-[#00ff0c]">Email (optional)</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(event) => setContactEmail(event.target.value)}
                  className="w-full rounded-lg border border-[#00ff0c]/50 bg-black px-3 py-2 text-white"
                  placeholder="you@email.com"
                />
                <div className="flex flex-wrap gap-3 text-xs">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberIdentity}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setRememberIdentity(checked);
                        writeRememberPreference(checked);
                        if (!checked) clearStoredEmail();
                      }}
                    />
                    Remember this email on this browser
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold uppercase text-[#00ff0c]">Riders</p>
                  <p className="text-xs text-gray-300">{riders.length} rider{riders.length === 1 ? '' : 's'}</p>
                </div>
                <div className="border border-[#00ff0c]/35 bg-[#00ff0c]/10 rounded-xl p-3">
                  <p className="text-sm font-semibold text-[#00ff0c] mb-2">Bringing multiple riders?</p>
                  <button
                    type="button"
                    onClick={addRider}
                    className="w-full sm:w-auto text-sm font-bold px-4 py-2 border border-[#00ff0c] rounded-lg bg-black hover:bg-[#00ff0c]/15"
                  >
                    + Add another rider
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-auto pr-1">
                  {riders.map((rider, index) => (
                    <div key={index} className="border border-[#00ff0c]/25 rounded-xl p-3 grid md:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Rider name"
                        value={rider.display_name}
                        onChange={(event) => updateRider(index, 'display_name', event.target.value)}
                        className="rounded-lg border border-[#00ff0c]/40 bg-black px-3 py-2 text-white"
                      />
                      <input
                        type="number"
                        min={1}
                        max={99}
                        placeholder="Age"
                        value={rider.age}
                        onChange={(event) => updateRider(index, 'age', event.target.value)}
                        className="rounded-lg border border-[#00ff0c]/40 bg-black px-3 py-2 text-white"
                      />
                      <select
                        value={rider.experience_level}
                        onChange={(event) => updateRider(index, 'experience_level', event.target.value)}
                        className="rounded-lg border border-[#00ff0c]/40 bg-black px-3 py-2 text-white"
                      >
                        <option value="">Experience</option>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeRider(index)}
                        disabled={riders.length <= 1}
                        className="rounded-lg border border-red-400/60 px-3 py-2 text-red-300 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setActiveCheckin(null)}
                  className="px-3 py-2 rounded-lg border border-gray-500 text-gray-200"
                >
                  Keep anonymous
                </button>
                <button
                  type="button"
                  onClick={saveDetailsForCheckin}
                  disabled={savingModal}
                  className="px-3 py-2 rounded-lg bg-[#00ff0c] text-black font-bold disabled:opacity-50"
                >
                  {savingModal ? 'Saving...' : 'Save details'}
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="border border-[#00ff0c]/35 rounded-2xl p-5">
          <h2 className="text-xl font-black text-[#00ff0c] mb-2">Your Recent Check-Ins</h2>
          <p className="text-xs text-gray-400 mb-4">
            Remove is available for check-ins created from this browser only.
          </p>
          {myCheckins.length === 0 ? (
            <p className="text-sm text-gray-300">No recent check-ins stored in this browser.</p>
          ) : (
            <div className="space-y-2">
              {myCheckins.map((record) => (
                <div
                  key={record.submission_id}
                  className="flex flex-wrap items-center justify-between gap-3 border border-[#00ff0c]/25 rounded-lg px-3 py-2"
                >
                  <p className="text-sm">
                    {record.checkin_date} - {trackLabel(record.track_choice as TrackChoice)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeCheckin(record)}
                    className="text-xs border border-red-500/60 text-red-300 px-2 py-1 rounded hover:bg-red-500/10"
                  >
                    Remove check-in
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="checkin-day-summaries" className="border border-[#00ff0c]/35 rounded-2xl p-5">
          <h2 className="text-xl font-black text-[#00ff0c] mb-4">Upcoming Check-In Totals</h2>
          {loadingSummary ? (
            <p className="text-sm text-gray-300">Loading summary...</p>
          ) : summaryDays.length === 0 ? (
            <p className="text-sm text-gray-300">No check-ins yet for this date range.</p>
          ) : (
            <div className="space-y-4">
              {summaryDays.map((day) => (
                <div id={`summary-${day.date}`} key={day.date} className="border border-[#00ff0c]/20 rounded-xl p-4">
                  <div className="flex flex-wrap gap-3 justify-between mb-2">
                    <p className="font-bold">{day.date}</p>
                    <p className="text-sm text-gray-300">
                      Submissions: {day.submissions} | Riders: {day.riders}
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2 text-sm mb-3">
                    {TRACK_OPTIONS.map((track) => (
                      <div key={track.value} className="border border-[#00ff0c]/25 rounded px-2 py-1">
                        <span className="text-gray-300">{track.label}:</span> {day.tracks[track.value] ?? 0}
                      </div>
                    ))}
                  </div>
                  {day.notes?.length > 0 && (
                    <div className="mb-3 border border-yellow-500/40 rounded p-2 bg-yellow-500/5">
                      <p className="text-xs font-semibold text-yellow-300 mb-1">Community event notes</p>
                      <div className="space-y-1">
                        {day.notes.map((note, index) => (
                          <p key={`${day.date}-note-${index}`} className="text-xs text-gray-200">
                            - {note}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs text-gray-300">
                    <div>Novice: {day.experience.novice ?? 0}</div>
                    <div>Intermediate: {day.experience.intermediate ?? 0}</div>
                    <div>Expert: {day.experience.expert ?? 0}</div>
                    <div>Pro: {day.experience.pro ?? 0}</div>
                    <div>Unknown: {day.experience.unknown ?? 0}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
