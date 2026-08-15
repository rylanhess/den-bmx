import type { MetadataRoute } from 'next';
import { COLORADO_CANONICAL_ORIGIN } from '@/lib/canonicalSite';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/account', '/auth/'],
    },
    sitemap: `${COLORADO_CANONICAL_ORIGIN}/sitemap.xml`,
    host: COLORADO_CANONICAL_ORIGIN.replace(/^https?:\/\//, ''),
  };
}
