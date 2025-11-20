/**
 * Tracks Showcase Component
 * 
 * Displays track logos and names on the home page
 */

'use client';

import { useEffect, useState } from 'react';
import type { Track } from '@/lib/supabase';
import Link from 'next/link';
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
          OUR TRACKS
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
          OUR TRACKS
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {tracks.map((track) => (
          <Link
            key={track.id}
            href="/tracks"
            className="bg-black border-4 border-[#00ff0c] active:border-white p-4 sm:p-6 transform active:scale-95 transition-all group min-h-[180px] sm:min-h-[200px] flex flex-col justify-center items-center"
          >
            {/* Logo - Fixed circular container */}
            {track.logo && (
              <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-[#00ff0c] group-hover:border-white transition-colors overflow-hidden p-3">
                <img 
                  src={track.logo} 
                  alt={`${track.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            {/* Track Name */}
            <h3 className="text-xl font-black text-[#00ff0c] group-hover:text-white text-center transition-colors">
              {track.name}
            </h3>
            
            {/* Location */}
            <p className="text-white font-bold text-center mt-2 flex items-center justify-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              {track.city}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TracksShowcase;

