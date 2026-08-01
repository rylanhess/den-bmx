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

function BoardStat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center min-w-[3.5rem]">
      <p
        className={`font-bold tabular-nums leading-none ${
          highlight ? 'text-[#BF0A30]' : 'text-[#002868]'
        }`}
      >
        {value}
      </p>
      <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">{label}</p>
    </div>
  );
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

  const sorted = [...visibleCategories].sort(
    (a, b) => b.post_count - a.post_count || a.name.localeCompare(b.name)
  );

  if (categories.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h2 className="font-black text-[#002868] text-sm sm:text-base uppercase tracking-wide">
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
        <p className="text-gray-500 text-xs mb-2">
          Toggle which track boards appear on your forum home. Saved{' '}
          {isLoggedIn ? 'to your account' : 'on this device'}.
        </p>
      )}

      {sorted.length === 0 ? (
        <div className="rounded-lg bg-white px-4 py-6 text-center text-gray-400 text-sm">
          All track boards hidden.{' '}
          <button type="button" onClick={() => setCustomizing(true)} className="text-[#002868] font-bold hover:underline">
            Customize boards
          </button>
        </div>
      ) : (
        <div className="rounded-lg bg-white overflow-hidden">
          <div className="hidden md:grid md:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,14rem)_4rem_4rem_4rem_5rem] gap-2 px-3 py-2 bg-[#002868]/5 border-b border-[#D0D7E2]/60 text-[10px] font-black uppercase tracking-wide text-[#002868]/70">
            <span className="text-center">Posts</span>
            <span>Track</span>
            <span className="text-center col-span-1">Last post</span>
            <span className="text-center">Topics</span>
            <span className="text-center">New</span>
            <span className="text-center">Replies</span>
            <span className="text-center">Active</span>
          </div>
          <div className="divide-y divide-[#D0D7E2]/60">
            {sorted.map((cat) => {
              const isHidden = hidden.has(cat.id);
              const newCount = newCounts[cat.id] ?? cat.new_post_count ?? 0;
              const replyCount = Math.max(0, cat.post_count - cat.thread_count);
              const isRecentlyActive = hasRecentBoardActivity(cat.latest_post_at);
              const name = trackBoardDisplayName(cat.name);
              const lastActive = cat.latest_post_at
                ? formatRelativeDate(cat.latest_post_at)
                : '—';

              return (
                <div key={cat.id} className="relative flex items-stretch">
                  {customizing && (
                    <label className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/80 rounded px-1.5 py-0.5 text-[10px] text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!isHidden}
                        onChange={(e) => toggleBoard(cat.id, e.target.checked)}
                        className="accent-[#002868]"
                      />
                      Show
                    </label>
                  )}
                  <Link
                    href={customizing ? '#' : `/forum/${cat.slug}`}
                    onClick={customizing ? (e) => e.preventDefault() : undefined}
                    className={`flex flex-1 items-center gap-3 px-3 py-2.5 hover:bg-[#002868]/5 transition-colors min-w-0 md:grid md:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,14rem)_4rem_4rem_4rem_5rem] md:gap-2 md:items-center ${
                      isHidden && customizing ? 'opacity-50' : ''
                    }`}
                  >
                    <span className="w-12 md:w-auto shrink-0 text-center tabular-nums leading-none">
                      <span className="block font-black text-sm text-[#002868]">
                        {cat.post_count}
                      </span>
                      <span className="block text-[9px] uppercase tracking-wide text-gray-500 mt-0.5">
                        {cat.post_count === 1 ? 'post' : 'posts'}
                      </span>
                    </span>

                    <span className="min-w-0 flex-1 md:flex-none">
                      <span className="font-bold text-sm text-[#0B1C2D] leading-snug">
                        {name}
                        {isRecentlyActive && (
                          <>
                            {' '}
                            <NewBadge />
                          </>
                        )}
                      </span>
                      <span className="block text-[11px] text-gray-500 mt-0.5 md:hidden">
                        {cat.thread_count} {cat.thread_count === 1 ? 'topic' : 'topics'}
                        {newCount > 0 && ` · ${newCount} new`}
                        {cat.latest_post_at && ` · ${lastActive}`}
                      </span>
                    </span>

                    <span className="hidden md:block text-xs text-gray-500 truncate px-1">
                      {cat.latest_thread_title ? (
                        <span title={cat.latest_thread_title}>{cat.latest_thread_title}</span>
                      ) : (
                        <span className="text-gray-400">No posts yet</span>
                      )}
                    </span>

                    <span className="hidden md:block">
                      <BoardStat label="Topics" value={cat.thread_count} />
                    </span>
                    <span className="hidden md:block">
                      <BoardStat label="New" value={newCount} highlight={newCount > 0} />
                    </span>
                    <span className="hidden md:block">
                      <BoardStat label="Replies" value={replyCount} />
                    </span>
                    <span className="hidden md:block text-center text-xs text-gray-500 tabular-nums">
                      {lastActive}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
