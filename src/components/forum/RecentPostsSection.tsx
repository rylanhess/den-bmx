'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatRelativeDate } from '@/lib/forumFormat';
import type { RecentForumPost } from '@/lib/supabase';

function postExcerpt(body: string, maxLen = 100): string {
  const plain = body
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return '';
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen).trimEnd()}…`;
}

export default function RecentPostsSection({ posts }: { posts: RecentForumPost[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (posts.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % posts.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [posts.length]);

  if (posts.length === 0) return null;

  const post = posts[index];
  const href = `/forum/${post.category_slug}/${post.thread_id}`;
  const excerpt =
    postExcerpt(post.body) || (post.fb_url ? 'Shared a link on social.' : '');

  return (
    <section className="mb-4">
      <h2 className="font-black text-[#002868] text-xs uppercase tracking-wide mb-1.5">
        Recent Posts
      </h2>
      <Link
        href={href}
        className="co-chip-link block rounded-lg bg-white px-3 py-2 hover:bg-[#002868]/5 transition-colors min-h-[4.5rem]"
      >
        <div className="flex items-center gap-2 min-w-0 mb-0.5">
          <span className="text-[10px] font-black uppercase tracking-wide text-[#002868] truncate">
            {post.category_name}
          </span>
          <span className="text-[10px] text-gray-500 ml-auto shrink-0">
            {formatRelativeDate(post.created_at)}
          </span>
        </div>
        <p className="font-bold text-sm text-[#0B1C2D] leading-snug line-clamp-1">
          {post.thread_title}
        </p>
        {excerpt && (
          <p className="text-xs text-gray-600 mt-0.5 leading-snug line-clamp-1">
            {excerpt}
          </p>
        )}
      </Link>
      {posts.length > 1 && (
        <div className="flex justify-center gap-1 mt-1.5">
          {posts.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show post ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`co-carousel-dot rounded-full transition-colors ${
                i === index
                  ? 'bg-[#002868]'
                  : 'border border-[#002868]/25 bg-transparent'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
