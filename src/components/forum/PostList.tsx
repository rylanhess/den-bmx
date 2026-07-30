import { formatRelativeDate, renderMarkdownLite } from '@/lib/forum';
import UserAvatar from '@/components/forum/UserAvatar';
import UserProfileLink from '@/components/profile/UserProfileLink';
import type { ForumPost, Profile } from '@/lib/supabase';

interface PostWithAuthor extends ForumPost {
  author?: Profile;
}

export default function PostList({ posts }: { posts: PostWithAuthor[] }) {
  return (
    <div className="space-y-0 border-2 border-[#00ff0c]/30 rounded-lg overflow-hidden">
      {posts.map((post, i) => (
        <div
          key={post.id}
          className={`flex gap-4 p-4 ${i % 2 === 0 ? 'bg-black' : 'bg-[#00ff0c]/5'} border-b border-[#00ff0c]/10 last:border-b-0`}
        >
          <div className="w-24 shrink-0 text-center">
            {post.author_id ? (
              <a href={`/users/${post.author_id}`} className="block hover:opacity-80 transition-opacity">
                <UserAvatar
                  displayName={post.author?.display_name ?? 'System'}
                  avatarUrl={post.author?.avatar_url}
                  size={48}
                />
              </a>
            ) : (
              <UserAvatar
                displayName={post.author?.display_name ?? 'System'}
                avatarUrl={post.author?.avatar_url}
                size={48}
              />
            )}
            <p className="text-xs font-bold text-[#00ff0c] mt-2 break-words">
              <UserProfileLink
                userId={post.author_id}
                displayName={post.author?.display_name ?? 'System'}
              />
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatRelativeDate(post.created_at)}
            </p>
          </div>
          <div className="flex-1 min-w-0">
            {post.fb_url && (
              <div className="mb-3 inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/40 rounded px-3 py-1.5 text-sm">
                <span className="text-blue-300 font-bold">Facebook</span>
                <a
                  href={post.fb_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00ff0c] underline"
                >
                  View on Facebook →
                </a>
              </div>
            )}
            {post.body?.trim() && (
              <div
                className="text-gray-200 prose-sm leading-relaxed break-words"
                dangerouslySetInnerHTML={{ __html: renderMarkdownLite(post.body) }}
              />
            )}
            {post.image_urls && post.image_urls.length > 0 && (
              <div className={`flex flex-wrap gap-2 ${post.body?.trim() ? 'mt-3' : ''}`}>
                {post.image_urls.map((url) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="Attached"
                      className="max-h-64 rounded border border-[#00ff0c]/20 hover:border-[#00ff0c]/50 transition-colors"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
