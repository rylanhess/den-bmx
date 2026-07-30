import { formatRelativeDate, renderMarkdownLite } from '@/lib/forum';
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
            <div className="w-12 h-12 mx-auto bg-[#00ff0c]/20 rounded-full flex items-center justify-center text-[#00ff0c] font-black text-lg">
              {(post.author?.display_name ?? 'S')[0].toUpperCase()}
            </div>
            <p className="text-xs font-bold text-[#00ff0c] mt-2 break-words">
              {post.author?.display_name ?? 'System'}
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
            <div
              className="text-gray-200 prose-sm leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: renderMarkdownLite(post.body) }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
