/**
 * Supabase Client for Frontend
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  track?: Track;
}

