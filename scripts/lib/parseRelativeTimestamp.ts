/**
 * Parse social post timestamps (relative "2h" or absolute "July 30 at 4:09 PM").
 * Standalone — no Playwright dependency (safe for Vercel serverless).
 */

export function parseRelativeTimestamp(timestampText: string): Date | null {
  const now = new Date();

  if (timestampText.toLowerCase().includes('just now')) {
    return now;
  }

  const absoluteMatch = timestampText.match(
    /([A-Za-z]+)\s+(\d{1,2})(?:\s+at\s+(\d{1,2}):(\d{2})\s*(AM|PM)?)?/i
  );
  if (absoluteMatch) {
    const [, monthStr, dayStr, hourStr, minuteStr, ampm] = absoluteMatch;

    const months: Record<string, number> = {
      jan: 0,
      january: 0,
      feb: 1,
      february: 1,
      mar: 2,
      march: 2,
      apr: 3,
      april: 3,
      may: 4,
      jun: 5,
      june: 5,
      jul: 6,
      july: 6,
      aug: 7,
      august: 7,
      sep: 8,
      sept: 8,
      september: 8,
      oct: 9,
      october: 9,
      nov: 10,
      november: 10,
      dec: 11,
      december: 11,
    };

    const month = months[monthStr.toLowerCase()];
    const day = parseInt(dayStr, 10);

    if (month !== undefined && day > 0 && day <= 31) {
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const year = month > currentMonth ? currentYear - 1 : currentYear;

      let hour = 0;
      let minute = 0;

      if (hourStr && minuteStr) {
        hour = parseInt(hourStr, 10);
        minute = parseInt(minuteStr, 10);

        if (ampm) {
          if (ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
          else if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
        }
      }

      return new Date(year, month, day, hour, minute);
    }
  }

  const relativeMatch = timestampText.match(
    /(\d+)\s*(m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days|w|week|weeks)/i
  );

  if (!relativeMatch) return null;

  const value = parseInt(relativeMatch[1], 10);
  const unit = relativeMatch[2].toLowerCase();

  if (unit.startsWith('m')) now.setMinutes(now.getMinutes() - value);
  else if (unit.startsWith('h')) now.setHours(now.getHours() - value);
  else if (unit.startsWith('d')) now.setDate(now.getDate() - value);
  else if (unit.startsWith('w')) now.setDate(now.getDate() - value * 7);

  return now;
}
