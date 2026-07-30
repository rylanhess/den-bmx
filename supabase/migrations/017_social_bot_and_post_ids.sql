-- BMX Colorado bot profile + stronger social post dedup keys

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_bot BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE fb_post_signals
  ADD COLUMN IF NOT EXISTS external_post_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_fb_post_signals_platform_external_id
  ON fb_post_signals (platform, external_post_id)
  WHERE external_post_id IS NOT NULL;

COMMENT ON COLUMN profiles.is_bot IS 'Automated account (e.g. social scan bot). Not for human login.';
COMMENT ON COLUMN fb_post_signals.external_post_id IS 'Platform-native post id (FB numeric id or IG shortcode).';
