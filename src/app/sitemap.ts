import type { MetadataRoute } from 'next';
import { COLORADO_CANONICAL_ORIGIN } from '@/lib/canonicalSite';
import { COLORADO_BMX_TRACK_SLUGS } from '@/lib/coloradoTracks';

function entry(
  origin: string,
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly'
): MetadataRoute.Sitemap[number] {
  return {
    url: `${origin}${path.startsWith('/') ? path : `/${path}`}`,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = COLORADO_CANONICAL_ORIGIN;
  return [
    entry(origin, '/forum', 1, 'hourly'),
    entry(origin, '/tracks', 0.9),
    entry(origin, '/contact', 0.6, 'monthly'),
    entry(origin, '/login', 0.4, 'monthly'),
    entry(origin, '/signup', 0.4, 'monthly'),
    ...COLORADO_BMX_TRACK_SLUGS.map((slug) => entry(origin, `/tracks/${slug}`, 0.8)),
    ...COLORADO_BMX_TRACK_SLUGS.map((slug) =>
      entry(origin, `/forum/${slug}-comms`, 0.7, 'daily')
    ),
  ];
}
