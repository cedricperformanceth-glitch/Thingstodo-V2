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
  if (photo?.sourceType !== 'wikimedia') errors.push('automatic photo source must be Wikimedia Commons');
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

function photoKey(photo) {
  return clean(photo?.sourceUrl || photo?.src).toLowerCase();
}

function qualifiedAutomaticPhotos(candidate) {
  const current = existingImage(candidate);
  const candidates = [...(candidate?.photoCandidates ?? [])];
  if (current?.src && current.manual !== true) candidates.unshift(current);
  const seen = new Set();
  return candidates
    .map((photo) => ({ photo, validation: validateAutomaticPhotoCandidate(photo) }))
    .filter(({ validation }) => validation.valid)
    .map(({ photo }) => photo)
    .filter((photo) => {
      const key = photoKey(photo);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(compareScore);
}

function toMediaRecord(photo, candidateName) {
  const license = normalizedLicense(photo.license);
  return {
    id: clean(photo.id) || `spa-card-${clean(candidateName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
    src: clean(photo.src),
    alt: clean(photo.alt) || candidateName,
    sourceType: 'wikimedia',
    sourceUrl: clean(photo.sourceUrl),
    sourceName: 'Wikimedia Commons',
    ...(clean(photo.author) ? { author: clean(photo.author) } : {}),
    ...(license ? { license } : {}),
    manual: photo.manual === true,
    locked: photo.locked === true,
  };
}

function toActivityReserveRecord(photo, candidateName) {
  return {
    ...toMediaRecord(photo, candidateName),
    width: Number(photo.width),
    height: Number(photo.height),
    subjectConfidence: Number(photo.subjectConfidence),
    sourceConfidence: Number(photo.sourceConfidence),
  };
}

function mergeActivityPhotoReserve(existing = [], incoming = []) {
  const seen = new Set();
  const maximum = contract.selection.entityModes.thingToDo.reusableReserveMaximum;
  return [...existing, ...incoming].filter((photo) => {
    const key = photoKey(photo);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, maximum);
}

function mergeDistinctPhotos(existing = [], incoming = [], maximum = 3) {
  const seen = new Set();
  return [...existing, ...incoming].filter((photo) => {
    const key = photoKey(photo);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, maximum);
}

export function selectSpaCardPhoto(candidate) {
  const current = existingImage(candidate);
  if (current?.src && current.manual === true) {
    return { status: 'selected', reason: 'manual-photo', image: structuredClone(current), requiresManualFill: false };
  }

  const qualified = qualifiedAutomaticPhotos(candidate);
  if (!qualified.length) {
    return { status: 'missing', reason: 'no-qualified-photo', image: null, requiresManualFill: true };
  }

  return { status: 'selected', reason: 'qualified-photo', image: toMediaRecord(qualified[0], candidate?.name ?? 'Atlas place'), requiresManualFill: false };
}

export function applySpaCardPhotoSelection(candidate, options = {}) {
  const result = selectSpaCardPhoto(candidate);
  const next = structuredClone(candidate);
  const entityKind = options.entityKind ?? (candidate?.category === 'things-to-do' ? 'thing-to-do' : 'place');
  next.spaCard ??= {};
  next.spaCard.photoStatus = result.status === 'selected' ? 'verified' : 'missing';
  next.spaCard.photoRequiresManualFill = result.requiresManualFill;

  next.media ??= {};
  next.media.card ??= {};
  if (result.image) next.media.card.image = result.image;
  else delete next.media.card.image;

  if (next.media.research?.firstPartyPhotoLeads) delete next.media.research.firstPartyPhotoLeads;

  if (entityKind === 'thing-to-do') {
    const qualified = qualifiedAutomaticPhotos(candidate);
    const generatedGallery = qualified.map((photo) => toMediaRecord(photo, candidate?.name ?? 'Atlas activity'));
    const protectedGallery = (next.media.fieldCard?.gallery ?? []).filter((photo) => photo?.manual === true && photo?.locked === true);
    const primary = result.image ? [result.image] : [];
    const gallery = mergeDistinctPhotos(protectedGallery, [...primary, ...generatedGallery], contract.selection.entityModes.thingToDo.publicFieldCardPhotoMaximum ?? 3);
    if (gallery.length) {
      next.media.fieldCard ??= {};
      next.media.fieldCard.gallery = gallery;
    } else if (next.media.fieldCard?.gallery) {
      delete next.media.fieldCard.gallery;
    }
    const selectedKeys = new Set(gallery.map(photoKey));
    const reserve = qualified
      .filter((photo) => !selectedKeys.has(photoKey(photo)))
      .map((photo) => toActivityReserveRecord(photo, candidate?.name ?? 'Atlas activity'));
    const mergedReserve = mergeActivityPhotoReserve(next.media.research?.activityPhotoReserve, reserve);
    if (mergedReserve.length) {
      next.media.research ??= {};
      next.media.research.activityPhotoReserve = mergedReserve;
    } else if (next.media.research?.activityPhotoReserve) {
      delete next.media.research.activityPhotoReserve;
    }
  } else if (next.media.research?.activityPhotoReserve) {
    delete next.media.research.activityPhotoReserve;
  }

  if (next.media.research && Object.keys(next.media.research).length === 0) delete next.media.research;
  if ('image' in next && !result.image) delete next.image;
  if (result.image && 'image' in next) next.image = result.image;
  delete next.photoCandidates;
  return { ...result, candidate: next };
}
