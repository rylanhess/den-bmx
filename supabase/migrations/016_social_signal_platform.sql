-- Support Instagram signals alongside Facebook in fb_post_signals

ALTER TABLE fb_post_signals
  ADD COLUMN IF NOT EXISTS platform TEXT NOT NULL DEFAULT 'facebook';

ALTER TABLE fb_post_signals DROP CONSTRAINT IF EXISTS fb_post_signals_fb_url_key;
ALTER TABLE fb_post_signals DROP CONSTRAINT IF EXISTS fb_post_signals_platform_check;

ALTER TABLE fb_post_signals
  ADD CONSTRAINT fb_post_signals_platform_check
  CHECK (platform IN ('facebook', 'instagram'));

CREATE UNIQUE INDEX IF NOT EXISTS idx_fb_post_signals_platform_url
  ON fb_post_signals (platform, fb_url);
