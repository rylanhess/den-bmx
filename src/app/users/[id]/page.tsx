import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { getProfileById, getProfilePostCount } from '@/lib/profiles';
import { getRecentForumPosts } from '@/lib/forum';
import PublicProfileCard from '@/components/profile/PublicProfileCard';
import ColoradoContentLayout from '@/components/ads/ColoradoContentLayout';
import { coloradoOgImage } from '@/lib/siteMetadata';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const profile = await getProfileById(id);
  if (!profile) return { title: 'Rider Not Found' };
  const description = `${profile.display_name}'s rider profile on BMX Colorado — Colorado's BMX community message board.`;
  return {
    title: profile.display_name,
    description,
    openGraph: {
      title: `${profile.display_name} - BMX Colorado`,
      description,
      url: `/users/${id}`,
      siteName: 'BMX Colorado',
      locale: 'en_US',
      type: 'profile',
      images: coloradoOgImage(`${profile.display_name} on BMX Colorado`),
    },
  };
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [profile, currentUser, postCount, recentPosts] = await Promise.all([
    getProfileById(id),
    getCurrentUser(),
    getProfilePostCount(id),
    getRecentForumPosts(8, id),
  ]);

  if (!profile) notFound();

  return (
    <ColoradoContentLayout className="py-8">
      <PublicProfileCard
        profile={profile}
        postCount={postCount}
        isOwnProfile={currentUser?.user?.id === profile.id}
        recentPosts={recentPosts}
      />
    </ColoradoContentLayout>
  );
}
