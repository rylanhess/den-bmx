import { formatTrackShortName } from '@/lib/trackDisplay';

/** Short label for social posts, e.g. "Dacono BMX" → "Dacono". */
export function shortTrackLabel(name: string): string {
  return formatTrackShortName(name);
}

export function socialPlatformLabel(url: string): 'Facebook' | 'Instagram' {
  return url.includes('instagram.com') ? 'Instagram' : 'Facebook';
}

export function socialPostSentence(trackName: string, url: string): string {
  const label = shortTrackLabel(trackName);
  const platform = socialPlatformLabel(url);
  return `${label} posted on ${platform}.`;
}
