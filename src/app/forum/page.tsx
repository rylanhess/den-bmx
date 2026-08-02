import { getCategoryStats, getRecentForumPosts } from '@/lib/forum';
import { getCurrentUser, isEmailVerified } from '@/lib/auth';
import { parsePreferences } from '@/lib/userPreferences';
import ForumHomeClient from '@/components/forum/ForumHomeClient';
import ColoradoContentLayout from '@/components/ads/ColoradoContentLayout';

export const metadata = {
  title: 'Message Board',
};

export default async function ForumPage() {
  const user = await getCurrentUser();
  const preferences = parsePreferences(user?.profile?.preferences);
  const boardLastSeen = preferences.forum?.boardLastSeen ?? {};
  const categories = await getCategoryStats({ boardLastSeen });
  const recentPosts = await getRecentForumPosts(5);

  return (
    <ColoradoContentLayout>
      <ForumHomeClient
        categories={categories}
        recentPosts={recentPosts}
        isLoggedIn={!!user}
        emailVerified={user ? isEmailVerified(user.user) : false}
        userEmail={user?.user.email ?? null}
        serverPreferences={user?.profile?.preferences}
      />
    </ColoradoContentLayout>
  );
}
