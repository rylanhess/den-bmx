import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { category_id, title, body } = await request.json();
  if (!category_id || !title?.trim() || !body?.trim()) {
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

  const { error: postError } = await supabase
    .from('forum_posts')
    .insert({
      thread_id: thread.id,
      author_id: user.id,
      body: body.trim(),
    });

  if (postError) {
    return NextResponse.json({ error: postError.message }, { status: 500 });
  }

  return NextResponse.json({ thread });
}
