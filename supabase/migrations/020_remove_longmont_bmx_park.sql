-- Remove placeholder Longmont BMX Park (not a USA BMX race track; thin/incorrect data)

DELETE FROM forum_categories
WHERE slug = 'longmont-bmx-park-comms';

DELETE FROM tracks
WHERE slug = 'longmont-bmx-park';
