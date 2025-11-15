/**
 * Race Timeline Component
 * 
 * Displays key BMX races for 2025 with a progress indicator
 */

'use client';

import { useMemo } from 'react';
import Image from 'next/image';

interface RaceEvent {
  id: string;
  date: Date;
  endDate?: Date;
  name: string;
  location: string;
  isMajor: boolean;
  icon: 'trophy' | 'podium' | 'dot';
}

const RACE_EVENTS: RaceEvent[] = [
  {
    id: 'local-race-july',
    date: new Date('2025-07-01'),
    name: 'Local Race SINGLE',
    location: 'Mile High BMX, Denver, CO',
    isMajor: false,
    icon: 'dot',
  },
  {
    id: 'state-race-double',
    date: new Date('2025-07-06'),
    name: 'State Race Double',
    location: 'County Line BMX, Centennial, CO',
    isMajor: false,
    icon: 'dot',
  },
  {
    id: 'mile-high-nationals',
    date: new Date('2025-07-18'),
    endDate: new Date('2025-07-20'),
    name: 'Mile High Nationals',
    location: 'Mile High BMX, Denver, CO',
    isMajor: true,
    icon: 'podium',
  },
  {
    id: 'grand-nationals',
    date: new Date('2025-11-26'),
    endDate: new Date('2025-11-30'),
    name: 'USA BMX Grand Nationals',
    location: 'Tulsa, Oklahoma',
    isMajor: true,
    icon: 'trophy',
  },
];

