'use client';

import { useEffect, useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, View, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isSameDay, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { Event as EventType } from '@/lib/supabase';
import Footer from '@/components/Footer';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch events for a wider range (90 days) to populate the calendar
        const response = await fetch('/api/events?days=90');
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
  }, []);

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const trackSlug = event.resource.event.track?.slug || '';
    const colors: Record<string, { backgroundColor: string; borderColor: string }> = {
      'mile-high-bmx': { backgroundColor: '#00ff0c33', borderColor: '#00ff0c' },
      'twin-silo-bmx': { backgroundColor: '#00ff0c33', borderColor: '#00ff0c' },
      'county-line-bmx': { backgroundColor: '#00ff0c33', borderColor: '#00ff0c' },
      'dacono-bmx': { backgroundColor: '#00ff0c33', borderColor: '#00ff0c' },
    };

    const color = colors[trackSlug] || { backgroundColor: '#00ff0c33', borderColor: '#00ff0c' };

    return {
      style: {
        backgroundColor: color.backgroundColor,
        borderColor: color.borderColor,
        borderWidth: '2px',
        borderRadius: '4px',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 'bold',
      },
    };
  };

  const CustomToolbar = ({ label, onNavigate, onView }: any) => {
    // Generate label for Day/Week views
    let displayLabel = label;
    if (view === 'day') {
      displayLabel = formatDate(currentDate);
    } else if (view === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
      displayLabel = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    }

    const handleNavigate = (direction: 'PREV' | 'NEXT' | 'TODAY') => {
      if (direction === 'TODAY') {
        setCurrentDate(new Date());
        return;
      }

      const newDate = new Date(currentDate);
      if (view === 'day') {
        newDate.setDate(newDate.getDate() + (direction === 'PREV' ? -1 : 1));
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() + (direction === 'PREV' ? -7 : 7));
      } else {
        // For month view, use the calendar's navigation
        onNavigate(direction);
        return;
      }
      setCurrentDate(newDate);
    };

    return (
      <div className="flex flex-col gap-4 mb-4 p-3 sm:p-4 bg-black border-4 border-[#00ff0c]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#00ff0c] flex-shrink-0" />
            <span className="text-white font-black text-lg sm:text-xl truncate">{displayLabel}</span>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => handleNavigate('PREV')}
              className="bg-black text-[#00ff0c] hover:bg-[#00ff0c33] border-2 border-[#00ff0c] p-1.5 sm:p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Previous"
            >
              <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => handleNavigate('TODAY')}
              className="bg-black text-[#00ff0c] hover:bg-[#00ff0c] hover:text-black border-2 border-[#00ff0c] px-3 sm:px-4 py-1.5 sm:py-2 font-black text-xs sm:text-sm transition-colors min-h-[44px]"
            >
              TODAY
            </button>
            <button
              onClick={() => handleNavigate('NEXT')}
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

  const CustomEvent = ({ event }: { event: CalendarEvent }) => {
    const trackName = event.resource.event.track?.name || 'Track';
    const eventTitle = event.resource.event.title;
    
    return (
      <div className="p-1">
        <div className="text-xs font-bold truncate">{trackName}</div>
        <div className="text-xs truncate">{eventTitle}</div>
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
    const trackName = eventData.track?.name || 'Track';
    const trackCity = eventData.track?.city || '';
    
    return (
      <div
        className="bg-black border-2 border-[#00ff0c] rounded p-3 mb-3 hover:bg-[#00ff0c11] transition-colors cursor-pointer"
        onClick={() => {
          if (eventData.url) {
            window.open(eventData.url, '_blank', 'noopener,noreferrer');
          }
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#00ff0c] font-bold text-sm">
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
                    events.map(event => (
                      <div
                        key={event.id}
                        className="bg-black border border-[#00ff0c] rounded p-2 hover:bg-[#00ff0c11] transition-colors cursor-pointer text-xs"
                        onClick={() => {
                          if (event.resource.event.url) {
                            window.open(event.resource.event.url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        <div className="text-[#00ff0c] font-bold truncate">
                          {event.resource.event.track?.name || 'Track'}
                        </div>
                        <div className="text-white truncate mt-0.5">
                          {event.resource.event.title}
                        </div>
                      </div>
                    ))
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
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-8 flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#00ff0c]" />
              EVENT CALENDAR
            </h1>
            <div className="bg-black border-4 border-[#00ff0c] p-12 text-center">
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
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-8 flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#00ff0c]" />
              EVENT CALENDAR
            </h1>
            <div className="bg-black border-4 border-[#00ff0c] p-12 text-center">
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
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-8 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#00ff0c]" />
            EVENT CALENDAR
          </h1>

          <div className="bg-black border-4 border-[#00ff0c] p-4 sm:p-6">
            {/* Custom Toolbar for all views */}
            <CustomToolbar
              label={view === 'month' ? format(currentDate, 'MMMM yyyy') : ''}
              onNavigate={handleNavigate}
              onView={handleViewChange}
            />
            
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
                  dayRangeHeaderFormat: ({ start, end }: any) =>
                    `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`,
                  monthHeaderFormat: 'MMMM yyyy',
                  weekdayFormat: 'EEE',
                  timeGutterFormat: 'h:mm a',
                  eventTimeRangeFormat: ({ start, end }: any) =>
                    `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`,
                }}
                popup
                popupOffset={{ x: 10, y: 10 }}
                onSelectEvent={(event: CalendarEvent) => {
                  // Open event details or link
                  if (event.resource.event.url) {
                    window.open(event.resource.event.url, '_blank', 'noopener,noreferrer');
                  }
                }}
                onSelectSlot={(slotInfo: SlotInfo) => {
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

