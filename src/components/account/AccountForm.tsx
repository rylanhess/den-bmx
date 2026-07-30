'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase';

export default function AccountForm({ profile }: { profile: Profile }) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName.trim(), updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    setLoading(false);
    setMessage(error ? error.message : 'Profile updated!');
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="border-2 border-[#00ff0c]/30 rounded-lg p-6 max-w-md">
      <h1 className="text-2xl font-black text-[#00ff0c] mb-6">My Account</h1>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#00ff0c] mb-1">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            maxLength={40}
            className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none"
          />
        </div>
        <p className="text-gray-500 text-sm">Role: <span className="text-[#00ff0c] font-bold">{profile.role}</span></p>
        {message && <p className={`text-sm ${message.includes('updated') ? 'text-[#00ff0c]' : 'text-red-400'}`}>{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#00ff0c] text-black font-black rounded hover:bg-[#00cc0a] disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'SAVE'}
        </button>
      </form>

      <button
        onClick={handleSignOut}
        className="w-full mt-4 py-3 border-2 border-gray-600 text-gray-400 font-bold rounded hover:border-red-500 hover:text-red-400 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
