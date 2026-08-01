'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import NewBadge from '@/components/forum/NewBadge';
import { formatRelativeDate } from '@/lib/forumFormat';
import { hasRecentBoardActivity } from '@/lib/recentPostWindow';
import { coChipLink } from '@/lib/coloradoUi';
import {
  loadGuestPreferences,
  mergePreferences,
  saveGuestPreferences,
  trackBoardDisplayName,
  type UserPreferences,
} from '@/lib/userPreferences';
import type { CategoryStat } from '@/components/forum/CategoryTable';

interface TrackBoardGridProps {
  categories: CategoryStat[];
  initialPreferences?: UserPreferences;
  isLoggedIn: boolean;
}

export default function TrackBoardGrid({
  categories,
  initialPreferences = {},
  isLoggedIn,
}: TrackBoardGridProps) {
  const [prefs, setPrefs] = useState<UserPreferences>(initialPreferences);
  const [customizing, setCustomizing] = useState(false);
  const [newCounts, setNewCounts] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setPrefs(loadGuestPreferences());
    }
  }, [isLoggedIn]);

  const hidden = useMemo(
    () => new Set(prefs.forum?.hiddenTrackBoardIds ?? []),
    [prefs]
  );

  const boardLastSeen = prefs.forum?.boardLastSeen ?? {};

  const seenForActivity = useMemo(() => {
    if (isLoggedIn) return initialPreferences.forum?.boardLastSeen ?? {};
    return boardLastSeen;
  }, [isLoggedIn, initialPreferences.forum?.boardLastSeen, boardLastSeen]);

  useEffect(() => {
    if (Object.keys(seenForActivity).length === 0) return;

    fetch('/api/forum/board-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardLastSeen: seenForActivity }),
    })
      .then((r) => r.json())
      .then((data) => setNewCounts(data.counts ?? {}))
      .catch(() => {});
  }, [seenForActivity]);

  const persistPreferences = useCallback(
    async (next: UserPreferences) => {
      setPrefs(next);
      setSaving(true);
      try {
        if (isLoggedIn) {
          await fetch('/api/account', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preferences: next }),
          });
        } else {
          saveGuestPreferences(next);
        }
      } finally {
        setSaving(false);
      }
    },
    [isLoggedIn]
  );

  const toggleBoard = (categoryId: string, visible: boolean) => {
    const current = new Set(prefs.forum?.hiddenTrackBoardIds ?? []);
    if (visible) current.delete(categoryId);
    else current.add(categoryId);
    const next = mergePreferences(prefs, {
      forum: { hiddenTrackBoardIds: Array.from(current) },
    });
    persistPreferences(next);
  };

  const visibleCategories = customizing
    ? categories
    : categories.filter((c) => !hidden.has(c.id));

  if (categories.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 className="font-black text-[#00ff0c] text-xl uppercase tracking-wide">
          Track Message Boards
        </h2>
        <button
          type="button"
          onClick={() => setCustomizing((v) => !v)}
          className={coChipLink}
        >
          {customizing ? 'Done' : 'Customize boards'}
          {saving && !customizing ? '…' : ''}
        </button>
      </div>

      {customizing && (
        <p className="text-gray-500 text-xs mb-3">
          Toggle which track boards appear on your forum home. Saved {isLoggedIn ? 'to your account' : 'on this device'}.
        </p>
      )}

      {visibleCategories.length === 0 ? (
        <div className="border-2 border-[#00ff0c]/30 rounded-lg p-6 text-center text-gray-400 text-sm">
          All track boards hidden.{' '}
          <button type="button" onClick={() => setCustomizing(true)} className="text-[#00ff0c] font-bold hover:underline">
            Customize boards
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {visibleCategories.map((cat) => {
            const isHidden = hidden.has(cat.id);
            const newCount = newCounts[cat.id] ?? cat.new_post_count ?? 0;
            const isRecentlyActive = hasRecentBoardActivity(cat.latest_post_at);
            const name = trackBoardDisplayName(cat.name);

            return (
              <div key={cat.id} className="relative">
                {customizing && (
                  <label className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/80 rounded px-2 py-1 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!isHidden}
                      onChange={(e) => toggleBoard(cat.id, e.target.checked)}
                      className="accent-[#00ff0c]"
                    />
                    Show
                  </label>
                )}
                <Link
                  href={customizing ? '#' : `/forum/${cat.slug}`}
                  onClick={customizing ? (e) => e.preventDefault() : undefined}
                  className={`block h-full border-2 rounded-lg p-3 transition-all ${
                    customizing
                      ? 'border-[#00ff0c]/20 opacity-90'
                      : 'border-[#00ff0c]/30 hover:border-[#00ff0c] hover:bg-[#00ff0c]/5'
                  } ${isHidden && customizing ? 'opacity-50' : ''}`}
                >
                  <h3 className="font-black text-white text-sm leading-snug line-clamp-2 pr-14">
                    {name}
                    {isRecentlyActive && (
                      <>
                        {' '}
                        <NewBadge />
                      </>
                    )}
                  </h3>
                  <p className="text-2xl font-black text-[#00ff0c] mt-2 tabular-nums">
                    {cat.post_count}
                    <span className="text-xs font-bold text-gray-500 ml-1">posts</span>
                  </p>
                  <div className="mt-2 min-h-[1.25rem] flex flex-wrap items-center gap-1.5">
                    {newCount > 0 ? (
                      <span className="inline-block text-xs font-black bg-[#00ff0c]/20 text-[#00ff0c] border border-[#00ff0c]/40 px-2 py-0.5 rounded">
                        {newCount} unread
                      </span>
                    ) : cat.latest_post_at ? (
                      <span className="text-xs text-gray-400">
                        {formatRelativeDate(cat.latest_post_at)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">No posts yet</span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
