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

  const body = await request.json();
  const allowed = [
    'open_hours',
    'schedule',
    'description',
    'website',
    'phone',
    'operator_name',
    'address',
    'aerial_image',
  ] as const;
  const updates: Record<string, string | null> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      updates[key] = typeof body[key] === 'string' ? body[key].trim() || null : body[key];
    }
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('tracks')
    .update(updates)
    .eq('id', track.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ track: data });
}
