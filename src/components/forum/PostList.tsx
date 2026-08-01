import { formatRelativeDate, renderMarkdownLite } from '@/lib/forum';
import { socialPostSentence, shortTrackLabel } from '@/lib/socialPostDisplay';
import UserAvatar from '@/components/forum/UserAvatar';
import UserProfileLink from '@/components/profile/UserProfileLink';
import type { ForumPost, Profile } from '@/lib/supabase';

interface PostWithAuthor extends ForumPost {
  author?: Profile;
}

interface PostListProps {
  posts: PostWithAuthor[];
  /** Board or track name for social post copy (e.g. "Dacono BMX"). */
  boardName?: string;
}

export default function PostList({ posts, boardName }: PostListProps) {
  const trackLabel = boardName ? shortTrackLabel(boardName) : 'This track';

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
            {post.fb_url ? (
              <p className="text-[#0B1C2D] text-sm leading-relaxed">
                {socialPostSentence(boardName ?? trackLabel, post.fb_url)}{' '}
                <a
                  href={post.fb_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="co-text-link text-[#002868] font-bold underline hover:text-[#BF0A30]"
                >
                  Click here to see it.
                </a>
              </p>
            ) : post.body?.trim() ? (
              <div
                className="text-[#0B1C2D] prose-sm leading-relaxed break-words"
                dangerouslySetInnerHTML={{ __html: renderMarkdownLite(post.body) }}
              />
            ) : null}
            {post.image_urls && post.image_urls.length > 0 && (
              <div className={`flex flex-wrap gap-2 ${post.body?.trim() || post.fb_url ? 'mt-3' : ''}`}>
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
