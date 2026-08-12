const OPENVERSE_ENDPOINT = 'https://api.openverse.org/v1/images/';
const FLICKR_ENDPOINT = 'https://www.flickr.com/services/rest/';
const clean = (value) => String(value ?? '').trim();
const normalize = (value) => clean(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

function exactNameConfidence(candidateName, title, tags = '') {
  const name = normalize(candidateName);
  if (!name) return 0;
  const corpus = `${normalize(title)} ${normalize(Array.isArray(tags) ? tags.join(' ') : tags)}`;
  if (corpus.includes(name)) return .95;
  const significant = name.split(' ').filter((token) => token.length >= 4);
  if (significant.length >= 2 && significant.every((token) => corpus.includes(token))) return .9;
  return 0;
}

function acceptedOpenverseLicense(license, version) {
  const slug = clean(license).toLowerCase();
  const suffix = clean(version) ? ` ${clean(version)}` : '';
  if (slug === 'by') return `CC BY${suffix}`;
  if (slug === 'by-sa') return `CC BY-SA${suffix}`;
  if (slug === 'cc0') return `CC0${suffix || ' 1.0'}`;
  if (slug === 'pdm' || slug === 'publicdomain') return 'Public Domain';
  return '';
}

async function jsonFetch(url, fetchImpl) {
  const response = await fetchImpl(url, { headers: { Accept: 'application/json', 'User-Agent': 'ThingsToDoAtlas/1.0 photo research' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function discoverOpenversePhotos(candidate, context = {}, fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') return [];
  const query = [candidate?.name, context?.cityName, context?.countryName ?? context?.country].filter(Boolean).join(' ');
  if (!clean(query)) return [];
  const params = new URLSearchParams({ q: `"${candidate.name}" ${context.cityName ?? ''}`.trim(), license: 'by,by-sa,cc0,pdm', page_size: '12' });
  try {
    const data = await jsonFetch(`${OPENVERSE_ENDPOINT}?${params}`, fetchImpl);
    return (data?.results ?? []).flatMap((result) => {
      const license = acceptedOpenverseLicense(result.license, result.license_version);
      const confidence = exactNameConfidence(candidate.name, result.title, (result.tags ?? []).map((tag) => tag?.name));
      const width = Number(result.width); const height = Number(result.height);
      const sourceUrl = clean(result.foreign_landing_url);
      const src = clean(result.url || result.thumbnail);
      if (!license || !src || !sourceUrl || confidence < .9 || !Number.isFinite(width) || !Number.isFinite(height)) return [];
      return [{
        id: `openverse-${clean(result.id || result.identifier || candidate.id || candidate.name)}`,
        src,
        alt: clean(result.title) || candidate.name,
        sourceType: 'openverse',
        sourceUrl,
        sourceName: `Openverse · ${clean(result.provider || result.source) || 'open media'}`,
        author: clean(result.creator),
        license,
        width,
        height,
        subjectVerified: true,
        subjectConfidence: confidence,
        sourceConfidence: .8,
        manual: false,
        locked: false
      }];
    });
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
  const [openverse, flickr] = await Promise.all([
    discoverOpenversePhotos(candidate, context, fetchImpl),
    discoverFlickrPhotos(candidate, context, fetchImpl, options.flickrApiKey ?? process.env.FLICKR_API_KEY)
  ]);
  return dedupePhotos([...flickr, ...openverse]).slice(0, 12);
}
