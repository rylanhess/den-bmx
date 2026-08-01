import type { Profile } from '@/lib/supabase';
import { instagramHandleFromUrl } from '@/lib/socialUrls';
import { coChipLink } from '@/lib/coloradoUi';

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
            className={coChipLink}
          >
            USA BMX Profile →
          </a>
        )}
        {profile.instagram_url && (
          <a
            href={profile.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className={coChipLink}
          >
            Instagram {igHandle ? `(${igHandle})` : '→'}
          </a>
        )}
        {profile.facebook_url && (
          <a
            href={profile.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className={coChipLink}
          >
            Facebook →
          </a>
        )}
      </div>
    </section>
  );
}
