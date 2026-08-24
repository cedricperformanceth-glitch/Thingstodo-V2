import assert from 'node:assert/strict';
import { applySpaCardPhotoSelection, selectSpaCardPhoto, validateAutomaticPhotoCandidate } from './lib/spa-card-media.mjs';

const base = {
  name: 'Mekong Garden Café',
  spaCard: { handwrittenTags: ['Riverside', 'Easy stop', 'Morning'] },
};

const commonsPhoto = {
  id: 'commons-mekong-garden',
  src: '/assets/generated/mekong-garden.webp',
  alt: 'Mekong Garden Café',
  sourceType: 'wikimedia',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Example.jpg',
  sourceName: 'Wikimedia Commons',
  author: 'Example Author',
  license: 'CC BY-SA 4.0',
  width: 1600,
  height: 1000,
  subjectVerified: true,
  subjectConfidence: 1,
  sourceConfidence: 1,
  manual: false,
  locked: false,
};

assert.equal(validateAutomaticPhotoCandidate(commonsPhoto).valid, true);
const selected = selectSpaCardPhoto({ ...base, photoCandidates: [commonsPhoto] });
assert.equal(selected.status, 'selected');
assert.equal(selected.requiresManualFill, false);
assert.equal(selected.image.license, 'cc-by-sa');
assert.equal(selected.image.author, 'Example Author');
assert.equal(selected.image.sourceName, 'Wikimedia Commons');

const uncertainSubject = { ...commonsPhoto, id: 'uncertain', subjectVerified: false };
assert.equal(validateAutomaticPhotoCandidate(uncertainSubject).valid, false);
assert.equal(selectSpaCardPhoto({ ...base, photoCandidates: [uncertainSubject] }).status, 'missing');

const lowSubjectConfidence = { ...commonsPhoto, id: 'low-subject-confidence', subjectConfidence: .89 };
assert.equal(validateAutomaticPhotoCandidate(lowSubjectConfidence).valid, false);

const lowSourceConfidence = { ...commonsPhoto, id: 'low-source-confidence', sourceConfidence: .74 };
assert.equal(validateAutomaticPhotoCandidate(lowSourceConfidence).valid, false);

const nonCommercial = { ...commonsPhoto, id: 'nc', license: 'CC BY-NC-SA 4.0' };
assert.equal(validateAutomaticPhotoCandidate(nonCommercial).valid, false);
assert.equal(selectSpaCardPhoto({ ...base, photoCandidates: [nonCommercial] }).status, 'missing');

const unknownLicense = { ...commonsPhoto, id: 'unknown', license: '' };
assert.equal(validateAutomaticPhotoCandidate(unknownLicense).valid, false);

const tooSmall = { ...commonsPhoto, id: 'small', width: 320, height: 200 };
assert.equal(validateAutomaticPhotoCandidate(tooSmall).valid, false);

const wrongAutomaticSource = { ...commonsPhoto, id: 'wrong-source', sourceType: 'public-domain' };
assert.equal(validateAutomaticPhotoCandidate(wrongAutomaticSource).valid, false, 'automatic discovery is Commons-only');

const lowerConfidence = {
  ...commonsPhoto,
  id: 'lower',
  src: '/assets/lower.webp',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lower.jpg',
  subjectConfidence: .9,
  sourceConfidence: .8,
};
const higherConfidence = {
  ...commonsPhoto,
  id: 'higher',
  src: '/assets/higher.webp',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Higher.jpg',
  subjectConfidence: 1,
  sourceConfidence: .9,
};
assert.equal(selectSpaCardPhoto({ ...base, photoCandidates: [lowerConfidence, higherConfidence] }).image.src, '/assets/higher.webp');

const manual = {
  id: 'manual-photo', src: '/assets/manual.webp', alt: 'Manual photo', sourceType: 'manual', manual: true, locked: true,
};
const manualResult = selectSpaCardPhoto({ ...base, media: { card: { image: manual } }, photoCandidates: [commonsPhoto] });
assert.equal(manualResult.reason, 'manual-photo');
assert.equal(manualResult.image.src, '/assets/manual.webp');

const missing = applySpaCardPhotoSelection({ ...base });
assert.equal(missing.status, 'missing');
assert.equal(missing.candidate.spaCard.photoStatus, 'missing');
assert.equal(missing.candidate.spaCard.photoRequiresManualFill, true);
assert.equal(missing.candidate.media.card.image, undefined);

const generalPlace = applySpaCardPhotoSelection({
  ...base,
  category: 'accommodation',
  photoCandidates: [higherConfidence, lowerConfidence],
}, { entityKind: 'place' });
assert.equal(generalPlace.candidate.media.card.image.src, higherConfidence.src, 'a general Place must use only the best Commons photo');
assert.equal(generalPlace.candidate.media.research?.activityPhotoReserve, undefined, 'general Places must not retain reusable photo surplus');
assert.equal('photoCandidates' in generalPlace.candidate, false);

const activity = applySpaCardPhotoSelection({
  ...base,
  category: 'things-to-do',
  photoCandidates: [lowerConfidence, higherConfidence, commonsPhoto],
}, { entityKind: 'thing-to-do' });
assert.equal(activity.candidate.media.card.image.src, commonsPhoto.src, 'activity SPA still has exactly one best primary photo');
assert.equal(activity.candidate.media.research, undefined, 'three qualified images are fully materialized in the Field Card gallery, leaving no surplus reserve');
assert.equal(activity.candidate.media.fieldCard.gallery.length, 3, 'activity Field Cards must receive up to three distinct qualified Commons images');
assert.deepEqual(activity.candidate.media.fieldCard.gallery.map((photo) => photo.src), [commonsPhoto.src, higherConfidence.src, lowerConfidence.src]);
assert.equal(new Set(activity.candidate.media.fieldCard.gallery.map((photo) => photo.sourceUrl)).size, 3, 'Field Card images must be distinct originals');

const activityWithManualPrimary = applySpaCardPhotoSelection({
  ...base,
  category: 'things-to-do',
  media: { card: { image: manual } },
  photoCandidates: [higherConfidence, lowerConfidence],
}, { entityKind: 'thing-to-do' });
assert.equal(activityWithManualPrimary.candidate.media.card.image.src, manual.src);
assert.equal(activityWithManualPrimary.candidate.media.fieldCard.gallery[0].src, manual.src, 'a locked manual primary remains the first Field Card image');
assert.equal(activityWithManualPrimary.candidate.media.fieldCard.gallery.length, 3, 'a manual primary can be complemented by two qualified Commons images');
assert.equal(activityWithManualPrimary.candidate.media.research, undefined, 'no reserve remains after the three public Field Card slots are filled');

const legacyLead = {
  ...base,
  media: { research: { firstPartyPhotoLeads: [{ sourceUrl: 'https://example.org' }] } },
};
const legacyCleaned = applySpaCardPhotoSelection(legacyLead);
assert.equal(legacyCleaned.candidate.media.research, undefined, 'legacy first-party photo metadata must be removed during generation');

console.log('SPA card Wikimedia Commons media selection tests passed.');
