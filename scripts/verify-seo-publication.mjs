import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const origin = 'https://thingstodoatlas.com';
const mode = process.argv[2];
const expectIndexing = process.argv[3] === 'index';
const googleVerificationFile = 'googleb482868e10aa0e46.html';
const googleVerificationContent = 'google-site-verification: googleb482868e10aa0e46.html';
const laosCities = ['don-det', 'luang-prabang', 'pakse', 'tad-lo', 'thakhek', 'vang-vieng', 'vientiane'];
const publishedCityRoutes = laosCities.flatMap((slug) => [`/laos/${slug}`, `/laos/${slug}/field-note`, `/laos/${slug}/things-to-do`]);
const publishedCountryFieldNoteRoutes = ['cambodia', 'thailand', 'vietnam'].map((slug) => `/field-notes/${slug}`);

function assert(condition, explanation) {
  if (!condition) throw new Error(explanation);
}

function robots(html) {
  const match = html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/i);
  return match?.[0] ?? '';
}

function* htmlFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(file);
    else if (entry.isFile() && entry.name.endsWith('.html')) yield file;
  }
}

function routeForHtml(file) {
  const name = relative('dist', file).split(sep).join('/');
  if (name === 'index.html') return '/';
  if (name.endsWith('/index.html')) return '/' + name.slice(0, -'/index.html'.length);
  return '/' + name.slice(0, -'.html'.length);
}

