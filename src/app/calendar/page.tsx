'use client';

import { useEffect, useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, View, type Event as RBCEvent } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isSameDay, eachDayOfInterval } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { Event as EventType } from '@/lib/supabase';
import Footer from '@/components/Footer';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BoltIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    event: EventType & { track: { name: string; city: string; slug: string } };
  };
}

interface EventsData {
  events: (EventType & { track: { name: string; city: string; slug: string } })[];
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('month');

  // Set default view to week on mobile after mount
  useEffect(() => {
    if (window.innerWidth < 640) {
      setView('week');
    }
  }, []); // Only run on mount

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Calculate how many days to fetch based on the current view date
        // Fetch enough events to cover the visible month plus buffer
        const now = new Date();
        const viewDate = currentDate;
        
        // Calculate days from today to the end of the viewed month
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysFromToday = Math.ceil((lastDayOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Fetch at least 365 days to cover all of 2026, or enough to cover the viewed month
        const daysToFetch = Math.max(365, daysFromToday + 30); // Add 30 day buffer
        
        const response = await fetch(`/api/events?days=${daysToFetch}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data: EventsData = await response.json();

        // Transform events for react-big-calendar
        const calendarEvents: CalendarEvent[] = data.events.map((event) => {
          const start = new Date(event.start_at);
          // If end_at is null, default to 2 hours after start
          const end = event.end_at
            ? new Date(event.end_at)
            : new Date(start.getTime() + 2 * 60 * 60 * 1000);

          return {
            id: event.id,
            title: `${event.track?.name || 'Track'}: ${event.title}`,
            start,
            end,
            resource: { event },
          };
        });

        setEvents(calendarEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate]);

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );

  const handleNavigate = (newDate: Date | string) => {
    // Handle both Date objects and navigation strings from react-big-calendar
    if (typeof newDate === 'string') {
      // Handle navigation strings like 'PREV', 'NEXT', 'TODAY'
      const today = new Date();
      const newDateObj = new Date(currentDate);
      
      if (newDate === 'TODAY') {
        setCurrentDate(today);
      } else if (newDate === 'PREV') {
        if (view === 'month') {
          newDateObj.setMonth(newDateObj.getMonth() - 1);
        } else if (view === 'week') {
          newDateObj.setDate(newDateObj.getDate() - 7);
        } else {
          newDateObj.setDate(newDateObj.getDate() - 1);
        }
        setCurrentDate(newDateObj);
      } else if (newDate === 'NEXT') {
        if (view === 'month') {
          newDateObj.setMonth(newDateObj.getMonth() + 1);
        } else if (view === 'week') {
          newDateObj.setDate(newDateObj.getDate() + 7);
        } else {
          newDateObj.setDate(newDateObj.getDate() + 1);
        }
        setCurrentDate(newDateObj);
      }
    } else {
      // Handle Date object
      if (isNaN(newDate.getTime())) {
        console.error('Invalid date received:', newDate);
        setCurrentDate(new Date());
        return;
      }
      setCurrentDate(newDate);
    }
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  // Track color and icon configuration
  const trackConfig: Record<string, { 
    color: string; 
    backgroundColor: string; 
    borderColor: string;
    icon: React.ComponentType<{ className?: string }>;
    name: string;
  }> = {
    'mile-high-bmx': {
      color: '#00FF0D',
      backgroundColor: '#00FF0D33',
      borderColor: '#00FF0D',
      icon: BoltIcon,
      name: 'Mile High BMX',
    },
    'twin-silo-bmx': {
      color: '#0073FF',
      backgroundColor: '#0073FF33',
      borderColor: '#0073FF',
      icon: BoltIcon,
      name: 'Twin Silo BMX',
    },
    'county-line-bmx': {
      color: '#FF00F2',
      backgroundColor: '#FF00F233',
      borderColor: '#FF00F2',
      icon: BoltIcon,
      name: 'County Line BMX',
    },
    'dacono-bmx': {
      color: '#FF8C00',
      backgroundColor: '#FF8C0033',
      borderColor: '#FF8C00',
      icon: BoltIcon,
      name: 'Dacono BMX',
    },
  };

  const getTrackConfig = (trackSlug: string | null | undefined) => {
    if (!trackSlug || !trackConfig[trackSlug]) {
      return {
        color: '#FFFFFF',
        backgroundColor: '#FFFFFF33',
        borderColor: '#FFFFFF',
        icon: UserGroupIcon,
        name: 'Meetup/Other',
      };
    }
    return trackConfig[trackSlug];
  };

  const eventStyleGetter = (event: RBCEvent) => {
    const calendarEvent = event as CalendarEvent;
    const trackSlug = calendarEvent.resource.event.track?.slug;
    const config = getTrackConfig(trackSlug);

    return {
      style: {
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
        borderWidth: '1px',
        borderRadius: '2px',
        color: '#ffffff',
        fontSize: '10px',
        fontWeight: 'normal',
        padding: '1px 2px',
        marginBottom: '1px',
        minHeight: '16px',
        lineHeight: '1.2',
      },
    };
  };

  const CustomToolbar = ({ label, onNavigate, onView }: { label: string; onNavigate: (date: Date | string) => void; onView: (view: View) => void }) => {
    // Generate label for Day/Week views
    let displayLabel = label;
    try {
      if (view === 'day') {
        displayLabel = formatDate(currentDate);
      } else if (view === 'week') {
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
        const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        displayLabel = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      } else if (view === 'month') {
        // Use the calendar's label for month view, or format currentDate as fallback
        displayLabel = label || format(currentDate, 'MMMM yyyy');
      }
    } catch (error) {
      console.error('Error formatting date label:', error);
      displayLabel = format(new Date(), 'MMMM yyyy');
    }

    const handleToolbarNavigate = (direction: 'PREV' | 'NEXT' | 'TODAY') => {
      if (direction === 'TODAY') {
        const today = new Date();
        setCurrentDate(today);
        onNavigate(today);
        return;
      }

      const newDate = new Date(currentDate);
      
      // Validate currentDate before using it
      if (isNaN(newDate.getTime())) {
        console.error('Invalid currentDate, resetting to today');
        const today = new Date();
        setCurrentDate(today);
        onNavigate(today);
        return;
      }
      
      if (view === 'day') {
        newDate.setDate(newDate.getDate() + (direction === 'PREV' ? -1 : 1));
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() + (direction === 'PREV' ? -7 : 7));
      } else {
        // For month view, navigate by month
        newDate.setMonth(newDate.getMonth() + (direction === 'PREV' ? -1 : 1));
      }
      
      // Validate the new date before setting
      if (isNaN(newDate.getTime())) {
        console.error('Invalid date created:', newDate);
        const today = new Date();
        setCurrentDate(today);
        onNavigate(today);
        return;
      }
      
      setCurrentDate(newDate);
      onNavigate(newDate);
    };

    return (
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 p-3 sm:p-4 bg-black border-4 border-[#00ff0c] rounded-xl">
        {/* Date and Navigation - Stack on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-2">
          {/* Date Label */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#00ff0c] flex-shrink-0" />
            <span className="text-white font-black text-lg sm:text-xl truncate">{displayLabel}</span>
          </div>
          
          {/* Navigation Buttons - Below date on mobile, inline on desktop */}
          <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => handleToolbarNavigate('PREV')}
              className="bg-black text-[#00ff0c] hover:bg-[#00ff0c33] border-2 border-[#00ff0c] p-1.5 sm:p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Previous"
            >
              <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => handleToolbarNavigate('TODAY')}
              className="bg-black text-[#00ff0c] hover:bg-[#00ff0c] hover:text-black border-2 border-[#00ff0c] px-3 sm:px-4 py-1.5 sm:py-2 font-black text-xs sm:text-sm transition-colors min-h-[44px]"
            >
              TODAY
            </button>
            <button
              onClick={() => handleToolbarNavigate('NEXT')}
              className="bg-black text-[#00ff0c] hover:bg-[#00ff0c33] border-2 border-[#00ff0c] p-1.5 sm:p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Next"
            >
              <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        
        {/* View Toggle Buttons */}
        <div className="flex gap-1 sm:gap-2 border-2 border-[#00ff0c] rounded w-full sm:w-auto">
          <button
            onClick={() => onView('day')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 font-black text-xs sm:text-sm transition-colors min-h-[44px] ${
              view === 'day'
                ? 'bg-[#00ff0c] text-black'
                : 'bg-black text-[#00ff0c] hover:bg-[#00ff0c33]'
            }`}
          >
            DAY
          </button>
          <button
            onClick={() => onView('week')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 font-black text-xs sm:text-sm transition-colors min-h-[44px] ${
              view === 'week'
                ? 'bg-[#00ff0c] text-black'
                : 'bg-black text-[#00ff0c] hover:bg-[#00ff0c33]'
            }`}
          >
            WEEK
          </button>
          <button
            onClick={() => onView('month')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 font-black text-xs sm:text-sm transition-colors min-h-[44px] ${
              view === 'month'
                ? 'bg-[#00ff0c] text-black'
                : 'bg-black text-[#00ff0c] hover:bg-[#00ff0c33]'
            }`}
          >
            MONTH
          </button>
        </div>
      </div>
    );
  };

