import assert from 'node:assert/strict';
import {
  buildSpaCardEditorialBrief,
  materializeSpaCardEditorial,
  normalizeBestTime,
  normalizeDuration,
  normalizeGettingThere,
  normalizeOpeningHours,
  validateSpaCardEditorialDraft,
  verifiedEditorialFacts,
} from './lib/spa-card-editorial.mjs';

const image = { src: '/assets/mekong-garden.webp' };
const placeCandidate = {
  name: 'Mekong Garden Café',
  googleMapsUrl: 'https://www.google.com/maps/place/Mekong+Garden+Cafe',
  media: { card: { image } },
};
const placeFacts = [
  { id: 'f-setting', verified: true, field: 'setting', text: 'The café has seating beside the Mekong River.' },
  { id: 'f-food', verified: true, field: 'offer', text: 'It serves coffee and light meals.' },
  { id: 'f-hours', verified: true, field: 'hours', text: 'Current opening hours are every day from 7:30 am to 6 pm.' },
  { id: 'ignored', verified: false, field: 'claim', text: 'It is the best café in town.' },
];

assert.equal(verifiedEditorialFacts(placeFacts).length, 3, 'Unverified facts must never enter the editorial brief');
const placeBrief = buildSpaCardEditorialBrief(placeCandidate, 'place', placeFacts);
assert.equal(placeBrief.scope, 'spa-card-editorial-only');
assert.equal(placeBrief.immutable.exactName, 'Mekong Garden Café');
assert.equal(placeBrief.instructions.hardRules.some((rule) => rule.includes('Field Card')), true);
assert.equal(placeBrief.verifiedFacts.some((fact) => fact.id === 'ignored'), false);

const placeDraft = {
  shortDescription: 'Coffee and light meals beside the Mekong, with riverside seating that makes this a pleasant pause during the day.',
  handwrittenTags: ['Riverside', 'Coffee break', 'Easy stop'],
  openingHours: 'Every day · 7:30 am - 6 pm',
  evidenceRefs: {
    shortDescription: ['f-setting', 'f-food'],
    handwrittenTags: [['f-setting'], ['f-food'], ['f-setting', 'f-food']],
    openingHours: ['f-hours'],
  },
};
assert.deepEqual(validateSpaCardEditorialDraft(placeDraft, 'place', placeFacts), { valid: true, errors: [] });
const materializedPlace = materializeSpaCardEditorial(placeCandidate, placeDraft, 'place', placeFacts);
assert.equal(materializedPlace.status, 'ready');
assert.equal(materializedPlace.candidate.spaCard.openingHours, 'Daily · 07:30–18:00');
assert.deepEqual(materializedPlace.candidate.spaCard.handwrittenTags, ['Riverside', 'Coffee break', 'Easy stop']);
assert.equal(materializedPlace.candidate.editorialEvidenceRefs.shortDescription.includes('f-setting'), true);

const promotionalDraft = structuredClone(placeDraft);
promotionalDraft.shortDescription = 'The best hidden-gem café beside the Mekong, perfect for coffee and a light meal during the day.';
const promoErrors = validateSpaCardEditorialDraft(promotionalDraft, 'place', placeFacts).errors.join(' | ');
assert.match(promoErrors, /unsupported promotional language/);

const genericDraft = structuredClone(placeDraft);
genericDraft.shortDescription = 'This useful address is worth keeping for travellers who want an easy stop during the day.';
assert.match(validateSpaCardEditorialDraft(genericDraft, 'place', placeFacts).errors.join(' | '), /generic filler language/);

const weakEvidence = structuredClone(placeDraft);
weakEvidence.evidenceRefs.shortDescription = ['f-setting'];
assert.match(validateSpaCardEditorialDraft(weakEvidence, 'place', placeFacts).errors.join(' | '), /at least 2 distinct verified facts/);

const badEvidence = structuredClone(placeDraft);
badEvidence.evidenceRefs.shortDescription = ['not-a-real-fact', 'f-food'];
assert.match(validateSpaCardEditorialDraft(badEvidence, 'place', placeFacts).errors.join(' | '), /unknown fact id/);

