import { NextResponse } from 'next/server';
import { requireVerifiedUserForApi } from '@/lib/auth';
import { queueForumPostNotification } from '@/lib/forumNotifications';

export async function POST(request: Request) {
  const auth = await requireVerifiedUserForApi();
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { user, supabase } = auth;
  const { category_id, title, body, image_urls } = await request.json();
  if (!category_id || !title?.trim() || (!body?.trim() && (!image_urls || image_urls.length === 0))) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data: thread, error: threadError } = await supabase
    .from('forum_threads')
    .insert({
      category_id,
      author_id: user.id,
      title: title.trim(),
      reply_count: 0,
    })
    .select()
    .single();

  if (threadError) {
    return NextResponse.json({ error: threadError.message }, { status: 500 });
  }

  const { data: firstPost, error: postError } = await supabase
    .from('forum_posts')
    .insert({
      thread_id: thread.id,
      author_id: user.id,
      body: body?.trim() || '',
      image_urls: image_urls?.length ? image_urls : [],
    })
    .select('id')
    .single();

  if (postError) {
    return NextResponse.json({ error: postError.message }, { status: 500 });
  }

  queueForumPostNotification({
    postId: firstPost.id,
    threadId: thread.id,
    authorId: user.id,
    body: body?.trim() || '',
    isNewThread: true,
  });

  return NextResponse.json({ thread });
}
