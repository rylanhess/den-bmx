/** Short label for social posts, e.g. "Dacono BMX" → "Dacono". */
export function shortTrackLabel(name: string): string {
  return name
    .replace(/\s*—\s*Track Comms$/i, '')
    .replace(/\s+BMX$/i, '')
    .trim();
}

export function socialPlatformLabel(url: string): 'Facebook' | 'Instagram' {
  return url.includes('instagram.com') ? 'Instagram' : 'Facebook';
}

export function socialPostSentence(trackName: string, url: string): string {
  const label = shortTrackLabel(trackName);
  const platform = socialPlatformLabel(url);
  return `${label} posted on ${platform}.`;
}
