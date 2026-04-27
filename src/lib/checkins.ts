export const TRACK_OPTIONS = [
  { value: 'mile_high', label: 'Mile High' },
  { value: 'dacono', label: 'Dacono' },
  { value: 'county_line', label: 'County Line' },
  { value: 'twin_silos', label: 'Twin Silos' },
  { value: 'other', label: 'Other' },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: 'novice', label: 'Novice' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' },
  { value: 'pro', label: 'Pro' },
] as const;

export type TrackChoice = (typeof TRACK_OPTIONS)[number]['value'];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]['value'];

export const MAX_RIDERS_PER_SUBMISSION = 6;
export const DELETE_WINDOW_HOURS = 24;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function startOfDayIso(date: Date): string {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function trackLabel(trackChoice: TrackChoice): string {
  return TRACK_OPTIONS.find((track) => track.value === trackChoice)?.label ?? 'Other';
}
