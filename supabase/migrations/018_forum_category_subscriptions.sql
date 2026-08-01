-- Email subscriptions: notify users when new posts appear on a board (track or discussion).

CREATE TABLE IF NOT EXISTS forum_category_subscriptions (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_forum_cat_subs_category
  ON forum_category_subscriptions(category_id);

ALTER TABLE forum_category_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own board subscriptions"
  ON forum_category_subscriptions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users subscribe to boards"
  ON forum_category_subscriptions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users unsubscribe from boards"
  ON forum_category_subscriptions FOR DELETE TO authenticated
  USING (user_id = auth.uid());
