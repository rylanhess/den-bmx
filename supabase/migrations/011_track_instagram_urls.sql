-- Instagram profiles for Colorado BMX race tracks

ALTER TABLE tracks ADD COLUMN IF NOT EXISTS instagram_url TEXT;

UPDATE tracks SET instagram_url = 'https://www.instagram.com/milehighbmx/' WHERE slug = 'mile-high-bmx';
UPDATE tracks SET instagram_url = 'https://www.instagram.com/daconobmxtrack/' WHERE slug = 'dacono-bmx';
UPDATE tracks SET instagram_url = 'https://www.instagram.com/CountyLineBMX/' WHERE slug = 'county-line-bmx';
UPDATE tracks SET instagram_url = 'https://www.instagram.com/twinsilobmx/' WHERE slug = 'twin-silo-bmx';
UPDATE tracks SET instagram_url = 'https://www.instagram.com/durango_bmx/' WHERE slug = 'durango-bmx';
UPDATE tracks SET instagram_url = 'https://www.instagram.com/grandvalleybmx/' WHERE slug = 'grand-valley-bmx';
UPDATE tracks SET instagram_url = 'https://www.instagram.com/eaglecountybmx/' WHERE slug = 'eagle-county-bmx';
UPDATE tracks SET instagram_url = 'https://www.instagram.com/crownmountainbmx/' WHERE slug = 'crown-mountain-bmx-park';
UPDATE tracks SET instagram_url = 'https://www.instagram.com/cortezbmx/' WHERE slug = 'cortez-bmx';
UPDATE tracks SET instagram_url = 'https://www.instagram.com/crosscreekbmxco/' WHERE slug = 'cross-creek-bmx';
