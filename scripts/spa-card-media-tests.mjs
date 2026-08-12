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

const lowerConfidence = { ...commonsPhoto, id: 'lower', src: '/assets/lower.webp', subjectConfidence: .9, sourceConfidence: .8 };
const higherConfidence = { ...commonsPhoto, id: 'higher', src: '/assets/higher.webp', subjectConfidence: 1, sourceConfidence: .9 };
assert.equal(selectSpaCardPhoto({ ...base, photoCandidates: [lowerConfidence, higherConfidence] }).image.src, '/assets/higher.webp');

const manual = {
  id: 'manual-photo', src: '/assets/manual.webp', alt: 'Manual photo', sourceType: 'manual', manual: true, locked: true,
};
const manualResult = selectSpaCardPhoto({ ...base, media: { card: { image: manual } }, photoCandidates: [commonsPhoto] });
assert.equal(manualResult.reason, 'manual-photo');
assert.equal(manualResult.image.src, '/assets/manual.webp');

const legacyAutomaticWithoutProof = {
  id: 'legacy-auto', src: '/assets/legacy.webp', alt: 'Old auto image', sourceType: 'open-license',
  sourceUrl: 'https://example.org/photo', license: 'CC BY 4.0', author: 'Author', manual: false, locked: false,
};
assert.equal(selectSpaCardPhoto({ ...base, media: { card: { image: legacyAutomaticWithoutProof } } }).status, 'missing');

const missing = applySpaCardPhotoSelection({ ...base });
assert.equal(missing.status, 'missing');
assert.equal(missing.candidate.spaCard.photoStatus, 'missing');
assert.equal(missing.candidate.spaCard.photoRequiresManualFill, true);
assert.equal(missing.candidate.media.card.image, undefined);

const firstPartyLead = {
  id: 'first-party-facebook-mekong-garden-1',
  entityName: 'Mekong Garden Café',
  cityName: 'Atlas Town',
  sourceType: 'facebook',
  sourceName: 'Official Facebook',
  sourceUrl: 'https://www.facebook.com/mekonggarden/',
  imageUrl: 'https://cdn.example/mekong-garden.jpg',
  identityConfidence: .95,
  pageFetched: true,
  discoveryStatus: 'image-found',
  rightsStatus: 'unconfirmed-first-party',
  autoPublishable: false,
  editorialAction: 'review-rights-before-use',
  score: 89,
};
const withLead = applySpaCardPhotoSelection({ ...base, photoCandidates: [firstPartyLead] });
assert.equal(withLead.status, 'missing', 'first-party lead must not become an automatic card photo');
assert.equal(withLead.candidate.spaCard.photoStatus, 'missing');
assert.equal(withLead.candidate.media.research.firstPartyPhotoLeads.length, 1);
assert.equal(withLead.candidate.media.research.firstPartyPhotoLeads[0].imageUrl, firstPartyLead.imageUrl);
assert.equal('photoCandidates' in withLead.candidate, false);

const applied = applySpaCardPhotoSelection({ ...base, photoCandidates: [commonsPhoto, firstPartyLead] });
assert.equal(applied.candidate.spaCard.photoStatus, 'verified');
assert.equal(applied.candidate.spaCard.photoRequiresManualFill, false);
assert.equal(applied.candidate.media.card.image.src, commonsPhoto.src);
assert.equal(applied.candidate.media.research.firstPartyPhotoLeads.length, 1, 'editorial lead should survive even when a reusable photo is selected');
assert.equal('photoCandidates' in applied.candidate, false);

console.log('SPA card media selection tests passed.');
