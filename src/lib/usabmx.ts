const USABMX_API = 'https://www.usabmx.com/api/backend';

export interface UsabmxPointEntry {
  type: string;
  skill: string;
  points: number;
  rank: number;
}

export interface UsabmxSyncResult {
  profileId: string;
  riderName: string | null;
  districtPoints: number | null;
  districtRank: number | null;
  pointsDetail: UsabmxPointEntry[];
}

/** Extract numeric profile ID from USA BMX profile URLs. */
export function parseUsabmxProfileId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    if (!parsed.hostname.includes('usabmx.com')) return null;

    const newFormat = parsed.pathname.match(/\/profiles\/(\d+)/i);
    if (newFormat) return newFormat[1];

    const legacyFormat = parsed.pathname.match(/\/site\/profiles\/(\d+)/i);
    if (legacyFormat) return legacyFormat[1];

    return null;
  } catch {
    return null;
  }
}

export function normalizeUsabmxProfileUrl(url: string): string | null {
  const id = parseUsabmxProfileId(url);
  if (!id) return null;
  return `https://www.usabmx.com/profiles/${id}`;
}

interface PointsApiResponse {
  status: boolean;
  data?: Array<{
    name: string;
    results?: Array<{
      type: string;
      details?: { skill?: string; points?: number; rank?: number };
    }>;
  }>;
}

interface ProfileApiResponse {
  status: boolean;
  memberData?: {
    first_name?: string;
    last_name?: string;
    memberData?: { proficiency_class?: string; track_name?: string };
  };
}

function flattenPoints(data: PointsApiResponse['data']): UsabmxPointEntry[] {
  const entries: UsabmxPointEntry[] = [];
  for (const group of data ?? []) {
    for (const result of group.results ?? []) {
      entries.push({
        type: result.type,
        skill: result.details?.skill ?? '',
        points: result.details?.points ?? 0,
        rank: result.details?.rank ?? 0,
      });
    }
  }
  return entries;
}

/** District class points are the primary BMX standings metric (lower = better). */
function primaryDistrictClassPoints(entries: UsabmxPointEntry[]): { points: number; rank: number } | null {
  const district = entries.find(
    (e) => e.type.toLowerCase() === 'district' && e.skill.toLowerCase() !== 'cruiser'
  );
  if (!district) return null;
  return { points: district.points, rank: district.rank };
}

export async function syncUsabmxProfile(profileId: string): Promise<UsabmxSyncResult> {
  const [profileRes, pointsRes] = await Promise.all([
    fetch(`${USABMX_API}/dashboard/rider-profile?profile_id=${profileId}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 0 },
    }),
    fetch(`${USABMX_API}/dashboard/my-points/${profileId}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 0 },
    }),
  ]);

  if (!profileRes.ok && !pointsRes.ok) {
    throw new Error('Could not fetch USA BMX profile — check the URL and try again');
  }

  let riderName: string | null = null;
  if (profileRes.ok) {
    const profileData = (await profileRes.json()) as ProfileApiResponse;
    const md = profileData.memberData;
    if (md?.first_name) {
      riderName = [md.first_name, md.last_name].filter(Boolean).join(' ');
    }
  }

  let pointsDetail: UsabmxPointEntry[] = [];
  if (pointsRes.ok) {
    const pointsData = (await pointsRes.json()) as PointsApiResponse;
    pointsDetail = flattenPoints(pointsData.data);
  }

  const primary = primaryDistrictClassPoints(pointsDetail);

  return {
    profileId,
    riderName,
    districtPoints: primary?.points ?? null,
    districtRank: primary?.rank ?? null,
    pointsDetail,
  };
}
