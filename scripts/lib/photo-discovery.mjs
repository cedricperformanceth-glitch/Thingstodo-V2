import { discoverFirstPartyPhotoLeads } from './first-party-photo-discovery.mjs';

const OPENVERSE_ENDPOINT = 'https://api.openverse.org/v1/images/';
const COMMONS_API_ENDPOINT = 'https://commons.wikimedia.org/w/api.php';
const PLACE_REUSABLE_LIMIT = 12;
const ACTIVITY_REUSABLE_LIMIT = 24;
const clean = (value) => String(value ?? '').trim();
const normalize = (value) => clean(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const stripHtml = (value) => clean(value).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();

function exactNameConfidence(candidateName, title, tags = '') {
  const name = normalize(candidateName);
  if (!name) return 0;
  const corpus = `${normalize(title)} ${normalize(Array.isArray(tags) ? tags.join(' ') : tags)}`;
  if (corpus.includes(name)) return .95;
  const significant = name.split(' ').filter((token) => token.length >= 4);
  if (significant.length >= 2 && significant.every((token) => corpus.includes(token))) return .9;
  return 0;
}

function acceptedOpenverseLicense(license) {
  return ['by', 'by-sa', 'cc0', 'pdm', 'publicdomain'].includes(clean(license).toLowerCase());
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
  const response = await fetchImpl(url, { headers: { Accept: 'application/json', 'User-Agent': 'ThingsToDoAtlas/1.0 photo research' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function commonsFileTitle(sourceUrl) {
  try {
    const url = new URL(sourceUrl);
    if (url.hostname !== 'commons.wikimedia.org') return '';
    const prefix = '/wiki/';
    if (!url.pathname.startsWith(prefix)) return '';
    const title = decodeURIComponent(url.pathname.slice(prefix.length)).replace(/_/g, ' ');
    return /^File:/i.test(title) ? title : '';
  } catch {
    return '';
  }
}

async function sourceVerifiedCommonsPhoto(result, candidate, subjectConfidence, fetchImpl) {
  const sourceUrl = clean(result.foreign_landing_url);
  const title = commonsFileTitle(sourceUrl);
  if (!title) return null;
  const params = new URLSearchParams({
    action: 'query', format: 'json', origin: '*', prop: 'imageinfo', titles: title,
    iiprop: 'url|size|extmetadata', iiurlwidth: '1600'
  });
  const data = await jsonFetch(`${COMMONS_API_ENDPOINT}?${params}`, fetchImpl);
  const page = Object.values(data?.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  const metadata = info.extmetadata ?? {};
  const license = compatibleLicenseLabel(metadata?.LicenseShortName?.value);
  const author = stripHtml(metadata?.Artist?.value) || clean(result.creator);
  const src = clean(info.thumburl || info.url);
  const width = Number(info.thumbwidth ?? info.width);
  const height = Number(info.thumbheight ?? info.height);
  if (!license || !src || !Number.isFinite(width) || !Number.isFinite(height)) return null;
  return {
    id: `openverse-${clean(result.id || result.identifier || candidate.id || candidate.name)}`,
    src,
    alt: clean(result.title) || candidate.name,
    sourceType: 'wikimedia',
    sourceUrl,
    sourceName: 'Wikimedia Commons via Openverse',
    author,
    license,
    width,
    height,
    subjectVerified: true,
    subjectConfidence,
    sourceConfidence: 1,
    manual: false,
    locked: false
  };
}

function positiveInteger(value, fallback, maximum) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) return fallback;
  return Math.min(number, maximum);
}

export async function discoverOpenversePhotos(candidate, context = {}, fetchImpl = globalThis.fetch, options = {}) {
  if (typeof fetchImpl !== 'function') return [];
  const query = [candidate?.name, context?.cityName, context?.countryName ?? context?.country].filter(Boolean).join(' ');
  if (!clean(query)) return [];

  const maxResults = positiveInteger(options.maxResults, PLACE_REUSABLE_LIMIT, ACTIVITY_REUSABLE_LIMIT);
  const pageSize = positiveInteger(options.pageSize, maxResults > PLACE_REUSABLE_LIMIT ? 20 : 12, 50);
  const maxPages = positiveInteger(options.maxPages, maxResults > PLACE_REUSABLE_LIMIT ? 3 : 1, 5);
  const photos = [];
  const seen = new Set();

  try {
    for (let page = 1; page <= maxPages && photos.length < maxResults; page += 1) {
      const params = new URLSearchParams({
        q: `"${candidate.name}" ${context.cityName ?? ''}`.trim(),
        license: 'by,by-sa,cc0,pdm',
        page_size: String(pageSize),
        page: String(page),
      });
      const data = await jsonFetch(`${OPENVERSE_ENDPOINT}?${params}`, fetchImpl);
      const results = data?.results ?? [];
      if (!results.length) break;

      for (const result of results) {
        if (!acceptedOpenverseLicense(result.license)) continue;
        const confidence = exactNameConfidence(candidate.name, result.title, (result.tags ?? []).map((tag) => tag?.name));
        if (confidence < .9) continue;
        const verified = await sourceVerifiedCommonsPhoto(result, candidate, confidence, fetchImpl);
        if (!verified) continue;
        const key = clean(verified.sourceUrl || verified.src).toLowerCase();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        photos.push(verified);
        if (photos.length >= maxResults) break;
      }
      if (results.length < pageSize) break;
    }
    return photos;
  } catch {
    return photos;
  }
}

function dedupePhotos(photos) {
  const seen = new Set();
  return photos.filter((photo) => {
    const key = clean(photo.sourceUrl || photo.src).toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key); return true;
  });
}

export async function discoverPhotoCandidates(candidate, context = {}, options = {}) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const activityMode = options.mode === 'activity';
  const reusableLimit = activityMode ? ACTIVITY_REUSABLE_LIMIT : PLACE_REUSABLE_LIMIT;
  const [openverse, firstPartyLeads] = await Promise.all([
    discoverOpenversePhotos(candidate, context, fetchImpl, {
      maxResults: reusableLimit,
      pageSize: activityMode ? 20 : 12,
      maxPages: activityMode ? 3 : 1,
    }),
    discoverFirstPartyPhotoLeads(candidate, context, fetchImpl),
  ]);
  const reusable = dedupePhotos(openverse).slice(0, reusableLimit);
  return [...reusable, ...firstPartyLeads];
}
