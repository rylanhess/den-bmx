/**
 * Only ingest posts within the recent window (default 2 days).
 */

export const RECENT_POST_DAYS = 2;

export function recentPostCutoff(referenceDate = new Date()): Date {
  const cutoff = new Date(referenceDate);
  cutoff.setDate(cutoff.getDate() - RECENT_POST_DAYS);
  return cutoff;
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
  return date >= recentPostCutoff(referenceDate);
}
