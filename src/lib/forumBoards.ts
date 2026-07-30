import type { CategoryStat } from '@/components/forum/CategoryTable';

const NEW_BOARD_DAYS = 30;

export function isDiscussionBoard(cat: Pick<CategoryStat, 'track_id'>) {
  return !cat.track_id;
}

export function partitionDiscussionBoards(categories: CategoryStat[]) {
  const general = categories.filter(isDiscussionBoard);
  const cutoff = Date.now() - NEW_BOARD_DAYS * 24 * 60 * 60 * 1000;

  const newBoards = general
    .filter((c) => new Date(c.created_at).getTime() >= cutoff)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const newIds = new Set(newBoards.map((b) => b.id));
  const mainBoards = general
    .filter((c) => !newIds.has(c.id))
    .sort((a, b) => b.post_count - a.post_count || a.name.localeCompare(b.name));

  return { newBoards, mainBoards };
}
