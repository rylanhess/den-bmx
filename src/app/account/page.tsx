import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { COLORADO_BMX_TRACK_SLUGS } from '@/lib/coloradoTracks';
import AccountForm from '@/components/account/AccountForm';
import type { Profile, Track } from '@/lib/supabase';

export const metadata = {
  title: 'Account',
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const result = await getCurrentUser();
  if (!result?.profile) redirect('/login');

  const supabase = await createClient();
  const { data: tracks } = await supabase
    .from('tracks')
    .select('id, name, slug')
    .in('slug', [...COLORADO_BMX_TRACK_SLUGS])
    .order('name');

  return (
    <div className="container mx-auto px-4 py-8">
      <AccountForm
        profile={result.profile as Profile}
        tracks={(tracks as Pick<Track, 'id' | 'name' | 'slug'>[]) ?? []}
      />
    </div>
  );
}
