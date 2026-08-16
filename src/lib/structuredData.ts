import { COLORADO_CANONICAL_ORIGIN, canonicalUrl } from '@/lib/canonicalSite';
import { formatTrackLocation } from '@/lib/trackDisplay';
import type { Track } from '@/lib/supabase';

const SITE_NAME = 'BMX Colorado';
const SITE_DESCRIPTION =
  "Colorado's community message board for BMX racing, freestyle, and track news.";

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${COLORADO_CANONICAL_ORIGIN}/#organization`,
    name: SITE_NAME,
    url: COLORADO_CANONICAL_ORIGIN,
    description: SITE_DESCRIPTION,
    logo: {
      '@type': 'ImageObject',
      url: canonicalUrl('/logos/cbmx_tab_icon-512.png?v=20260802'),
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://store.bmxdenver.com',
      'https://www.instagram.com/bmxdenver',
    ],
  };
}

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${COLORADO_CANONICAL_ORIGIN}/#website`,
    name: SITE_NAME,
    url: COLORADO_CANONICAL_ORIGIN,
    description: SITE_DESCRIPTION,
    publisher: { '@id': `${COLORADO_CANONICAL_ORIGIN}/#organization` },
    inLanguage: 'en-US',
  };
}

export interface BreadcrumbJsonLdItem {
  label: string;
  href?: string;
}

export function breadcrumbJsonLd(items: BreadcrumbJsonLdItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: canonicalUrl(item.href) } : {}),
    })),
  };
}

export function trackJsonLd(track: Track) {
  const sameAs = [track.fb_page_url, track.instagram_url, track.usabmx_url, track.website].filter(
    (u): u is string => !!u
  );
  const uniqueSameAs = [...new Set(sameAs)];
  const street = track.address?.split(',')[0]?.trim();
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    '@id': `${canonicalUrl(`/tracks/${track.slug}`)}#track`,
    name: track.name,
    url: canonicalUrl(`/tracks/${track.slug}`),
    ...(track.description ? { description: track.description } : {}),
    address: {
      '@type': 'PostalAddress',
      ...(street ? { streetAddress: street } : {}),
      addressLocality: formatTrackLocation(track.city).replace(/, CO$/, ''),
      addressRegion: 'CO',
      addressCountry: 'US',
    },
    ...(track.phone ? { telephone: track.phone } : {}),
    ...(track.lat && track.lon
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: track.lat,
            longitude: track.lon,
          },
        }
      : {}),
    ...(uniqueSameAs.length > 0 ? { sameAs: uniqueSameAs } : {}),
    isPartOf: { '@id': `${COLORADO_CANONICAL_ORIGIN}/#website` },
  };
}

interface DiscussionThreadInput {
  threadId: string;
  categorySlug: string;
  title: string;
  boardName: string;
  createdAt: string;
  lastPostAt: string;
  replyCount: number;
  authorName?: string | null;
  text?: string | null;
}

export function discussionThreadJsonLd(input: DiscussionThreadInput) {
  const url = canonicalUrl(`/forum/${input.categorySlug}/${input.threadId}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    '@id': `${url}#thread`,
    headline: input.title,
    url,
    datePublished: input.createdAt,
    dateModified: input.lastPostAt,
    ...(input.text ? { text: input.text } : {}),
    author: {
      '@type': 'Person',
      name: input.authorName ?? 'BMX Colorado member',
    },
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/CommentAction',
      userInteractionCount: input.replyCount,
    },
    isPartOf: {
      '@type': 'DiscussionForum',
      name: input.boardName,
      url: canonicalUrl(`/forum/${input.categorySlug}`),
    },
  };
}

interface TrackListItem {
  name: string;
  slug: string;
}

export function trackListJsonLd(tracks: TrackListItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Colorado BMX Tracks',
    url: canonicalUrl('/tracks'),
    numberOfItems: tracks.length,
    itemListElement: tracks.map((track, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: track.name,
      url: canonicalUrl(`/tracks/${track.slug}`),
    })),
  };
}
