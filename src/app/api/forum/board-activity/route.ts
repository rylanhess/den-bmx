import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** Returns new post counts per category since last-seen timestamps. */
export async function POST(request: Request) {
  const { boardLastSeen } = (await request.json()) as {
    boardLastSeen?: Record<string, string>;
  };

  if (!boardLastSeen || Object.keys(boardLastSeen).length === 0) {
    return NextResponse.json({ counts: {} });
  }

  const supabase = await createClient();
  const counts: Record<string, number> = {};

  await Promise.all(
    Object.entries(boardLastSeen).map(async ([categoryId, since]) => {
      const { data: threadIds } = await supabase
        .from('forum_threads')
        .select('id')
        .eq('category_id', categoryId);

      if (!threadIds?.length) {
        counts[categoryId] = 0;
        return;
      }

      const { count } = await supabase
        .from('forum_posts')
        .select('*', { count: 'exact', head: true })
        .in('thread_id', threadIds.map((t) => t.id))
        .gt('created_at', since);

      counts[categoryId] = count ?? 0;
    })
  );

  return NextResponse.json({ counts });
}
