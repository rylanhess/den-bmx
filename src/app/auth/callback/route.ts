import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRequestSiteOrigin } from '@/lib/siteUrl';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/forum';
  const siteOrigin = getRequestSiteOrigin(request);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${siteOrigin}${next}`);
    }
  }

  return NextResponse.redirect(`${siteOrigin}/login?error=auth`);
}
