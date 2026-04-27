import { NextResponse } from 'next/server';
import { createChallenge } from '@/lib/humanCheck';

export async function GET() {
  return NextResponse.json({ challenge: createChallenge() });
}
