import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const updates: Record<string, boolean> = {};

  const { data: thread } = await supabase
    .from('forum_threads')
    .select('author_id, track_id')
    .eq('id', id)
    .single();

  if (!thread) return NextResponse.json({ error: 'Thread not found' }, { status: 404 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';
  let isMod = false;
  if (thread.track_id) {
    const { data: mod } = await supabase
      .from('track_moderators')
      .select('user_id')
      .eq('user_id', user.id)
      .eq('track_id', thread.track_id)
      .single();
    isMod = !!mod;
  }

  if (typeof body.is_pinned === 'boolean') {
    if (!thread.track_id) {
      return NextResponse.json({ error: 'Only track board posts can be pinned' }, { status: 400 });
    }
    if (!isAdmin && !isMod) {
      return NextResponse.json(
        { error: 'Only track operators or admins can pin posts' },
        { status: 403 }
      );
    }
    updates.is_pinned = body.is_pinned;
  }

  if (typeof body.is_locked === 'boolean') {
    if (!isAdmin && !isMod && thread.author_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    updates.is_locked = body.is_locked;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid updates' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('forum_threads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ thread: data });
}
