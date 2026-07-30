/** Build a URL-safe slug from a discussion board name. */
export function slugifyBoardName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

/** Append a short suffix when the base slug is taken. */
export function uniqueBoardSlug(base: string, attempt = 0): string {
  if (attempt === 0) return base;
  const suffix = `-${attempt}`;
  return `${base.slice(0, Math.max(1, 50 - suffix.length))}${suffix}`;
}
