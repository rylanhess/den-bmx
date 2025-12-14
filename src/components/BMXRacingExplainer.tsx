'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

export default function BMXRacingExplainer() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 mb-8 relative z-10">
      {/* Collapsed Button State with Background Images */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-black border-4 border-[#00ff0c] hover:border-white transition-all text-left group relative overflow-hidden min-h-[300px] sm:min-h-[350px] md:min-h-[400px]"
      >
        {/* Background Images Side by Side */}
        <div className="absolute inset-0 flex">
          {/* Racing Image - Left Side */}
          <div className="relative w-1/2 h-full">
            <Image
              src="/side-view-people-riding-bicycled-sunny-day%20(1).jpg"
              alt="BMX racers competing"
              fill
              className="object-cover opacity-40 group-hover:opacity-50 transition-opacity"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
          </div>
          {/* Freestyle Image - Right Side */}
          <div className="relative w-1/2 h-full">
            <Image
              src="/low-section-man-with-bicycle-performing-stunt-against-clear-sky.jpg"
              alt="BMX freestyle tricks"
              fill
              className="object-cover opacity-40 group-hover:opacity-50 transition-opacity"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black via-black/50 to-transparent"></div>
          </div>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 p-8 sm:p-10 md:p-12 flex flex-col justify-between h-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#00ff0c] group-hover:text-white transition-colors leading-tight">
              WHAT IS BMX RACING?
            </h3>
            {isExpanded ? (
              <ChevronUpIcon className="w-10 h-10 sm:w-12 sm:h-12 text-[#00ff0c] group-hover:text-white transition-colors flex-shrink-0 mt-2" />
            ) : (
              <ChevronDownIcon className="w-10 h-10 sm:w-12 sm:h-12 text-[#00ff0c] group-hover:text-white transition-colors flex-shrink-0 mt-2" />
            )}
          </div>
          <p className="text-white font-bold text-lg sm:text-xl md:text-2xl mt-4 max-w-2xl">
            Learn the difference between BMX racing and freestyle jumping
          </p>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-black border-4 border-t-0 border-[#00ff0c] p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Intro */}
          <div className="space-y-4">
            <p className="text-white font-bold text-lg md:text-xl leading-relaxed">
              Most people think &quot;BMX&quot; means tricks and jumps at skate parks. But there&apos;s another side to BMX that many don&apos;t know about: <span className="text-[#00ff0c] text-xl md:text-2xl font-black">BMX RACING</span>.
            </p>
            <p className="text-white font-bold text-lg md:text-xl leading-relaxed">
              While freestyle BMX is about creativity and tricks, BMX racing is about <span className="text-[#00ff0c]">speed, strategy, and competition</span> on purpose-built dirt tracks.
            </p>
          </div>

          {/* Two Column Comparison */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* BMX Racing */}
            <div className="bg-gray-900/50 border-4 border-[#00ff0c] p-6">
              <h4 className="text-2xl md:text-3xl font-black text-[#00ff0c] mb-4">
                BMX RACING
              </h4>
              <div className="relative w-full aspect-video mb-4 border-2 border-[#00ff0c] overflow-hidden">
                <Image
                  src="/side-view-people-riding-bicycled-sunny-day%20(1).jpg"
                  alt="BMX racers competing on a dirt track"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <ul className="space-y-2 text-white font-bold">
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff0c] font-black">→</span>
                  <span>Riders race head-to-head on dirt tracks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff0c] font-black">→</span>
                  <span>8 riders compete in each race (moto)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff0c] font-black">→</span>
                  <span>Races last 30-45 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff0c] font-black">→</span>
                  <span>All ages and skill levels welcome</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff0c] font-black">→</span>
                  <span>USA BMX sanctioned competitions</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t-2 border-[#00ff0c]">
                <Link
                  href="/tracks"
                  className="inline-block bg-[#00ff0c] hover:bg-white text-black font-black px-6 py-3 border-4 border-black transition-colors transform hover:scale-105"
                >
                  FIND RACE TRACKS →
                </Link>
              </div>
            </div>

            {/* Freestyle BMX */}
            <div className="bg-gray-900/50 border-4 border-[#00ff0c] p-6">
              <h4 className="text-2xl md:text-3xl font-black text-[#00ff0c] mb-4">
                FREESTYLE BMX
              </h4>
              <div className="relative w-full aspect-video mb-4 border-2 border-[#00ff0c] overflow-hidden">
                <Image
                  src="/low-section-man-with-bicycle-performing-stunt-against-clear-sky.jpg"
                  alt="BMX rider performing tricks at a skate park"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <ul className="space-y-2 text-white font-bold">
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff0c] font-black">→</span>
                  <span>Riders perform tricks and jumps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff0c] font-black">→</span>
                  <span>Practice at skate parks and bike parks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff0c] font-black">→</span>
                  <span>No competition required - just ride!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff0c] font-black">→</span>
                  <span>Creative expression and skill building</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff0c] font-black">→</span>
                  <span>Great for practicing bike control</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t-2 border-[#00ff0c]">
                <Link
                  href="/freestyle"
                  className="inline-block bg-[#00ff0c] hover:bg-white text-black font-black px-6 py-3 border-4 border-black transition-colors transform hover:scale-105"
                >
                  FIND FREESTYLE PARKS →
                </Link>
              </div>
            </div>
          </div>

          {/* Popular Locations */}
          <div className="bg-gray-900/50 border-4 border-[#00ff0c] p-6">
            <h4 className="text-2xl md:text-3xl font-black text-[#00ff0c] mb-4">
              POPULAR LOCATIONS
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h5 className="text-xl font-black text-white mb-2">RACE TRACKS:</h5>
                <ul className="space-y-1 text-white font-bold">
                  <li>• Mile High BMX (Denver)</li>
                  <li>• County Line BMX (Englewood)</li>
                  <li>• Dacono BMX (Dacono)</li>
                  <li>• Twin Silo BMX (Fort Collins)</li>
                </ul>
              </div>
              <div>
                <h5 className="text-xl font-black text-white mb-2">FREESTYLE PARKS:</h5>
                <ul className="space-y-1 text-white font-bold">
                  <li>• Ruby Hill Bike Park (Denver)</li>
                  <li>• Valmont Bike Park (Boulder)</li>
                  <li>• McKay Lake Bike Park (Broomfield)</li>
                  <li>• Denver Skatepark (Downtown)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Closing */}
          <div className="text-center pt-4 border-t-4 border-[#00ff0c]">
            <p className="text-white font-bold text-lg md:text-xl">
              Both styles of BMX are awesome! Whether you want to <span className="text-[#00ff0c]">race against others</span> or <span className="text-[#00ff0c]">master tricks at the park</span>, there&apos;s a place for you in the Denver BMX community.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

