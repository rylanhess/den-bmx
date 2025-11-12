/**
 * Data Refresh Banner Component
 * 
 * Shows when the Facebook data was last refreshed
 */

'use client';

import { useEffect, useState } from 'react';

interface RefreshStatus {
  lastRefresh: string | null;
  lastScrape: string | null;
  isStale: boolean;
}

const DataRefreshBanner = () => {
  const [status, setStatus] = useState<RefreshStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRefreshStatus = async () => {
      try {
        const response = await fetch('/api/refresh-status');
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        }
      } catch (err) {
        console.error('Error fetching refresh status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRefreshStatus();
  }, []);

  if (isLoading || !status?.lastRefresh) {
    return null;
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const getLastRefreshDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      timeZone: 'America/Denver',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const timeAgo = getTimeAgo(status.lastRefresh);
  const fullDate = getLastRefreshDate(status.lastRefresh);
  
  const lastScrapeTimeAgo = status.lastScrape ? getTimeAgo(status.lastScrape) : null;
  const lastScrapeFullDate = status.lastScrape ? getLastRefreshDate(status.lastScrape) : null;

  return (
    <div
      className={`border-b ${
        status.isStale
          ? 'bg-black border-[#00ff0c]/50'
          : 'bg-black border-[#00ff0c]/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
          <div className="flex items-center gap-2">
            {status.isStale ? (
              <svg className="w-4 h-4 text-[#00ff0c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-[#00ff0c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className={status.isStale ? 'text-[#00ff0c]' : 'text-white/80'}>
              <span className="font-medium">Latest Facebook post:</span>{' '}
              <span className="font-semibold">{timeAgo}</span>
              <span className="hidden sm:inline text-white/50"> ({fullDate})</span>
            </span>
          </div>
          {lastScrapeTimeAgo && (
            <>
              <span className="hidden sm:inline text-white/40">•</span>
              <div className="flex items-center gap-2">
                <span className="text-white/70">
                  <span className="font-medium">Last site refresh:</span>{' '}
                  <span className="font-semibold">{lastScrapeTimeAgo}</span>
                  <span className="hidden sm:inline text-white/50"> ({lastScrapeFullDate})</span>
                </span>
              </div>
            </>
          )}
          {status.isStale && (
            <span className="hidden md:inline text-[#00ff0c]">
              • Data may be outdated
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataRefreshBanner;

