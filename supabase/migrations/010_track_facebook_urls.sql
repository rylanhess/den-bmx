-- Facebook pages for Colorado BMX race tracks

UPDATE tracks SET fb_page_url = 'https://www.facebook.com/crownmountainBMX/' WHERE slug = 'crown-mountain-bmx-park';
UPDATE tracks SET fb_page_url = 'https://www.facebook.com/cortezbmx/' WHERE slug = 'cortez-bmx';
UPDATE tracks SET fb_page_url = 'https://www.facebook.com/CrossCreekBMXCO/' WHERE slug = 'cross-creek-bmx';
UPDATE tracks SET fb_page_url = 'https://www.facebook.com/HigherGroundBMX/' WHERE slug = 'higher-ground-bmx';

-- FB scrape sources for tracks that didn't have one yet
INSERT INTO sources (track_id, type, url, last_checked_at)
SELECT t.id, 'facebook', t.fb_page_url, NOW()
FROM tracks t
WHERE t.slug IN (
  'crown-mountain-bmx-park',
  'cortez-bmx',
  'cross-creek-bmx',
  'higher-ground-bmx',
  'eagle-county-bmx'
)
  AND t.fb_page_url IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM sources s WHERE s.track_id = t.id AND s.type = 'facebook'
  );
