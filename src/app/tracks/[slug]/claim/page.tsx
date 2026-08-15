import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ClaimForm from '@/components/forum/ClaimForm';
import BreadcrumbNav from '@/components/forum/BreadcrumbNav';

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata = {
  title: 'Claim This Track',
  robots: { index: false, follow: false },
};

export default async function ClaimPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/tracks/${slug}/claim`);

  const { data: track } = await supabase
    .from('tracks')
    .select('id, name, slug, claimed_by')
    .eq('slug', slug)
    .single();

  if (!track) notFound();
  if (track.claimed_by) redirect(`/tracks/${slug}`);

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <BreadcrumbNav
        items={[
          { label: 'Tracks', href: '/tracks' },
          { label: track.name, href: `/tracks/${slug}` },
          { label: 'Claim' },
        ]}
      />
      <ClaimForm trackId={track.id} trackName={track.name} trackSlug={slug} />
    </div>
  );
}
