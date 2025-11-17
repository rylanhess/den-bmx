/**
 * Race Timeline Component
 * 
 * Displays key BMX races for 2025 with a progress indicator
 */

'use client';

import { useMemo } from 'react';

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

// Color constants
const COLORS = {
  primary: '#00FF0D', // Lime green
  secondary: '#0073FF', // Blue
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9CA3AF',
};

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

  // Timeline Line Component
  const TimelineLine = ({ isVertical = false, progressPercent }: { isVertical?: boolean; progressPercent: number }) => {
    if (isVertical) {
      return (
        <>
          {/* Background line - blue for variety */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#0073FF] opacity-20"></div>
          {/* Progress line - green for completed */}
          <div 
            className="absolute left-3 top-0 w-0.5 bg-[#00FF0D] transition-all duration-500"
            style={{ height: `${progressPercent}%` }}
          ></div>
        </>
      );
    }
    
    // Desktop: timeline centered at 60px from top
    return (
      <>
        {/* Background line - blue for variety */}
        <div className="absolute top-[60px] left-0 right-0 h-0.5 bg-[#0073FF] opacity-20"></div>
        {/* Progress line - green for completed */}
        <div 
          className="absolute top-[60px] left-0 h-0.5 bg-[#00FF0D] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </>
    );
  };

  // Event Info Component
  const EventInfo = ({ 
    event, 
    isPast 
  }: { 
    event: RaceEvent; 
    isPast: boolean;
  }) => {
    const opacityClass = isPast ? 'opacity-50' : 'opacity-100';
    
    return (
      <div className={`text-center transition-opacity duration-300 ${opacityClass}`}>
        {/* Date in blue for differentiation */}
        <div className="text-[#0073FF] font-black text-xs mb-0.5">
          {formatDateRange(event.date, event.endDate)}
        </div>
        <div className="text-white font-bold text-[10px] mb-0.5 leading-tight">
          {event.name}
        </div>
        <div className="text-gray-400 text-[10px] leading-tight">
          {event.location}
        </div>
      </div>
    );
  };

  // Desktop Event Component
  const DesktopEvent = ({ event, index }: { event: RaceEvent; index: number }) => {
    const isPast = isEventPast(event);

    return (
      <div
        className="relative flex flex-col items-center"
        style={{ width: `${100 / sortedEvents.length}%`, maxWidth: '150px' }}
      >
        {/* Event Info - positioned below timeline line */}
        <div 
          className="absolute flex justify-center"
          style={{ 
            top: '72px', // Just below timeline (60px + 12px spacing)
            width: '100%',
          }}
        >
          <EventInfo event={event} isPast={isPast} />
        </div>
      </div>
    );
  };

  // Mobile Event Component
  const MobileEvent = ({ event, index }: { event: RaceEvent; index: number }) => {
    const isPast = isEventPast(event);
    // Position events with spacing - each event takes ~80px, timeline is at left-3 (12px)
    const eventTop = index * 80 + 16; // 16px offset for first event

    return (
      <div className="relative mb-6 last:mb-0" style={{ minHeight: '80px' }}>
        {/* Event Info - positioned below timeline line */}
        <div 
          className={`absolute transition-opacity duration-300 ${isPast ? 'opacity-50' : 'opacity-100'}`}
          style={{
            left: '20px',
            top: `${eventTop + 8}px`, // Below timeline line
          }}
        >
          <div className="text-[#0073FF] font-black text-xs mb-0.5">
            {formatDateRange(event.date, event.endDate)}
          </div>
          <div className="text-white font-bold text-xs mb-0.5 leading-tight">
            {event.name}
          </div>
          <div className="text-gray-400 text-[10px] leading-tight">
            {event.location}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mb-12">
      <div className="bg-black border-2 border-[#00FF0D] p-4 sm:p-5 shadow-xl">
        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#00FF0D] mb-4 sm:mb-5 text-center">
          2025 RACE TIMELINE
        </h2>

        {/* Desktop Horizontal Timeline */}
        <div className="hidden md:block relative">
          <div className="relative h-32 pb-4">
            {/* Timeline Line */}
            <TimelineLine isVertical={false} progressPercent={progress} />

            {/* Events Container */}
            <div className="relative flex justify-between px-2">
              {sortedEvents.map((event, index) => (
                <DesktopEvent key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden relative">
          <div className="relative pl-6 pb-4" style={{ minHeight: `${sortedEvents.length * 80 + 32}px` }}>
            {/* Timeline Line */}
            {(() => {
              const firstEvent = sortedEvents[0].date;
              const lastEvent = sortedEvents[sortedEvents.length - 1].endDate || sortedEvents[sortedEvents.length - 1].date;
              const totalDuration = lastEvent.getTime() - firstEvent.getTime();
              const currentProgress = currentDate.getTime() - firstEvent.getTime();
              const progressPercent = Math.max(0, Math.min(100, (currentProgress / totalDuration) * 100));
              
              return <TimelineLine isVertical={true} progressPercent={progressPercent} />;
            })()}

            {/* Events Container */}
            {sortedEvents.map((event, index) => (
              <MobileEvent key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceTimeline;
