import assert from 'node:assert/strict';
import { evaluateCityPublication } from './lib/city-publish-qa.mjs';

const sourceMetadata = { sourceName: 'Atlas research pipeline', reviewedAt: '2026-08-12T00:00:00.000Z' };
const researchSources = [{ sourceName: 'Official source', sourceUrl: 'https://example.org', purpose: 'facts' }];
const verification = { decision: 'accept', reason: 'verified-current-business-or-operator', checkedAt: '2026-08-12T00:00:00.000Z' };
const missingPhoto = { photoStatus: 'missing', photoRequiresManualFill: true };

function place(id, category = 'restaurants') {
  return {
    id,
    slug: id,
    name: `Place ${id}`,
    country: 'laos',
    city: 'test-village',
    category,
    coordinates: { latitude: 14, longitude: 105 },
    shortDescription: 'A verified riverside address serving local dishes, with enough practical detail for travellers deciding where to stop.',
    media: { card: {} },
    spaCard: { handwrittenTags: ['Local stop', 'Riverside', 'Daytime'], ...missingPhoto },
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${id}`,
    address: 'Test Village',
    sourceMetadata,
    researchSources,
    verification,
    manualLocks: {},
  };
}

function thing(index) {
  const id = `activity-${index}`;
  return {
    id,
    slug: id,
    name: `Activity ${index}`,
    country: 'laos',
    city: 'test-village',
    category: 'things-to-do',
    coordinates: { latitude: 14, longitude: 105 },
    shortDescription: 'A verified river outing reached on foot from the village, with one to two hours outside during the cooler morning.',
    media: { card: {} },
    spaCard: { handwrittenTags: ['River view', 'Easy outing', 'Morning'], gettingThere: 'Walk · 15 min', duration: '1–2 hours', costType: 'free', bestTime: 'Early morning', ...missingPhoto },
    googleMapsUrl: `https://maps.google.com/?q=${id}`,
    isLandmark: false,
    longDescription: '',
    breadcrumbs: ['laos', 'test-village', 'things-to-do'],
    fieldCard: { template: 'compact', whyGo: '', practical: '', access: '', faq: [] },
    sourceMetadata,
    researchSources,
    verification,
    manualLocks: {},
  };
}

function draft() {
  return {
    country: 'laos',
    city: 'test-village',
    generatedAt: '2026-08-12T00:00:00.000Z',
    cityData: {
      id: 'city-laos-test-village',
      slug: 'test-village',
      name: 'Test Village',
      country: 'laos',
      profile: 'compact',
      settlementType: 'village',
      coordinates: { latitude: 14, longitude: 105 },
      description: '',
      categories: ['things-to-do', 'restaurants', 'cafes', 'accommodation', 'practical-services'],
      categoryTargets: { 'things-to-do': 5, restaurants: 1 },
      hero: { eyebrow: 'laos', title: 'Test Village', subtitle: '', facts: [] },
      exploreBoard: { featuredThingIds: [] },
      manualLocks: {},
      seo: { title: 'Test', description: '', canonicalPath: '/laos/test-village', indexable: true },
    },
    places: [place('restaurant-one')],
    things: Array.from({ length: 5 }, (_, index) => thing(index + 1)),
  };
}

const valid = evaluateCityPublication(draft());
assert.equal(valid.status, 'ready-with-warnings');
assert.equal(valid.errors.length, 0);
assert.equal(valid.warnings.length, 6);
assert.equal(valid.warnings.every((entry) => entry.code === 'missing-spa-photo'), true);

const underfilled = draft();
underfilled.things.pop();
const underfilledReport = evaluateCityPublication(underfilled);
assert.equal(underfilledReport.status, 'blocked');
assert.ok(underfilledReport.errors.some((entry) => entry.code === 'things-target-mismatch'));

const unverified = draft();
unverified.places[0].verification = { decision: 'manual-review', reason: 'insufficient-independent-signals' };
assert.ok(evaluateCityPublication(unverified).errors.some((entry) => entry.code === 'source-verification'));

