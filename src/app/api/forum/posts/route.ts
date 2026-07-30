import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { thread_id, body, image_urls } = await request.json();
  if (!thread_id || (!body?.trim() && (!image_urls || image_urls.length === 0))) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data: thread } = await supabase
    .from('forum_threads')
    .select('is_locked')
    .eq('id', thread_id)
    .single();

  if (!thread) return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  if (thread.is_locked) return NextResponse.json({ error: 'Thread is locked' }, { status: 403 });

  const { data: post, error } = await supabase
    .from('forum_posts')
    .insert({
      thread_id,
      author_id: user.id,
      body: body?.trim() || '',
      image_urls: image_urls?.length ? image_urls : [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { count: postCount } = await supabase
    .from('forum_posts')
    .select('*', { count: 'exact', head: true })
    .eq('thread_id', thread_id);

  await supabase
    .from('forum_threads')
    .update({
      reply_count: Math.max(0, (postCount ?? 1) - 1),
      last_post_at: new Date().toISOString(),
    })
    .eq('id', thread_id);

  return NextResponse.json({ post });
}
