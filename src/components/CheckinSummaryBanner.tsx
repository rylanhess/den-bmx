'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

type RiderScoreboard = {
  mile_high: number;
  dacono: number;
  county_line: number;
  twin_silos: number;
};

const emptyScoreboard: RiderScoreboard = {
  mile_high: 0,
  dacono: 0,
  county_line: 0,
  twin_silos: 0,
};

export default function CheckinSummaryBanner() {
  const [scoreboard, setScoreboard] = useState<RiderScoreboard>(emptyScoreboard);
  const [loading, setLoading] = useState(true);
  const scoreboardText = `Mile High: ${scoreboard.mile_high} riders | Dacono: ${scoreboard.dacono} riders | County Line: ${scoreboard.county_line} riders | Twin Silos: ${scoreboard.twin_silos} riders`;

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/checkins/summary?mode=home');
        const payload = await response.json();
        if (response.ok) {
          setScoreboard(payload.rider_scoreboard ?? emptyScoreboard);
        }
      } catch (error) {
        console.error('Unable to load check-in banner summary', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="bg-black border-b border-[#00ff0c]/40 sticky z-30 md:top-[128px] top-[96px]">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-3">
          <h2 className="text-[#00ff0c] font-black text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap">
            Check-ins
          </h2>
          <div className="flex-1 min-w-0 overflow-hidden">
            {loading ? (
              <p className="text-xs text-gray-300 truncate">Loading attendance summary...</p>
            ) : (
              <div className="checkins-marquee-track text-xs sm:text-sm text-gray-200 whitespace-nowrap">
                <span>{scoreboardText}</span>
                <span className="mx-8 text-[#00ff0c]/60">|</span>
                <span>{scoreboardText}</span>
              </div>
            )}
          </div>
          <Link
            href="/check-ins"
            className="whitespace-nowrap border-2 border-[#00ff0c] rounded-lg px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-black bg-black text-[#00ff0c] hover:bg-[#00ff0c] hover:text-black active:scale-95 transition-all duration-200 inline-flex items-center gap-1.5"
          >
            <CheckCircleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            CHECK IN NOW
          </Link>
        </div>
      </div>
    </section>
  );
}
