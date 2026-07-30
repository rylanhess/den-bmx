import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { normalizeUsabmxProfileUrl, parseUsabmxProfileId, syncUsabmxProfile } from '@/lib/usabmx';
import { normalizeFacebookUrl, normalizeInstagramUrl } from '@/lib/socialUrls';

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const {
    display_name,
    home_track_id,
    practice_schedule,
    usabmx_profile_url,
    instagram_url,
    facebook_url,
    sync_usabmx,
  } = body;

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (display_name !== undefined) {
    if (!display_name?.trim()) {
      return NextResponse.json({ error: 'Display name is required' }, { status: 400 });
    }
    updates.display_name = display_name.trim();
  }

  if (home_track_id !== undefined) {
    updates.home_track_id = home_track_id || null;
  }

  if (practice_schedule !== undefined) {
    updates.practice_schedule = practice_schedule?.trim() || null;
  }

  if (instagram_url !== undefined) {
    if (!instagram_url?.trim()) {
      updates.instagram_url = null;
    } else {
      const normalized = normalizeInstagramUrl(instagram_url);
      if (!normalized) {
        return NextResponse.json(
          { error: 'Invalid Instagram — use @handle or https://instagram.com/handle' },
          { status: 400 }
        );
      }
      updates.instagram_url = normalized;
    }
  }

  if (facebook_url !== undefined) {
    if (!facebook_url?.trim()) {
      updates.facebook_url = null;
    } else {
      const normalized = normalizeFacebookUrl(facebook_url);
      if (!normalized) {
        return NextResponse.json(
          { error: 'Invalid Facebook URL — use a facebook.com profile or page link' },
          { status: 400 }
        );
      }
      updates.facebook_url = normalized;
    }
  }

  if (usabmx_profile_url !== undefined) {
    if (!usabmx_profile_url?.trim()) {
      updates.usabmx_profile_url = null;
      updates.usabmx_profile_id = null;
      updates.usabmx_rider_name = null;
      updates.usabmx_points = null;
      updates.usabmx_points_rank = null;
      updates.usabmx_points_detail = null;
      updates.usabmx_synced_at = null;
    } else {
      const normalized = normalizeUsabmxProfileUrl(usabmx_profile_url);
      const profileId = parseUsabmxProfileId(usabmx_profile_url);
      if (!normalized || !profileId) {
        return NextResponse.json(
          { error: 'Invalid USA BMX profile URL — use a link like https://www.usabmx.com/profiles/123456' },
          { status: 400 }
        );
      }
      updates.usabmx_profile_url = normalized;
      updates.usabmx_profile_id = profileId;
    }
  }

  const shouldSync =
    sync_usabmx === true ||
    (usabmx_profile_url?.trim() && updates.usabmx_profile_id);

  if (shouldSync && (updates.usabmx_profile_id || usabmx_profile_url)) {
    const profileId =
      (updates.usabmx_profile_id as string) ??
      parseUsabmxProfileId(usabmx_profile_url);
    if (profileId) {
      try {
        const synced = await syncUsabmxProfile(profileId);
        updates.usabmx_profile_id = synced.profileId;
        updates.usabmx_rider_name = synced.riderName;
        updates.usabmx_points = synced.districtPoints;
        updates.usabmx_points_rank = synced.districtRank;
        updates.usabmx_points_detail = synced.pointsDetail;
        updates.usabmx_synced_at = new Date().toISOString();
      } catch (err) {
        return NextResponse.json(
          { error: err instanceof Error ? err.message : 'USA BMX sync failed' },
          { status: 400 }
        );
      }
    }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: existing } = await supabase
    .from('profiles')
    .select('usabmx_profile_id')
    .eq('id', user.id)
    .single();

  if (!existing?.usabmx_profile_id) {
    return NextResponse.json({ error: 'No USA BMX profile linked' }, { status: 400 });
  }

  try {
    const synced = await syncUsabmxProfile(existing.usabmx_profile_id);
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        usabmx_rider_name: synced.riderName,
        usabmx_points: synced.districtPoints,
        usabmx_points_rank: synced.districtRank,
        usabmx_points_detail: synced.pointsDetail,
        usabmx_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ profile });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'USA BMX sync failed' },
      { status: 400 }
    );
  }
}
