/** Pushpin icon for pinned forum posts. */
export default function PinnedPostIcon({
  className = 'w-4 h-4',
  title = 'Pinned',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6l1.8-1 1.8 1v-6H18v-2l-2-2z" />
    </svg>
  );
}
