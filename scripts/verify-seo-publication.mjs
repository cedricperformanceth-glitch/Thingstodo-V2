import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const origin = 'https://thingstodoatlas-v2.pages.dev';
const mode = process.argv[2];
const expectIndexing = process.argv[3] === 'index';
const laosCities = ['don-det', 'luang-prabang', 'pakse', 'tad-lo', 'thakhek', 'vang-vieng', 'vientiane'];
const publishedCityRoutes = laosCities.flatMap((slug) => [`/laos/${slug}`, `/laos/${slug}/field-note`, `/laos/${slug}/things-to-do`]);

function assert(condition, explanation) {
  if (!condition) throw new Error(explanation);
}

function robots(html) {
  const match = html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/i);
  return match?.[0] ?? '';
}

function canonical(html) {
  return html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0] ?? '';
}

function verifyPage(name, html, expectedUrl, indexable) {
  const actualRobots = robots(html);
  const actualCanonical = canonical(html);
  const noindex = /\bnoindex\b/i.test(actualRobots);
  assert(noindex !== indexable, `${name}: expected indexable=${indexable}, robots=${actualRobots || '(absent)'}`);
  assert(actualCanonical.includes(`href="${expectedUrl}"`), `${name}: incorrect canonical: ${actualCanonical}`);
  assert(/<title>[^<]+<\/title>/i.test(html), `${name}: missing HTML title`);
  console.log(`PASS ${name}: indexable=${indexable}, canonical=${expectedUrl}`);
}

function output(path) {
  const options = path === '/' ? ['index.html'] : [`${path.slice(1)}/index.html`, `${path.slice(1)}.html`];
  for (const option of options) {
    const filename = join('dist', option);
    if (existsSync(filename)) return readFileSync(filename, 'utf8');
  }
  throw new Error(`Missing built HTML: ${path} (tried ${options.join(', ')})`);
}

