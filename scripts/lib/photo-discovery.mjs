import { discoverFirstPartyPhotoLeads } from './first-party-photo-discovery.mjs';

const OPENVERSE_ENDPOINT = 'https://api.openverse.org/v1/images/';
const COMMONS_API_ENDPOINT = 'https://commons.wikimedia.org/w/api.php';
const FLICKR_ENDPOINT = 'https://www.flickr.com/services/rest/';
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

export async function discoverOpenversePhotos(candidate, context = {}, fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') return [];
  const query = [candidate?.name, context?.cityName, context?.countryName ?? context?.country].filter(Boolean).join(' ');
  if (!clean(query)) return [];
  const params = new URLSearchParams({ q: `"${candidate.name}" ${context.cityName ?? ''}`.trim(), license: 'by,by-sa,cc0,pdm', page_size: '12' });
  try {
    const data = await jsonFetch(`${OPENVERSE_ENDPOINT}?${params}`, fetchImpl);
    const photos = [];
    for (const result of data?.results ?? []) {
      if (!acceptedOpenverseLicense(result.license)) continue;
      const confidence = exactNameConfidence(candidate.name, result.title, (result.tags ?? []).map((tag) => tag?.name));
      if (confidence < .9) continue;
      const verified = await sourceVerifiedCommonsPhoto(result, candidate, confidence, fetchImpl);
      if (verified) photos.push(verified);
    }
    return photos;
  } catch {
    return [];
  }
}

function normalizedFlickrLicense(name, url) {
  const value = `${clean(name)} ${clean(url)}`.toLowerCase();
  if (!value || value.includes('noncommercial') || value.includes('no derivatives') || value.includes('noderivs')) return '';
  const version = value.match(/licenses\/(?:by|by-sa)\/(\d(?:\.\d)?)/)?.[1] ?? '2.0';
  if (value.includes('cc0') || value.includes('/publicdomain/zero/')) return 'CC0 1.0';
  if (value.includes('public domain') || value.includes('government work') || value.includes('/publicdomain/mark/')) return 'Public Domain';
  if (value.includes('sharealike') || value.includes('/by-sa/')) return `CC BY-SA ${version}`;
  if (value.includes('attribution') || value.includes('/by/')) return `CC BY ${version}`;
  return '';
}

async function flickrLicenses(apiKey, fetchImpl) {
  const params = new URLSearchParams({ method: 'flickr.photos.licenses.getInfo', api_key: apiKey, format: 'json', nojsoncallback: '1' });
  const data = await jsonFetch(`${FLICKR_ENDPOINT}?${params}`, fetchImpl);
  return new Map((data?.licenses?.license ?? []).flatMap((license) => {
    const normalized = normalizedFlickrLicense(license.name, license.url);
    return normalized ? [[String(license.id), normalized]] : [];
  }));
}

export async function discoverFlickrPhotos(candidate, context = {}, fetchImpl = globalThis.fetch, apiKey = process.env.FLICKR_API_KEY) {
  if (!clean(apiKey) || typeof fetchImpl !== 'function') return [];
  try {
    const licenses = await flickrLicenses(apiKey, fetchImpl);
    if (!licenses.size) return [];
    const params = new URLSearchParams({
      method: 'flickr.photos.search', api_key: apiKey, format: 'json', nojsoncallback: '1',
      text: [candidate?.name, context?.cityName].filter(Boolean).join(' '),
      license: [...licenses.keys()].join(','), sort: 'relevance', safe_search: '1', content_type: '1', media: 'photos', per_page: '12',
      extras: 'description,license,owner_name,geo,tags,o_dims,url_z,url_c,url_l,date_taken,last_update'
    });
    const latitude = Number(candidate?.coordinates?.latitude); const longitude = Number(candidate?.coordinates?.longitude);
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      params.set('lat', String(latitude)); params.set('lon', String(longitude)); params.set('radius', '1'); params.set('radius_units', 'km');
    }
    const data = await jsonFetch(`${FLICKR_ENDPOINT}?${params}`, fetchImpl);
    return (data?.photos?.photo ?? []).flatMap((photo) => {
      const confidence = exactNameConfidence(candidate.name, photo.title, `${photo.tags ?? ''} ${photo.description?._content ?? ''}`);
      const license = licenses.get(String(photo.license));
      const src = clean(photo.url_l || photo.url_c || photo.url_z);
      const width = Number(photo.width_l ?? photo.width_c ?? photo.width_z ?? photo.o_width);
      const height = Number(photo.height_l ?? photo.height_c ?? photo.height_z ?? photo.o_height);
      if (!license || !src || confidence < .9 || !Number.isFinite(width) || !Number.isFinite(height)) return [];
      return [{
        id: `flickr-${photo.id}`,
        src,
        alt: clean(photo.title) || candidate.name,
        sourceType: 'flickr',
        sourceUrl: `https://www.flickr.com/photos/${encodeURIComponent(photo.owner)}/${encodeURIComponent(photo.id)}/`,
        sourceName: 'Flickr',
        author: clean(photo.ownername) || clean(photo.owner),
        license,
        width,
        height,
        subjectVerified: true,
        subjectConfidence: confidence,
        sourceConfidence: .98,
        manual: false,
        locked: false
      }];
    });
  } catch {
    return [];
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
  const [openverse, flickr, firstPartyLeads] = await Promise.all([
    discoverOpenversePhotos(candidate, context, fetchImpl),
    discoverFlickrPhotos(candidate, context, fetchImpl, options.flickrApiKey ?? process.env.FLICKR_API_KEY),
    discoverFirstPartyPhotoLeads(candidate, context, fetchImpl),
  ]);
  const reusable = dedupePhotos([...flickr, ...openverse]).slice(0, 12);
  return [...reusable, ...firstPartyLeads];
}
