-- Fix Duplicate Events and Add Proper Unique Constraint

-- 1. Delete duplicate events (keep only the earliest created_at for each unique combination)
DELETE FROM events
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY track_id, start_at, LEFT(title, 100)
             ORDER BY created_at ASC
           ) as row_num
    FROM events
  ) t
  WHERE row_num > 1
);

-- 2. Drop the old unique index if it exists
DROP INDEX IF EXISTS events_dedupe_idx;

-- 3. Create a better unique constraint
-- This prevents duplicates: same track + same start time + same title (first 100 chars)
CREATE UNIQUE INDEX events_dedupe_idx 
  ON events (track_id, start_at, LEFT(title, 100));

-- 4. Show current event counts by track
SELECT 
  t.name as track_name,
  COUNT(e.id) as event_count,
  COUNT(CASE WHEN e.status = 'scheduled' THEN 1 END) as scheduled,
  COUNT(CASE WHEN e.status = 'cancelled' THEN 1 END) as cancelled
FROM tracks t
LEFT JOIN events e ON t.id = e.track_id
GROUP BY t.name
ORDER BY t.name;

