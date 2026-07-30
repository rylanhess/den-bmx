/**
 * Detect Chrome remote debugging (Chrome 144+ uses chrome://inspect/#remote-debugging
 * and exposes CDP on port 9222 — WebSocket-only, no /json/version HTTP API).
 */

import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_CDP_URL = 'http://127.0.0.1:9222';

export const chromeDebugUrl = (): string =>
  process.env.CHROME_DEBUG_URL ?? DEFAULT_CDP_URL;

const devToolsActivePortPath = (): string | null => {
  if (!process.env.HOME) return null;
  const portFile = path.join(
    process.env.HOME,
    'Library/Application Support/Google/Chrome/DevToolsActivePort'
  );
  return fs.existsSync(portFile) ? portFile : null;
};

/** Legacy flag file when Chrome started with --remote-debugging-port */
export const hasLegacyDevToolsActivePort = (): boolean =>
  devToolsActivePortPath() !== null;

/**
 * Chrome 144+ WebSocket endpoint from DevToolsActivePort (line 1 = port, line 2 = path).
 * Required because chrome://inspect remote debugging has no HTTP /json/version.
 */
export const chromeWebSocketEndpoint = (): string | null => {
  const portFile = devToolsActivePortPath();
  if (!portFile) return null;

  try {
    const lines = fs.readFileSync(portFile, 'utf8').trim().split('\n');
    const port = lines[0]?.trim();
    const wsPath = lines[1]?.trim();
    if (!port || !wsPath) return null;

    const host = chromeDebugUrl().replace(/^https?:\/\//, '').split(':')[0] || '127.0.0.1';
    return `ws://${host}:${port}${wsPath}`;
  } catch {
    return null;
  }
};

/** Chrome 144+ remote debugging answers on /json/version only for legacy --remote-debugging-port */
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
  if (chromeWebSocketEndpoint()) return true;
  return probeCdpHttp();
};

export type ChromeConnectOptions =
  | { browserURL: string; defaultViewport: null }
  | { browserWSEndpoint: string; defaultViewport: null };

/** Puppeteer connect options for local Chrome (M144+ ws path or legacy HTTP). */
export const chromePuppeteerConnectOptions = async (): Promise<ChromeConnectOptions> => {
  const ws = chromeWebSocketEndpoint();
  if (ws) return { browserWSEndpoint: ws, defaultViewport: null };

  const base = chromeDebugUrl();
  if (await probeCdpHttp(base)) return { browserURL: base, defaultViewport: null };

  throw new Error(
    'Chrome CDP not ready. Enable chrome://inspect/#remote-debugging or run with --remote-debugging-port=9222'
  );
};
