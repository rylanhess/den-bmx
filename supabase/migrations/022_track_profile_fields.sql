-- Track profile contact fields for /tracks cards and /tracks/[slug]
-- Operator name left blank for operators/admins to fill in later.

ALTER TABLE tracks ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS operator_name TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS aerial_image TEXT;

-- Website: Facebook page is an acceptable stand-in when no dedicated site exists.
UPDATE tracks
SET website = fb_page_url
WHERE website IS NULL AND fb_page_url IS NOT NULL;

-- Aerial: reuse USA BMX wallpaper/hero shots already stored on some tracks.
UPDATE tracks
SET aerial_image = wallpaper
WHERE aerial_image IS NULL AND wallpaper IS NOT NULL;

-- Street addresses for Colorado race tracks (public venue locations).
UPDATE tracks SET address = '3606 S Independence St, Lakewood, CO 80235' WHERE slug = 'mile-high-bmx' AND address IS NULL;
UPDATE tracks SET address = '8560 S Colorado Blvd, Centennial, CO 80126' WHERE slug = 'county-line-bmx' AND address IS NULL;
UPDATE tracks SET address = '113 Forest Ave, Dacono, CO 80514' WHERE slug = 'dacono-bmx' AND address IS NULL;
UPDATE tracks SET address = '5400 Ziegler Rd, Fort Collins, CO 80528' WHERE slug = 'twin-silo-bmx' AND address IS NULL;
UPDATE tracks SET address = '360 S Camino Del Rio, Durango, CO 81301' WHERE slug = 'durango-bmx' AND address IS NULL;
UPDATE tracks SET address = '2785 US Hwy 50, Grand Junction, CO 81503' WHERE slug = 'grand-valley-bmx' AND address IS NULL;
UPDATE tracks SET address = '1700 Brush Creek Rd, Eagle, CO 81631' WHERE slug = 'eagle-county-bmx' AND address IS NULL;
UPDATE tracks SET address = '501 Eagle County Dr, El Jebel, CO 81623' WHERE slug = 'crown-mountain-bmx-park' AND address IS NULL;
UPDATE tracks SET address = '1425 E Empire St, Cortez, CO 81321' WHERE slug = 'cortez-bmx' AND address IS NULL;
UPDATE tracks SET address = '8115 Parkglen Dr, Fountain, CO 80817' WHERE slug = 'cross-creek-bmx' AND address IS NULL;
UPDATE tracks SET address = '635 Main St S, La Jara, CO 81140' WHERE slug = 'higher-ground-bmx' AND address IS NULL;
