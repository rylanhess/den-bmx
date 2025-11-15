/**
 * Scraper Configuration
 * 
 * Centralized configuration for Supabase connection and track mappings
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local from project root
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Create Supabase client with service role key (bypass RLS)
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Track Configuration
 * Maps track slugs to their database UUIDs and metadata
 * 
 * IMPORTANT: Update these UUIDs after seeding your tracks table!
 * Run this query in Supabase SQL Editor to get your UUIDs:
 * 
 * SELECT id, name, slug FROM tracks ORDER BY name;
 */
export interface TrackMapping {
  id: string;  // UUID from tracks table
  name: string;
  slug: string;
  facebookUrl: string;
}

export const TRACK_MAPPINGS: Record<string, TrackMapping> = {
  'mile-high-bmx': {
    id: '660cebf4-c936-4758-8e63-5f1fd2d751f9',
    name: 'Mile High BMX',
    slug: 'mile-high-bmx',
    facebookUrl: 'https://www.facebook.com/MileHighBmx/'
  },
  'dacono-bmx': {
    id: '90bd1e42-43e6-4630-8383-2dfbb4d9050d',
    name: 'Dacono BMX',
    slug: 'dacono-bmx',
    facebookUrl: 'https://www.facebook.com/DaconoBMXTrack/'
  },
  'county-line-bmx': {
    id: 'ddaf6ec7-bd52-4516-9759-29a025f0b2ef',
    name: 'County Line BMX',
    slug: 'county-line-bmx',
    facebookUrl: 'https://www.facebook.com/CountyLineBMX/'
  },
  'twin-silo-bmx': {
    id: '', // TODO: Update this UUID after adding Twin Silo BMX to the tracks table in Supabase
    name: 'Twin Silo BMX',
    slug: 'twin-silo-bmx',
    facebookUrl: 'https://www.facebook.com/twinsilobmx/'
  }
};

/**
 * Get track mapping by slug
 */
export const getTrackMapping = (slug: string): TrackMapping => {
  const mapping = TRACK_MAPPINGS[slug];
  if (!mapping) {
    throw new Error(`Unknown track slug: ${slug}`);
  }
  if (!mapping.id) {
    throw new Error(`Track ${slug} is missing database UUID. Update scripts/config.ts with the UUID from your tracks table.`);
  }
  return mapping;
};

/**
 * Validate configuration
 */
export const validateConfig = async (): Promise<boolean> => {
  try {
    // Test Supabase connection
    const { error } = await supabase.from('tracks').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Check if track UUIDs are set
    const missingUuids = Object.entries(TRACK_MAPPINGS)
      .filter(([_, track]) => !track.id)
      .map(([slug, _]) => slug);
    
    if (missingUuids.length > 0) {
      console.warn('⚠️  Missing track UUIDs for:', missingUuids.join(', '));
      console.warn('   Run this SQL to get your track UUIDs:');
      console.warn('   SELECT id, name, slug FROM tracks ORDER BY name;');
      return false;
    }
    
    console.log('✅ All track UUIDs configured');
    return true;
    
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    return false;
  }
};

// Run validation if executed directly
if (require.main === module) {
  validateConfig()
    .then(valid => {
      if (valid) {
        console.log('\n🎉 Configuration is valid!');
        process.exit(0);
      } else {
        console.log('\n❌ Configuration has errors. Please fix them.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

