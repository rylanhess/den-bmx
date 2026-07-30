-- Public user profiles: home track, practice schedule, USA BMX linkage

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS home_track_id UUID REFERENCES tracks(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS practice_schedule TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS usabmx_profile_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS usabmx_profile_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS usabmx_rider_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS usabmx_points INT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS usabmx_points_rank INT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS usabmx_points_detail JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS usabmx_synced_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_profiles_home_track ON profiles(home_track_id);
CREATE INDEX IF NOT EXISTS idx_profiles_usabmx_points ON profiles(usabmx_points) WHERE usabmx_points IS NOT NULL;
