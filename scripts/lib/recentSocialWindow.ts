/**
 * Re-export shared calendar window from src (single source of truth).
 */
export {
  RECENT_CALENDAR_DAYS_PRIOR,
  recentPostCutoff,
  isWithinRecentWindow,
  hasRecentBoardActivity,
} from '../../src/lib/recentPostWindow';

/** @deprecated use RECENT_CALENDAR_DAYS_PRIOR */
export { RECENT_CALENDAR_DAYS_PRIOR as RECENT_POST_DAYS } from '../../src/lib/recentPostWindow';
