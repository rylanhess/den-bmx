/**
 * This Week's Events Component
 * 
 * Displays upcoming events from all tracks
 */

'use client';

import { useEffect, useState } from 'react';
import type { Event } from '@/lib/supabase';

interface EventsData {
  events: (Event & { track: { name: string; city: string; slug: string } })[];
}

const ThisWeeksEvents = () => {
  const [events, setEvents] = useState<EventsData['events']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?days=7');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data: EventsData = await response.json();
        
        // Filter out any past events (extra safety check)
        // Compare dates at day level in Denver timezone to avoid filtering out 
        // today's events that have midnight timestamps (unknown times)
        const now = new Date();
        const denverNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Denver' }));
        denverNow.setHours(0, 0, 0, 0); // Start of today
        
        const upcomingEvents = data.events.filter(event => {
          const eventDate = new Date(event.start_at);
          const denverEventDate = new Date(eventDate.toLocaleString('en-US', { timeZone: 'America/Denver' }));
          denverEventDate.setHours(0, 0, 0, 0); // Start of event day
          return denverEventDate >= denverNow;
        });
        
        setEvents(upcomingEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if it's today
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) {
      return 'Today';
    }
    if (isTomorrow) {
      return 'Tomorrow';
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'America/Denver'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Denver'
    });
  };

  const isUnknownTime = (dateString: string) => {
    const date = new Date(dateString);
    // Get time in Denver timezone
    const denverTimeString = date.toLocaleTimeString('en-US', { 
      timeZone: 'America/Denver',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    // Check if time is 00:00 (midnight) - our sentinel for unknown time
    return denverTimeString === '00:00' || denverTimeString.startsWith('00:00');
  };

  const getTimeRange = (startAt: string, endAt: string | null) => {
    // Check if start time is unknown (midnight sentinel)
    if (isUnknownTime(startAt)) {
      return 'Time TBD - Check track site';
    }
    
    const startTime = formatTime(startAt);
    if (endAt) {
      const endTime = formatTime(endAt);
      return `${startTime} - ${endTime}`;
    }
    return startTime;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">This Week&apos;s Events</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800 rounded-lg p-4 border border-slate-700 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">This Week&apos;s Events</h2>
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
          <p className="font-semibold text-red-400">Error loading events</p>
          <p className="text-sm text-red-300 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // No events
  const noEvents = events.length === 0;

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">This Week&apos;s Events</h2>
        {!isLoading && !error && (
          <span className="text-sm text-slate-400">
            {events.length} {events.length === 1 ? 'event' : 'events'}
          </span>
        )}
      </div>

      {noEvents ? (
        <div className="bg-slate-800 rounded-lg p-12 text-center border border-slate-700">
          <p className="text-slate-300 text-lg">No upcoming events this week</p>
          <p className="text-slate-500 text-sm mt-2">Check back soon for updates from the tracks!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    {/* Track Name */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500 font-semibold text-sm">
                        {event.track?.name || 'Unknown Track'}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 text-xs">
                        {event.track?.city || ''}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-white mb-2">
                      {event.title}
                    </h3>

                    {/* Description */}
                    {event.description && (
                      <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    {/* Date & Time */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(event.start_at)}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{getTimeRange(event.start_at, event.end_at)}</span>
                      </div>

                      {/* Gate Fee */}
                      {event.gate_fee && (
                        <div className="flex items-center gap-1 text-green-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{event.gate_fee}</span>
                        </div>
                      )}
                    </div>

                    {/* Facebook Link */}
                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium mt-3"
                      >
                        View on Facebook
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>

                  {/* Class Badge */}
                  {event.class && (
                    <div className="bg-slate-700 text-slate-300 px-3 py-1 rounded text-xs font-medium whitespace-nowrap">
                      {event.class}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThisWeeksEvents;

