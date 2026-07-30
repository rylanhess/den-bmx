import Image from 'next/image';

interface UserAvatarProps {
  displayName: string;
  avatarUrl?: string | null;
  size?: number;
}

export default function UserAvatar({ displayName, avatarUrl, size = 48 }: UserAvatarProps) {
  const initial = (displayName || 'S')[0].toUpperCase();

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={displayName}
        width={size}
        height={size}
        className="mx-auto rounded-full object-cover border-2 border-[#00ff0c]/30"
        style={{ width: size, height: size }}
        unoptimized
      />
    );
  }

  return (
    <div
      className="mx-auto bg-[#00ff0c]/20 rounded-full flex items-center justify-center text-[#00ff0c] font-black border-2 border-[#00ff0c]/30"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}
