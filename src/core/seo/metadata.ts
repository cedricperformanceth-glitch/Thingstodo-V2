import type { SeoMetadata } from '../models/types';

const stagingSiteUrl = 'https://thingstodoatlas-v2.pages.dev';
const configuredSiteUrl = import.meta.env.PUBLIC_SITE_URL?.trim() || stagingSiteUrl;
const configuredHost = new URL(configuredSiteUrl).hostname.toLowerCase();

// A static build cannot reliably infer its eventual host at request time. Indexing
// therefore stays off unless an explicit production URL and opt-in are supplied.
export const indexingEnabled = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true'
  && !configuredHost.endsWith('.pages.dev');

export function absoluteCanonical(path: string): string {
  return new URL(path, configuredSiteUrl).toString();
}

export function breadcrumbJson(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteCanonical(item.path),
    })),
  };
}

export function pageSeo(seo: SeoMetadata, breadcrumbs: Array<{ name: string; path: string }>) {
  return {
    ...seo,
    canonical: absoluteCanonical(seo.canonicalPath),
    image: seo.image ? new URL(seo.image, configuredSiteUrl).toString() : undefined,
    breadcrumbs: breadcrumbJson(breadcrumbs),
  };
}
