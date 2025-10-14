/**
 * Tracks Showcase Component
 * 
 * Displays track logos and names on the home page
 */

'use client';

import { useEffect, useState } from 'react';
import type { Track } from '@/lib/supabase';
import Link from 'next/link';

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
        <h2 className="text-4xl font-black text-yellow-400 text-center mb-8 bg-black px-6 py-3 inline-block border-4 border-yellow-400">
          🏁 OUR TRACKS 🏁
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-black border-4 border-yellow-400 p-6 animate-pulse">
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
    <div className="max-w-6xl mx-auto mb-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-yellow-400 bg-black px-6 py-3 inline-block border-4 border-yellow-400 animate-pulse-crazy">
          🏁 OUR TRACKS 🏁
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <Link
            key={track.id}
            href="/tracks"
            className="bg-black border-4 border-yellow-400 hover:border-pink-500 p-6 transform hover:scale-105 transition-all group"
          >
            {/* Logo - Fixed circular container */}
            {track.logo && (
              <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-cyan-400 group-hover:border-pink-500 transition-colors overflow-hidden p-3">
                <img 
                  src={track.logo} 
                  alt={`${track.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            {/* Track Name */}
            <h3 className="text-xl font-black text-yellow-400 group-hover:text-pink-500 text-center transition-colors">
              {track.name}
            </h3>
            
            {/* Location */}
            <p className="text-cyan-400 font-bold text-center mt-2">
              📍 {track.city}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TracksShowcase;

