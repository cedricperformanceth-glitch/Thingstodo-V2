import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const origin = 'https://thingstodoatlas-v2.pages.dev';
const mode = process.argv[2];
const expectIndexing = process.argv[3] === 'index';

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

if (mode === 'build') {
  verifyPage('home', output('/'), `${origin}/`, expectIndexing);
  verifyPage('Laos', output('/laos'), `${origin}/laos`, expectIndexing);
  verifyPage('Don Det', output('/laos/don-det'), `${origin}/laos/don-det`, expectIndexing);
  verifyPage('Pakse unpublished', output('/laos/pakse'), `${origin}/laos/pakse`, false);
  const notFound = output('/404');
  assert(/This page took a different road\./.test(notFound), 'Missing Atlas 404 body');
  assert(/noindex/i.test(robots(notFound)), '404 should explicitly noindex');
  console.log('PASS 404.html exists and is non-indexable');
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
        ['/laos/don-det', 'Don Det', true],
        ['/laos/pakse', 'Pakse unpublished', false],
      ]) {
        const response = await request(path);
        assert(response.status === 200, `${label} returned HTTP ${response.status}`);
        assert(!/noindex/i.test(response.headers.get('x-robots-tag') ?? '') || !indexable,
          `${label} blocked by X-Robots-Tag: ${response.headers.get('x-robots-tag')}`);
        verifyPage(`live ${label}`, response.html, `${origin}${path}`, indexable);
        console.log(`HTTP status ${response.status}, X-Robots-Tag: ${response.headers.get('x-robots-tag') || '(none)'}`);
      }
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
