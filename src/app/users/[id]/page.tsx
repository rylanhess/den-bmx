import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getProfileById, getProfilePostCount } from '@/lib/profiles';
import PublicProfileCard from '@/components/profile/PublicProfileCard';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getProfileById(id);
  if (!profile) return { title: 'Rider Not Found' };
  return {
    title: profile.display_name,
    description: `${profile.display_name}'s rider profile on BMX Colorado — Colorado's BMX community message board.`,
  };
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [profile, currentUser, postCount] = await Promise.all([
    getProfileById(id),
    getCurrentUser(),
    getProfilePostCount(id),
  ]);

  if (!profile) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <PublicProfileCard
        profile={profile}
        postCount={postCount}
        isOwnProfile={currentUser?.user?.id === profile.id}
      />
    </div>
  );
}
