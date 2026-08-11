import assert from 'node:assert/strict';
import { validateSpaCardCandidate } from './lib/spa-card-generation.mjs';

const image = {
  id: 'media-test',
  src: '/assets/test.webp',
  alt: 'Test place',
  sourceType: 'manual',
  manual: true,
  locked: false,
};

const place = {
  name: 'Mekong Garden Café',
  shortDescription: 'A relaxed riverside café for an easy coffee break, a light bite and a little time beside the Mekong.',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mekong+Garden+Cafe',
  media: { card: { image } },
  spaCard: {
    handwrittenTags: ['Riverside', 'Easy stop', 'Morning'],
    openingHours: '07:30–18:00',
  },
};

assert.deepEqual(validateSpaCardCandidate(place, 'place'), { valid: true, errors: [] });

const activity = {
  name: 'Sunset Kayak on the Mekong',
  shortDescription: 'An easy paddle on the Mekong that turns the late afternoon into a slower, quieter way to see the islands.',
  googleMapsUrl: 'https://maps.app.goo.gl/example',
  media: { card: { image } },
  spaCard: {
    handwrittenTags: ['Mekong', 'Slow paddle', 'Sunset'],
    duration: '2–3 hours',
    costType: 'paid',
    bestTime: 'Late afternoon',
  },
};

assert.deepEqual(validateSpaCardCandidate(activity, 'thing-to-do'), { valid: true, errors: [] });

const missingPhoto = structuredClone(place);
delete missingPhoto.media.card.image;
missingPhoto.spaCard.photoStatus = 'missing';
missingPhoto.spaCard.photoRequiresManualFill = true;
assert.deepEqual(validateSpaCardCandidate(missingPhoto, 'place'), { valid: true, errors: [] });

const unmarkedMissingPhoto = structuredClone(missingPhoto);
delete unmarkedMissingPhoto.spaCard.photoStatus;
assert.ok(validateSpaCardCandidate(unmarkedMissingPhoto, 'place').errors.includes('missing photo must be explicitly marked as photoStatus=missing'));

const contradictoryPhotoStatus = structuredClone(place);
contradictoryPhotoStatus.spaCard.photoStatus = 'missing';
assert.ok(validateSpaCardCandidate(contradictoryPhotoStatus, 'place').errors.includes('photoStatus cannot be missing when a photo is present'));

const missingMap = structuredClone(place);
delete missingMap.googleMapsUrl;
assert.ok(validateSpaCardCandidate(missingMap, 'place').errors.includes('valid Google Maps URL is required'));

const nonGoogleMap = structuredClone(place);
nonGoogleMap.googleMapsUrl = 'https://example.com/place';
assert.ok(validateSpaCardCandidate(nonGoogleMap, 'place').errors.includes('valid Google Maps URL is required'));

const wrongTags = structuredClone(place);
wrongTags.spaCard.handwrittenTags = ['Only one'];
assert.ok(validateSpaCardCandidate(wrongTags, 'place').errors.includes('exactly 3 handwritten tags are required'));

const longTag = structuredClone(place);
longTag.spaCard.handwrittenTags = ['Far too many words', 'Easy stop', 'Morning'];
assert.ok(validateSpaCardCandidate(longTag, 'place').errors.some((error) => error.includes('handwritten tag 1')));

const missingActivityMeta = structuredClone(activity);
delete missingActivityMeta.spaCard.duration;
missingActivityMeta.spaCard.costType = 'unknown';
delete missingActivityMeta.spaCard.bestTime;
const activityErrors = validateSpaCardCandidate(missingActivityMeta, 'thing-to-do').errors;
assert.ok(activityErrors.includes('activity duration is required'));
assert.ok(activityErrors.includes('activity costType must be free or paid'));
assert.ok(activityErrors.includes('activity bestTime is required'));

const tooLongDescription = structuredClone(place);
tooLongDescription.shortDescription = Array.from({ length: 46 }, () => 'word').join(' ');
assert.ok(validateSpaCardCandidate(tooLongDescription, 'place').errors.includes('short description must be at most 45 words'));

console.log('SPA card generation contract tests passed.');