function verifyNoUnexpectedNoindex() {
  // These are utility or error documents, not public editorial landing pages.
  const intentionalNoindex = new Set(['/404', '/summary', '/adsterra/300x250']);
  const unexpected = [];

  for (const file of htmlFiles('dist')) {
    const route = routeForHtml(file);
    if (intentionalNoindex.has(route)) continue;
    const html = readFileSync(file, 'utf8');
    const hasNoindex = /<meta\b[^>]*\bname=["'](?:robots|googlebot)["'][^>]*\bcontent=["'][^"']*\bnoindex\b/i.test(html);
    if (hasNoindex) unexpected.push(route);
  }

  assert(unexpected.length === 0,
    'Published website pages must not contain noindex directives: ' + unexpected.join(', '));
  console.log('PASS all public HTML pages are indexable; only utility, error and ad execution pages remain noindex');
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

const nonAdvertisingRoutes = ['/404', '/summary', '/legal/cookie-policy', '/legal/privacy-policy', '/legal/legal-notice', '/legal/terms-of-use', '/legal/editorial-policy', '/legal/media-credits'];
const approvedAdRouteSamples = ['/laos/pakse/field-note', '/laos/don-det/things-to-do/cycle-don-det-don-khon'];

function verifyAdvertisingScope(path, html, eligible) {
  assert(!/AD PLACEHOLDER/i.test(html), path + ': public advertising placeholder must not appear');
  const eligibilityFlag = 'data-atlas-ads-eligible="' + (eligible ? 'true' : 'false') + '"';
  assert(html.includes(eligibilityFlag), path + ': expected ' + eligibilityFlag);
  const hasSlotMarkers = /<template\b[^>]*\bdata-atlas-ad-slot=/i.test(html);
  assert(hasSlotMarkers === eligible, path + ': reserved markers mismatch eligibility');

  const banners = [...html.matchAll(/<div\b[^>]*\bdata-atlas-ad-primary=[^>]*>/gi)].map(match => match[0]);
  const frames = [...html.matchAll(/<iframe\b[^>]*\bdata-atlas-ad-frame\b[^>]*>/gi)].map(match => match[0]);
  const expectedCount = !eligible ? 0 : path === '/laos/pakse/field-note' ? 4 : 1;
  assert(banners.length === expectedCount && frames.length === expectedCount,
    path + ': expected ' + expectedCount + ' isolated banner, found ' + banners.length + ' containers and ' + frames.length + ' frames');
  if (path === '/laos/pakse/field-note') {
    const expectedSlots = [
      'city-field-note-before-chapter-one',
      'city-field-note-after-chapter-two',
      'city-field-note-after-chapter-four',
      'city-field-note-after-chapter-seven',
    ];
    const actualSlots = banners.map(tag => tag.match(/data-atlas-ad-primary="([^"]+)"/)?.[1]);
    assert(actualSlots.join('|') === expectedSlots.join('|'),
      path + ': four banners must appear in editorial order: ' + actualSlots.join(', '));
  }

  // Advertising is independent of Google Analytics consent. A visitor who
  // rejects analytics still receives the editorial banner, including on desktop.
  assert(!html.includes('atlas.optionalAdvertisingConsent.v2'),
    path + ': obsolete advertising consent storage key remains');
  assert(!html.includes('data-consent-ads'),
    path + ': obsolete advertising consent checkbox remains');
  assert(html.includes('atlas.optionalAnalyticsConsent.v1'),
    path + ': Google Analytics consent must remain available');
  assert(html.includes('data-consent-analytics'),
    path + ': Google Analytics consent checkbox missing');
  assert(!html.includes('https://bauval.org/22/8ae25b964fbb4d4378a45891366f2143'),
    path + ': ad provider script must execute in the isolated page only');

  for (const banner of banners) {
    assert(!/\bhidden(?:\s|>|=)/i.test(banner), path + ': ad placement must not be hidden');
  }
  for (const frame of frames) {
    const sandbox = frame.match(/\bsandbox="([^"]+)"/i)?.[1] ?? '';
    const flags = new Set(sandbox.split(/\s+/));
    assert(flags.has('allow-scripts') && flags.has('allow-same-origin') && flags.has('allow-popups'),
      path + ': isolated ad document requires script, origin and click permissions');
    assert(!flags.has('allow-top-navigation') && !flags.has('allow-top-navigation-by-user-activation'),
      path + ': iframe must prohibit direct top-level ad redirects');
    assert(/\bsrc="\/adsterra\/300x250\/"/.test(frame),
      path + ': ad frame must load automatically without reading localStorage');
    assert(/\bloading="eager"/.test(frame),
      path + ': desktop ad frame must not be delayed with lazy loading');
    assert(!/\bdata-src=/.test(frame) && !/\bsrcdoc=/.test(frame),
      path + ': obsolete deferred frame source remains');
    assert(/\bwidth="300"/.test(frame) && /\bheight="250"/.test(frame),
      path + ': frame must remain 300x250');
  }
  assert(!/infolinks/i.test(html), path + ': obsolete ad provider must not appear');
  console.log('PASS ad scope ' + path + ': isolated frames=' + frames.length + ', automatic ads, GA consent only');
}

const socialBarScriptUrl = 'https://bauval.org/14/320dbfaae03e988a1b6e573d23b1dd58';

function verifySocialBarScope(path, html) {
  const expected = path === '/laos/pakse/field-note' ? 1 : 0;
  const count = html.split(socialBarScriptUrl).length - 1;
  assert(count === expected,
    path + ': expected ' + expected + ' Social Bar script, found ' + count);
  if (expected) {
    const scriptTag = html.match(/<script\b[^>]*src="https:\/\/bauval\.org\/14\/320dbfaae03e988a1b6e573d23b1dd58"[^>]*><\/script>/i)?.[0] ?? '';
    assert(scriptTag.includes('data-cfasync="false"'),
      path + ': Social Bar script missing Cloudflare bypass attribute');
    assert(html.indexOf(socialBarScriptUrl) > html.lastIndexOf('</main>') &&
      html.indexOf(socialBarScriptUrl) < html.lastIndexOf('</body>'),
      path + ': Social Bar script must be at the end of body, outside editorial content');
  }
  console.log('PASS Social Bar ' + path + ': script count=' + count);
}

function verifyAdExecutionDocument(html) {
  assert(/<meta\b[^>]*name="robots"[^>]*noindex/i.test(html),
    'Adsterra execution page must be noindex');
  assert(html.includes("key: '8ae25b964fbb4d4378a45891366f2143'") ||
    html.includes('8ae25b964fbb4d4378a45891366f2143'),
    'Adsterra execution page missing publisher key');
  assert(html.includes('https://bauval.org/22/8ae25b964fbb4d4378a45891366f2143'),
    'Adsterra execution page missing provider script');
  assert(html.includes('width: 300') && html.includes('height: 250'),
    'Adsterra execution page has wrong format');
  console.log('PASS 300x250 ad execution page: provider script in dedicated document');
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
    for (const required of ['/', '/laos', ...publishedCityRoutes, ...publishedCountryFieldNoteRoutes]) {
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

// Every indexable sitemap URL must be reachable by following ordinary HTML
// anchors from the homepage, without executing SPA JavaScript or relying only
// on Search Console's sitemap submission.
function verifyHtmlLinkDiscovery() {
  const sitemap = readFileSync(join('dist', 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const normalize = (path) => path === '/' ? path : path.replace(/\/+$/, '');
  const publishedPaths = new Set(urls.map((url) => normalize(new URL(url).pathname)));
  const discovered = new Set(['/']);
  const queue = ['/'];

  for (let index = 0; index < queue.length; index++) {
    const path = queue[index];
    const html = output(path);
    for (const match of html.matchAll(/<a\b[^>]*\bhref\s*=\s*(['"])(.*?)\1/gi)) {
      let parsed;
      try { parsed = new URL(match[2].replace(/&amp;/g, '&'), origin + path); }
      catch { continue; }
      if (parsed.origin !== origin) continue;
      const target = normalize(parsed.pathname);
      if (!publishedPaths.has(target) || discovered.has(target)) continue;
      discovered.add(target);
      queue.push(target);
    }
  }

  const missing = [...publishedPaths].filter((path) => !discovered.has(path));
  assert(missing.length === 0,
    'Indexable sitemap URLs without a crawlable HTML link path from homepage (' +
    missing.length + '): ' + missing.slice(0, 40).join(', '));
  console.log('PASS crawlable HTML links: all ' + publishedPaths.size +
    ' sitemap URLs are reachable from the homepage without JavaScript');
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
  for (const path of publishedCountryFieldNoteRoutes) {
    verifyPage(path, output(path), origin + path, expectIndexing);
  }
  const notFound = output('/404');
  assert(/This page took a different road\./.test(notFound), 'Missing Atlas 404 body');
  assert(/noindex/i.test(robots(notFound)), '404 should explicitly noindex');
  console.log('PASS 404.html exists and is non-indexable');
  for (const path of nonAdvertisingRoutes) {
    verifyAdvertisingScope(path, output(path), false);
  }
  for (const path of approvedAdRouteSamples) {
    verifyAdvertisingScope(path, output(path), true);
  }
  for (const path of [...nonAdvertisingRoutes, ...publishedCityRoutes, ...approvedAdRouteSamples]) {
    verifySocialBarScope(path, output(path));
  }
  verifyAdExecutionDocument(output('/adsterra/300x250'));
  const iconRedirects = readFileSync('dist/_redirects', 'utf8');
  assert(iconRedirects.includes('/favicon.ico /assets/navbar/things-to-do-atlas-logo-v2.webp 302'),
    'Conventional favicon fallback must not return 404');
  assert(output('/').includes('rel="icon"') && output('/').includes('things-to-do-atlas-logo-v2.webp'),
    'Main page must declare its existing brand favicon');
  const adHeaders = readFileSync('dist/_headers', 'utf8');
  assert(adHeaders.includes('/adsterra/300x250') && adHeaders.includes('Content-Security-Policy: sandbox'),
    'Adsterra ad route must retain its response-level sandbox');
  const verificationFile = join('dist', googleVerificationFile);
  assert(existsSync(verificationFile), 'Google Search Console verification file missing from build');
  assert(readFileSync(verificationFile, 'utf8').trim() === googleVerificationContent,
    'Google Search Console verification file content differs from expected');
  console.log('PASS Google Search Console HTML file included in build');
  verifySeoArtifacts(expectIndexing);
  if (expectIndexing) {
    verifyNoUnexpectedNoindex();
    verifyHtmlLinkDiscovery();
  }
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
      verifyAdvertisingScope('/404', missing.html, false);

      const faviconResponse = await fetch(origin + '/favicon.ico', {
        redirect: 'follow',
        signal: AbortSignal.timeout(15000),
      });
      assert(faviconResponse.status === 200 &&
        faviconResponse.url.endsWith('/assets/navbar/things-to-do-atlas-logo-v2.webp'),
        'Conventional favicon URL is not serving existing brand icon: ' +
        faviconResponse.status + ' ' + faviconResponse.url);
      console.log('PASS favicon: 200 via existing Atlas brand asset');

      const adResponse = await request('/adsterra/300x250/');
      assert(adResponse.status === 200, 'Adsterra execution page returned HTTP ' + adResponse.status);
      verifyAdExecutionDocument(adResponse.html);
      const adCsp = adResponse.headers.get('content-security-policy') ?? '';
      assert(/sandbox\s+allow-scripts\s+allow-same-origin/i.test(adCsp) &&
        /frame-ancestors\s+'self'/i.test(adCsp),
        'Live Adsterra execution page missing Cloudflare response sandbox at ' + adResponse.url + ': ' + adCsp);
      assert(/noindex/i.test(adResponse.headers.get('x-robots-tag') ?? ''),
        'Live Adsterra execution page must be noindex via HTTP header');

      // Check the current advertising policy, not just an old successful SEO deployment.
      // This fails on stale Cloudflare deployments and on accidental ad exposure.
      for (const path of [...nonAdvertisingRoutes.filter((p) => p !== '/404'), ...approvedAdRouteSamples]) {
        const response = await request(path);
        assert(response.status === 200, `ad scope ${path}: expected HTTP 200, got ${response.status}`);
        verifyAdvertisingScope(path, response.html, approvedAdRouteSamples.includes(path));
        verifySocialBarScope(path, response.html);
      }

      for (const [path, label, indexable] of [
        ['/', 'home', true],
        ['/laos', 'Laos', true],
        ...publishedCityRoutes.map((path) => [path, path, true]),
      ]) {
        const response = await request(path);
        assert(response.status === 200, `${label} returned HTTP ${response.status}`);
        assert(!/noindex/i.test(response.headers.get('x-robots-tag') ?? '') || !indexable,
          `${label} blocked by X-Robots-Tag: ${response.headers.get('x-robots-tag')}`);
        if (path === '/' || path === '/laos/pakse/field-note') {
          const beaconScripts = [...response.html.matchAll(/<script\b[^>]*\bsrc=['"]https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js['"][^>]*>/gi)];
          assert(beaconScripts.length === 1 && /data-cf-beacon=/.test(beaconScripts[0][0]),
            'Cloudflare Web Analytics beacon must be injected exactly once on ' + path);
          assert(!/(?:^|,)\s*no-transform\s*(?:,|$)/i.test(response.headers.get('cache-control') ?? ''),
            'Cloudflare Web Analytics injection is blocked by Cache-Control: no-transform on ' + path);
          console.log('PASS Cloudflare Web Analytics beacon injected on live ' + path);
        }
        verifyPage(`live ${label}`, response.html, `${origin}${path}`, indexable);
        verifySocialBarScope(path, response.html);
        // Require the new crawlable category navigation to reach production,
        // rather than passing against a stale Cloudflare deployment.
        if (path === '/laos/pakse') {
          assert(response.html.includes('href="/laos/pakse/things-to-do"'),
            'Live Pakse page has no crawlable category link, deploy may be stale');
        }
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

      const verificationResponse = await request('/' + googleVerificationFile);
      assert(verificationResponse.status === 200,
        'Google verification file returned HTTP ' + verificationResponse.status);
      assert(verificationResponse.html.trim() === googleVerificationContent,
        'Google verification file has unexpected live content');
      console.log('PASS live Google Search Console ownership verification file: HTTP 200, content correct');

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
