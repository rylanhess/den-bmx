-- Remove sandbox test track used for claim/operator QA

DELETE FROM forum_categories
WHERE slug = 'rylans-backyard-comms';

DELETE FROM tracks
WHERE slug = 'rylans-backyard';
