const COMMONS_API_ENDPOINT = 'https://commons.wikimedia.org/w/api.php';
const PLACE_REUSABLE_LIMIT = 8;
const ACTIVITY_REUSABLE_LIMIT = 24;
const clean = (value) => String(value ?? '').trim();
const normalize = (value) => clean(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const stripHtml = (value) => clean(value).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&#39;/g, "'").replace(/&quot;/gi, '"').replace(/\s+/g, ' ').trim();

function exactNameConfidence(candidateName, ...values) {
  const name = normalize(candidateName);
  if (!name) return 0;
  const corpus = values.map(normalize).join(' ');
  if (corpus.includes(name)) return .95;
  const significant = name.split(' ').filter((token) => token.length >= 4);
  if (significant.length >= 2 && significant.every((token) => corpus.includes(token))) return .9;
  return 0;
}

function compatibleLicenseLabel(value) {
  const license = clean(value);
  const normalized = license.toLowerCase().replace(/_/g, '-');
  if (!normalized || normalized.includes('noncommercial') || normalized.includes('no derivatives') || normalized.includes('no-derivatives') || normalized.includes('cc by-nc') || normalized.includes('cc-by-nc') || normalized.includes('cc by-nd') || normalized.includes('cc-by-nd')) return '';
  if (normalized.includes('public domain') || normalized === 'pd' || normalized.startsWith('public-domain')) return 'Public Domain';
  if (normalized.includes('cc0')) return license;
  if (normalized.includes('cc by-sa') || normalized.includes('cc-by-sa')) return license;
  if (normalized.includes('cc by') || normalized.includes('cc-by')) return license;
  return '';
}

async function jsonFetch(url, fetchImpl) {
  const response = await fetchImpl(url, { headers: { Accept: 'application/json', 'User-Agent': 'ThingsToDoAtlas/1.0 Wikimedia Commons photo search' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function commonsSourceUrl(page) {
  if (clean(page?.canonicalurl)) return clean(page.canonicalurl);
  const title = clean(page?.title).replace(/ /g, '_');
  if (!title) return '';
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(title).replace(/^File%3A/i, 'File:')}`;
}

function pageToPhoto(page, candidate) {
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  const metadata = info.extmetadata ?? {};
  const description = stripHtml(metadata?.ImageDescription?.value);
  const objectName = stripHtml(metadata?.ObjectName?.value);
  const categories = stripHtml(metadata?.Categories?.value);
  const subjectConfidence = exactNameConfidence(candidate?.name, page?.title, objectName, description, categories);
  if (subjectConfidence < .9) return null;

  const license = compatibleLicenseLabel(metadata?.LicenseShortName?.value);
  const author = stripHtml(metadata?.Artist?.value);
  const src = clean(info.thumburl || info.url);
  const width = Number(info.thumbwidth ?? info.width);
  const height = Number(info.thumbheight ?? info.height);
  const sourceUrl = commonsSourceUrl(page);
  if (!license || !src || !sourceUrl || !Number.isFinite(width) || !Number.isFinite(height)) return null;

  return {
    id: `commons-${page.pageid ?? clean(candidate?.id || candidate?.name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    src,
    alt: objectName || stripHtml(page?.title).replace(/^File:/i, '').replace(/_/g, ' ') || candidate.name,
    sourceType: 'wikimedia',
    sourceUrl,
    sourceName: 'Wikimedia Commons',
    author,
    license,
    width,
    height,
    subjectVerified: true,
    subjectConfidence,
    sourceConfidence: 1,
    manual: false,
    locked: false,
  };
}

function dedupePhotos(photos) {
  const seen = new Set();
  return photos.filter((photo) => {
    const key = clean(photo?.sourceUrl || photo?.src).toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function discoverWikimediaCommonsPhotos(candidate, context = {}, fetchImpl = globalThis.fetch, options = {}) {
  if (typeof fetchImpl !== 'function' || !clean(candidate?.name)) return [];
  const limit = Math.max(1, Math.min(50, Number(options.maxResults) || PLACE_REUSABLE_LIMIT));
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrnamespace: '6',
    gsrsearch: `"${candidate.name}" ${context?.cityName ?? ''}`.trim(),
    gsrlimit: String(limit),
    prop: 'info|imageinfo',
    inprop: 'url',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '1600',
  });

  try {
    const data = await jsonFetch(`${COMMONS_API_ENDPOINT}?${params}`, fetchImpl);
    const pages = Object.values(data?.query?.pages ?? {}).sort((a, b) => Number(a?.index ?? 0) - Number(b?.index ?? 0));
    return dedupePhotos(pages.map((page) => pageToPhoto(page, candidate)).filter(Boolean)).slice(0, limit);
  } catch {
    return [];
  }
}

export async function discoverPhotoCandidates(candidate, context = {}, options = {}) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const activityMode = options.mode === 'activity';
  return discoverWikimediaCommonsPhotos(candidate, context, fetchImpl, {
    maxResults: activityMode ? ACTIVITY_REUSABLE_LIMIT : PLACE_REUSABLE_LIMIT,
  });
}
