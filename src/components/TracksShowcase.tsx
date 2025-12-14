/**
 * Tracks Showcase Component
 * 
 * Displays track logos and names on the home page
 */

'use client';

import { useEffect, useState } from 'react';
import type { Track } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { MapPinIcon } from '@heroicons/react/24/solid';

const TracksShowcase = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error('Error fetching tracks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-4xl font-black text-[#00ff0c] text-center mb-8 bg-black px-6 py-3 inline-block border-4 border-[#00ff0c]">
          DENVER AREA TRACKS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-black border-4 border-[#00ff0c] p-6 animate-pulse">
              <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-gray-800 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#00ff0c] bg-black px-4 sm:px-6 py-2 sm:py-3 inline-block border-4 border-[#00ff0c]">
          DENVER AREA TRACKS
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {tracks.map((track) => (
          <Link
            key={track.id}
            href="/tracks"
            className="bg-black border-4 border-[#00ff0c] active:border-white overflow-hidden transform active:scale-95 transition-all group relative h-[280px] sm:h-[320px] md:h-[360px]"
          >
            {/* Wallpaper/Header Image */}
            {track.wallpaper ? (
              <div className="relative h-full w-full overflow-hidden">
                <Image 
                  src={track.wallpaper} 
                  alt={`${track.name} wallpaper`}
                  fill
                  className="object-cover"
                  style={track.slug === 'dacono-bmx' ? { objectPosition: 'center 66%' } : undefined}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                
                {/* Logo overlay - Fixed circular container */}
                {track.logo && (
                  <div className="absolute top-4 left-4 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-xl border-4 border-[#00ff0c] group-hover:border-white transition-colors overflow-hidden flex items-center justify-center p-2">
                    <Image 
                      src={track.logo} 
                      alt={`${track.name} logo`}
                      width={80}
                      height={80}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                
                {/* Track Name and Location - Bottom overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-black text-[#00ff0c] group-hover:text-white text-center transition-colors mb-2">
                    {track.name}
                  </h3>
                  <p className="text-white font-bold text-center flex items-center justify-center gap-1 text-sm sm:text-base">
                    <MapPinIcon className="w-4 h-4" />
                    {track.city}
                  </p>
                </div>
              </div>
            ) : (
              /* Fallback when no wallpaper - show logo centered */
              <div className="p-4 sm:p-6 flex flex-col justify-center items-center min-h-[200px] sm:min-h-[240px]">
                {track.logo && (
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-[#00ff0c] group-hover:border-white transition-colors overflow-hidden p-3">
                    <Image 
                      src={track.logo} 
                      alt={`${track.name} logo`}
                      width={96}
                      height={96}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <h3 className="text-xl font-black text-[#00ff0c] group-hover:text-white text-center transition-colors">
                  {track.name}
                </h3>
                <p className="text-white font-bold text-center mt-2 flex items-center justify-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  {track.city}
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TracksShowcase;

