import type { SeoMetadata } from '../models/types';

const productionSiteUrl = 'https://thingstodoatlas.com';
// Keep one canonical domain in every generated build. A stale Cloudflare
// PUBLIC_SITE_URL value must never publish pages.dev canonical URLs again.
const configuredSiteUrl = productionSiteUrl;

// Astro generates static HTML at build time. Only the Cloudflare Pages production
// build (master) may emit indexable pages, never a branch preview or local build.
const isProductionBuild = String(import.meta.env.CF_PAGES) === '1'
  && import.meta.env.CF_PAGES_BRANCH === 'master';

// Publishing is enabled by default only on production. Explicitly setting
// PUBLIC_ALLOW_INDEXING=false remains an emergency off switch.
export const indexingEnabled = isProductionBuild
  && String(import.meta.env.PUBLIC_ALLOW_INDEXING ?? '').trim().toLowerCase() !== 'false';

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
