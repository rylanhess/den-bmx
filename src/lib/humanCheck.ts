import crypto from 'crypto';

type ChallengePayload = {
  nonce: string;
  target: number;
  issuedAt: number;
  expiresAt: number;
};

export type HumanChallenge = ChallengePayload & {
  signature: string;
};

const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const TOLERANCE = 6;

function getSecret(): string {
  return (
    process.env.CHECKIN_HUMAN_TEST_SECRET ||
    process.env.RESEND_API_KEY ||
    'den-bmx-dev-fallback-secret'
  );
}

function sign(payload: ChallengePayload): string {
  return crypto.createHmac('sha256', getSecret()).update(JSON.stringify(payload)).digest('hex');
}

export function createChallenge(): HumanChallenge {
  const now = Date.now();
  const payload: ChallengePayload = {
    nonce: crypto.randomBytes(12).toString('hex'),
    target: Math.floor(Math.random() * 61) + 20,
    issuedAt: now,
    expiresAt: now + CHALLENGE_TTL_MS,
  };

  return {
    ...payload,
    signature: sign(payload),
  };
}

export function verifyChallenge(input: HumanChallenge, finalPosition: number, startedAt?: number): boolean {
  const expectedSig = sign({
    nonce: input.nonce,
    target: input.target,
    issuedAt: input.issuedAt,
    expiresAt: input.expiresAt,
  });

  const expected = Buffer.from(expectedSig, 'hex');
  const actual = Buffer.from(input.signature, 'hex');
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    return false;
  }

  const now = Date.now();
  if (now > input.expiresAt || now < input.issuedAt) {
    return false;
  }

  if (typeof startedAt === 'number' && now - startedAt < 800) {
    return false;
  }

  return Math.abs(finalPosition - input.target) <= TOLERANCE;
}
