import { NextRequest, NextResponse } from 'next/server';
import { ingestSocialMetadata, type ScrapeOutput } from '../../../../../scripts/lib/ingestSocialSignals';

export const runtime = 'nodejs';
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

  let body: ScrapeOutput;
  try {
    body = (await request.json()) as ScrapeOutput;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body?.results || !Array.isArray(body.results)) {
    return NextResponse.json({ error: 'Expected { results: [...] }' }, { status: 400 });
  }

  const summary = await ingestSocialMetadata(body);
  return NextResponse.json({
    ok: true,
    scrapedAt: body.scrapedAt ?? null,
    ...summary,
  });
}
