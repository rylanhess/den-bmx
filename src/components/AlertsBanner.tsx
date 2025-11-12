/**
 * Alerts Banner Component
 * 
 * Displays weather updates and cancellations from tracks
 */

'use client';

import { useEffect, useState } from 'react';
import type { Alert } from '@/lib/supabase';

interface AlertsData {
  alerts: (Alert & { track: { name: string; slug: string } })[];
  hasAlerts: boolean;
}

const AlertsBanner = () => {
  const [alertsData, setAlertsData] = useState<AlertsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/alerts');
        if (response.ok) {
          const data: AlertsData = await response.json();
          setAlertsData(data);
        }
      } catch (err) {
        console.error('Error fetching alerts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Don't show banner while loading
  if (isLoading) {
    return (
      <div className="bg-[#00ff0c] text-black px-4 py-3 text-center font-black border-b-4 border-black relative z-10">
        <span className="text-2xl">⚠️</span> WEATHER UPDATES AND CANCELLATIONS WILL APPEAR HERE <span className="text-2xl">⚠️</span>
      </div>
    );
  }

  // Show placeholder if no alerts
  if (!alertsData?.hasAlerts) {
    return (
      <div className="bg-black text-white px-4 py-3 text-center font-bold border-b-4 border-[#00ff0c] relative z-10">
        <span className="text-lg">✓</span> No cancellations - Check schedule below for this week&apos;s events
      </div>
    );
  }

  // Show alerts without blinking (easier to read)
  return (
    <div className="bg-[#00ff0c] text-black px-4 py-4 border-b-4 border-black relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center font-black text-xl mb-3">
          <span className="text-2xl">⚠️</span> TRACK ALERTS <span className="text-2xl">⚠️</span>
        </div>
        <div className="space-y-2">
          {alertsData.alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-black text-[#00ff0c] px-4 py-3 rounded border-4 border-[#00ff0c]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <div className="font-black text-sm sm:text-base flex-shrink-0">
                  {alert.track?.name || 'Track'}:
                </div>
                <div className="font-bold text-sm sm:text-base flex-1">
                  {alert.text}
                </div>
                {alert.url && (
                  <a
                    href={alert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00ff0c] hover:text-white font-black text-xs sm:text-sm underline flex-shrink-0"
                  >
                    View Post →
                  </a>
                )}
              </div>
              <div className="text-xs text-white/70 mt-2">
                Posted {formatTimeAgo(alert.posted_at)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'yesterday';
  return `${diffDays} days ago`;
};

export default AlertsBanner;

