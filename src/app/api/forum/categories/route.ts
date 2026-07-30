import { NextResponse } from 'next/server';
import { requireVerifiedUserForApi } from '@/lib/auth';
import { slugifyBoardName, uniqueBoardSlug } from '@/lib/forumSlug';

const MAX_BOARDS_PER_DAY = 2;

export async function POST(request: Request) {
  const auth = await requireVerifiedUserForApi();
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { user, supabase } = auth;
  const { name, description } = await request.json();

  const trimmedName = name?.trim();
  if (!trimmedName || trimmedName.length < 3) {
    return NextResponse.json({ error: 'Board name must be at least 3 characters' }, { status: 400 });
  }
  if (trimmedName.length > 80) {
    return NextResponse.json({ error: 'Board name must be 80 characters or less' }, { status: 400 });
  }

  const trimmedDescription = description?.trim() || null;
  if (trimmedDescription && trimmedDescription.length > 500) {
    return NextResponse.json({ error: 'Description must be 500 characters or less' }, { status: 400 });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('forum_categories')
    .select('*', { count: 'exact', head: true })
    .eq('created_by', user.id)
    .is('track_id', null)
    .gte('created_at', since);

  if ((count ?? 0) >= MAX_BOARDS_PER_DAY) {
    return NextResponse.json(
      { error: `You can start up to ${MAX_BOARDS_PER_DAY} new boards per day. Try again tomorrow.` },
      { status: 429 }
    );
  }

  const baseSlug = slugifyBoardName(trimmedName);
  if (!baseSlug) {
    return NextResponse.json({ error: 'Board name must include letters or numbers' }, { status: 400 });
  }

  let slug = baseSlug;
  for (let attempt = 0; attempt < 20; attempt++) {
    slug = uniqueBoardSlug(baseSlug, attempt);
    const { data: existing } = await supabase
      .from('forum_categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (!existing) break;
    if (attempt === 19) {
      return NextResponse.json({ error: 'Could not generate a unique board URL' }, { status: 500 });
    }
  }

  const { data: category, error } = await supabase
    .from('forum_categories')
    .insert({
      slug,
      name: trimmedName,
      description: trimmedDescription,
      sort_order: 200,
      track_id: null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    if (error.message.includes('can_create_discussion_board')) {
      return NextResponse.json(
        { error: `You can start up to ${MAX_BOARDS_PER_DAY} new boards per day. Try again tomorrow.` },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ category });
}
