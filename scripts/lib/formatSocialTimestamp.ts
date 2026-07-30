const DENVER_TZ = 'America/Denver';

/** Full date/time for social bot posts (Mountain Time). */
export function formatSocialPostTimestamp(date: Date): string {
  return date.toLocaleString('en-US', {
    timeZone: DENVER_TZ,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

/** Shorter label for thread titles, e.g. "Jul 30, 3:42 PM MT". */
export function formatSocialPostTitleDate(date: Date): string {
  return date.toLocaleString('en-US', {
    timeZone: DENVER_TZ,
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}
