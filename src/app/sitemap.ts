import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { canonicalOriginForHost } from '@/lib/canonicalSite';
import { COLORADO_BMX_TRACK_SLUGS } from '@/lib/coloradoTracks';
import { isColoradoHost } from '@/lib/coloradoTheme';

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

function coloradoSitemap(origin: string): MetadataRoute.Sitemap {
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

function denverSitemap(origin: string): MetadataRoute.Sitemap {
  return [
    entry(origin, '/', 1),
    entry(origin, '/denver-bmx-races', 0.9, 'daily'),
    entry(origin, '/bmx-tracks-denver', 0.9),
    entry(origin, '/bmx-parks-denver', 0.8),
    entry(origin, '/kids-bmx-denver', 0.7),
    entry(origin, '/volunteer-bmx-denver', 0.6),
    entry(origin, '/denver-bmx-merch', 0.6),
    entry(origin, '/contact', 0.5, 'monthly'),
    entry(origin, '/about', 0.5, 'monthly'),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get('host') ?? '';
  const origin = canonicalOriginForHost(host);
  return isColoradoHost(host) ? coloradoSitemap(origin) : denverSitemap(origin);
}
