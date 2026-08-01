/** Paths that use the BMX Colorado shell + Colorado Day theme (local + production). */
export function isColoradoPath(pathname: string): boolean {
  return (
    pathname.startsWith('/forum') ||
    pathname.startsWith('/tracks') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/users') ||
    pathname.startsWith('/riders') ||
    pathname === '/login' ||
    pathname === '/signup'
  );
}

export function isColoradoHost(host: string): boolean {
  const h = host.toLowerCase();
  return h.includes('bmxcolorado') || h.includes('coloradobmx');
}

/** Contact is Colorado on Colorado hosts, or when explicitly requested (?co=1) for local preview. */
export function isColoradoContact(
  host: string,
  pathname: string,
  searchParams?: URLSearchParams | { get(name: string): string | null }
): boolean {
  if (!pathname.startsWith('/contact')) return false;
  if (isColoradoHost(host)) return true;
  return searchParams?.get('co') === '1';
}

export function isColoradoExperience(
  host: string,
  pathname: string,
  searchParams?: URLSearchParams | { get(name: string): string | null }
): boolean {
  if (isColoradoHost(host)) return true;
  if (isColoradoContact(host, pathname, searchParams)) return true;
  return isColoradoPath(pathname);
}
