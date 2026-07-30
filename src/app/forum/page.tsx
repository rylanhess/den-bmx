import { getCategoryStats } from '@/lib/forum';
import { getCurrentUser, isEmailVerified } from '@/lib/auth';
import { parsePreferences } from '@/lib/userPreferences';
import ForumHomeClient from '@/components/forum/ForumHomeClient';
import BreadcrumbNav from '@/components/forum/BreadcrumbNav';

export const metadata = {
  title: 'Message Board',
};

export default async function ForumPage() {
  const user = await getCurrentUser();
  const preferences = parsePreferences(user?.profile?.preferences);
  const boardLastSeen = preferences.forum?.boardLastSeen ?? {};
  const categories = await getCategoryStats({ boardLastSeen });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <BreadcrumbNav items={[{ label: 'BMX Colorado Forum' }]} />
      <ForumHomeClient
        categories={categories}
        isLoggedIn={!!user}
        emailVerified={user ? isEmailVerified(user.user) : false}
        userEmail={user?.user.email ?? null}
        serverPreferences={user?.profile?.preferences}
      />
    </div>
  );
}
