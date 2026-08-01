import { NextResponse } from 'next/server';
import { requireVerifiedUserForApi } from '@/lib/auth';
import { queueForumPostNotification } from '@/lib/forumNotifications';

export async function POST(request: Request) {
  const auth = await requireVerifiedUserForApi();
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { user, supabase } = auth;
  const { thread_id, body, image_urls } = await request.json();
  if (!thread_id || (!body?.trim() && (!image_urls || image_urls.length === 0))) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data: thread } = await supabase
    .from('forum_threads')
    .select('is_locked, category_id')
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

  queueForumPostNotification({
    postId: post.id,
    threadId: thread_id,
    authorId: user.id,
    body: body?.trim() || '',
    isNewThread: false,
  });

  return NextResponse.json({ post });
}