const forbiddenFieldCard = structuredClone(placeDraft);
forbiddenFieldCard.fieldCard = { whyGo: 'Nope' };
assert.match(validateSpaCardEditorialDraft(forbiddenFieldCard, 'place', placeFacts).errors.join(' | '), /Field Card output is forbidden/);

assert.equal(normalizeOpeningHours('Every day · 7:30 am - 6 pm'), 'Daily · 07:30–18:00');
assert.equal(normalizeOpeningHours('Mon-Sat · 08:00 to 17:00'), 'Mon-Sat · 08:00–17:00');
assert.equal(normalizeGettingThere('Walk  ·  20 min'), 'Walk · 20 min');
assert.equal(normalizeDuration('2-3 hrs'), '2–3 hours');
assert.equal(normalizeDuration('half day'), 'Half-day');
assert.equal(normalizeDuration('full-day'), 'Full day');
assert.equal(normalizeBestTime('late afternoon'), 'Late afternoon');

const activityCandidate = {
  name: 'Sunset Kayak on the Mekong',
  googleMapsUrl: 'https://maps.app.goo.gl/example',
  media: { card: { image: { src: '/assets/kayak.webp' } } },
};
const activityFacts = [
  { id: 'a-action', verified: true, field: 'experience', text: 'The activity is a guided kayak paddle on the Mekong.' },
  { id: 'a-access', verified: true, field: 'access', text: 'The kayak departure point is about a 10-minute walk from the main Don Det arrival area.' },
  { id: 'a-duration', verified: true, field: 'duration', text: 'The operator describes the trip as lasting about 2 to 3 hours.' },
  { id: 'a-cost', verified: true, field: 'cost', text: 'Participation requires a paid tour fee.' },
  { id: 'a-time', verified: true, field: 'best-time', text: 'The departure is timed for late afternoon and sunset.' },
];
const activityDraft = {
  shortDescription: 'A guided Mekong paddle lasting two to three hours, timed so the final stretch of the trip reaches the softer light before sunset.',
  handwrittenTags: ['Mekong', 'Slow paddle', 'Sunset'],
  gettingThere: 'Walk · 10 min',
  duration: '2-3 hrs',
  costType: 'paid',
  bestTime: 'late afternoon',
  evidenceRefs: {
    shortDescription: ['a-action', 'a-duration', 'a-time'],
    handwrittenTags: [['a-action'], ['a-action'], ['a-time']],
    gettingThere: ['a-access'],
    duration: ['a-duration'],
    costType: ['a-cost'],
    bestTime: ['a-time'],
  },
};
assert.deepEqual(validateSpaCardEditorialDraft(activityDraft, 'thing-to-do', activityFacts), { valid: true, errors: [] });
const materializedActivity = materializeSpaCardEditorial(activityCandidate, activityDraft, 'thing-to-do', activityFacts);
assert.equal(materializedActivity.status, 'ready');
assert.equal(materializedActivity.candidate.spaCard.gettingThere, 'Walk · 10 min');
assert.equal(materializedActivity.candidate.spaCard.duration, '2–3 hours');
assert.equal(materializedActivity.candidate.spaCard.costType, 'paid');
assert.equal(materializedActivity.candidate.spaCard.bestTime, 'Late afternoon');

const missingAccessEvidence = structuredClone(activityDraft);
delete missingAccessEvidence.evidenceRefs.gettingThere;
const accessReview = materializeSpaCardEditorial(activityCandidate, missingAccessEvidence, 'thing-to-do', activityFacts);
assert.equal(accessReview.status, 'manual-review');
assert.match(accessReview.errors.join(' | '), /evidenceRefs.gettingThere/);

const missingBestTimeEvidence = structuredClone(activityDraft);
delete missingBestTimeEvidence.evidenceRefs.bestTime;
const review = materializeSpaCardEditorial(activityCandidate, missingBestTimeEvidence, 'thing-to-do', activityFacts);
assert.equal(review.status, 'manual-review');
assert.match(review.errors.join(' | '), /evidenceRefs.bestTime/);

assert.throws(
  () => buildSpaCardEditorialBrief(placeCandidate, 'place', [{ id: 'x', verified: false, text: 'Unverified' }]),
  /requires at least one verified fact/,
);

console.log('SPA card editorial generation tests passed.');
