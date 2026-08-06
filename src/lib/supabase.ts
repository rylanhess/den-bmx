/**
 * Database types and legacy client export
 */

import { createClient as createBrowserClient } from './supabase/client';
import type { UserPreferences } from './userPreferences';

export const supabase = createBrowserClient();

export interface Track {
  id: string;
  name: string;
  slug: string;
  city: string;
  tz: string;
  fb_page_url: string | null;
  instagram_url: string | null;
  usabmx_url: string | null;
  lat: number | null;
  lon: number | null;
  logo: string | null;
  wallpaper: string | null;
  image: string | null;
  description: string | null;
  claimed_by: string | null;
  open_hours: string | null;
  schedule: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  track_id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  status: 'scheduled' | 'updated' | 'cancelled';
  url: string | null;
  image: string | null;
  gate_fee: string | null;
  class: string | null;
  created_at: string;
  updated_at: string;
  track?: Track;
}

export interface Alert {
  id: string;
  track_id: string;
  posted_at: string;
  text: string;
  url: string | null;
  image: string | null;
  track?: Track;
}

export interface NewsletterUser {
  id: string;
  email: string;
  subscribed_at: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  role: 'user' | 'admin';
  home_track_id: string | null;
  practice_schedule: string | null;
  usabmx_profile_url: string | null;
  usabmx_profile_id: string | null;
  usabmx_rider_name: string | null;
  usabmx_points: number | null;
  usabmx_points_rank: number | null;
  usabmx_points_detail: UsabmxPointEntry[] | null;
  usabmx_synced_at: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  is_bot: boolean;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UsabmxPointEntry {
  type: string;
  skill: string;
  points: number;
  rank: number;
}

export interface ForumCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  track_id: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ForumThread {
  id: string;
  category_id: string;
  track_id: string | null;
  author_id: string | null;
  title: string;
  is_pinned: boolean;
  is_locked: boolean;
  is_system: boolean;
  reply_count: number;
  created_at: string;
  last_post_at: string;
  /** Direct social post permalink — populated for bot cross-post threads by list queries. */
  fb_url?: string | null;
  author?: Profile;
  category?: ForumCategory;
}

export interface ForumPost {
  id: string;
  thread_id: string;
  author_id: string | null;
  body: string;
  fb_url: string | null;
  image_urls: string[] | null;
  is_reported: boolean;
  created_at: string;
  edited_at: string | null;
  author?: Profile;
}

export interface RecentForumPost {
  id: string;
  thread_id: string;
  thread_title: string;
  category_slug: string;
  category_name: string;
  body: string;
  fb_url: string | null;
  created_at: string;
  author_name: string | null;
}

export interface TrackClaimRequest {
  id: string;
  user_id: string;
  track_id: string;
  contact_name: string;
  contact_email: string;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  track?: Track;
  user?: Profile;
}

export interface FbPostSignal {
  id: string;
  track_id: string;
  fb_url: string;
  platform: 'facebook' | 'instagram';
  external_post_id: string | null;
  detected_at: string;
  forum_thread_id: string | null;
  track?: Track;
}
