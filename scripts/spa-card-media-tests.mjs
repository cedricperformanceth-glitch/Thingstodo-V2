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

const uncertainSubject = { ...commonsPhoto, id: 'uncertain', subjectVerified: false };
assert.equal(validateAutomaticPhotoCandidate(uncertainSubject).valid, false);
assert.equal(selectSpaCardPhoto({ ...base, photoCandidates: [uncertainSubject] }).status, 'missing');

const nonCommercial = { ...commonsPhoto, id: 'nc', license: 'CC BY-NC-SA 4.0' };
assert.equal(validateAutomaticPhotoCandidate(nonCommercial).valid, false);
assert.equal(selectSpaCardPhoto({ ...base, photoCandidates: [nonCommercial] }).status, 'missing');

const unknownLicense = { ...commonsPhoto, id: 'unknown', license: '' };
assert.equal(validateAutomaticPhotoCandidate(unknownLicense).valid, false);

const tooSmall = { ...commonsPhoto, id: 'small', width: 320, height: 200 };
assert.equal(validateAutomaticPhotoCandidate(tooSmall).valid, false);

const lowerConfidence = { ...commonsPhoto, id: 'lower', src: '/assets/lower.webp', subjectConfidence: .8, sourceConfidence: .8 };
const higherConfidence = { ...commonsPhoto, id: 'higher', src: '/assets/higher.webp', subjectConfidence: 1, sourceConfidence: .9 };
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

const applied = applySpaCardPhotoSelection({ ...base, photoCandidates: [commonsPhoto] });
assert.equal(applied.candidate.spaCard.photoStatus, 'verified');
assert.equal(applied.candidate.spaCard.photoRequiresManualFill, false);
assert.equal(applied.candidate.media.card.image.src, commonsPhoto.src);
assert.equal('photoCandidates' in applied.candidate, false);

console.log('SPA card media selection tests passed.');
