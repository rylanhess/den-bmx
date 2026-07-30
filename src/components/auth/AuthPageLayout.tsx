import CategoryTable from '@/components/forum/CategoryTable';
import type { CategoryStat } from '@/components/forum/CategoryTable';

interface AuthPageLayoutProps {
  categories: CategoryStat[];
  children: React.ReactNode;
}

export default function AuthPageLayout({ categories, children }: AuthPageLayoutProps) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Forum preview in background */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="opacity-30 blur-[1px] scale-[1.02]">
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-black text-[#00ff0c] mb-2">BMX COLORADO FORUM</h1>
            <p className="text-gray-400 text-sm mb-6">
              Colorado BMX racing, freestyle, tracks, and community discussion
            </p>
            <CategoryTable categories={categories} />
          </div>
        </div>
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Auth modal */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        {children}
      </div>
    </div>
  );
}
