/**
 * Events API Endpoint
 * 
 * GET /api/events - Fetch upcoming events
 * Query params:
 *  - days: number of days to look ahead (default: 7)
 *  - track: track slug to filter by
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Track priority order
const TRACK_PRIORITY: Record<string, number> = {
  'mile-high-bmx': 1,
  'county-line-bmx': 2,
  'dacono-bmx': 3
};

// Keywords that indicate a cancellation
const CANCELLATION_KEYWORDS = [
  'no practice',
  'no gate',
  'cancel',
  'cancelled',
  'canceled',
  'postpone',
  'postponed',
  'reschedule',
  'rescheduled',
];

const isCancelled = (title: string, description: string | null): boolean => {
  const combinedText = `${title} ${description || ''}`.toLowerCase();
  return CANCELLATION_KEYWORDS.some(keyword => combinedText.includes(keyword));
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const trackSlug = searchParams.get('track');
    
    // Calculate date range - start from beginning of today in Denver timezone
    const now = new Date();
    const denverNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Denver' }));
    denverNow.setHours(0, 0, 0, 0); // Start of today
    
    const futureDate = new Date(denverNow);
    futureDate.setDate(futureDate.getDate() + days);
    
    // Build query
    let query = supabase
      .from('events')
      .select(`
        *,
        track:tracks(*)
      `)
      .gte('start_at', denverNow.toISOString())
      .lte('start_at', futureDate.toISOString())
      .in('status', ['scheduled', 'updated'])
      .order('start_at', { ascending: true });
    
    // Filter by track if specified
    if (trackSlug) {
      // First get track ID by slug
      const { data: track } = await supabase
        .from('tracks')
        .select('id')
        .eq('slug', trackSlug)
        .single();
      
      if (track) {
        query = query.eq('track_id', track.id);
      }
    }
    
    const { data: events, error } = await query;
    
    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      );
    }
    
    // Filter out cancelled events based on keywords in title/description
    const activeEvents = (events || []).filter(event => {
      return !isCancelled(event.title, event.description);
    });
    
    // Sort events: first by date, then by track priority
    const sortedEvents = activeEvents.sort((a, b) => {
      const dateA = new Date(a.start_at).getTime();
      const dateB = new Date(b.start_at).getTime();
      
      // If same date, sort by track priority
      if (dateA === dateB) {
        const priorityA = TRACK_PRIORITY[a.track?.slug] || 999;
        const priorityB = TRACK_PRIORITY[b.track?.slug] || 999;
        return priorityA - priorityB;
      }
      
      // Otherwise sort by date
      return dateA - dateB;
    });
    
    return NextResponse.json({ events: sortedEvents });
    
  } catch (error) {
    console.error('Exception in events API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