const RaceTimeline = () => {
  const { currentDate, progress, sortedEvents } = useMemo(() => {
    const now = new Date();
    const denverNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Denver' }));
    denverNow.setHours(0, 0, 0, 0);

    // Sort events by date
    const sorted = [...RACE_EVENTS].sort((a, b) => a.date.getTime() - b.date.getTime());

    // Find the first and last event dates
    const firstEvent = sorted[0].date;
    const lastEvent = sorted[sorted.length - 1].endDate || sorted[sorted.length - 1].date;
    
    const totalDuration = lastEvent.getTime() - firstEvent.getTime();
    const currentProgress = denverNow.getTime() - firstEvent.getTime();
    
    // Calculate progress percentage (0-100)
    // Clamp between 0 and 100
    const progressPercent = Math.max(0, Math.min(100, (currentProgress / totalDuration) * 100));

    return {
      currentDate: denverNow,
      progress: progressPercent,
      sortedEvents: sorted,
    };
  }, []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateRange = (startDate: Date, endDate?: Date): string => {
    if (!endDate) {
      return formatDate(startDate);
    }
    const start = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${start} - ${end}`;
  };

  const isEventPast = (event: RaceEvent): boolean => {
    const eventEndDate = event.endDate || event.date;
    return currentDate > eventEndDate;
  };

  return (
    <div className="w-full mb-12">
      <div className="bg-black border-4 border-[#00ff0c] p-6 sm:p-8 shadow-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#00ff0c] mb-6 sm:mb-8 text-center">
          2025 RACE TIMELINE
        </h2>

        {/* Desktop Horizontal Timeline */}
        <div className="hidden md:block relative">
          <div className="relative h-64 pb-8">
            {/* Connecting Line */}
            <div className="absolute top-28 left-0 right-0 h-1 bg-[#00ff0c] opacity-30"></div>
            
            {/* Progress Line (completed portion) */}
            <div 
              className="absolute top-28 left-0 h-1 bg-[#00ff0c] transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>

            {/* Rider Sprite - positioned based on progress */}
            <div
              className="absolute top-20 transition-all duration-500 z-20"
              style={{ left: `calc(${progress}% - 24px)` }}
            >
              <Image
                src="/BMX_Sprite.png"
                alt="BMX Rider Progress"
                width={48}
                height={48}
                className="drop-shadow-lg"
              />
            </div>

            {/* Events - Evenly spaced across timeline */}
            <div className="relative flex justify-between items-start pt-8 px-4">
              {sortedEvents.map((event, index) => {
                const isPast = isEventPast(event);
                // Calculate even spacing: first at 0%, last at 100%, others evenly distributed
                const eventPosition = sortedEvents.length === 1 
                  ? 50 
                  : (index / (sortedEvents.length - 1)) * 100;

                return (
                  <div
                    key={event.id}
                    className="flex flex-col items-center relative"
                    style={{ width: `${100 / sortedEvents.length}%`, maxWidth: '200px' }}
                  >
                    {/* Event Icon */}
                    <div className={`mb-3 transition-opacity duration-300 ${isPast ? 'opacity-50' : 'opacity-100'}`}>
                      {event.icon === 'trophy' && (
                        <Image
                          src="/BMX_Trophy.png"
                          alt="Trophy"
                          width={64}
                          height={64}
                          className="drop-shadow-lg"
                        />
                      )}
                      {event.icon === 'podium' && (
                        <Image
                          src="/BMX_Podium.png"
                          alt="Podium"
                          width={64}
                          height={64}
                          className="drop-shadow-lg"
                        />
                      )}
                      {event.icon === 'dot' && (
                        <div className="w-4 h-4 bg-[#00ff0c] rounded-full border-2 border-[#00ff0c] shadow-lg"></div>
                      )}
                    </div>

                    {/* Event Dot on Timeline - positioned to align with timeline at top-28 (112px) */}
                    {/* Timeline is at 112px from container, events container has pt-8 (32px), so dot is at 112-32=80px from events container */}
                    <div 
                      className={`absolute w-3 h-3 rounded-full border-2 border-[#00ff0c] ${
                        isPast ? 'bg-[#00ff0c] opacity-50' : 'bg-black'
                      }`}
                      style={{ top: '80px', left: '50%', transform: 'translateX(-50%)' }}
                    ></div>

                    {/* Event Info */}
                    <div className={`text-center mt-8 transition-opacity duration-300 ${isPast ? 'opacity-50' : 'opacity-100'}`}>
                      <div className="text-[#00ff0c] font-black text-sm mb-1">
                        {formatDateRange(event.date, event.endDate)}
                      </div>
                      <div className="text-white font-bold text-xs mb-1">
                        {event.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {event.location}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden relative">
          <div className="relative pl-8">
            {/* Vertical Connecting Line - spans the full height of events */}
            <div className="absolute left-4 top-0 bottom-0 w-1 bg-[#00ff0c] opacity-30"></div>
            
            {/* Progress Line (completed portion) - calculated dynamically */}
            {(() => {
              const firstEvent = sortedEvents[0].date;
              const lastEvent = sortedEvents[sortedEvents.length - 1].endDate || sortedEvents[sortedEvents.length - 1].date;
              const totalDuration = lastEvent.getTime() - firstEvent.getTime();
              const currentProgress = currentDate.getTime() - firstEvent.getTime();
              const progressPercent = Math.max(0, Math.min(100, (currentProgress / totalDuration) * 100));
              
              // Estimate height: each event takes ~120px (mb-12 = 3rem = 48px + content)
              const estimatedHeight = sortedEvents.length * 120;
              const progressHeight = (progressPercent / 100) * estimatedHeight;
              
              return (
                <>
                  <div 
                    className="absolute left-4 top-0 w-1 bg-[#00ff0c] transition-all duration-500"
                    style={{ height: `${progressHeight}px` }}
                  ></div>
                  
                  {/* Rider Sprite - positioned based on progress */}
                  <div
                    className="absolute left-0 transition-all duration-500 z-20"
                    style={{ top: `${Math.max(0, progressHeight - 16)}px` }}
                  >
                    <Image
                      src="/BMX_Sprite.png"
                      alt="BMX Rider Progress"
                      width={32}
                      height={32}
                      className="drop-shadow-lg"
                    />
                  </div>
                </>
              );
            })()}

            {/* Events */}
            {sortedEvents.map((event, index) => {
              const isPast = isEventPast(event);

              return (
                <div
                  key={event.id}
                  className="relative mb-12 last:mb-0"
                >
                  {/* Event Dot on Timeline */}
                  <div className={`absolute left-3 top-6 w-3 h-3 rounded-full border-2 border-[#00ff0c] z-10 ${
                    isPast ? 'bg-[#00ff0c] opacity-50' : 'bg-black'
                  }`}></div>

                  {/* Event Content */}
                  <div className={`ml-12 transition-opacity duration-300 ${isPast ? 'opacity-50' : 'opacity-100'}`}>
                    {/* Event Icon */}
                    <div className="mb-2">
                      {event.icon === 'trophy' && (
                        <Image
                          src="/BMX_Trophy.png"
                          alt="Trophy"
                          width={48}
                          height={48}
                          className="drop-shadow-lg"
                        />
                      )}
                      {event.icon === 'podium' && (
                        <Image
                          src="/BMX_Podium.png"
                          alt="Podium"
                          width={48}
                          height={48}
                          className="drop-shadow-lg"
                        />
                      )}
                      {event.icon === 'dot' && (
                        <div className="w-3 h-3 bg-[#00ff0c] rounded-full border-2 border-[#00ff0c] shadow-lg"></div>
                      )}
                    </div>

                    {/* Event Info */}
                    <div className="text-[#00ff0c] font-black text-sm mb-1">
                      {formatDateRange(event.date, event.endDate)}
                    </div>
                    <div className="text-white font-bold text-base mb-1">
                      {event.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {event.location}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceTimeline;

