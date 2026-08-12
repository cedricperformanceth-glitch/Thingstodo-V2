import { readFileSync } from 'node:fs';

const contract = JSON.parse(readFileSync(new URL('../../pipeline/contracts/spa-card-media.json', import.meta.url), 'utf8'));

export const SPA_CARD_MEDIA_CONTRACT = contract;

const clean = (value) => String(value ?? '').trim();

function normalizedLicense(value) {
  const license = clean(value).toLowerCase().replace(/_/g, '-');
  if (!license) return '';
  if (license.includes('public domain') || license === 'pd' || license.startsWith('public-domain')) return 'public-domain';
  if (license.includes('cc0')) return 'cc0';
  if (license.includes('cc by-nc')) return license.includes('sa') ? 'cc-by-nc-sa' : license.includes('nd') ? 'cc-by-nc-nd' : 'cc-by-nc';
  if (license.includes('cc by-sa') || license.startsWith('cc-by-sa')) return 'cc-by-sa';
  if (license.includes('cc by') || license.startsWith('cc-by')) return 'cc-by';
  if (license.includes('all rights reserved')) return 'all-rights-reserved';
  return license;
}

function attributionRequired(license) {
  return license === 'cc-by' || license === 'cc-by-sa';
}

function existingImage(candidate) {
  return candidate?.image ?? candidate?.media?.card?.image ?? null;
}

export function validateAutomaticPhotoCandidate(photo) {
  const errors = [];
  if (!clean(photo?.src)) errors.push('photo src is required');
  if (photo?.subjectVerified !== true) errors.push('photo must be verified as the exact entity');
  const subjectConfidence = Number(photo?.subjectConfidence);
  const sourceConfidence = Number(photo?.sourceConfidence);
  if (!Number.isFinite(subjectConfidence) || subjectConfidence < contract.candidateRequirements.minimumSubjectConfidence) {
    errors.push(`photo subject confidence must be at least ${contract.candidateRequirements.minimumSubjectConfidence}`);
  }
  if (!Number.isFinite(sourceConfidence) || sourceConfidence < contract.candidateRequirements.minimumSourceConfidence) {
    errors.push(`photo source confidence must be at least ${contract.candidateRequirements.minimumSourceConfidence}`);
  }
  if (!clean(photo?.sourceUrl)) errors.push('external photo sourceUrl is required');
  const license = normalizedLicense(photo?.license);
  if (!contract.acceptedLicenses.includes(license)) errors.push(`photo license is not accepted: ${license || 'unknown'}`);
  if (!Number.isFinite(photo?.width) || photo.width < contract.candidateRequirements.minimumWidth) errors.push(`photo width must be at least ${contract.candidateRequirements.minimumWidth}px`);
  if (!Number.isFinite(photo?.height) || photo.height < contract.candidateRequirements.minimumHeight) errors.push(`photo height must be at least ${contract.candidateRequirements.minimumHeight}px`);
  if (attributionRequired(license) && !clean(photo?.author)) errors.push('photo author is required for attribution');
  return { valid: errors.length === 0, errors, license };
}

function score(photo) {
  const pixels = Math.max(0, Number(photo?.width) || 0) * Math.max(0, Number(photo?.height) || 0);
  return [
    photo?.locked === true ? 1 : 0,
    Math.max(0, Math.min(1, Number(photo?.subjectConfidence) || 0)),
    Math.max(0, Math.min(1, Number(photo?.sourceConfidence) || 0)),
    pixels,
    clean(photo?.sourceUrl) ? 1 : 0,
  ];
}

function compareScore(a, b) {
  const left = score(a);
  const right = score(b);
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return right[index] - left[index];
  }
  return clean(a?.src).localeCompare(clean(b?.src));
}

function toMediaRecord(photo, candidateName) {
  const license = normalizedLicense(photo.license);
  return {
    id: clean(photo.id) || `spa-card-${clean(candidateName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
    src: clean(photo.src),
    alt: clean(photo.alt) || candidateName,
    sourceType: photo.sourceType ?? 'open-license',
    ...(clean(photo.sourceUrl) ? { sourceUrl: clean(photo.sourceUrl) } : {}),
    ...(clean(photo.sourceName) ? { sourceName: clean(photo.sourceName) } : {}),
    ...(clean(photo.author) ? { author: clean(photo.author) } : {}),
    ...(license ? { license } : {}),
    manual: photo.manual === true,
    locked: photo.locked === true,
  };
}

function firstPartyPhotoLeads(candidate) {
  return (candidate?.photoCandidates ?? []).filter((photo) => photo?.autoPublishable === false && photo?.rightsStatus === 'unconfirmed-first-party');
}

function mergeFirstPartyPhotoLeads(existing = [], incoming = []) {
  const seen = new Set();
  return [...existing, ...incoming].filter((lead) => {
    const key = `${clean(lead?.sourceUrl).toLowerCase()}|${clean(lead?.imageUrl).toLowerCase()}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => Number(b?.score ?? 0) - Number(a?.score ?? 0)).slice(0, 12);
}

export function selectSpaCardPhoto(candidate) {
  const current = existingImage(candidate);
  if (current?.src && current.manual === true) {
    return { status: 'selected', reason: 'manual-photo', image: structuredClone(current), requiresManualFill: false };
  }

  const candidates = [...(candidate?.photoCandidates ?? [])];
  if (current?.src) candidates.unshift(current);

  const qualified = candidates
    .map((photo) => ({ photo, validation: validateAutomaticPhotoCandidate(photo) }))
    .filter(({ validation }) => validation.valid)
    .map(({ photo }) => photo)
    .sort(compareScore);

  if (!qualified.length) {
    return { status: 'missing', reason: 'no-qualified-photo', image: null, requiresManualFill: true };
  }

  return { status: 'selected', reason: 'qualified-photo', image: toMediaRecord(qualified[0], candidate?.name ?? 'Atlas place'), requiresManualFill: false };
}

export function applySpaCardPhotoSelection(candidate) {
  const result = selectSpaCardPhoto(candidate);
  const leads = firstPartyPhotoLeads(candidate);
  const next = structuredClone(candidate);
  next.spaCard ??= {};
  next.spaCard.photoStatus = result.status === 'selected' ? 'verified' : 'missing';
  next.spaCard.photoRequiresManualFill = result.requiresManualFill;

  next.media ??= {};
  next.media.card ??= {};
  if (result.image) next.media.card.image = result.image;
  else delete next.media.card.image;
  if (leads.length) {
    next.media.research ??= {};
    next.media.research.firstPartyPhotoLeads = mergeFirstPartyPhotoLeads(next.media.research.firstPartyPhotoLeads, leads);
  }
  if ('image' in next && !result.image) delete next.image;
  if (result.image && 'image' in next) next.image = result.image;
  delete next.photoCandidates;
  return { ...result, candidate: next };
}
