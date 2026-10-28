import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const outputDirectory = new URL('../dist/', import.meta.url);
const outputPath = outputDirectory.pathname;
const DEFAULT_ORIGIN = 'https://thingstodoatlas-v2.pages.dev';
const MAX_SITEMAP_URLS = 50000;

function attr(tag, name) {
  const match = tag.match(new RegExp('(?:^|\\s)' + name + '\\s*=\\s*(["\\x27])(.*?)\\1', 'i'));
  return match ? match[2] : null;
}

function tags(html, type) {
  return html.match(new RegExp('<' + type + '\\b[^>]*>', 'gi')) ?? [];
}

function htmlDecode(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function canonicalHref(html) {
  const element = tags(html, 'link').find((tag) => (attr(tag, 'rel') ?? '').split(/\s+/).includes('canonical'));
  const href = element && attr(element, 'href');
  return href ? htmlDecode(href) : null;
}

function isNoindex(html) {
  return tags(html, 'meta').some((tag) => {
    const name = (attr(tag, 'name') ?? '').toLowerCase();
    return (name === 'robots' || name === 'googlebot') && /(?:^|[\s,;])noindex(?:$|[\s,;])/i.test(attr(tag, 'content') ?? '');
  });
}

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(file);
    else if (entry.isFile() && entry.name.endsWith('.html')) yield file;
  }
}

function routeForHtml(file) {
  const name = relative(outputPath, file).split(sep).join('/');
  if (name === 'index.html') return '/';
  if (name.endsWith('/index.html')) return '/' + name.slice(0, -'/index.html'.length);
  return '/' + name.slice(0, -'.html'.length);
}

function xmlEscape(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  })[character]);
}

function inspect() {
  if (!existsSync(join(outputPath, 'index.html'))) {
    throw new Error('Missing dist/index.html: run astro build before generating SEO artifacts.');
  }

  const homeHtml = readFileSync(join(outputPath, 'index.html'), 'utf8');
  const homeCanonical = canonicalHref(homeHtml);
  if (!homeCanonical) throw new Error('Homepage is missing its canonical URL.');

  const siteUrl = new URL(homeCanonical);
  if (siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash || siteUrl.protocol !== 'https:') {
    throw new Error('Invalid homepage canonical URL: ' + homeCanonical);
  }
  const origin = siteUrl.origin;

  const urls = [];
  let excludedByRobots = 0;
  let excludedByCanonical = 0;
  let missingCanonical = 0;
  for (const file of htmlFiles(outputPath)) {
    const route = routeForHtml(file);
    if (route === '/404') continue;

    const html = readFileSync(file, 'utf8');
    if (isNoindex(html)) {
      excludedByRobots++;
      continue;
    }

    const href = canonicalHref(html);
    if (!href) {
      missingCanonical++;
      continue;
    }

    const canonical = new URL(href, origin);
    if (canonical.origin !== origin || canonical.pathname !== route || canonical.search || canonical.hash) {
      excludedByCanonical++;
      continue;
    }
    urls.push(canonical.href);
  }

  urls.sort((a, b) => a.localeCompare(b, 'en'));
  if (new Set(urls).size !== urls.length) {
    throw new Error('Multiple generated files resolve to the same canonical URL.');
  }
  if (urls.length > MAX_SITEMAP_URLS) {
    throw new Error('More than 50,000 URLs: split the sitemap into separate files.');
  }

  // Do not advertise URLs if a production build is globally marked noindex.
  // This also prevents sitemap publication on Cloudflare branch previews.
  if (isNoindex(homeHtml) && urls.length) {
    throw new Error('Homepage has noindex but another built page is indexable.');
  }

  return { origin, urls, excludedByRobots, excludedByCanonical, missingCanonical };
}

const { origin, urls, excludedByRobots, excludedByCanonical, missingCanonical } = inspect();

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => '  <url><loc>' + xmlEscape(url) + '</loc></url>'),
  '</urlset>',
  '',
].join('\n');

const robots = urls.length
  ? 'User-agent: *\nAllow: /\n\nSitemap: ' + origin + '/sitemap.xml\n'
  : 'User-agent: *\nDisallow: /\n';

writeFileSync(join(outputPath, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(join(outputPath, 'robots.txt'), robots, 'utf8');

console.log('SEO artifacts generated for ' + origin);
console.log('Sitemap URLs: ' + urls.length);
console.log('Excluded: ' + excludedByRobots + ' noindex, ' + excludedByCanonical + ' non-self-canonical, ' + missingCanonical + ' without canonical');
console.log('Robots: ' + (urls.length ? 'public sitemap advertised' : 'all crawlers disallowed (non-indexable build)'));
if (urls.length) console.log('First URLs: ' + urls.slice(0, 12).join(', '));
