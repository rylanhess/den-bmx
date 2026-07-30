import type { UsabmxPointEntry } from '@/lib/supabase';

export default function UsabmxPointsDisplay({
  districtPoints,
  districtRank,
  pointsDetail,
  syncedAt,
  profileUrl,
  riderName,
}: {
  districtPoints: number | null;
  districtRank: number | null;
  pointsDetail: UsabmxPointEntry[] | null;
  syncedAt: string | null;
  profileUrl: string | null;
  riderName: string | null;
}) {
  if (!profileUrl) {
    return (
      <p className="text-gray-500 text-sm">No USA BMX profile linked</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-3">
        {districtPoints !== null ? (
          <>
            <div>
              <p className="text-3xl font-black text-[#00ff0c]">{districtPoints.toLocaleString()}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">District Points</p>
            </div>
            {districtRank !== null && districtRank > 0 && (
              <div className="border-l border-[#00ff0c]/30 pl-3">
                <p className="text-xl font-black text-white">#{districtRank}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">District Rank</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400 text-sm">Points not available — try refreshing from account settings</p>
        )}
      </div>

      <p className="text-gray-500 text-xs">
        In BMX, lower district points means a better season.{' '}
        {syncedAt && `Last synced ${new Date(syncedAt).toLocaleDateString()}.`}
      </p>

      {riderName && (
        <p className="text-gray-400 text-sm">
          USA BMX: <span className="text-white font-bold">{riderName}</span>
        </p>
      )}

      {pointsDetail && pointsDetail.length > 0 && (
        <div className="border border-[#00ff0c]/20 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#00ff0c]/10 border-b border-[#00ff0c]/20">
                <th className="text-left px-3 py-2 text-[#00ff0c] font-bold">Category</th>
                <th className="text-left px-3 py-2 text-[#00ff0c] font-bold hidden sm:table-cell">Class</th>
                <th className="text-right px-3 py-2 text-[#00ff0c] font-bold">Pts</th>
                <th className="text-right px-3 py-2 text-[#00ff0c] font-bold">Rank</th>
              </tr>
            </thead>
            <tbody>
              {pointsDetail.map((row, i) => (
                <tr key={`${row.type}-${row.skill}-${i}`} className="border-b border-[#00ff0c]/10 last:border-b-0">
                  <td className="px-3 py-2 text-gray-300">{row.type}</td>
                  <td className="px-3 py-2 text-gray-500 hidden sm:table-cell">{row.skill}</td>
                  <td className="px-3 py-2 text-right text-white font-bold">{row.points.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right text-gray-400">
                    {row.rank > 0 ? `#${row.rank}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm text-[#00ff0c] font-bold hover:underline"
      >
        View on USA BMX →
      </a>
    </div>
  );
}
