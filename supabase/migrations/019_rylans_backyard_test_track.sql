-- Test track for operator/admin flow QA (unclaimed by default)

INSERT INTO tracks (name, slug, city, tz, description)
VALUES (
  'Rylan''s backyard',
  'rylans-backyard',
  'Denver, CO',
  'America/Denver',
  'Sandbox track for testing operator claims, schedule edits, and moderation flows.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  description = EXCLUDED.description;

INSERT INTO forum_categories (slug, name, description, sort_order, track_id)
SELECT
  'rylans-backyard-comms',
  'Rylan''s backyard — Track Comms',
  'Official track communications and discussion for Rylan''s backyard.',
  99,
  t.id
FROM tracks t
WHERE t.slug = 'rylans-backyard'
ON CONFLICT (slug) DO NOTHING;

-- Welcome thread (idempotent)
WITH cat AS (
  SELECT fc.id AS category_id, fc.track_id
  FROM forum_categories fc
  JOIN tracks t ON t.id = fc.track_id
  WHERE t.slug = 'rylans-backyard'
),
ins_thread AS (
  INSERT INTO forum_threads (
    category_id,
    track_id,
    author_id,
    title,
    is_pinned,
    is_locked,
    is_system,
    reply_count,
    last_post_at
  )
  SELECT
    category_id,
    track_id,
    NULL,
    'Welcome — Rylan''s backyard Track Comms',
    TRUE,
    FALSE,
    FALSE,
    0,
    NOW()
  FROM cat
  WHERE NOT EXISTS (
    SELECT 1
    FROM forum_threads ft
    JOIN cat c ON ft.category_id = c.category_id
    WHERE ft.title = 'Welcome — Rylan''s backyard Track Comms'
  )
  RETURNING id
)
INSERT INTO forum_posts (thread_id, author_id, body)
SELECT
  id,
  NULL,
  'This is the official discussion board for **Rylan''s backyard**. Track operators can claim this page to moderate discussions. When Rylan''s backyard posts on Facebook, you''ll see a notification here with a link to check it out — we don''t copy Facebook content, just let you know when something new is up.'
FROM ins_thread;

-- Keep track boards sorted (10–99)
WITH ranked AS (
  SELECT id, 10 + ROW_NUMBER() OVER (ORDER BY name) AS new_sort
  FROM forum_categories
  WHERE track_id IS NOT NULL
)
UPDATE forum_categories c
SET sort_order = r.new_sort
FROM ranked r
WHERE c.id = r.id;
