import type { SeoMetadata } from '../models/types';

const productionSiteUrl = 'https://thingstodoatlas-v2.pages.dev';
const configuredSiteUrl = import.meta.env.PUBLIC_SITE_URL?.trim() || productionSiteUrl;
const configuredUrl = new URL(configuredSiteUrl);
const configuredHost = configuredUrl.hostname.toLowerCase();

// Astro generates static HTML at build time. Only the Cloudflare Pages production
// build (master) may emit indexable pages, never a branch preview or local build.
const isProductionBuild = process.env.CF_PAGES === '1'
  && process.env.CF_PAGES_BRANCH === 'master';

// Allow the project's public pages.dev hostname now, and a custom domain later.
// Other *.pages.dev hostnames must never be treated as the canonical public site.
const isPublicHostname = configuredUrl.protocol === 'https:'
  && (configuredHost === new URL(productionSiteUrl).hostname || !configuredHost.endsWith('.pages.dev'));

// Publishing is enabled by default only on production. Explicitly setting
// PUBLIC_ALLOW_INDEXING=false remains an emergency off switch.
export const indexingEnabled = isProductionBuild
  && isPublicHostname
  && import.meta.env.PUBLIC_ALLOW_INDEXING !== 'false';

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
