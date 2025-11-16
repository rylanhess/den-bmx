/**
 * Race Timeline Component
 * 
 * Displays key BMX races for 2025 with a progress indicator
 */

'use client';

import { useMemo, useState, useEffect } from 'react';
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
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#0073FF] opacity-20"></div>
          {/* Progress line - green for completed */}
          <div 
            className="absolute left-4 top-0 w-0.5 bg-[#00FF0D] transition-all duration-500"
            style={{ height: `${progressPercent}%` }}
          ></div>
        </>
      );
    }
    
    return (
      <>
        {/* Background line - blue for variety */}
        <div className="absolute top-28 left-0 right-0 h-0.5 bg-[#0073FF] opacity-20"></div>
        {/* Progress line - green for completed */}
        <div 
          className="absolute top-28 left-0 h-0.5 bg-[#00FF0D] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </>
    );
  };

  // Timeline Dot Component
  const TimelineDot = ({ 
    isPast, 
    position, 
    isVertical = false 
  }: { 
    isPast: boolean; 
    position: number; 
    isVertical?: boolean;
  }) => {
    const dotClasses = `absolute w-3 h-3 rounded-full border-2 transition-opacity duration-300 ${
      isPast 
        ? `bg-[#00FF0D] border-[#00FF0D] opacity-50` 
        : `bg-black border-[#00FF0D]`
    }`;
    
    if (isVertical) {
      // For vertical timeline: left-4 = 16px, dot is 3px wide, so center at 16px - 1.5px = 14.5px
      // Position is the top offset for the event
      return (
        <div 
          className={dotClasses}
          style={{ 
            left: '14.5px', // Center on the 16px timeline (left-4)
            top: `${position}px`,
            transform: 'translate(-50%, -50%)', // Center both horizontally and vertically
          }}
        />
      );
    }
    
    // For horizontal timeline: 
    // Timeline line is at top-28 = 112px from main container
    // Timeline line has h-0.5 = 2px height, so center is at 112px + 1px = 113px
    // Events container has pt-8 = 32px padding
    // So timeline center is at 113px - 32px = 81px from events container content area
    // Use transform to perfectly center the dot on the line
    return (
      <div 
        className={dotClasses}
        style={{ 
          left: `calc(${position}% - 6px)`, // Center horizontally (w-3 = 12px, so 12px/2 = 6px)
          top: '81px', // Position at timeline center
          transform: 'translateY(-50%)', // Center vertically using transform
        }}
      />
    );
  };

  // Timeline Sprite Component with pedaling animation
  const TimelineSprite = ({ 
    progressPercent, 
    isVertical = false 
  }: { 
    progressPercent: number; 
    isVertical?: boolean;
  }) => {
    // Pedaling animation frames in sequence
    const spriteFrames = [
      '/pedal_sprite/sprite_main_fwd_dwn_001.png',
      '/pedal_sprite/sprite_bk_dwn_002.png',
      '/pedal_sprite/sprite_bk_up_003.png',
      '/pedal_sprite/sprite_fwd_up_004.png',
    ];
    
    const [currentFrame, setCurrentFrame] = useState(0);
    
    // Cycle through frames every 300ms
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % spriteFrames.length);
      }, 300);
      
      return () => clearInterval(interval);
    }, [spriteFrames.length]);
    
    if (isVertical) {
      const estimatedHeight = sortedEvents.length * 120;
      const progressHeight = (progressPercent / 100) * estimatedHeight;
      return (
        <div
          className="absolute left-0 transition-all duration-500 z-20"
          style={{ top: `${Math.max(0, progressHeight - 16)}px` }}
        >
          <Image
            src={spriteFrames[currentFrame]}
            alt="BMX Rider Progress"
            width={32}
            height={32}
            className="drop-shadow-lg"
          />
        </div>
      );
    }
    
    return (
      <div
        className="absolute top-20 transition-all duration-500 z-20"
        style={{ left: `calc(${progressPercent}% - 24px)` }}
      >
        <Image
          src={spriteFrames[currentFrame]}
          alt="BMX Rider Progress"
          width={48}
          height={48}
          className="drop-shadow-lg"
        />
      </div>
    );
  };

  // Event Icon Component
  const EventIcon = ({ 
    icon, 
    isPast, 
    size = 64 
  }: { 
    icon: 'trophy' | 'podium' | 'dot'; 
    isPast: boolean;
    size?: number;
  }) => {
    const opacityClass = isPast ? 'opacity-50' : 'opacity-100';
    
    if (icon === 'trophy') {
      return (
        <div className={`transition-opacity duration-300 ${opacityClass}`}>
          <Image
            src="/BMX_Trophy.png"
            alt="Trophy"
            width={size}
            height={size}
            className="drop-shadow-lg"
          />
        </div>
      );
    }
    
    if (icon === 'podium') {
      return (
        <div className={`transition-opacity duration-300 ${opacityClass}`}>
          <Image
            src="/BMX_Podium.png"
            alt="Podium"
            width={size}
            height={size}
            className="drop-shadow-lg"
          />
        </div>
      );
    }
    
    // Dot icon - use blue for variety
    return (
      <div className={`w-4 h-4 rounded-full border-2 border-[#0073FF] bg-[#0073FF] shadow-lg transition-opacity duration-300 ${opacityClass}`}></div>
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
        <div className="text-[#0073FF] font-black text-sm mb-1">
          {formatDateRange(event.date, event.endDate)}
        </div>
        <div className="text-white font-bold text-xs mb-1">
          {event.name}
        </div>
        <div className="text-gray-400 text-xs">
          {event.location}
        </div>
      </div>
    );
  };

  // Desktop Event Component
  const DesktopEvent = ({ event, index }: { event: RaceEvent; index: number }) => {
    const isPast = isEventPast(event);
    const eventPosition = sortedEvents.length === 1 
      ? 50 
      : (index / (sortedEvents.length - 1)) * 100;

    return (
      <div
        className="flex flex-col items-center relative"
        style={{ width: `${100 / sortedEvents.length}%`, maxWidth: '200px' }}
      >
        {/* Event Icon */}
        <div className="mb-3">
          <EventIcon icon={event.icon} isPast={isPast} size={64} />
        </div>

        {/* Event Dot - positioned to touch timeline */}
        <TimelineDot isPast={isPast} position={eventPosition} isVertical={false} />

        {/* Event Info */}
        <div className="mt-8">
          <EventInfo event={event} isPast={isPast} />
        </div>
      </div>
    );
  };

  // Mobile Event Component
  const MobileEvent = ({ event, index }: { event: RaceEvent; index: number }) => {
    const isPast = isEventPast(event);
    // Calculate position for vertical timeline (each event ~120px apart)
    const eventPosition = index * 120 + 24; // 24px offset for first event

    return (
      <div className="relative mb-12 last:mb-0">
        {/* Event Dot - positioned to touch timeline */}
        <TimelineDot isPast={isPast} position={eventPosition} isVertical={true} />

        {/* Event Content */}
        <div className={`ml-12 transition-opacity duration-300 ${isPast ? 'opacity-50' : 'opacity-100'}`}>
          {/* Event Icon */}
          <div className="mb-2">
            <EventIcon icon={event.icon} isPast={isPast} size={48} />
          </div>

          {/* Event Info */}
          <div className="text-[#0073FF] font-black text-sm mb-1">
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
  };

  return (
    <div className="w-full mb-12">
      <div className="bg-black border-4 border-[#00FF0D] p-6 sm:p-8 shadow-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#00FF0D] mb-6 sm:mb-8 text-center">
          2025 RACE TIMELINE
        </h2>

        {/* Desktop Horizontal Timeline */}
        <div className="hidden md:block relative">
          <div className="relative h-64 pb-8">
            {/* Timeline Line */}
            <TimelineLine isVertical={false} progressPercent={progress} />

            {/* Timeline Sprite */}
            <TimelineSprite progressPercent={progress} isVertical={false} />

            {/* Events Container */}
            <div className="relative flex justify-between items-start pt-8 px-4">
              {sortedEvents.map((event, index) => (
                <DesktopEvent key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden relative">
          <div className="relative pl-8 pb-8">
            {/* Timeline Line */}
            {(() => {
              const firstEvent = sortedEvents[0].date;
              const lastEvent = sortedEvents[sortedEvents.length - 1].endDate || sortedEvents[sortedEvents.length - 1].date;
              const totalDuration = lastEvent.getTime() - firstEvent.getTime();
              const currentProgress = currentDate.getTime() - firstEvent.getTime();
              const progressPercent = Math.max(0, Math.min(100, (currentProgress / totalDuration) * 100));
              
              return <TimelineLine isVertical={true} progressPercent={progressPercent} />;
            })()}

            {/* Timeline Sprite */}
            <TimelineSprite progressPercent={progress} isVertical={true} />

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
