import { NextResponse } from 'next/server';
import { requireVerifiedUserForApi } from '@/lib/auth';

export async function GET(request: Request) {
  const auth = await requireVerifiedUserForApi();
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const categoryId = new URL(request.url).searchParams.get('category_id');
  if (!categoryId) {
    return NextResponse.json({ error: 'category_id required' }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from('forum_category_subscriptions')
    .select('category_id')
    .eq('user_id', auth.user.id)
    .eq('category_id', categoryId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subscribed: !!data });
}

export async function POST(request: Request) {
  const auth = await requireVerifiedUserForApi();
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { category_id: categoryId } = await request.json();
  if (!categoryId) {
    return NextResponse.json({ error: 'category_id required' }, { status: 400 });
  }

  const { data: category, error: catError } = await auth.supabase
    .from('forum_categories')
    .select('id')
    .eq('id', categoryId)
    .single();

  if (catError || !category) {
    return NextResponse.json({ error: 'Board not found' }, { status: 404 });
  }

  const { error } = await auth.supabase.from('forum_category_subscriptions').upsert(
    {
      user_id: auth.user.id,
      category_id: categoryId,
    },
    { onConflict: 'user_id,category_id' }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subscribed: true });
}

export async function DELETE(request: Request) {
  const auth = await requireVerifiedUserForApi();
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const categoryId = new URL(request.url).searchParams.get('category_id');
  if (!categoryId) {
    return NextResponse.json({ error: 'category_id required' }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from('forum_category_subscriptions')
    .delete()
    .eq('user_id', auth.user.id)
    .eq('category_id', categoryId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subscribed: false });
}
