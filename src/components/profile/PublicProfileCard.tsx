import Link from 'next/link';
import UserAvatar from '@/components/forum/UserAvatar';
import ProfileSocialLinks from '@/components/profile/ProfileSocialLinks';
import UsabmxPointsDisplay from '@/components/profile/UsabmxPointsDisplay';
import type { PublicProfile } from '@/lib/profiles';

export default function PublicProfileCard({
  profile,
  postCount,
  isOwnProfile,
}: {
  profile: PublicProfile;
  postCount: number;
  isOwnProfile?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <div className="border-2 border-[#00ff0c]/30 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <UserAvatar displayName={profile.display_name} avatarUrl={profile.avatar_url} size={96} />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-white">{profile.display_name}</h1>
            {profile.usabmx_rider_name && profile.usabmx_rider_name !== profile.display_name && (
              <p className="text-gray-400 text-sm mt-1">{profile.usabmx_rider_name}</p>
            )}
            <p className="text-gray-500 text-sm mt-2">
              Member since {new Date(profile.created_at).toLocaleDateString()}
              {' · '}
              {postCount} forum post{postCount !== 1 ? 's' : ''}
            </p>
            {isOwnProfile && (
              <Link
                href="/account"
                className="inline-block mt-3 text-sm text-[#00ff0c] font-bold hover:underline"
              >
                Edit Profile →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="border-2 border-[#00ff0c]/30 rounded-lg p-5">
          <h2 className="font-black text-[#00ff0c] mb-3 uppercase text-sm tracking-wide">Home Track</h2>
          {profile.home_track ? (
            <Link
              href={`/tracks/${profile.home_track.slug}`}
              className="text-white font-bold hover:text-[#00ff0c] transition-colors"
            >
              {profile.home_track.name}
            </Link>
          ) : (
            <p className="text-gray-500 text-sm">Not set</p>
          )}
        </section>

        <section className="border-2 border-[#00ff0c]/30 rounded-lg p-5">
          <h2 className="font-black text-[#00ff0c] mb-3 uppercase text-sm tracking-wide">Practice Schedule</h2>
          {profile.practice_schedule ? (
            <p className="text-gray-300 text-sm whitespace-pre-wrap">{profile.practice_schedule}</p>
          ) : (
            <p className="text-gray-500 text-sm">Not set</p>
          )}
        </section>
      </div>

      <ProfileSocialLinks profile={profile} />

      <section className="border-2 border-[#00ff0c]/30 rounded-lg p-5 mt-6">
        <h2 className="font-black text-[#00ff0c] mb-4 uppercase text-sm tracking-wide">USA BMX Points</h2>
        <UsabmxPointsDisplay
          districtPoints={profile.usabmx_points}
          districtRank={profile.usabmx_points_rank}
          pointsDetail={profile.usabmx_points_detail}
          syncedAt={profile.usabmx_synced_at}
          profileUrl={profile.usabmx_profile_url}
          riderName={profile.usabmx_rider_name}
        />
      </section>
    </div>
  );
}
