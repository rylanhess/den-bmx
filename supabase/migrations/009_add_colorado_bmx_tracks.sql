-- Add Colorado USA BMX race tracks + forum comms boards

INSERT INTO tracks (name, slug, city, tz, usabmx_url, lat, lon, fb_page_url)
VALUES
  (
    'Eagle County BMX',
    'eagle-county-bmx',
    'Eagle, CO',
    'America/Denver',
    'https://www.usabmx.com/tracks/co-eagle-county%20bmx%20(co)',
    39.6556,
    -106.8267,
    'https://www.facebook.com/eaglecombmx/'
  ),
  (
    'Crown Mountain BMX Park',
    'crown-mountain-bmx-park',
    'El Jebel, CO',
    'America/Denver',
    'https://www.usabmx.com/tracks/co-crown-mountain-bmx-park',
    39.3947,
    -107.0903,
    NULL
  ),
  (
    'Cortez BMX',
    'cortez-bmx',
    'Cortez, CO',
    'America/Denver',
    'https://www.usabmx.com/tracks/co-cortez-bmx',
    37.3489,
    -108.5859,
    NULL
  ),
  (
    'Cross Creek BMX',
    'cross-creek-bmx',
    'Fountain, CO',
    'America/Denver',
    'https://www.usabmx.com/tracks/co-cross-creek-bmx',
    38.6822,
    -104.7008,
    NULL
  ),
  (
    'Higher Ground BMX',
    'higher-ground-bmx',
    'La Jara, CO',
    'America/Denver',
    'https://www.usabmx.com/tracks/co-higher-ground-bmx',
    37.2747,
    -105.9925,
    NULL
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  usabmx_url = EXCLUDED.usabmx_url,
  lat = COALESCE(EXCLUDED.lat, tracks.lat),
  lon = COALESCE(EXCLUDED.lon, tracks.lon),
  fb_page_url = COALESCE(EXCLUDED.fb_page_url, tracks.fb_page_url);

-- Normalize Grand Valley USA BMX URL to current site format
UPDATE tracks
SET usabmx_url = 'https://www.usabmx.com/tracks/co-grand-valley-bmx'
WHERE slug = 'grand-valley-bmx';

-- Per-track comms boards for new tracks
INSERT INTO forum_categories (slug, name, description, sort_order, track_id)
SELECT
  t.slug || '-comms',
  t.name || ' — Track Comms',
  'Official track communications and discussion for ' || t.name || '.',
  0,
  t.id
FROM tracks t
WHERE t.slug IN (
  'eagle-county-bmx',
  'crown-mountain-bmx-park',
  'cortez-bmx',
  'cross-creek-bmx',
  'higher-ground-bmx'
)
ON CONFLICT (slug) DO NOTHING;

-- Keep track message boards sorted first (10–99)
WITH ranked AS (
  SELECT id, 10 + ROW_NUMBER() OVER (ORDER BY name) AS new_sort
  FROM forum_categories
  WHERE track_id IS NOT NULL
)
UPDATE forum_categories c
SET sort_order = r.new_sort
FROM ranked r
WHERE c.id = r.id;
