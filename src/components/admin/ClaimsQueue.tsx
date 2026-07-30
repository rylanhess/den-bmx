'use client';

import { useState } from 'react';

interface ClaimRow {
  id: string;
  contact_name: string;
  contact_email: string;
  message: string | null;
  status: string;
  created_at: string;
  track?: { name: string; slug: string };
}

export default function ClaimsQueue({ claims }: { claims: ClaimRow[] }) {
  const [items, setItems] = useState(claims);
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setLoading(id);
    const res = await fetch(`/api/admin/claims/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setItems((prev) => prev.filter((c) => c.id !== id));
    }
    setLoading(null);
  };

  if (items.length === 0) {
    return <p className="text-gray-400">No pending claim requests.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((claim) => (
        <div key={claim.id} className="border-2 border-[#00ff0c]/30 rounded-lg p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h3 className="font-black text-white">{claim.track?.name}</h3>
              <p className="text-[#00ff0c] text-sm font-bold mt-1">{claim.contact_name}</p>
              <p className="text-gray-400 text-sm">{claim.contact_email}</p>
              {claim.message && (
                <p className="text-gray-300 text-sm mt-2 border-l-2 border-[#00ff0c]/30 pl-3">
                  {claim.message}
                </p>
              )}
              <p className="text-gray-600 text-xs mt-2">
                Submitted {new Date(claim.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleAction(claim.id, 'approved')}
                disabled={loading === claim.id}
                className="px-4 py-2 bg-[#00ff0c] text-black font-black text-sm rounded hover:bg-[#00cc0a] disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(claim.id, 'rejected')}
                disabled={loading === claim.id}
                className="px-4 py-2 border-2 border-red-500 text-red-400 font-bold text-sm rounded hover:bg-red-900/20 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
