const EMAIL_KEY = 'den_bmx_last_used_email';
const REMEMBER_KEY = 'den_bmx_remember_identity';
const MY_CHECKINS_KEY = 'den_bmx_my_checkins';

export type StoredCheckin = {
  submission_id: string;
  delete_token: string;
  checkin_date: string;
  track_choice: string;
  created_at: string;
};

export function readRememberPreference(): boolean {
  if (typeof window === 'undefined') return true;
  const value = window.localStorage.getItem(REMEMBER_KEY);
  return value !== 'false';
}

export function writeRememberPreference(remember: boolean): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(REMEMBER_KEY, remember ? 'true' : 'false');
}

export function readStoredEmail(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(EMAIL_KEY) ?? '';
}

export function writeStoredEmail(email: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(EMAIL_KEY, email);
}

export function clearStoredEmail(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(EMAIL_KEY);
}

export function readMyCheckins(): StoredCheckin[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(MY_CHECKINS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item?.submission_id && item?.delete_token);
  } catch {
    return [];
  }
}

export function storeCheckin(record: StoredCheckin): void {
  if (typeof window === 'undefined') return;
  const current = readMyCheckins();
  const withoutDuplicate = current.filter((item) => item.submission_id !== record.submission_id);
  const next = [record, ...withoutDuplicate].slice(0, 25);
  window.localStorage.setItem(MY_CHECKINS_KEY, JSON.stringify(next));
}

export function removeStoredCheckin(submissionId: string): void {
  if (typeof window === 'undefined') return;
  const current = readMyCheckins();
  const next = current.filter((item) => item.submission_id !== submissionId);
  window.localStorage.setItem(MY_CHECKINS_KEY, JSON.stringify(next));
}
