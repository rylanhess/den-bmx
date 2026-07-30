-- Enable Row Level Security on public reference tables.
-- The site reads these via the anon key; scrapers use the service role (bypasses RLS).

ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

-- Public read-only access (tracks listing, events join, refresh-status)
CREATE POLICY "Public can view tracks"
  ON tracks
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view sources"
  ON sources
  FOR SELECT
  TO anon, authenticated
  USING (true);
