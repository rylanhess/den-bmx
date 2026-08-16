export const FORUM_TAGLINE = 'Where Colorado talks BMX!';
export const FORUM_HEADLINE = 'All your tracks in one place!';
export const FORUM_SUBHEAD =
  'Facebook posts and updates from every Colorado BMX track. Where Colorado talks BMX!';

export const WELCOME_SEEN_KEY = 'bmx_colorado_welcome_seen';
export const GUEST_PREFS_KEY = 'bmx_colorado_preferences';

export interface ForumPreferences {
  /** Category IDs for track boards the user has hidden */
  hiddenTrackBoardIds?: string[];
  /** category id → ISO timestamp of last board visit */
  boardLastSeen?: Record<string, string>;
}

export interface UserPreferences {
  forum?: ForumPreferences;
}

export const DEFAULT_PREFERENCES: UserPreferences = {};

export function parsePreferences(raw: unknown): UserPreferences {
  if (!raw || typeof raw !== 'object') return {};
  return raw as UserPreferences;
}

export function mergePreferences(
  base: UserPreferences,
  patch: Partial<UserPreferences>
): UserPreferences {
  return {
    ...base,
    ...patch,
    forum: {
      ...base.forum,
      ...patch.forum,
      hiddenTrackBoardIds:
        patch.forum?.hiddenTrackBoardIds ?? base.forum?.hiddenTrackBoardIds,
      boardLastSeen: {
        ...base.forum?.boardLastSeen,
        ...patch.forum?.boardLastSeen,
      },
    },
  };
}

export function loadGuestPreferences(): UserPreferences {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(GUEST_PREFS_KEY);
    return raw ? parsePreferences(JSON.parse(raw)) : {};
  } catch {
    return {};
  }
}

export function saveGuestPreferences(prefs: UserPreferences) {
  localStorage.setItem(GUEST_PREFS_KEY, JSON.stringify(prefs));
}

import { formatTrackShortName } from '@/lib/trackDisplay';

export function trackBoardDisplayName(name: string): string {
  return formatTrackShortName(name);
}
