'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { uploadAvatar } from '@/components/forum/ImageUploadField';
import UserAvatar from '@/components/forum/UserAvatar';
import UsabmxPointsDisplay from '@/components/profile/UsabmxPointsDisplay';
import AvatarCropModal from '@/components/account/AvatarCropModal';
import { AVATAR_ACCEPT, AVATAR_BUCKET_LIMIT_MB, validateAvatarSourceFile } from '@/lib/avatarImage';
import type { Profile, Track } from '@/lib/supabase';

export default function AccountForm({
  profile,
  tracks,
}: {
  profile: Profile;
  tracks: Pick<Track, 'id' | 'name' | 'slug'>[];
}) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [homeTrackId, setHomeTrackId] = useState(profile.home_track_id ?? '');
  const [practiceSchedule, setPracticeSchedule] = useState(profile.practice_schedule ?? '');
  const [usabmxUrl, setUsabmxUrl] = useState(profile.usabmx_profile_url ?? '');
  const [instagramUrl, setInstagramUrl] = useState(profile.instagram_url ?? '');
  const [facebookUrl, setFacebookUrl] = useState(profile.facebook_url ?? '');
  const [savedProfile, setSavedProfile] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = '';
    if (!file) return;

    const validationError = validateAvatarSourceFile(file);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    setMessage('');
    setCropFile(file);
  };

  const handleAvatarSave = async (blob: Blob) => {
    setUploading(true);
    setMessage('');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not signed in');

      const url = await uploadAvatar(blob, user.id);
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;
      setAvatarUrl(url);
      setCropFile(null);
      setMessage('Avatar updated!');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName.trim(),
          home_track_id: homeTrackId || null,
          practice_schedule: practiceSchedule,
          usabmx_profile_url: usabmxUrl,
          instagram_url: instagramUrl,
          facebook_url: facebookUrl,
          sync_usabmx: !!usabmxUrl.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSavedProfile(data.profile);
      setMessage('Profile updated!');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncPoints = async () => {
    setSyncing(true);
    setMessage('');
    try {
      const res = await fetch('/api/account', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      setSavedProfile(data.profile);
      setMessage('USA BMX points refreshed!');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="max-w-2xl space-y-6">
      {cropFile && (
        <AvatarCropModal
          file={cropFile}
          onCancel={() => setCropFile(null)}
          onSave={handleAvatarSave}
        />
      )}
      <div className="border-2 border-[#00ff0c]/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-[#00ff0c]">My Account</h1>
          <Link
            href={`/users/${profile.id}`}
            className="text-sm text-[#00ff0c] font-bold hover:underline"
          >
            View Public Profile →
          </Link>
        </div>

        <div className="flex flex-col items-center mb-6">
          <UserAvatar displayName={displayName} avatarUrl={avatarUrl} size={80} />
          <input
            ref={fileRef}
            type="file"
            accept={AVATAR_ACCEPT}
            className="hidden"
            onChange={handleAvatarPick}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="mt-3 text-sm text-[#00ff0c] font-bold hover:underline disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Change Avatar'}
          </button>
          <p className="text-gray-500 text-xs mt-1 text-center max-w-xs">
            JPEG, PNG, or WebP up to {AVATAR_BUCKET_LIMIT_MB}MB after crop. Drag to position your face in the circle.
          </p>
        </div>

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

          <div>
            <label className="block text-sm font-bold text-[#00ff0c] mb-1">Home Track</label>
            <select
              value={homeTrackId}
              onChange={(e) => setHomeTrackId(e.target.value)}
              className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none"
            >
              <option value="">— Select your home track —</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#00ff0c] mb-1">Typical Practice Schedule</label>
            <textarea
              value={practiceSchedule}
              onChange={(e) => setPracticeSchedule(e.target.value)}
              rows={3}
              placeholder="e.g. Tuesday & Thursday 6–8pm, Saturday open practice 10am"
              className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#00ff0c] mb-1">USA BMX Profile URL</label>
            <input
              type="url"
              value={usabmxUrl}
              onChange={(e) => setUsabmxUrl(e.target.value)}
              placeholder="https://www.usabmx.com/profiles/123456"
              className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none"
            />
            <p className="text-gray-500 text-xs mt-1">
              Shown on your public profile when points are synced.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#00ff0c] mb-1">Instagram</label>
            <input
              type="text"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="@yourhandle or https://instagram.com/yourhandle"
              className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#00ff0c] mb-1">Facebook Profile</label>
            <input
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://www.facebook.com/your.profile"
              className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none"
            />
          </div>

          <p className="text-gray-500 text-sm">
            Role: <span className="text-[#00ff0c] font-bold">{profile.role}</span>
          </p>

          {message && (
            <p className={`text-sm ${message.includes('updated') || message.includes('refreshed') || message.includes('Avatar') ? 'text-[#00ff0c]' : 'text-red-400'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00ff0c] text-black font-black rounded hover:bg-[#00cc0a] disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'SAVE PROFILE'}
          </button>
        </form>

        <button
          onClick={handleSignOut}
          className="w-full mt-4 py-3 border-2 border-gray-600 text-gray-400 font-bold rounded hover:border-red-500 hover:text-red-400 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {savedProfile.usabmx_profile_url && (
        <div className="border-2 border-[#00ff0c]/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-[#00ff0c] uppercase text-sm tracking-wide">Your USA BMX Points</h2>
            <button
              type="button"
              onClick={handleSyncPoints}
              disabled={syncing}
              className="text-sm text-[#00ff0c] font-bold hover:underline disabled:opacity-50"
            >
              {syncing ? 'Refreshing...' : 'Refresh Points'}
            </button>
          </div>
          <UsabmxPointsDisplay
            districtPoints={savedProfile.usabmx_points}
            districtRank={savedProfile.usabmx_points_rank}
            pointsDetail={savedProfile.usabmx_points_detail}
            syncedAt={savedProfile.usabmx_synced_at}
            profileUrl={savedProfile.usabmx_profile_url}
            riderName={savedProfile.usabmx_rider_name}
          />
        </div>
      )}
    </div>
  );
}