  const CustomEvent = ({ event }: { event: RBCEvent }) => {
    const calendarEvent = event as CalendarEvent;
    const trackSlug = calendarEvent.resource.event.track?.slug;
    const config = getTrackConfig(trackSlug);
    const Icon = config.icon;
    const eventTitle = calendarEvent.resource.event.title;
    
    // Extract just the event type from title (remove [TEST] prefix and track name)
    const titleParts = eventTitle.replace('[TEST]', '').trim();
    const shortTitle = titleParts.length > 20 ? titleParts.substring(0, 18) + '...' : titleParts;
    
    return (
      <div className="px-0.5 py-0 flex items-center gap-0.5 min-h-0">
        <Icon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: config.color }} />
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="text-[10px] leading-tight truncate font-semibold" style={{ color: config.color }}>
            {shortTitle}
          </div>
        </div>
      </div>
    );
  };

  // Get events for a specific day
  const getEventsForDay = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, date);
    });
  };

  // Get events for a week (7 days starting from the current date)
  const getEventsForWeek = (startDate: Date): { date: Date; events: CalendarEvent[] }[] => {
    const weekStart = startOfWeek(startDate, { weekStartsOn: 0 }); // Sunday
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
    });

    return weekDays.map(date => ({
      date,
      events: getEventsForDay(date)
    }));
  };

  // Format date helper
  const formatDate = (date: Date) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (isSameDay(date, now)) {
      return 'Today';
    }
    if (isSameDay(date, tomorrow)) {
      return 'Tomorrow';
    }
    return format(date, 'EEEE, MMMM d');
  };

  // Event card component for Day/Week views
  const EventCard = ({ event }: { event: CalendarEvent }) => {
    const eventData = event.resource.event;
    const trackSlug = eventData.track?.slug;
    const config = getTrackConfig(trackSlug);
    const Icon = config.icon;
    const trackName = eventData.track?.name || 'Meetup/Other';
    const trackCity = eventData.track?.city || '';
    
    return (
      <div
        className="bg-black border-2 rounded p-3 mb-3 hover:opacity-80 transition-opacity cursor-pointer"
        style={{ borderColor: config.borderColor }}
        onClick={() => {
          if (eventData.url) {
            window.open(eventData.url, '_blank', 'noopener,noreferrer');
          }
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: config.color }} />
              <span className="font-bold text-sm" style={{ color: config.color }}>
                {trackName}
              </span>
              {trackCity && (
                <>
                  <span className="text-white/40">•</span>
                  <span className="text-white/70 text-xs">
                    {trackCity}
                  </span>
                </>
              )}
            </div>
            <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">
              {eventData.title}
            </h3>
            {eventData.description && (
              <p className="text-white/80 text-xs sm:text-sm mb-2 leading-relaxed line-clamp-2">
                {eventData.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/70">
              {eventData.gate_fee && (
                <div className="flex items-center gap-1 text-[#00ff0c]">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{eventData.gate_fee}</span>
                </div>
              )}
              {eventData.class && (
                <span className="bg-[#00ff0c] text-black px-2 py-0.5 rounded text-xs font-medium">
                  {eventData.class}
                </span>
              )}
            </div>
            {eventData.url && (
              <a
                href={eventData.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[#00ff0c] hover:text-white text-xs sm:text-sm font-medium mt-2"
              >
                View on Facebook
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Day View Component
  const DayView = () => {
    const dayEvents = getEventsForDay(currentDate);
    
    return (
      <div className="min-h-[500px]">
        <div className="mb-4 pb-4 border-b-2 border-[#00ff0c]">
          <h2 className="text-2xl sm:text-3xl font-black text-[#00ff0c]">
            {formatDate(currentDate)}
          </h2>
          <p className="text-white/70 text-sm mt-1">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        
        {dayEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">No events scheduled for this day</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Track Legend Component
  const TrackLegend = () => {
    const tracks = Object.entries(trackConfig).map(([slug, config]) => ({
      slug,
      ...config,
    }));
    
    // Add "No Track" option
    tracks.push({
      slug: 'none',
      color: '#FFFFFF',
      backgroundColor: '#FFFFFF33',
      borderColor: '#FFFFFF',
      icon: UserGroupIcon,
      name: 'Meetup/Other',
    });

    return (
      <div className="mb-3 p-2 bg-black border-2 border-[#00ff0c] rounded">
        <h3 className="text-white font-black text-xs mb-2">TRACK LEGEND</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <div
                key={track.slug}
                className="flex items-center gap-1.5 text-xs"
              >
                <div
                  className="w-3 h-3 flex items-center justify-center flex-shrink-0"
                  style={{ color: track.color }}
                >
                  <Icon className="w-full h-full" />
                </div>
                <span className="text-white font-bold truncate">{track.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Week View Component
  const WeekView = () => {
    const weekData = getEventsForWeek(currentDate);
    
    return (
      <div className="min-h-[500px]">
        <div className="mb-4 pb-4 border-b-2 border-[#00ff0c]">
          <h2 className="text-xl sm:text-2xl font-black text-[#00ff0c]">
            {format(weekData[0].date, 'MMM d')} - {format(weekData[6].date, 'MMM d, yyyy')}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 sm:gap-4">
          {weekData.map(({ date, events }) => {
            const isToday = isSameDay(date, new Date());
            
            return (
              <div
                key={date.toISOString()}
                className={`border-2 ${isToday ? 'border-[#00ff0c] bg-[#00ff0c11]' : 'border-[#00ff0c33]'} rounded p-2 sm:p-3 min-h-[200px]`}
              >
                <div className="mb-3 pb-2 border-b border-[#00ff0c33]">
                  <div className={`text-xs sm:text-sm font-black ${isToday ? 'text-[#00ff0c]' : 'text-white/70'}`}>
                    {format(date, 'EEE')}
                  </div>
                  <div className={`text-sm sm:text-base font-bold ${isToday ? 'text-[#00ff0c]' : 'text-white'}`}>
                    {format(date, 'MMM d')}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {events.length === 0 ? (
                    <p className="text-white/40 text-xs">No events</p>
                  ) : (
                    events.map(event => {
                      const trackSlug = event.resource.event.track?.slug;
                      const config = getTrackConfig(trackSlug);
                      const Icon = config.icon;
                      const trackName = event.resource.event.track?.name || 'Meetup/Other';
                      
                      return (
                        <div
                          key={event.id}
                          className="bg-black border rounded p-2 hover:opacity-80 transition-opacity cursor-pointer text-xs"
                          style={{ borderColor: config.borderColor }}
                          onClick={() => {
                            if (event.resource.event.url) {
                              window.open(event.resource.event.url, '_blank', 'noopener,noreferrer');
                            }
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <Icon className="w-3 h-3 flex-shrink-0" style={{ color: config.color }} />
                            <div className="font-bold truncate" style={{ color: config.color }}>
                              {trackName}
                            </div>
                          </div>
                          <div className="text-white truncate mt-0.5">
                            {event.resource.event.title}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Images - Responsive: Single Rider (Mobile) / Two Riders (Desktop) */}
        <div 
          className="fixed inset-0 z-0 w-full h-full" 
          style={{ 
            opacity: 0.25,
            pointerEvents: 'none',
          }}
        >
          {/* Mobile: Single Rider (Vertical) */}
          <div 
            className="md:hidden absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/black-white-portrait-athlete-participating-olympic-championship-sports.jpg')`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
            }}
          />
          {/* Desktop: Two Riders (Landscape) */}
          <div 
            className="hidden md:block absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/black-white-portrait-athlete-participating-olympic-championship-sports%20(1).jpg')`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
            }}
          />
          {/* Dark overlay to ensure text readability */}
          <div className="absolute inset-0 w-full h-full bg-black/50" />
        </div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Hero - Professional Punk */}
            <div className="text-center mb-12">
              <div className="inline-block bg-black border-4 border-[#00ff0c] rounded-xl p-8 mb-6">
                <h1 className="text-5xl md:text-7xl font-black text-[#00ff0c] mb-2" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
                  EVENT CALENDAR
                </h1>
                <div className="h-2 bg-[#00ff0c]"></div>
              </div>
            </div>
            <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-12 text-center">
              <div className="text-[#00ff0c] font-black text-lg">Loading events...</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Images - Responsive: Single Rider (Mobile) / Two Riders (Desktop) */}
        <div 
          className="fixed inset-0 z-0 w-full h-full" 
          style={{ 
            opacity: 0.25,
            pointerEvents: 'none',
          }}
        >
          {/* Mobile: Single Rider (Vertical) */}
          <div 
            className="md:hidden absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/black-white-portrait-athlete-participating-olympic-championship-sports.jpg')`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
            }}
          />
          {/* Desktop: Two Riders (Landscape) */}
          <div 
            className="hidden md:block absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/black-white-portrait-athlete-participating-olympic-championship-sports%20(1).jpg')`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
            }}
          />
          {/* Dark overlay to ensure text readability */}
          <div className="absolute inset-0 w-full h-full bg-black/50" />
        </div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-8 flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#00ff0c]" />
              EVENT CALENDAR
            </h1>
            <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-12 text-center">
              <div className="text-[#00ff0c] font-black text-lg mb-2">Error loading events</div>
              <div className="text-white/70 text-sm">{error}</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Images - Responsive: Single Rider (Mobile) / Two Riders (Desktop) */}
      <div 
        className="fixed inset-0 z-0 w-full h-full" 
        style={{ 
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        {/* Mobile: Single Rider (Vertical) */}
        <div 
          className="md:hidden absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/black-white-portrait-athlete-participating-olympic-championship-sports.jpg')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
        />
        {/* Desktop: Two Riders (Landscape) */}
        <div 
          className="hidden md:block absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/black-white-portrait-athlete-participating-olympic-championship-sports%20(1).jpg')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 w-full h-full bg-black/50" />
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero - Professional Punk */}
          <div className="text-center mb-12">
            <div className="inline-block bg-black border-4 border-[#00ff0c] rounded-xl p-8 mb-6">
              <h1 className="text-5xl md:text-7xl font-black text-[#00ff0c] mb-2" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
                EVENT CALENDAR
              </h1>
              <div className="h-2 bg-[#00ff0c]"></div>
            </div>
          </div>

          <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-4 sm:p-6">
            {/* Custom Toolbar for all views */}
            <CustomToolbar
              label={view === 'month' ? (isNaN(currentDate.getTime()) ? format(new Date(), 'MMMM yyyy') : format(currentDate, 'MMMM yyyy')) : ''}
              onNavigate={handleNavigate}
              onView={handleViewChange}
            />
            
            {/* Track Legend */}
            <TrackLegend />
            
            {/* Render appropriate view */}
            {view === 'day' ? (
              <DayView />
            ) : view === 'week' ? (
              <WeekView />
            ) : (
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultDate={defaultDate}
                defaultView="month"
                view={view}
                onView={handleViewChange}
                date={currentDate}
                onNavigate={handleNavigate}
                scrollToTime={scrollToTime}
                style={{ height: '70vh', minHeight: '400px' }}
                className="calendar-container"
                eventPropGetter={eventStyleGetter}
                components={{
                  toolbar: () => null, // Hide default toolbar, we use custom one above
                  event: CustomEvent,
                }}
                formats={{
                  dayFormat: 'EEE M/d',
                  dayHeaderFormat: 'EEEE MMMM d',
                  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
                    `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`,
                  monthHeaderFormat: 'MMMM yyyy',
                  weekdayFormat: 'EEE',
                  timeGutterFormat: 'h:mm a',
                  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
                    `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`,
                }}
                popup
                popupOffset={{ x: 10, y: 10 }}
                onSelectEvent={(event: RBCEvent) => {
                  // Open event details or link
                  const calendarEvent = event as CalendarEvent;
                  if (calendarEvent.resource.event.url) {
                    window.open(calendarEvent.resource.event.url, '_blank', 'noopener,noreferrer');
                  }
                }}
                onSelectSlot={() => {
                  // Optional: handle slot selection
                }}
                selectable
              />
            )}
          </div>

          {/* Event Details Modal could be added here */}
        </div>
      </div>
      <Footer />
    </div>
  );
}

