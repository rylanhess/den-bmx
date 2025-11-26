/**
 * Supabase Client for Frontend
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client with placeholder values during build time
// This prevents build errors when env vars aren't available
// At runtime, the client will fail if vars are actually missing
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

/**
 * Database types
 */
export interface Track {
  id: string;
  name: string;
  slug: string;
  city: string;
  tz: string;
  fb_page_url: string | null;
  usabmx_url: string | null;
  lat: number | null;
  lon: number | null;
  logo: string | null;
  wallpaper: string | null;
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

