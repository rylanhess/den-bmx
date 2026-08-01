/** Normalize track city strings that may already include state (e.g. "Dacono, CO"). */
export function formatTrackLocation(
  city: string | null | undefined,
  state: 'CO' | 'Colorado' = 'CO'
): string {
  if (!city?.trim()) return state === 'Colorado' ? 'Colorado' : 'CO';
  const place = city.trim().replace(/,?\s*(Colorado|CO)\s*$/i, '').trim();
  return place ? `${place}, ${state}` : state;
}

/** Display name without redundant "BMX" / "Park" suffixes (e.g. "Dacono BMX" → "Dacono"). */
export function formatTrackShortName(name: string): string {
  return name
    .replace(/\s*—\s*Track Comms$/i, '')
    .replace(/\s+BMX\s+Park$/i, '')
    .replace(/\s+BMX$/i, '')
    .replace(/\s+Park$/i, '')
    .trim();
}
