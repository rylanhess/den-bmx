import Link from 'next/link';
import ShareInviteForm from '@/components/share/ShareInviteForm';
import { coChipLink } from '@/lib/coloradoUi';

export const metadata = {
  title: 'Share BMX Colorado',
  description: 'Invite BMX friends and family to bmxcolorado.com',
};

export default function SharePage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-lg">
      <h1 className="text-2xl sm:text-3xl font-black text-[#002868] mb-2">
        Spread the word
      </h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        We&apos;re bootstrapping Colorado&apos;s BMX message boards from scratch. Every invite
        helps — race families, coaches, riders at your track, anyone who cares about BMX here.
      </p>

      <div className="border-2 border-[#002868]/15 rounded-xl bg-white p-6 shadow-sm">
        <ShareInviteForm />
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        <Link href="/forum" className={coChipLink}>
          Back to forum
        </Link>
      </p>
    </div>
  );
}
