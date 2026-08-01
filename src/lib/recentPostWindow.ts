/**
 * Calendar-day window for recent forum/social activity (America/Denver).
 * "Last two days" = today plus the two prior calendar days (e.g. Thu + Wed + Tue).
 */

export const RECENT_CALENDAR_DAYS_PRIOR = 2;
const DENVER_TZ = 'America/Denver';

function denverDateKey(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: DENVER_TZ });
}

function shiftDateKey(dateKey: string, deltaDays: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + deltaDays);
  return dt.toISOString().slice(0, 10);
}

/** Start of the oldest included calendar day (Denver), as UTC instant. */
export function recentPostCutoff(referenceDate = new Date()): Date {
  const todayKey = denverDateKey(referenceDate);
  const cutoffKey = shiftDateKey(todayKey, -RECENT_CALENDAR_DAYS_PRIOR);
  const probe = new Date(`${cutoffKey}T12:00:00Z`);
  const denverNoon = probe.toLocaleString('en-US', { timeZone: DENVER_TZ, hour12: false });
  const utcNoon = probe.toLocaleString('en-US', { timeZone: 'UTC', hour12: false });
  const offsetMs = Date.parse(`1970-01-01 ${utcNoon}`) - Date.parse(`1970-01-01 ${denverNoon}`);
  return new Date(Date.parse(`${cutoffKey}T00:00:00Z`) + offsetMs);
}

export function isWithinRecentWindow(
  parsed: Date | null,
  isoTimestamp?: string | null,
  referenceDate = new Date()
): boolean {
  let date = parsed;
  if (!date && isoTimestamp) {
    const d = new Date(isoTimestamp);
    if (!Number.isNaN(d.getTime())) date = d;
  }
  if (!date) return false;

  const postKey = denverDateKey(date);
  const todayKey = denverDateKey(referenceDate);
  const cutoffKey = shiftDateKey(todayKey, -RECENT_CALENDAR_DAYS_PRIOR);
  return postKey >= cutoffKey && postKey <= todayKey;
}

/** True when a board has forum activity within the recent calendar window. */
export function hasRecentBoardActivity(
  latestPostAt: string | null | undefined,
  referenceDate = new Date()
): boolean {
  return isWithinRecentWindow(null, latestPostAt ?? null, referenceDate);
}
