/**
 * Alerts API Endpoint
 * 
 * GET /api/alerts - Fetch recent alerts/cancellations
 * Parses alerts for keywords like 'cancel', 'no practice', 'rain', etc.
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Keywords that indicate a cancellation or weather-related change
const CANCELLATION_KEYWORDS = [
  'no practice',
  'no gate',
  'cancel',
  'cancelled',
  'canceled',
  'rain',
  'weather',
  'postpone',
  'postponed',
  'reschedule',
  'rescheduled',
  'closed',
  'will not have',
  'wont have',
  "won't have",
  'transition to',
  'change',
  'moved to',
  'due to',
  'staffing'
];

const containsCancellationKeyword = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return CANCELLATION_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

export async function GET() {
  try {
    // Fetch alerts from yesterday and today only (in Denver timezone)
    const now = new Date();
    const denverNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Denver' }));
    
    // Start of yesterday
    const yesterday = new Date(denverNow);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select(`
        *,
        track:tracks(*)
      `)
      .gte('posted_at', yesterday.toISOString())
      .order('posted_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching alerts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch alerts' },
        { status: 500 }
      );
    }
    
    // Filter alerts for cancellation-related content
    const cancellationAlerts = (alerts || []).filter(alert => {
      return containsCancellationKeyword(alert.text);
    });
    
    // Only return the most recent 5 alerts to keep the banner clean
    const recentAlerts = cancellationAlerts.slice(0, 5);
    
    return NextResponse.json({ 
      alerts: recentAlerts,
      hasAlerts: recentAlerts.length > 0
    });
    
  } catch (error) {
    console.error('Exception in alerts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

