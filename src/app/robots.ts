import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { canonicalOriginForHost } from '@/lib/canonicalSite';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host') ?? '';
  const origin = canonicalOriginForHost(host);

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${origin}/sitemap.xml`,
    host: origin.replace(/^https?:\/\//, ''),
  };
}
