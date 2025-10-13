/**
 * Refresh Status API Endpoint
 * 
 * GET /api/refresh-status - Get last data refresh timestamp
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get the most recent alert based on when it was posted on Facebook
    // This tells us how current our data is
    const { data: latestAlert, error } = await supabase
      .from('alerts')
      .select('posted_at')
      .order('posted_at', { ascending: false })
      .limit(1)
      .single();
    
    // Get the most recent scrape time from sources
    const { data: latestSource } = await supabase
      .from('sources')
      .select('last_checked_at')
      .eq('type', 'facebook')
      .order('last_checked_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .single();
    
    if (error || !latestAlert) {
      return NextResponse.json({
        lastRefresh: null,
        lastScrape: latestSource?.last_checked_at || null,
        isStale: true
      });
    }
    
    // Consider data stale if the most recent Facebook post is older than 48 hours
    // (tracks typically post several times per week)
    const lastRefresh = new Date(latestAlert.posted_at);
    const now = new Date();
    const hoursSinceRefresh = (now.getTime() - lastRefresh.getTime()) / (1000 * 60 * 60);
    const isStale = hoursSinceRefresh > 48;
    
    return NextResponse.json({
      lastRefresh: latestAlert.posted_at,
      lastScrape: latestSource?.last_checked_at || null,
      isStale
    });
    
  } catch (error) {
    console.error('Exception in refresh-status API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

