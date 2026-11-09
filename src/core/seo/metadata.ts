import type { SeoMetadata } from '../models/types';

const productionSiteUrl = 'https://thingstodoatlas.com';
// Keep one canonical domain in every generated build. A stale Cloudflare
// PUBLIC_SITE_URL value must never publish pages.dev canonical URLs again.
const configuredSiteUrl = productionSiteUrl;

// Production builds are indexable by default. Cloudflare branch previews stay
// noindex, while local production builds can still exercise the real SEO output.
// This avoids silently noindexing the live site if CF_PAGES is omitted by a
// build integration, without ever opening indexing on a named preview branch.
const cloudflareBranch = String(import.meta.env.CF_PAGES_BRANCH ?? '').trim();
const isProductionBuild = cloudflareBranch
  ? cloudflareBranch === 'master'
  : Boolean(import.meta.env.PROD);

// Publishing is enabled by default. Explicitly setting
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
