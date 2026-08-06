import { sendEmail } from '@/lib/email';
import { COLORADO_CANONICAL_ORIGIN } from '@/lib/canonicalSite';

const SITE_LINK = 'https://bmxcolorado.com';
const FORUM_URL = `${COLORADO_CANONICAL_ORIGIN}/forum`;
const SIGNUP_URL = `${COLORADO_CANONICAL_ORIGIN}/signup`;

export function buildShareInviteEmail(sharerName?: string | null) {
  const who = sharerName?.trim() || 'A friend';

  const subject = 'BMX Colorado was shared with you!';

  const text = [
    'Hey,',
    '',
    `${who} shared BMX Colorado with you!`,
    '',
    'bmxcolorado was shared with you — Colorado\'s community message board for BMX riders.',
    '',
    `Check it out: ${FORUM_URL}`,
    '',
    'Where Colorado talks BMX — race talk, track news, freestyle, and boards for every track in the state.',
    '',
    `Join free to post and reply: ${SIGNUP_URL}`,
    '',
    `Or just browse: ${SITE_LINK}`,
    '',
    '— BMX Colorado',
  ].join('\n');

  return { subject, text };
}

export async function sendShareInviteEmail(
  to: string,
  sharerName?: string | null
): Promise<{
  ok: boolean;
  error?: string;
  sandboxRedirected?: boolean;
  intendedRecipient?: string;
}> {
  const { subject, text } = buildShareInviteEmail(sharerName);

  const result = await sendEmail({
    to,
    subject,
    text,
    plainTextOnly: true,
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return {
    ok: true,
    sandboxRedirected: result.sandboxRedirected,
    intendedRecipient: result.intended?.[0] ?? to,
  };
}
