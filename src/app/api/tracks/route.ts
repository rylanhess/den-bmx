/**
 * Tracks API Endpoint
 * 
 * GET /api/tracks - Fetch Denver-area BMX race tracks only
 * Only returns the 4 main Denver metro BMX race tracks:
 * - Mile High BMX
 * - Dacono BMX
 * - County Line BMX
 * - Twin Silo BMX
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Denver-area BMX race tracks (only these should appear on the Tracks page)
const DENVER_AREA_BMX_TRACKS = [
  'mile-high-bmx',
  'dacono-bmx',
  'county-line-bmx',
  'twin-silo-bmx',
];

// Track priority order for consistent sorting
const TRACK_PRIORITY: Record<string, number> = {
  'mile-high-bmx': 1,
  'twin-silo-bmx': 2,
  'county-line-bmx': 3,
  'dacono-bmx': 4
};

export async function GET() {
  try {
    const { data: tracks, error } = await supabase
      .from('tracks')
      .select('*')
      .in('slug', DENVER_AREA_BMX_TRACKS)
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching tracks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tracks' },
        { status: 500 }
      );
    }
    
    // Sort by priority if available
    const sortedTracks = (tracks || []).sort((a, b) => {
      const priorityA = TRACK_PRIORITY[a.slug] || 999;
      const priorityB = TRACK_PRIORITY[b.slug] || 999;
      return priorityA - priorityB;
    });
    
    return NextResponse.json({ tracks: sortedTracks });
    
  } catch (error) {
    console.error('Exception in tracks API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

