import { socialPlatform, socialPlatformLabel, type SocialPlatform } from '@/lib/socialPostDisplay';

const PLATFORM_STYLES: Record<
  SocialPlatform,
  { bg: string; text: string; border: string; hoverBorder: string; tint: string; hoverTint: string }
> = {
  facebook: {
    bg: 'bg-[#1877F2]',
    text: 'text-[#1877F2]',
    border: 'border-[#1877F2]/40',
    hoverBorder: 'hover:border-[#1877F2]',
    tint: 'bg-[#1877F2]/5',
    hoverTint: 'hover:bg-[#1877F2]/10',
  },
  instagram: {
    bg: 'bg-[#E1306C]',
    text: 'text-[#E1306C]',
    border: 'border-[#E1306C]/40',
    hoverBorder: 'hover:border-[#E1306C]',
    tint: 'bg-[#E1306C]/5',
    hoverTint: 'hover:bg-[#E1306C]/10',
  },
};

export function SocialPlatformIcon({
  platform,
  className = 'h-5 w-5',
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  if (platform === 'instagram') {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Inline "View post on … ↗" affordance — safe to nest inside an outer anchor/card. */
export function SocialCtaLine({ url, className = '' }: { url: string; className?: string }) {
  const platform = socialPlatform(url);
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold ${PLATFORM_STYLES[platform].text} ${className}`}
    >
      <SocialPlatformIcon platform={platform} className="h-3.5 w-3.5 shrink-0" />
      View post on {socialPlatformLabel(url)} ↗
    </span>
  );
}

/** Standalone direct link for lists (thread tables) — its own anchor. */
export function SocialPostChip({ url, className = '' }: { url: string; className?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`co-text-link ${className}`}
    >
      <SocialCtaLine url={url} />
    </a>
  );
}

/** Full-width card CTA — the standard cross-post template body on thread pages. */
export function SocialPostCard({ url, sentence }: { url: string; sentence: string }) {
  const platform = socialPlatform(url);
  const styles = PLATFORM_STYLES[platform];
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-3 rounded-lg border-2 ${styles.border} ${styles.tint} p-4 transition-colors ${styles.hoverBorder} ${styles.hoverTint}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles.bg} text-white`}
      >
        <SocialPlatformIcon platform={platform} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-white">{sentence}</span>
        <SocialCtaLine url={url} className="mt-1 text-sm font-black" />
      </span>
      <span
        className={`shrink-0 text-xl font-black ${styles.text} transition-transform group-hover:translate-x-0.5`}
        aria-hidden="true"
      >
        →
      </span>
    </a>
  );
}
