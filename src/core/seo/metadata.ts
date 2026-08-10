import type { SeoMetadata } from '../models/types';

const siteUrl = 'https://thingstodoatlas-v2.pages.dev';
export function absoluteCanonical(path: string): string { return new URL(path, siteUrl).toString(); }
export function breadcrumbJson(items: Array<{ name: string; path: string }>) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteCanonical(item.path) })) };
}
export function pageSeo(seo: SeoMetadata, breadcrumbs: Array<{ name: string; path: string }>) { return { ...seo, canonical: absoluteCanonical(seo.canonicalPath), breadcrumbs: breadcrumbJson(breadcrumbs) }; }
