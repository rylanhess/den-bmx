import { tryCreateAdminClient } from '@/lib/supabase/admin';
import { sendEmail, globalForumAlertEmails } from '@/lib/email';
import { getSiteUrl } from '@/lib/siteUrl';
import { trackBoardDisplayName } from '@/lib/userPreferences';

function excerpt(body: string, max = 280): string {
  const plain = body
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return '';
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).trimEnd()}…`;
}

async function resolveUserEmails(userIds: string[]): Promise<Map<string, string>> {
  const admin = tryCreateAdminClient();
  const map = new Map<string, string>();
  if (!admin || userIds.length === 0) return map;

  await Promise.all(
    userIds.map(async (id) => {
      const { data, error } = await admin.auth.admin.getUserById(id);
      if (error || !data.user?.email) return;
      if (!data.user.email_confirmed_at) return;
      map.set(id, data.user.email);
    })
  );

  return map;
}

async function getBoardSubscriberEmails(
  categoryId: string,
  excludeUserId?: string
): Promise<string[]> {
  const admin = tryCreateAdminClient();
  if (!admin) return [];

  const { data: subs, error } = await admin
    .from('forum_category_subscriptions')
    .select('user_id')
    .eq('category_id', categoryId);

  if (error || !subs?.length) return [];

  const userIds = (subs as { user_id: string }[])
    .map((s) => s.user_id)
    .filter((id) => id !== excludeUserId);

  const emailMap = await resolveUserEmails(userIds);
  return [...new Set(emailMap.values())];
}

export interface ForumPostNotificationInput {
  postId: string;
  threadId: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  threadTitle: string;
  body: string;
  authorId: string | null;
  authorName: string | null;
  isNewThread: boolean;
}

export async function notifyForumPostCreated(input: ForumPostNotificationInput) {
  const boardName = trackBoardDisplayName(input.categoryName);
  const postUrl = `${getSiteUrl()}/forum/${input.categorySlug}/${input.threadId}`;
  const authorLabel = input.authorName ?? 'Someone';
  const preview = excerpt(input.body) || '(image or link post)';

  const subscriberEmails = await getBoardSubscriberEmails(
    input.categoryId,
    input.authorId ?? undefined
  );

  const recipients = [
    ...new Set([...subscriberEmails, ...globalForumAlertEmails()]),
  ].filter((email) => email);

  if (recipients.length === 0) {
    return { sent: 0 };
  }

  const action = input.isNewThread ? 'New post' : 'New reply';
  const subject = `[BMX Colorado] ${action} on ${boardName}: ${input.threadTitle}`;
  const text = [
    `${action} on ${boardName}`,
    '',
    `Thread: ${input.threadTitle}`,
    `By: ${authorLabel}`,
    '',
    preview,
    '',
    `Read and reply: ${postUrl}`,
    '',
    'You received this because you subscribed to email updates for this board.',
    'Open the board page and turn off "Email me new posts" to unsubscribe.',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; color: #0b1c2d;">
      <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold; color: #002868; text-transform: uppercase;">BMX Colorado Forum</p>
      <h2 style="margin: 0 0 12px; font-size: 18px; color: #002868;">${action} on ${boardName}</h2>
      <p style="margin: 0 0 4px;"><strong>${input.threadTitle}</strong></p>
      <p style="margin: 0 0 12px; color: #4a5568; font-size: 14px;">By ${authorLabel}</p>
      <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.5;">${preview}</p>
      <p style="margin: 0 0 16px;">
        <a href="${postUrl}" style="display: inline-block; background: #bf0a30; color: #fff; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold;">View post</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #6b7280;">Subscribed to email updates for this board. Unsubscribe from the board page.</p>
    </div>
  `;

  let sent = 0;
  for (const to of recipients) {
    const result = await sendEmail({ to, subject, text, html });
    if (result.ok) sent += 1;
  }

  return { sent };
}

/** Fire-and-forget helper for API routes after a post is created. */
export function queueForumPostNotification({
  postId,
  threadId,
  authorId,
  body,
  isNewThread,
}: {
  postId: string;
  threadId: string;
  authorId: string | null;
  body: string;
  isNewThread: boolean;
}) {
  void (async () => {
    const admin = tryCreateAdminClient();
    if (!admin) return;

    const { data: threadRow, error: threadError } = await admin
      .from('forum_threads')
      .select(
        `
        id,
        title,
        category_id,
        category:forum_categories (
          id,
          slug,
          name
        )
      `
      )
      .eq('id', threadId)
      .single();

    if (threadError || !threadRow) return;

    const thread = threadRow as {
      id: string;
      title: string;
      category_id: string;
      category:
        | { id: string; slug: string; name: string }
        | { id: string; slug: string; name: string }[]
        | null;
    };

    const categoryRaw = thread.category;
    const category = Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw;
    if (!category) return;

    let authorName: string | null = null;
    if (authorId) {
      const { data: profile } = await admin
        .from('profiles')
        .select('display_name')
        .eq('id', authorId)
        .single();
      authorName = (profile as { display_name: string } | null)?.display_name ?? null;
    }

    await notifyForumPostCreated({
      postId,
      threadId,
      categoryId: category.id,
      categorySlug: category.slug,
      categoryName: category.name,
      threadTitle: thread.title,
      body,
      authorId,
      authorName,
      isNewThread,
    });
  })().catch((err) => console.error('[forum notify]', err));
}
