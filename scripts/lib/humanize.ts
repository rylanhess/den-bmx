/**
 * Human-like timing bounds for Facebook MCP scraper.
 * Agent/runbook picks a fresh random value within each range per action.
 */

export const HUMANIZE = {
  afterTabFocusMs: { min: 1500, max: 4500 },
  betweenScrollsMs: { min: 1800, max: 4200 },
  betweenTracksMs: { min: 3000, max: 8000 },
  scrollsPerTab: { min: 2, max: 4 },
  scrollViewportFraction: { min: 0.7, max: 1.0 },
  mouseMovesPerTab: { min: 2, max: 4 },
  afterSeeMoreMs: { min: 800, max: 2000 },
  afterOpenCommentsMs: { min: 1200, max: 2800 },
  commentScrollPauseMs: { min: 1500, max: 3500 },
  betweenPostsMs: { min: 2000, max: 5000 },
  afterLikeMs: { min: 1000, max: 2500 },
  mouseHoverMs: { min: 300, max: 900 },
} as const;

export const LIKE_CAPS = {
  perTrack: 3,
  perRun: 8,
} as const;

export const HEAL_LIMITS = {
  maxCyclesPerTrack: 2,
  maxFileEditsPerRun: 5,
} as const;

export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const randomDelayMs = (min: number, max: number): number =>
  randomInt(min, max);

export const randomInRange = (min: number, max: number): number =>
  min + Math.random() * (max - min);

/** Inline script for MCP page.evaluate — random mouse moves in feed main area */
export const getMouseMoveEvaluateScript = (moveCount: number): string => `
(() => {
  const main = document.querySelector('[role="main"]') || document.body;
  const rect = main.getBoundingClientRect();
  const moves = ${moveCount};
  for (let i = 0; i < moves; i++) {
    const x = rect.left + Math.random() * rect.width * 0.8 + rect.width * 0.1;
    const y = rect.top + Math.random() * rect.height * 0.8 + rect.height * 0.1;
    main.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: y }));
  }
  return { moves, rect: { w: rect.width, h: rect.height } };
})()
`;

/** Scroll by random fraction of viewport */
export const getScrollEvaluateScript = (fraction: number): string => `
(() => {
  const dy = Math.floor(window.innerHeight * ${fraction});
  window.scrollBy(0, dy);
  return { dy, scrollY: window.scrollY };
})()
`;
