import Link from 'next/link';

interface UserProfileLinkProps {
  userId?: string | null;
  displayName: string;
  className?: string;
}

export default function UserProfileLink({ userId, displayName, className = '' }: UserProfileLinkProps) {
  if (!userId) {
    return <span className={className}>{displayName}</span>;
  }

  return (
    <Link
      href={`/users/${userId}`}
      className={`hover:text-[#00ff0c] hover:underline transition-colors ${className}`}
    >
      {displayName}
    </Link>
  );
}
