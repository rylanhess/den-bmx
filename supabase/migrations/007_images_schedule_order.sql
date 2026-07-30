-- Forum images, avatars, track schedule fields, category ordering

ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

ALTER TABLE tracks ADD COLUMN IF NOT EXISTS open_hours TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS schedule TEXT;

-- Track message boards first (10–99), general topics after (100+)
WITH ranked AS (
  SELECT id, 10 + ROW_NUMBER() OVER (ORDER BY name) AS new_sort
  FROM forum_categories
  WHERE track_id IS NOT NULL
)
UPDATE forum_categories c
SET sort_order = r.new_sort
FROM ranked r
WHERE c.id = r.id;

UPDATE forum_categories
SET sort_order = sort_order + 90
WHERE track_id IS NULL AND sort_order < 100;

-- Storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('forum-images', 'forum-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Forum images: public read, authenticated upload to own folder
CREATE POLICY "Public read forum images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'forum-images');

CREATE POLICY "Users upload forum images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'forum-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users delete own forum images"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'forum-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Avatars: public read, users manage own folder
CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users upload avatars"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users update own avatars"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users delete own avatars"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
