import { formatTrackShortName } from '@/lib/trackDisplay';

/** Short label for social posts, e.g. "Dacono BMX" → "Dacono". */
export function shortTrackLabel(name: string): string {
  return formatTrackShortName(name);
}

export type SocialPlatform = 'facebook' | 'instagram';

export function socialPlatform(url: string): SocialPlatform {
  return url.includes('instagram.com') ? 'instagram' : 'facebook';
}

export function socialPlatformLabel(url: string): 'Facebook' | 'Instagram' {
  return socialPlatform(url) === 'instagram' ? 'Instagram' : 'Facebook';
}

export function socialPostSentence(trackName: string, url: string): string {
  const label = shortTrackLabel(trackName);
  const platform = socialPlatformLabel(url);
  return `${label} posted on ${platform}.`;
}
