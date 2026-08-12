const clean = (value) => String(value ?? '').trim();
const normalize = (value) => clean(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const slugify = (value) => normalize(value).replace(/\s+/g, '-');

const BLOCKED_FIRST_PARTY_HOSTS = [
  'booking.com', 'agoda.com', 'tripadvisor.', 'expedia.', 'google.', 'maps.apple.',
  'hostelworld.', 'hotels.com', 'traveloka.', 'airbnb.',
];
const DECORATIVE_IMAGE_PATTERN = /(?:^|[\s/_-])(logo|icon|favicon|sprite|avatar|badge|flag|payment|visa|mastercard|arrow|close|loader|spinner|pixel|tracking|social)(?:[\s/_.-]|$)/i;

function validHttpUrl(value) {
  try {
    const url = new URL(clean(value));
    return ['http:', 'https:'].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

function sourceKind(url) {
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'facebook.com' || host.endsWith('.facebook.com') || host === 'fb.com') return 'facebook';
  if (host === 'instagram.com' || host.endsWith('.instagram.com')) return 'instagram';
  return 'official-website';
}

function isBlockedHost(url) {
  const host = url.hostname.toLowerCase();
  return BLOCKED_FIRST_PARTY_HOSTS.some((blocked) => host.includes(blocked));
}

function sourceEntry(value, fallbackName = '') {
  if (typeof value === 'string') return { sourceUrl: value, sourceName: fallbackName };
  if (!value || typeof value !== 'object') return null;
  return {
    sourceUrl: value.sourceUrl ?? value.url ?? value.href,
    sourceName: value.sourceName ?? value.name ?? fallbackName,
    imageUrl: value.imageUrl ?? value.image,
    firstParty: value.firstParty,
    sourceType: value.sourceType,
    purpose: value.purpose,
  };
}

function explicitFirstPartySource(source) {
  return source?.firstParty === true
    || source?.sourceType === 'first-party-official'
    || source?.sourceType === 'official-establishment'
    || source?.sourceType === 'first-party-social-network'
    || source?.purpose === 'first-party';
}

export function collectFirstPartySources(candidate) {
  const raw = [];
  for (const item of candidate?.firstPartySources ?? []) raw.push(sourceEntry(item));
  if (candidate?.officialWebsiteUrl) raw.push(sourceEntry(candidate.officialWebsiteUrl, 'Official website'));
  if (candidate?.websiteUrl) raw.push(sourceEntry(candidate.websiteUrl, 'Official website'));

  const social = candidate?.socialLinks ?? candidate?.socialUrls;
  if (Array.isArray(social)) {
    for (const item of social) raw.push(sourceEntry(item, 'Official social profile'));
  } else if (social && typeof social === 'object') {
    for (const [network, value] of Object.entries(social)) raw.push(sourceEntry(value, `Official ${network}`));
  }

  for (const source of [...(candidate?.sources ?? []), ...(candidate?.researchSources ?? [])]) {
    if (explicitFirstPartySource(source)) raw.push(sourceEntry(source));
  }

  const seen = new Set();
  const result = [];
  for (const source of raw.filter(Boolean)) {
    const url = validHttpUrl(source.sourceUrl);
    if (!url || isBlockedHost(url)) continue;
    const key = url.href.replace(/\/$/, '').toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const kind = sourceKind(url);
    result.push({
      sourceUrl: url.href,
      sourceName: clean(source.sourceName) || (kind === 'official-website' ? 'Official website' : `Official ${kind}`),
      sourceType: kind,
      ...(validHttpUrl(source.imageUrl) ? { imageUrl: validHttpUrl(source.imageUrl).href } : {}),
    });
  }
  return result;
}

function decodeHtml(value) {
  return clean(value)
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function attributes(tag) {
  const result = {};
  const regex = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  for (const match of tag.matchAll(regex)) result[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4]);
  return result;
}

function resolveUrl(value, baseUrl) {
  try {
    return validHttpUrl(new URL(decodeHtml(value), baseUrl).href)?.href ?? '';
  } catch {
    return '';
  }
}

function pageMetadata(html, baseUrl) {
  const meta = {};
  for (const tag of String(html ?? '').match(/<meta\b[^>]*>/gi) ?? []) {
    const attrs = attributes(tag);
    const key = clean(attrs.property || attrs.name).toLowerCase();
    if (key && attrs.content && !(key in meta)) meta[key] = attrs.content;
  }
  for (const tag of String(html ?? '').match(/<link\b[^>]*>/gi) ?? []) {
    const attrs = attributes(tag);
    const rel = clean(attrs.rel).toLowerCase();
    if (rel === 'image_src' && attrs.href && !meta.image_src) meta.image_src = attrs.href;
  }
  const titleMatch = String(html ?? '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = decodeHtml(meta['og:title'] || meta['twitter:title'] || titleMatch?.[1]);
  const rawImage = meta['og:image:secure_url'] || meta['og:image'] || meta['twitter:image'] || meta['twitter:image:src'] || meta.image_src;
  return { title, imageUrl: rawImage ? resolveUrl(rawImage, baseUrl) : '' };
}

function srcsetCandidate(value) {
  const candidates = clean(value).split(',').map((entry) => clean(entry).split(/\s+/)[0]).filter(Boolean);
  return candidates.at(-1) ?? '';
}

function isLikelyDecorativeImage(attrs, imageUrl) {
  const url = validHttpUrl(imageUrl);
  if (!url) return true;
  if (/\.(?:svg|ico)(?:$|\?)/i.test(url.pathname)) return true;
  const descriptor = `${url.pathname} ${attrs.alt ?? ''} ${attrs.title ?? ''} ${attrs.class ?? ''} ${attrs.id ?? ''}`;
  if (DECORATIVE_IMAGE_PATTERN.test(descriptor)) return true;
  const width = Number.parseInt(attrs.width, 10);
  const height = Number.parseInt(attrs.height, 10);
  if (Number.isFinite(width) && width > 0 && width < 320) return true;
  if (Number.isFinite(height) && height > 0 && height < 220) return true;
  return false;
}

function officialWebsitePageImages(html, baseUrl) {
  const images = [];
  const seen = new Set();
  for (const tag of String(html ?? '').match(/<img\b[^>]*>/gi) ?? []) {
    const attrs = attributes(tag);
    const raw = attrs['data-src'] || attrs['data-lazy-src'] || attrs.src || srcsetCandidate(attrs.srcset);
    const imageUrl = raw ? resolveUrl(raw, baseUrl) : '';
    if (!imageUrl || isLikelyDecorativeImage(attrs, imageUrl)) continue;
    const key = imageUrl.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    images.push(imageUrl);
    if (images.length >= 8) break;
  }
  return images;
}

function identityConfidence(candidateName, pageTitle, sourceUrl) {
  const name = normalize(candidateName);
  if (!name) return 0;
  const corpus = `${normalize(pageTitle)} ${normalize(sourceUrl)}`;
  if (corpus.includes(name)) return .95;
  const significant = name.split(' ').filter((token) => token.length >= 4);
  if (significant.length >= 2 && significant.every((token) => corpus.includes(token))) return .9;
  if (significant.length === 1 && corpus.includes(significant[0])) return .8;
  return .65;
}

async function fetchHtml(sourceUrl, fetchImpl) {
  try {
    const signal = typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(8000) : undefined;
    const response = await fetchImpl(sourceUrl, {
      redirect: 'follow',
      ...(signal ? { signal } : {}),
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'ThingsToDoAtlas/1.0 first-party media research',
      },
    });
    if (!response?.ok || typeof response.text !== 'function') return { ok: false, html: '', finalUrl: sourceUrl };
    const contentType = clean(response.headers?.get?.('content-type')).toLowerCase();
    if (contentType && !contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) return { ok: false, html: '', finalUrl: response.url || sourceUrl };
    return { ok: true, html: await response.text(), finalUrl: response.url || sourceUrl };
  } catch {
    return { ok: false, html: '', finalUrl: sourceUrl };
  }
}

function leadScore(lead) {
  return (lead.imageUrl ? 40 : 0)
    + Math.round((lead.identityConfidence ?? 0) * 30)
    + (lead.sourceType === 'official-website' ? 20 : 15)
    + (lead.pageFetched ? 5 : 0);
}

function dedupeLeads(leads) {
  const seen = new Set();
  return leads.filter((lead) => {
    const key = `${clean(lead.sourceUrl).toLowerCase()}|${clean(lead.imageUrl).toLowerCase()}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function makeLead(candidate, context, source, fetched, metadata, imageUrl, index) {
  const confidence = identityConfidence(candidate?.name, metadata.title, fetched.finalUrl || source.sourceUrl);
  const lead = {
    id: `first-party-${source.sourceType}-${slugify(candidate?.id || candidate?.name || 'entity')}-${index}`,
    entityName: clean(candidate?.name),
    cityName: clean(context?.cityName),
    sourceType: source.sourceType,
    sourceName: source.sourceName,
    sourceUrl: source.sourceUrl,
    ...(imageUrl ? { imageUrl } : {}),
    ...(metadata.title ? { pageTitle: metadata.title } : {}),
    identityConfidence: confidence,
    pageFetched: fetched.ok,
    discoveryStatus: imageUrl ? 'image-found' : 'page-found',
    rightsStatus: 'unconfirmed-first-party',
    autoPublishable: false,
    editorialAction: 'review-rights-before-use',
  };
  lead.score = leadScore(lead);
  return lead;
}

export async function discoverFirstPartyPhotoLeads(candidate, context = {}, fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') return [];
  const leads = [];
  for (const source of collectFirstPartySources(candidate)) {
    const fetched = await fetchHtml(source.sourceUrl, fetchImpl);
    const metadata = fetched.ok ? pageMetadata(fetched.html, fetched.finalUrl) : { title: '', imageUrl: '' };
    const imageUrls = [];
    if (source.imageUrl) imageUrls.push(source.imageUrl);
    if (metadata.imageUrl) imageUrls.push(metadata.imageUrl);
    if (fetched.ok && source.sourceType === 'official-website') imageUrls.push(...officialWebsitePageImages(fetched.html, fetched.finalUrl));
    const uniqueImages = [...new Set(imageUrls.filter(Boolean))].slice(0, 8);
    if (uniqueImages.length) {
      for (const imageUrl of uniqueImages) leads.push(makeLead(candidate, context, source, fetched, metadata, imageUrl, leads.length + 1));
    } else {
      leads.push(makeLead(candidate, context, source, fetched, metadata, '', leads.length + 1));
    }
  }
  return dedupeLeads(leads).sort((a, b) => b.score - a.score || a.sourceUrl.localeCompare(b.sourceUrl)).slice(0, 12);
}
