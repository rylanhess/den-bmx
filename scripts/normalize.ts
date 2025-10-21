/**
 * Data Normalization Functions
 * 
 * Transforms scraped Facebook posts into database-ready format
 */

import type { FacebookPost } from './fetchFacebook';

/**
 * Alert record for database insertion
 */
export interface AlertRecord {
  track_id: string;
  posted_at: string;  // ISO timestamp
  text: string;
  url: string | null;
  image: string | null;
}

/**
 * Event record for database insertion (future use)
 */
export interface EventRecord {
  track_id: string;
  title: string;
  description: string | null;
  start_at: string;  // ISO timestamp
  end_at: string | null;
  status: 'scheduled' | 'updated' | 'cancelled';
  url: string | null;
}

/**
 * Normalize a Facebook post into an alert record
 */
export const normalizeToAlert = (
  post: FacebookPost,
  trackId: string
): AlertRecord => {
  return {
    track_id: trackId,
    posted_at: post.timestamp ? post.timestamp.toISOString() : new Date().toISOString(),
    text: post.text.trim(),
    url: post.url,
    image: post.image
  };
};

/**
 * Extract potential event information from post text
 * This is a simple extraction - can be enhanced with better parsing
 */
export const extractEventInfo = (post: FacebookPost): Partial<EventRecord> | null => {
  const text = post.text.toLowerCase();
  
  // Look for date/time patterns
  const hasDate = /\d{1,2}\/\d{1,2}|today|tonight|tomorrow|sunday|saturday|monday|tuesday|wednesday|thursday|friday/.test(text);
  const hasTime = /\d{1,2}:\d{2}|am|pm|\d{1,2}\s*(am|pm)/.test(text);
  
  if (!post.isEvent || (!hasDate && !hasTime)) {
    return null;
  }
  
  // Determine status
  let status: 'scheduled' | 'updated' | 'cancelled' = 'scheduled';
  if (post.hasAlertKeywords) {
    if (/cancel/i.test(post.text)) {
      status = 'cancelled';
    } else {
      status = 'updated';
    }
  }
  
  // Extract title (first line or first sentence)
  const lines = post.text.split('\n').filter(l => l.trim());
  const title = lines[0]?.substring(0, 200) || 'Event';
  
  return {
    title,
    description: post.text,
    start_at: post.timestamp ? post.timestamp.toISOString() : new Date().toISOString(),
    status,
    url: post.url
  };
};

/**
 * Normalize multiple posts to alerts
 */
export const normalizePosts = (
  posts: FacebookPost[],
  trackId: string
): AlertRecord[] => {
  return posts.map(post => normalizeToAlert(post, trackId));
};

/**
 * Filter posts by criteria
 */
export interface FilterOptions {
  alertsOnly?: boolean;
  eventsOnly?: boolean;
  minLength?: number;
  maxAge?: number;  // in hours
}

export const filterPosts = (
  posts: FacebookPost[],
  options: FilterOptions = {}
): FacebookPost[] => {
  let filtered = [...posts];
  
  // Filter by alert keywords
  if (options.alertsOnly) {
    filtered = filtered.filter(p => p.hasAlertKeywords);
  }
  
  // Filter by event keywords
  if (options.eventsOnly) {
    filtered = filtered.filter(p => p.isEvent);
  }
  
  // Filter by minimum text length
  if (options.minLength && options.minLength > 0) {
    const minLen = options.minLength;
    filtered = filtered.filter(p => p.text.length >= minLen);
  }
  
  // Filter by post age
  if (options.maxAge && options.maxAge > 0) {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - options.maxAge);
    
    filtered = filtered.filter(p => {
      if (!p.timestamp) return true; // Keep if no timestamp
      return p.timestamp >= cutoffDate;
    });
  }
  
  return filtered;
};

/**
 * Deduplicate posts by content hash
 * Useful to avoid inserting the same post twice
 */
export const deduplicatePosts = (posts: FacebookPost[]): FacebookPost[] => {
  const seen = new Set<string>();
  return posts.filter(post => {
    // Create simple hash from first 100 chars + timestamp
    const hash = `${post.text.substring(0, 100)}_${post.timestamp?.getTime() || 0}`;
    if (seen.has(hash)) {
      return false;
    }
    seen.add(hash);
    return true;
  });
};

/**
 * Validate alert record before insertion
 */
export const validateAlert = (alert: AlertRecord): boolean => {
  if (!alert.track_id) {
    console.warn('Alert missing track_id');
    return false;
  }
  
  if (!alert.text || alert.text.length < 10) {
    console.warn('Alert text too short or missing');
    return false;
  }
  
  if (!alert.posted_at) {
    console.warn('Alert missing posted_at timestamp');
    return false;
  }
  
  return true;
};

/**
 * Clean and sanitize post text
 */
export const sanitizeText = (text: string): string => {
  return text
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
    .trim();
};