function verifySeoArtifacts(indexable) {
  const sitemap = readFileSync(join('dist', 'sitemap.xml'), 'utf8');
  const robotsTxt = readFileSync(join('dist', 'robots.txt'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expectedSitemap = origin + '/sitemap.xml';

  assert(sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'),
    'Sitemap must have the standard XML namespace');
  assert(/^User-agent: \*$/m.test(robotsTxt), 'robots.txt missing User-agent');
  assert(urls.length === new Set(urls).size, 'Sitemap contains duplicate URLs');

  if (indexable) {
    for (const required of ['/', '/laos', ...publishedCityRoutes]) {
      const url = origin + required;
      assert(urls.includes(url), 'Sitemap missing published URL ' + url);
    }
    for (const blocked of ['/404', '/admin', '/summary']) {
      assert(!urls.includes(origin + blocked), 'Sitemap contains blocked URL ' + blocked);
    }
    assert(urls.length > publishedCityRoutes.length + 2, 'Expected all approved cities plus their activity pages');
    assert(robotsTxt.includes('Sitemap: ' + expectedSitemap), 'robots.txt missing canonical sitemap');
    assert(/^Allow: \/$/m.test(robotsTxt), 'Production robots.txt must allow crawling');
    assert(!/^Disallow: \/$/m.test(robotsTxt), 'Production robots.txt must not disallow entire site');
  } else {
    assert(urls.length === 0, 'Preview must not publish any sitemap URL');
    assert(/^Disallow: \/$/m.test(robotsTxt), 'Preview robots.txt must disallow all crawlers');
    assert(!/Sitemap:/i.test(robotsTxt), 'Preview robots.txt must not advertise a sitemap');
  }

  console.log('PASS ' + (indexable ? 'production' : 'preview') +
    ' SEO artifacts: ' + urls.length + ' URLs, robots.txt policy correct');
}

if (mode === 'build') {
  verifyPage('home', output('/'), `${origin}/`, expectIndexing);
  verifyPage('Laos', output('/laos'), `${origin}/laos`, expectIndexing);
  for (const city of laosCities) {
    for (const suffix of ['', '/field-note', '/things-to-do']) {
      const path = `/laos/${city}${suffix}`;
      verifyPage(path, output(path), origin + path, expectIndexing);
    }
  }
  const notFound = output('/404');
  assert(/This page took a different road\./.test(notFound), 'Missing Atlas 404 body');
  assert(/noindex/i.test(robots(notFound)), '404 should explicitly noindex');
  console.log('PASS 404.html exists and is non-indexable');
  verifySeoArtifacts(expectIndexing);
} else if (mode === 'live') {
  const attempts = 18;
  const pauseMs = 10000;
  const request = async (pathname) => {
    const response = await fetch(`${origin}${pathname}`, {
      headers: { 'user-agent': 'AtlasSeoSmokeCheck/1.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    return { status: response.status, url: response.url, html: await response.text(), headers: response.headers };
  };

  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      // The 404 marker guarantees the Cloudflare deployment includes the new file,
      // rather than incorrectly accepting a previous successful deployment.
      const missing = await request('/laos/seo-smoke-nonexistent-destination-404');
      assert(missing.status === 404, `unknown path returned HTTP ${missing.status}, expected 404`);
      assert(/This page took a different road\./.test(missing.html), 'new custom Atlas 404 is not yet deployed');
      assert(/noindex/i.test(robots(missing.html)), 'live 404 missing noindex');
      console.log('PASS Cloudflare unknown route: HTTP 404 with Atlas page and noindex');

      for (const [path, label, indexable] of [
        ['/', 'home', true],
        ['/laos', 'Laos', true],
        ...publishedCityRoutes.map((path) => [path, path, true]),
      ]) {
        const response = await request(path);
        assert(response.status === 200, `${label} returned HTTP ${response.status}`);
        assert(!/noindex/i.test(response.headers.get('x-robots-tag') ?? '') || !indexable,
          `${label} blocked by X-Robots-Tag: ${response.headers.get('x-robots-tag')}`);
        verifyPage(`live ${label}`, response.html, `${origin}${path}`, indexable);
        console.log(`HTTP status ${response.status}, X-Robots-Tag: ${response.headers.get('x-robots-tag') || '(none)'}`);
      }
      const robotResponse = await request('/robots.txt');
      assert(robotResponse.status === 200, 'Live robots.txt returned HTTP ' + robotResponse.status);
      assert(robotResponse.html.includes('Sitemap: ' + origin + '/sitemap.xml'),
        'Live robots.txt missing production sitemap announcement');
      assert(/^Allow: \/$/m.test(robotResponse.html), 'Live robots.txt should allow crawlers');
      assert(!/^Disallow: \/$/m.test(robotResponse.html), 'Live robots.txt blocks all crawlers');

      const mapResponse = await request('/sitemap.xml');
      assert(mapResponse.status === 200, 'Live sitemap.xml returned HTTP ' + mapResponse.status);
      assert(mapResponse.html.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'),
        'Live sitemap.xml missing XML namespace');
      const liveUrls = [...mapResponse.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
      assert(liveUrls.includes(origin + '/'), 'Live sitemap.xml missing homepage');
      assert(liveUrls.includes(origin + '/laos'), 'Live sitemap.xml missing Laos');
      for (const path of publishedCityRoutes) {
        assert(liveUrls.includes(origin + path), 'Live sitemap.xml missing approved page ' + path);
      }
      assert(!liveUrls.includes(origin + '/404'), 'Live sitemap.xml lists 404');
      assert(liveUrls.length > publishedCityRoutes.length + 2, 'Live sitemap.xml lacks approved city activities');
      assert(liveUrls.length === new Set(liveUrls).size, 'Live sitemap.xml has duplicate URLs');
      console.log('PASS live robots.txt and sitemap.xml with ' + liveUrls.length + ' published URLs');

      console.log('PASS production HTML, HTTP status and meta robots checks');
      process.exit(0);
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt}/${attempts}: ${error.message}`);
      if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, pauseMs));
    }
  }
  throw lastError;
} else {
  throw new Error('Usage: node scripts/verify-seo-publication.mjs build index|noindex OR live');
}
