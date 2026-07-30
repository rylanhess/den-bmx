/**
 * Detect Chrome remote debugging (Chrome 144+ uses chrome://inspect/#remote-debugging
 * and exposes CDP on port 9222 — no DevToolsActivePort file).
 */

import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_CDP_URL = 'http://127.0.0.1:9222';

export const chromeDebugUrl = (): string =>
  process.env.CHROME_DEBUG_URL ?? DEFAULT_CDP_URL;

/** Legacy flag file when Chrome started with --remote-debugging-port */
export const hasLegacyDevToolsActivePort = (): boolean => {
  if (!process.env.HOME) return false;
  const portFile = path.join(
    process.env.HOME,
    'Library/Application Support/Google/Chrome/DevToolsActivePort'
  );
  return fs.existsSync(portFile);
};

/** Chrome 144+ remote debugging answers on /json/version */
export const probeCdpHttp = async (baseUrl = chromeDebugUrl()): Promise<boolean> => {
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/json/version`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return false;
    const body = (await res.json()) as { webSocketDebuggerUrl?: string };
    return Boolean(body.webSocketDebuggerUrl);
  } catch {
    return false;
  }
};

export const isChromeRemoteDebuggingReady = async (): Promise<boolean> => {
  if (hasLegacyDevToolsActivePort()) return true;
  return probeCdpHttp();
};
