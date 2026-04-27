-- Check-in submissions (household-level) and riders (per-rider details)
CREATE TABLE IF NOT EXISTS checkin_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  contact_email TEXT NOT NULL,
  checkin_date DATE NOT NULL,
  track_choice TEXT NOT NULL CHECK (
    track_choice IN ('mile_high', 'dacono', 'county_line', 'twin_silos', 'other')
  ),
  other_track_name TEXT NULL,
  human_test_passed BOOLEAN NOT NULL DEFAULT TRUE,
  source_ip_hash TEXT NULL,
  delete_token_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'removed', 'suspicious')),
  removed_at TIMESTAMPTZ NULL,
  suspicion_score INTEGER NOT NULL DEFAULT 0 CHECK (suspicion_score >= 0),
  CONSTRAINT other_track_required CHECK (
    (track_choice <> 'other' AND other_track_name IS NULL)
    OR
    (track_choice = 'other' AND other_track_name IS NOT NULL AND length(trim(other_track_name)) > 0)
  )
);

CREATE TABLE IF NOT EXISTS checkin_riders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES checkin_submissions(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL CHECK (length(trim(display_name)) > 0),
  age INTEGER NULL CHECK (age IS NULL OR (age >= 1 AND age <= 99)),
  experience_level TEXT NULL CHECK (
    experience_level IS NULL OR experience_level IN ('novice', 'intermediate', 'expert', 'pro')
  )
);

CREATE INDEX IF NOT EXISTS idx_checkin_submissions_date_track
  ON checkin_submissions(checkin_date, track_choice);

CREATE INDEX IF NOT EXISTS idx_checkin_submissions_status_date_track
  ON checkin_submissions(status, checkin_date, track_choice);

CREATE INDEX IF NOT EXISTS idx_checkin_riders_experience
  ON checkin_riders(experience_level);

CREATE INDEX IF NOT EXISTS idx_checkin_riders_submission
  ON checkin_riders(submission_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_household_checkin
  ON checkin_submissions(
    contact_email,
    checkin_date,
    track_choice,
    COALESCE(other_track_name, '')
  );

-- Row-level security
ALTER TABLE checkin_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_riders ENABLE ROW LEVEL SECURITY;

-- Public can read active check-ins and all riders tied to visible submissions
CREATE POLICY "Public can view submissions"
ON checkin_submissions FOR SELECT
TO anon
USING (status = 'active');

CREATE POLICY "Public can view riders"
ON checkin_riders FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1
    FROM checkin_submissions s
    WHERE s.id = checkin_riders.submission_id
      AND s.status = 'active'
  )
);

-- Public can insert via API route
CREATE POLICY "Public can insert submissions"
ON checkin_submissions FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Public can insert riders"
ON checkin_riders FOR INSERT
TO anon
WITH CHECK (true);

-- Public can update rows to support controlled soft-delete from API
CREATE POLICY "Public can update submissions"
ON checkin_submissions FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
