'use client';

import CategoryTable, { type CategoryStat } from '@/components/forum/CategoryTable';
import NewBoardForm from '@/components/forum/NewBoardForm';
import { partitionDiscussionBoards } from '@/lib/forumBoards';

interface DiscussionBoardsPanelProps {
  categories: CategoryStat[];
}

export default function DiscussionBoardsPanel({ categories }: DiscussionBoardsPanelProps) {
  const { newBoards, mainBoards } = partitionDiscussionBoards(categories);

  return (
    <div className="space-y-8">
      <div>
        <NewBoardForm />
      </div>

      {newBoards.length > 0 && (
        <CategoryTable
          title="New Discussion Boards"
          subtitle="Started in the last 30 days"
          categories={newBoards}
        />
      )}

      <CategoryTable
        title="Discussion Boards"
        subtitle="Ranked by total posts"
        categories={mainBoards}
      />
    </div>
  );
}
