import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

/**
 * POST ingest endpoint for social scrape results.
 * Vercel Cron cannot run the browser scrape — a worker with Chrome POSTs here after scanning.
 */
export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== 'object' ||
    !('results' in body) ||
    !Array.isArray((body as { results: unknown }).results)
  ) {
    return NextResponse.json({ error: 'Expected { results: [...] }' }, { status: 400 });
  }

  const { ingestSocialMetadata } = await import(
    '../../../../../scripts/lib/ingestSocialSignals'
  );
  const summary = await ingestSocialMetadata(body as Parameters<typeof ingestSocialMetadata>[0]);

  return NextResponse.json({
    ok: true,
    scrapedAt:
      body && typeof body === 'object' && 'scrapedAt' in body
        ? (body as { scrapedAt: string }).scrapedAt
        : null,
    ...summary,
  });
}
