import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: track } = await supabase.from('tracks').select('id').eq('slug', slug).single();
  if (!track) return NextResponse.json({ error: 'Track not found' }, { status: 404 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const isAdmin = profile?.role === 'admin';

  const { data: mod } = await supabase
    .from('track_moderators')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('track_id', track.id)
    .single();

  if (!isAdmin && !mod) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { open_hours, schedule, description } = await request.json();
  const updates: Record<string, string | null> = {};
  if (open_hours !== undefined) updates.open_hours = open_hours;
  if (schedule !== undefined) updates.schedule = schedule;
  if (description !== undefined && (isAdmin || mod)) updates.description = description;

  const { data, error } = await supabase
    .from('tracks')
    .update(updates)
    .eq('id', track.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ track: data });
}
