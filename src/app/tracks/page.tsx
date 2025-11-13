'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import type { Track } from '@/lib/supabase';
import {
  LinkIcon,
  MapPinIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  FlagIcon
} from '@heroicons/react/24/solid';

const TrackLink = ({
  href,
  children,
}: {
  readonly href: string;
  readonly children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 bg-black text-[#00ff0c] hover:text-white font-black px-3 py-2 border-4 border-[#00ff0c] hover:border-white transition-colors text-sm"
  >
    <LinkIcon className="w-4 h-4" />
    {children}
  </a>
);

const TrackCard = ({
  track,
  color,
  description,
  uniqueFeatures,
}: {
  readonly track: Track;
  readonly color: string;
  readonly description?: string;
  readonly uniqueFeatures?: readonly string[];
}) => (
  <div className={`bg-black border-8 border-${color} overflow-hidden transform hover:scale-105 transition-transform`}>
    {/* Wallpaper/Header Image */}
    {track.wallpaper && (
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={track.wallpaper} 
          alt={`${track.name} wallpaper`}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent`}></div>
        
        {/* Logo overlay - Fixed circular container */}
        {track.logo && (
          <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-full shadow-xl border-4 border-[#00ff0c] overflow-hidden flex items-center justify-center p-2">
            <img 
              src={track.logo} 
              alt={`${track.name} logo`}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
    )}
    
    {/* Logo only if no wallpaper - Fixed circular container */}
    {!track.wallpaper && track.logo && (
      <div className="flex justify-center py-6 bg-black">
        <div className="w-28 h-28 bg-white rounded-full shadow-xl border-4 border-[#00ff0c] overflow-hidden flex items-center justify-center p-3">
          <img 
            src={track.logo} 
            alt={`${track.name} logo`}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    )}
    
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-3xl font-black text-[#00ff0c] mb-2">{track.name}</h2>
        <div className="flex items-center gap-2 text-white font-bold bg-[#00ff0c] px-3 py-1 inline-block border-2 border-black">
          <MapPinIcon className="w-4 h-4" />
          <span>{track.city}</span>
        </div>
      </div>

      {description && (
        <p className="text-white mb-4 leading-relaxed font-bold">{description}</p>
      )}

      {uniqueFeatures && uniqueFeatures.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-black text-[#00ff0c] mb-2">
            UNIQUE FEATURES:
          </h3>
          <ul className="space-y-2">
            {uniqueFeatures.map((feature, index) => (
              <li key={index} className="text-[#00ff0c] font-bold border-l-4 border-[#00ff0c] pl-3 flex items-center gap-2">
                <BoltIcon className="w-4 h-4" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t-4 border-[#00ff0c] pt-4">
        <h3 className="text-lg font-black text-white mb-3">LINKS:</h3>
        <div className="flex flex-col gap-2">
          {track.fb_page_url && (
            <TrackLink href={track.fb_page_url}>
              Facebook Page
            </TrackLink>
          )}
          {track.usabmx_url && (
            <TrackLink href={track.usabmx_url}>
              USA BMX Track Info
            </TrackLink>
          )}
        </div>
      </div>
    </div>
  </div>
);

const LoadingCard = () => (
  <div className="bg-black border-4 border-[#00ff0c] overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-800"></div>
    <div className="p-6 space-y-4">
      <div className="h-8 bg-gray-800 rounded w-3/4"></div>
      <div className="h-6 bg-gray-800 rounded w-1/2"></div>
      <div className="h-24 bg-gray-800 rounded"></div>
    </div>
  </div>
);

const ErrorState = ({ error }: { readonly error: string }) => (
  <div className="bg-black border-4 border-[#00ff0c] p-8 text-center">
    <p className="text-2xl font-black text-[#00ff0c] mb-2 flex items-center justify-center gap-2">
      <ExclamationTriangleIcon className="w-6 h-6" />
      ERROR LOADING TRACKS
    </p>
    <p className="text-white">{error}</p>
  </div>
);

const NoTracksState = () => (
  <div className="bg-[#00ff0c] border-4 border-black p-8 text-center">
    <p className="text-2xl font-black text-black">NO TRACKS FOUND</p>
    <p className="text-black font-bold mt-2">Check back soon!</p>
  </div>
);

// Track descriptions and features mapped by slug
const trackInfo: Record<string, { description: string; uniqueFeatures: string[]; color: string }> = {
  'mile-high-bmx': {
    color: '[#00ff0c]',
    description: 
      "Mile High BMX is home to the longest BMX track in the nation, offering riders an extended racing experience with challenging features throughout. This track is known for its technical layout and competitive racing environment, attracting riders from across the region.",
    uniqueFeatures: [
      "Longest BMX track in the United States",
      "Challenging technical layout with extended straights",
      "High-elevation racing (5,280+ feet) requires excellent conditioning",
      "Active racing community with riders of all skill levels",
    ],
  },
  'county-line-bmx': {
    color: '[#00ff0c]',
    description:
      "Located in David A. Lorenz Regional Park, County Line BMX is one of the only tracks in south metro Denver. Completely redesigned in January 2020, this track features modern paving and design elements. Races take place on Sundays throughout the season with gate practice available on Thursdays.",
    uniqueFeatures: [
      "Modern track design with 3 paved turns",
      "Paved start hill for consistent launches",
      "Family-friendly atmosphere welcoming all ages (3 to 60+ years)",
      "Gate practice every Thursday during season (April-October)",
      "Convenient location in South Suburban Parks & Recreation system",
    ],
  },
  'dacono-bmx': {
    color: '[#00ff0c]',
    description:
      "Dacono BMX offers a welcoming environment for BMX racing enthusiasts in the northern Denver metro area. This track provides competitive racing opportunities while maintaining a community-focused atmosphere that encourages new riders to join the sport.",
    uniqueFeatures: [
      "Northern metro location serving Dacono and surrounding communities",
      "Beginner-friendly while still challenging for experienced riders",
      "Strong community support and volunteer involvement",
      "Regular race schedule throughout the season",
    ],
  },
};

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/tracks');
        if (!response.ok) {
          throw new Error('Failed to fetch tracks');
        }
        const data = await response.json();
        setTracks(data.tracks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const noTracks = !isLoading && !error && tracks.length === 0;

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Professional Punk */}
        <div className="text-center mb-12">
          <div className="inline-block bg-black border-4 border-[#00ff0c] p-8 mb-6">
            <h1 className="text-5xl md:text-6xl font-black text-[#00ff0c] mb-2" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
              BMX TRACKS!
            </h1>
            <div className="h-2 bg-[#00ff0c]"></div>
          </div>
          <p className="text-2xl text-white font-black bg-black px-6 py-3 inline-block border-4 border-[#00ff0c]">
            3 PREMIER TRACKS • DENVER METRO AREA
          </p>
        </div>

        {/* High Elevation Notice */}
        <div className="bg-[#00ff0c] border-4 border-black p-6 mb-8">
          <div className="flex items-center gap-4">
            <ExclamationTriangleIcon className="w-16 h-16" />
            <div>
              <h3 className="text-2xl font-black text-black mb-2">
                HIGH ELEVATION RACING!
              </h3>
              <p className="text-black font-bold text-lg">
                All Denver metro tracks are at 5,000+ feet elevation! Bring LOTS of water! Stay hydrated or DIE!
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && <ErrorState error={error} />}

        {/* No Tracks State */}
        {noTracks && <NoTracksState />}

        {/* Track Cards */}
        {!isLoading && !error && tracks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {tracks.map((track) => {
              const info = trackInfo[track.slug] || { color: '[#00ff0c]', description: '', uniqueFeatures: [] };
              return (
                <TrackCard 
                  key={track.id} 
                  track={track}
                  color={info.color}
                  description={info.description}
                  uniqueFeatures={info.uniqueFeatures}
                />
              );
            })}
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center bg-black border-4 border-[#00ff0c] p-8">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-4">
            NEW TO BMX RACING?
          </h2>
          <p className="text-white mb-6 font-bold text-xl">
            All tracks welcome ALL riders! USA BMX membership required ($80/year or $1/day trial). Wear a helmet, long sleeves, pants & closed shoes!
          </p>
          <Link
            href="/"
            className="inline-block bg-[#00ff0c] hover:bg-white text-black font-black px-8 py-4 border-4 border-black transition-colors transform hover:scale-110 text-xl"
          >
            <FlagIcon className="w-5 h-5 inline mr-2" />
            VIEW RACE CALENDAR
          </Link>
        </div>
      </div>
    </main>
  );
}
