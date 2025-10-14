-- Add unique constraint to alerts table to prevent duplicates at database level
-- This is an OPTIONAL but recommended migration for additional protection

-- Option 1: Unique constraint on URL (best for posts with URLs)
-- This allows same URL to be posted by different tracks, but prevents duplicate alerts per track
create unique index if not exists alerts_url_unique_idx 
  on alerts (track_id, url)
  where url is not null;

-- Option 2: Unique constraint on text + timestamp (for posts without URLs)
-- Using first 100 chars of text to avoid index size limits
create unique index if not exists alerts_text_time_unique_idx
  on alerts (track_id, posted_at, substring(text, 1, 100));

-- Note: If you already have duplicates in your database, you'll need to clean them first:
-- 
-- 1. Find duplicates by URL:
--    select track_id, url, count(*) as cnt
--    from alerts
--    where url is not null
--    group by track_id, url
--    having count(*) > 1
--    order by cnt desc;
--
-- 2. Find duplicates by text (first 100 chars):
--    select track_id, substring(text, 1, 100) as text_prefix, count(*) as cnt
--    from alerts
--    group by track_id, substring(text, 1, 100)
--    having count(*) > 1
--    order by cnt desc;
--
-- 3. Delete duplicates (keeps oldest record):
--    delete from alerts a
--    using (
--      select track_id, url, min(posted_at) as first_post
--      from alerts
--      where url is not null
--      group by track_id, url
--      having count(*) > 1
--    ) b
--    where a.track_id = b.track_id
--      and a.url = b.url
--      and a.posted_at > b.first_post;
--
-- 4. Then run the CREATE INDEX commands above

-- Check index status:
-- select indexname, indexdef
-- from pg_indexes
-- where tablename = 'alerts'
-- order by indexname;

