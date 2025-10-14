-- Migration: Add image column to alerts and events tables
-- Date: October 14, 2025
-- Description: Adds support for storing Facebook post images

-- Add image column to alerts table
ALTER TABLE public.alerts
ADD COLUMN IF NOT EXISTS image TEXT;

-- Add image column to events table
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS image TEXT;

-- Add comment to the columns
COMMENT ON COLUMN public.alerts.image IS 'URL to the Facebook post image, if present';
COMMENT ON COLUMN public.events.image IS 'URL to the event/post image, if present';