const disguisedAutomatic = draft();
disguisedAutomatic.places[0].sourceMetadata = { sourceName: 'Official establishment website' };
delete disguisedAutomatic.places[0].verification;
assert.ok(evaluateCityPublication(disguisedAutomatic).errors.some((entry) => entry.code === 'source-verification'));

const explicitManual = draft();
explicitManual.places[0].sourceMetadata = { sourceName: 'Manual' };
explicitManual.places[0].researchSources = [];
delete explicitManual.places[0].verification;
const manualReport = evaluateCityPublication(explicitManual);
assert.equal(manualReport.errors.some((entry) => entry.entity === 'restaurant-one' && ['source-verification', 'missing-research-source'].includes(entry.code)), false);

const noSource = draft();
noSource.places[0].researchSources = [];
assert.ok(evaluateCityPublication(noSource).errors.some((entry) => entry.code === 'missing-research-source'));

const duplicate = draft();
duplicate.things[1].name = duplicate.things[0].name;
assert.ok(evaluateCityPublication(duplicate).errors.some((entry) => entry.code === 'duplicate-entity'));

const wrongCategory = draft();
wrongCategory.places[0].category = 'gyms';
assert.ok(evaluateCityPublication(wrongCategory).errors.some((entry) => entry.code === 'invalid-category'));

const placeAsActivity = draft();
placeAsActivity.places[0].category = 'things-to-do';
assert.ok(evaluateCityPublication(placeAsActivity).errors.some((entry) => entry.code === 'entity-kind-category-mismatch'));

const wrongDestination = draft();
wrongDestination.things[0].city = 'another-village';
assert.ok(evaluateCityPublication(wrongDestination).errors.some((entry) => entry.code === 'entity-destination-mismatch'));

const badCoordinates = draft();
badCoordinates.places[0].coordinates.latitude = 190;
assert.ok(evaluateCityPublication(badCoordinates).errors.some((entry) => entry.code === 'invalid-coordinates'));

const transientLeak = draft();
transientLeak.things[0].photoCandidates = [{ src: '/raw.webp' }];
assert.ok(evaluateCityPublication(transientLeak).errors.some((entry) => entry.code === 'transient-generation-field'));

const withPhoto = draft();
withPhoto.places[0].media.card.image = {
  id: 'photo', src: '/assets/photo.webp', alt: 'Photo', sourceType: 'wikimedia', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Example.jpg', sourceName: 'Wikimedia Commons', author: 'Author', license: 'cc-by-sa', manual: false, locked: false,
};
withPhoto.places[0].spaCard.photoStatus = 'verified';
withPhoto.places[0].spaCard.photoRequiresManualFill = false;
const photoReport = evaluateCityPublication(withPhoto);
assert.equal(photoReport.errors.length, 0);
assert.equal(photoReport.warnings.length, 5);

const badPhotoLicense = draft();
badPhotoLicense.places[0].media.card.image = {
  id: 'photo', src: '/assets/photo.webp', alt: 'Photo', sourceType: 'open-license', sourceUrl: 'https://example.org/photo', sourceName: 'Example', license: 'cc-by-nc', manual: false, locked: false,
};
badPhotoLicense.places[0].spaCard.photoStatus = 'verified';
badPhotoLicense.places[0].spaCard.photoRequiresManualFill = false;
assert.ok(evaluateCityPublication(badPhotoLicense).errors.some((entry) => entry.code === 'photo-license'));

const inconsistentPhotoStatus = draft();
inconsistentPhotoStatus.places[0].media.card.image = {
  id: 'photo', src: '/assets/photo.webp', alt: 'Photo', sourceType: 'manual', manual: true, locked: true,
};
inconsistentPhotoStatus.places[0].spaCard.photoStatus = 'missing';
inconsistentPhotoStatus.places[0].spaCard.photoRequiresManualFill = false;
assert.ok(evaluateCityPublication(inconsistentPhotoStatus).errors.some((entry) => ['spa-card-contract', 'photo-status'].includes(entry.code)));

console.log('City publication QA tests passed.');
