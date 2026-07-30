'use client';

import { useEffect } from 'react';
import {
  loadGuestPreferences,
  mergePreferences,
  saveGuestPreferences,
  type UserPreferences,
} from '@/lib/userPreferences';

interface MarkBoardSeenProps {
  categoryId: string;
  isLoggedIn: boolean;
}

/** Updates board last-seen when a user opens a category page. */
export default function MarkBoardSeen({ categoryId, isLoggedIn }: MarkBoardSeenProps) {
  useEffect(() => {
    const now = new Date().toISOString();
    const patch: UserPreferences = {
      forum: { boardLastSeen: { [categoryId]: now } },
    };

    if (isLoggedIn) {
      fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: patch }),
      }).catch(() => {});
      return;
    }

    const merged = mergePreferences(loadGuestPreferences(), patch);
    saveGuestPreferences(merged);
  }, [categoryId, isLoggedIn]);

  return null;
}
