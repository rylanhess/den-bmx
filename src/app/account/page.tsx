import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AccountForm from '@/components/account/AccountForm';
import type { Profile } from '@/lib/supabase';

export const metadata = { title: 'Account' };

export default async function AccountPage() {
  const result = await getCurrentUser();
  if (!result?.profile) redirect('/login');

  return (
    <div className="container mx-auto px-4 py-8">
      <AccountForm profile={result.profile as Profile} />
    </div>
  );
}
