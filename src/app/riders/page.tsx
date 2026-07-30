import Link from 'next/link';
import { getRiderLeaderboard } from '@/lib/profiles';
import UserAvatar from '@/components/forum/UserAvatar';

export const metadata = {
  title: 'Rider Leaderboard',
  description: 'Colorado BMX riders ranked by USA BMX district points',
};

export default async function RidersLeaderboardPage() {
  const riders = await getRiderLeaderboard(100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-black text-[#00ff0c] mb-2">RIDER LEADERBOARD</h1>
      <p className="text-gray-400 text-sm mb-2">
        Riders with linked USA BMX profiles — sorted by district points (lower is better).
      </p>
      <p className="text-gray-500 text-xs mb-8">
        <Link href="/account" className="text-[#00ff0c] hover:underline font-bold">
          Link your USA BMX profile
        </Link>
        {' '}in account settings to show up here.
      </p>

      {riders.length === 0 ? (
        <div className="border-2 border-[#00ff0c]/30 rounded-lg p-8 text-center text-gray-400">
          No riders have linked their USA BMX profile yet. Be the first!
        </div>
      ) : (
        <div className="border-2 border-[#00ff0c]/30 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#00ff0c]/10 border-b border-[#00ff0c]/30">
                <th className="text-left px-4 py-3 font-black text-[#00ff0c] w-12">#</th>
                <th className="text-left px-4 py-3 font-black text-[#00ff0c]">Rider</th>
                <th className="text-left px-4 py-3 font-black text-[#00ff0c] hidden md:table-cell">Home Track</th>
                <th className="text-right px-4 py-3 font-black text-[#00ff0c]">District Pts</th>
                <th className="text-right px-4 py-3 font-black text-[#00ff0c] hidden sm:table-cell">Rank</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider, i) => (
                <tr
                  key={rider.id}
                  className="border-b border-[#00ff0c]/10 hover:bg-[#00ff0c]/5 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-500 font-bold">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link href={`/users/${rider.id}`} className="flex items-center gap-3 group">
                      <UserAvatar
                        displayName={rider.display_name}
                        avatarUrl={rider.avatar_url}
                        size={36}
                      />
                      <div>
                        <p className="font-bold text-white group-hover:text-[#00ff0c] transition-colors">
                          {rider.display_name}
                        </p>
                        {rider.usabmx_rider_name && rider.usabmx_rider_name !== rider.display_name && (
                          <p className="text-gray-500 text-xs">{rider.usabmx_rider_name}</p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                    {rider.home_track ? (
                      <Link
                        href={`/tracks/${rider.home_track.slug}`}
                        className="hover:text-[#00ff0c] transition-colors"
                      >
                        {rider.home_track.name}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-black text-[#00ff0c]">
                    {rider.usabmx_points?.toLocaleString() ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-400 hidden sm:table-cell">
                    {rider.usabmx_points_rank && rider.usabmx_points_rank > 0
                      ? `#${rider.usabmx_points_rank}`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
