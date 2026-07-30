import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import ClaimsQueue from '@/components/admin/ClaimsQueue';
import BreadcrumbNav from '@/components/forum/BreadcrumbNav';

export const metadata = { title: 'Track Claims — Admin' };

export default async function AdminClaimsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect('/forum');

  const supabase = await createClient();
  const { data: claims } = await supabase
    .from('track_claim_requests')
    .select('*, track:tracks(name, slug)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <BreadcrumbNav
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Track Claims' },
        ]}
      />
      <h1 className="text-2xl font-black text-[#00ff0c] mb-6">Pending Track Claims</h1>
      <ClaimsQueue claims={claims ?? []} />
    </div>
  );
}
