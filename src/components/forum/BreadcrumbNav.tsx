import Link from 'next/link';
import { Fragment } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-hide"
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span aria-hidden className="text-gray-400 shrink-0">
              ›
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="co-text-link text-[#002868] hover:underline font-medium shrink-0"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#0B1C2D] font-medium shrink-0">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
