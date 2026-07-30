-- Allow guests (anon) to browse forum content read-only

-- Forum categories
CREATE POLICY "Anon can view categories"
  ON forum_categories FOR SELECT TO anon USING (true);

-- Forum threads
CREATE POLICY "Anon can view threads"
  ON forum_threads FOR SELECT TO anon USING (true);

-- Forum posts
CREATE POLICY "Anon can view posts"
  ON forum_posts FOR SELECT TO anon USING (true);

-- Profiles (display names on posts)
CREATE POLICY "Anon can view profiles"
  ON profiles FOR SELECT TO anon USING (true);

-- FB signals
CREATE POLICY "Anon can view fb signals"
  ON fb_post_signals FOR SELECT TO anon USING (true);

-- Track moderators (public info)
CREATE POLICY "Anon can view moderators"
  ON track_moderators FOR SELECT TO anon USING (true);
