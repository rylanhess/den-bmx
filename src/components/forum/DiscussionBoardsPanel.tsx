'use client';

import CategoryTable, { type CategoryStat } from '@/components/forum/CategoryTable';
import NewBoardForm from '@/components/forum/NewBoardForm';
import { isDiscussionBoard } from '@/lib/forumBoards';

interface DiscussionBoardsPanelProps {
  categories: CategoryStat[];
}

export default function DiscussionBoardsPanel({ categories }: DiscussionBoardsPanelProps) {
  const boards = categories
    .filter(isDiscussionBoard)
    .sort((a, b) => b.post_count - a.post_count || a.name.localeCompare(b.name));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2 mb-2">
        <div>
          <h2 className="font-black text-[#00ff0c] text-sm sm:text-base uppercase tracking-wide">
            Discussion Boards
          </h2>
          <p className="text-gray-500 text-xs mt-0.5">Ranked by total posts</p>
        </div>
        <NewBoardForm variant="header" />
      </div>

      <CategoryTable categories={boards} hideTitle />
    </div>
  );
}
