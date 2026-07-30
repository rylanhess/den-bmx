-- BMX Colorado forum schema + auth profiles

-- Extend tracks for track page content
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Forum categories
CREATE TABLE IF NOT EXISTS forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  track_id UUID REFERENCES tracks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forum threads
CREATE TABLE IF NOT EXISTS forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  reply_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_post_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_threads_category ON forum_threads(category_id, last_post_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_threads_track ON forum_threads(track_id);

-- Forum posts
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  fb_url TEXT,
  is_reported BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edited_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_forum_posts_thread ON forum_posts(thread_id, created_at ASC);

-- Track moderators
CREATE TABLE IF NOT EXISTS track_moderators (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, track_id)
);

-- Track claim requests
CREATE TABLE IF NOT EXISTS track_claim_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_track_claim_requests_status ON track_claim_requests(status);

-- Facebook post signals (metadata only — no FB content)
CREATE TABLE IF NOT EXISTS fb_post_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  fb_url TEXT NOT NULL UNIQUE,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  forum_thread_id UUID REFERENCES forum_threads(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_fb_post_signals_track ON fb_post_signals(track_id, detected_at DESC);

-- Helper: check if user is track moderator
CREATE OR REPLACE FUNCTION public.is_track_moderator(p_user_id UUID, p_track_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM track_moderators
    WHERE user_id = p_user_id AND track_id = p_track_id
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = p_user_id AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_moderators ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_claim_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE fb_post_signals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Authenticated can view profiles"
  ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Forum categories: authenticated read
CREATE POLICY "Authenticated can view categories"
  ON forum_categories FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage categories"
  ON forum_categories FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Forum threads
CREATE POLICY "Authenticated can view threads"
  ON forum_threads FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can create threads"
  ON forum_threads FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND is_system = FALSE);

CREATE POLICY "Authors and mods can update threads"
  ON forum_threads FOR UPDATE TO authenticated
  USING (
    author_id = auth.uid()
    OR public.is_admin(auth.uid())
    OR (track_id IS NOT NULL AND public.is_track_moderator(auth.uid(), track_id))
  );

-- Forum posts
CREATE POLICY "Authenticated can view posts"
  ON forum_posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can create posts"
  ON forum_posts FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors and mods can update posts"
  ON forum_posts FOR UPDATE TO authenticated
  USING (
    author_id = auth.uid()
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Authors and mods can delete posts"
  ON forum_posts FOR DELETE TO authenticated
  USING (
    author_id = auth.uid()
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM forum_threads t
      WHERE t.id = thread_id
        AND t.track_id IS NOT NULL
        AND public.is_track_moderator(auth.uid(), t.track_id)
    )
  );

-- Track moderators
CREATE POLICY "Authenticated can view moderators"
  ON track_moderators FOR SELECT TO authenticated USING (true);

-- Track claim requests
CREATE POLICY "Users can view own claims"
  ON track_claim_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can submit claims"
  ON track_claim_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update claims"
  ON track_claim_requests FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

-- FB signals: authenticated read
CREATE POLICY "Authenticated can view fb signals"
  ON fb_post_signals FOR SELECT TO authenticated USING (true);

-- Tracks: allow authenticated update for mods/admins on claimed tracks
CREATE POLICY "Mods can update track description"
  ON tracks FOR UPDATE TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR public.is_track_moderator(auth.uid(), id)
  )
  WITH CHECK (
    public.is_admin(auth.uid())
    OR public.is_track_moderator(auth.uid(), id)
  );

-- Seed forum categories (general topics)
INSERT INTO forum_categories (slug, name, description, sort_order) VALUES
  ('grands', 'Grands (Tulsa, November)', 'Discussion about the Grands — the biggest race of the year in Tulsa, OK each November.', 10),
  ('nationals', 'Nationals Qualification', 'Nationals schedule, qualifying points, and race strategy.', 20),
  ('regionals', 'Regional Races', 'Colorado regional races and results.', 30),
  ('state-championship', 'State Championship', 'Colorado state championship discussion.', 40),
  ('beginners', 'Beginners — Getting Started', 'New to BMX? Ask questions about getting started, gear, and first races.', 50),
  ('freestyle', 'Freestyle', 'Freestyle BMX at Valmont, Ruby Hill, Durango, and other Colorado spots.', 60),
  ('pump-tracks', 'Pump Tracks', 'Pump track locations, sessions, and tips across Colorado.', 70),
  ('track-locator', 'Track Locator', 'Find BMX tracks and parks across Colorado.', 80),
  ('denver-cup', 'Should We Start a Denver Cup?', 'Community discussion about a Denver Cup / race circuit.', 90),
  ('gear', 'Gear & Equipment', 'Bikes, parts, helmets, and gear talk.', 100)
ON CONFLICT (slug) DO NOTHING;

-- Per-track comms categories
INSERT INTO forum_categories (slug, name, description, sort_order, track_id)
SELECT
  t.slug || '-comms',
  t.name || ' — Track Comms',
  'Official track communications and discussion for ' || t.name || '.',
  200 + ROW_NUMBER() OVER (ORDER BY t.name),
  t.id
FROM tracks t
WHERE t.slug IN (
  'mile-high-bmx', 'dacono-bmx', 'county-line-bmx', 'twin-silo-bmx',
  'durango-bmx', 'grand-valley-bmx', 'longmont-bmx-park'
)
ON CONFLICT (slug) DO NOTHING;

-- Add sources for Durango and Grand Valley if missing
INSERT INTO sources (track_id, type, url, last_checked_at)
SELECT t.id, 'facebook', t.fb_page_url, NOW()
FROM tracks t
WHERE t.slug IN ('durango-bmx', 'grand-valley-bmx')
  AND t.fb_page_url IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM sources s WHERE s.track_id = t.id AND s.type = 'facebook'
  );
