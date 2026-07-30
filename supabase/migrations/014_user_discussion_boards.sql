-- User-created discussion boards, daily rate limit, email verification for posting

ALTER TABLE forum_categories
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_forum_categories_created_by ON forum_categories(created_by);
CREATE INDEX IF NOT EXISTS idx_forum_categories_discussion_created
  ON forum_categories(created_at DESC)
  WHERE track_id IS NULL;

CREATE OR REPLACE FUNCTION public.has_verified_email()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND email_confirmed_at IS NOT NULL
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.can_create_discussion_board()
RETURNS BOOLEAN AS $$
  SELECT (
    SELECT COUNT(*)::int
    FROM forum_categories
    WHERE created_by = auth.uid()
      AND track_id IS NULL
      AND created_at > NOW() - INTERVAL '1 day'
  ) < 2;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE POLICY "Users can create discussion boards"
  ON forum_categories FOR INSERT TO authenticated
  WITH CHECK (
    track_id IS NULL
    AND created_by = auth.uid()
    AND public.has_verified_email()
    AND public.can_create_discussion_board()
  );

DROP POLICY IF EXISTS "Authenticated can create threads" ON forum_threads;
CREATE POLICY "Verified users can create threads"
  ON forum_threads FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND is_system = FALSE
    AND public.has_verified_email()
  );

DROP POLICY IF EXISTS "Authenticated can create posts" ON forum_posts;
CREATE POLICY "Verified users can create posts"
  ON forum_posts FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND public.has_verified_email()
  );
