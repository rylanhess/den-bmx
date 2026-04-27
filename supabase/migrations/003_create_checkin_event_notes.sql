-- Crowdsourced notes for potentially missing event information
CREATE TABLE IF NOT EXISTS checkin_event_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  checkin_date DATE NOT NULL,
  track_choice TEXT NOT NULL CHECK (
    track_choice IN ('mile_high', 'dacono', 'county_line', 'twin_silos', 'other')
  ),
  note_text TEXT NOT NULL CHECK (length(trim(note_text)) >= 3),
  source_ip_hash TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_checkin_event_notes_date
  ON checkin_event_notes(checkin_date);

CREATE INDEX IF NOT EXISTS idx_checkin_event_notes_date_track
  ON checkin_event_notes(checkin_date, track_choice);

ALTER TABLE checkin_event_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view checkin event notes"
ON checkin_event_notes FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public can insert checkin event notes"
ON checkin_event_notes FOR INSERT
TO anon
WITH CHECK (true);
