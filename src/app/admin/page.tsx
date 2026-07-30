import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

export const metadata = { title: 'Admin' };

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect('/forum');

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-black text-[#00ff0c] mb-6">ADMIN</h1>
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <Link
          href="/admin/claims"
          className="border-2 border-[#00ff0c]/30 rounded-lg p-5 hover:border-[#00ff0c] transition-colors"
        >
          <h2 className="font-black text-white">Track Claims</h2>
          <p className="text-gray-400 text-sm mt-1">Review and approve track operator claims</p>
        </Link>
        <Link
          href="/forum"
          className="border-2 border-[#00ff0c]/30 rounded-lg p-5 hover:border-[#00ff0c] transition-colors"
        >
          <h2 className="font-black text-white">Forum</h2>
          <p className="text-gray-400 text-sm mt-1">View and moderate discussions</p>
        </Link>
      </div>
    </div>
  );
}
