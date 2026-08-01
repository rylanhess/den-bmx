/** Calendar-based "new activity" label (last 2 MT calendar days). */
export default function NewBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`co-badge-new inline-flex items-center shrink-0 px-1.5 py-px text-[10px] leading-none font-black bg-[#FFC72C] text-[#002868] rounded uppercase tracking-wide align-middle ${className}`}
    >
      NEW
    </span>
  );
}
