import { getCategoryStats } from '@/lib/forum';
import CategoryTable from '@/components/forum/CategoryTable';
import BreadcrumbNav from '@/components/forum/BreadcrumbNav';
import Link from 'next/link';

export const metadata = {
  title: 'Message Board',
};

export default async function ForumPage() {
  const categories = await getCategoryStats();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <BreadcrumbNav items={[{ label: 'BMX Colorado Forum' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#00ff0c]">BMX COLORADO FORUM</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Colorado BMX racing, freestyle, tracks, and community discussion
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/tracks"
            className="px-4 py-2 border-2 border-[#00ff0c] text-[#00ff0c] font-bold text-sm rounded hover:bg-[#00ff0c]/10 transition-colors"
          >
            TRACKS
          </Link>
          <Link
            href="https://store.bmxdenver.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border-2 border-[#00ff0c] text-[#00ff0c] font-bold text-sm rounded hover:bg-[#00ff0c]/10 transition-colors"
          >
            MERCH
          </Link>
        </div>
      </div>

      <CategoryTable categories={categories} />
    </div>
  );
}
