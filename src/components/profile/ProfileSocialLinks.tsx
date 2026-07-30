import type { Profile } from '@/lib/supabase';
import { instagramHandleFromUrl } from '@/lib/socialUrls';

export default function ProfileSocialLinks({ profile }: { profile: Profile }) {
  const hasAny =
    profile.usabmx_profile_url ||
    profile.instagram_url ||
    profile.facebook_url;

  if (!hasAny) return null;

  const igHandle = instagramHandleFromUrl(profile.instagram_url);

  return (
    <section className="border-2 border-[#00ff0c]/30 rounded-lg p-5 mt-6">
      <h2 className="font-black text-[#00ff0c] mb-4 uppercase text-sm tracking-wide">Links</h2>
      <div className="flex flex-wrap gap-3">
        {profile.usabmx_profile_url && (
          <a
            href={profile.usabmx_profile_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 border border-[#00ff0c]/40 text-[#00ff0c] text-sm font-bold rounded hover:bg-[#00ff0c]/10 transition-colors"
          >
            USA BMX Profile →
          </a>
        )}
        {profile.instagram_url && (
          <a
            href={profile.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 border border-pink-500/40 text-pink-300 text-sm font-bold rounded hover:bg-pink-900/20 transition-colors"
          >
            Instagram {igHandle ? `(${igHandle})` : '→'}
          </a>
        )}
        {profile.facebook_url && (
          <a
            href={profile.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 border border-blue-500/40 text-blue-300 text-sm font-bold rounded hover:bg-blue-900/20 transition-colors"
          >
            Facebook →
          </a>
        )}
      </div>
    </section>
  );
}
