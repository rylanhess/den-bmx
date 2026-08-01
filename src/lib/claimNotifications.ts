import { sendEmail, claimReviewEmails } from '@/lib/email';
import { getSiteUrl } from '@/lib/siteUrl';

interface ClaimTrack {
  name: string;
  slug: string;
}

export async function notifyClaimSubmitted(input: {
  trackName: string;
  contactName: string;
  contactEmail: string;
  message?: string | null;
}) {
  const reviewUrl = `${getSiteUrl()}/admin/claims`;

  return sendEmail({
    to: claimReviewEmails(),
    subject: `Track claim request: ${input.trackName}`,
    replyTo: input.contactEmail,
    text: [
      `${input.contactName} (${input.contactEmail}) wants to claim ${input.trackName}.`,
      '',
      `Message: ${input.message?.trim() || '(none)'}`,
      '',
      `Review and approve: ${reviewUrl}`,
    ].join('\n'),
  });
}

export async function notifyClaimApproved(input: {
  track: ClaimTrack;
  contactName: string;
  contactEmail: string;
}) {
  const trackUrl = `${getSiteUrl()}/tracks/${input.track.slug}`;

  return sendEmail({
    to: input.contactEmail,
    subject: `Your ${input.track.name} track claim was approved`,
    text: [
      `Hi ${input.contactName},`,
      '',
      `Your request to moderate ${input.track.name} on BMX Colorado has been approved.`,
      '',
      'You can now:',
      '- Edit open hours, schedule, and track description',
      '- Moderate posts on the track discussion board',
      '',
      `Visit your track page: ${trackUrl}`,
      '',
      'Thanks for helping keep Colorado BMX connected!',
      '— BMX Colorado',
    ].join('\n'),
  });
}

export async function notifyClaimRejected(input: {
  trackName: string;
  contactName: string;
  contactEmail: string;
  adminNotes?: string | null;
}) {
  return sendEmail({
    to: input.contactEmail,
    subject: `Update on your ${input.trackName} track claim`,
    text: [
      `Hi ${input.contactName},`,
      '',
      `We reviewed your request to claim ${input.trackName} and were not able to approve it at this time.`,
      input.adminNotes?.trim() ? `\nNote from reviewer: ${input.adminNotes.trim()}` : '',
      '',
      'If you believe this was a mistake, reply to this email or contact us through the site.',
      '',
      '— BMX Colorado',
    ]
      .filter(Boolean)
      .join('\n'),
  });
}
