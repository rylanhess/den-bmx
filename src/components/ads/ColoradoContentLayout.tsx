import ColoradoAdRail from '@/components/ads/ColoradoAdRail';
import { leftSidebarAdSlots, rightSidebarAdSlots } from '@/lib/adSpaces';

interface ColoradoContentLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main content with ad rails on both sides on large screens.
 * Mobile mid-rolls only on non-discussion pages (e.g. /tracks index). Never inside threads or boards.
 */
export default function ColoradoContentLayout({ children, className = '' }: ColoradoContentLayoutProps) {
  return (
    <div className={`container mx-auto px-4 py-4 sm:py-6 max-w-7xl ${className}`}>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-6 xl:gap-8">
        <div className="hidden lg:block lg:w-52 xl:w-60 shrink-0">
          <div className="co-ad-rail-stick lg:sticky">
            <ColoradoAdRail slots={leftSidebarAdSlots} />
          </div>
        </div>

        <div className="flex-1 min-w-0">{children}</div>

        <div className="hidden lg:block lg:w-52 xl:w-60 shrink-0">
          <div className="co-ad-rail-stick lg:sticky">
            <ColoradoAdRail slots={rightSidebarAdSlots} />
          </div>
        </div>
      </div>
    </div>
  );
}
