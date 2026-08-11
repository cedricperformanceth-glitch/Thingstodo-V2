import assert from 'node:assert/strict';
import { emptyDraft, researchPlan, setEditorialCategoryTarget, SETTLEMENT_CATEGORIES, syncGenerationContract } from './lib/city-pipeline.mjs';

assert.deepEqual(SETTLEMENT_CATEGORIES.village, [
  'things-to-do',
  'restaurants',
  'cafes',
  'accommodation',
  'practical-services',
]);

assert.deepEqual(SETTLEMENT_CATEGORIES.city, [
  'things-to-do',
  'restaurants',
  'cafes',
  'accommodation',
  'scooter-rental',
  'gyms',
  'markets',
  'practical-services',
]);

const within = (value, min, max, label) => assert.ok(Number.isInteger(value) && value >= min && value <= max, `${label} must be an integer between ${min} and ${max}; received ${value}`);
const activityPolicy = {
  min: 7,
  idealMin: 19,
  idealMax: 28,
  max: 35,
  selectionMode: 'editorial',
};

const village = emptyDraft('laos', 'test-village', 'compact', 'village');
assert.equal(village.cityData.settlementType, 'village');
assert.deepEqual(village.cityData.categories, SETTLEMENT_CATEGORIES.village);
assert.deepEqual(Object.keys(village.cityData.categoryTargets), ['restaurants', 'cafes', 'accommodation']);
assert.equal(village.cityData.categoryTargets['things-to-do'], undefined, 'Activities must wait for an editorial/admin target choice');
within(village.cityData.categoryTargets.restaurants, 10, 15, 'Village restaurants');
within(village.cityData.categoryTargets.cafes, 10, 15, 'Village cafes');
within(village.cityData.categoryTargets.accommodation, 12, 19, 'Village guesthouses');
assert.equal(village.cityData.categoryTargets['practical-services'], undefined);
assert.equal(village.cityData.categoryTargets.gyms, undefined);
assert.equal(village.cityData.categoryTargets.markets, undefined);
assert.deepEqual(village.researchPlan.categoryTargetPolicies['things-to-do'], activityPolicy);
within(village.researchPlan.subcategoryTargets.restaurants.bar, 3, 5, 'Village bars');
assert.deepEqual(village.researchPlan.searchPriorities['practical-services'], ['hospital', 'tourism-office', 'immigration-office']);
assert.deepEqual(village.researchPlan.selection.searchArea, { scope: 'settlement-first', preferredRadiusKm: 2, maxRadiusKm: 3 });
assert.equal(village.researchPlan.selection.sourceStrategy.verifyCurrentExistenceBeforeSelection, true);
assert.equal(village.researchPlan.selection.sourceStrategy.preferRepeatedMentionsAcrossIndependentSources, true);
assert.deepEqual(village.researchPlan.selection.categories.restaurants.venueTypes, ['restaurant', 'bar']);
assert.equal(village.researchPlan.selection.categories.restaurants.barsBelongToRestaurants, true);
assert.equal(village.researchPlan.selection.categories.gyms, undefined, 'Village selection plan must not leak city-only categories');
assert.deepEqual(village.researchPlan.selection.categories.accommodation.priceUsdPerNight, {
  hardMinimum: null,
  preferredMin: 10,
  preferredMax: 30,
  hardMax: 50,
  upperBandMaxCount: 3,
});
assert.deepEqual(village.researchPlan.selection.categories['practical-services'].searchTypes, ['hospital', 'tourism-office', 'immigration-office']);
assert.deepEqual(village.researchPlan.selection.categories['practical-services'].officialOnly, ['tourism-office', 'immigration-office']);
assert.deepEqual(village.researchPlan.selection.categories['practical-services'].exclude, ['visa-agency', 'travel-agency']);

const city = emptyDraft('laos', 'test-city', 'standard', 'city');
assert.equal(city.cityData.settlementType, 'city');
assert.deepEqual(city.cityData.categories, SETTLEMENT_CATEGORIES.city);
assert.deepEqual(Object.keys(city.cityData.categoryTargets), ['restaurants', 'cafes', 'accommodation', 'scooter-rental']);
assert.equal(city.cityData.categoryTargets['things-to-do'], undefined, 'City activities must wait for an editorial/admin target choice');
within(city.cityData.categoryTargets.restaurants, 19, 25, 'City restaurants');
within(city.cityData.categoryTargets.cafes, 19, 25, 'City cafes');
within(city.cityData.categoryTargets.accommodation, 19, 25, 'City guesthouses');
within(city.cityData.categoryTargets['scooter-rental'], 5, 12, 'City scooter rentals');
assert.equal(city.cityData.categoryTargets.gyms, undefined);
assert.equal(city.cityData.categoryTargets.markets, undefined);
assert.equal(city.cityData.categoryTargets['practical-services'], undefined);
assert.deepEqual(city.researchPlan.categoryTargetPolicies['things-to-do'], activityPolicy);
assert.deepEqual(city.researchPlan.subcategoryTargets, {});
assert.deepEqual(city.researchPlan.searchPriorities['practical-services'], ['hospital', 'tourism-office', 'immigration-office']);
assert.deepEqual(city.researchPlan.selection.categories.gyms.groups, {
  'fitness-and-weights': { max: 5 },
  'muay-thai': { ideal: 2, max: 3 },
});
assert.equal(city.researchPlan.selection.categories.gyms.minimum, 0);
assert.deepEqual(city.researchPlan.selection.categories.markets.venueTypes, ['market', 'night-market']);
assert.equal(city.researchPlan.selection.categories.markets.minimum, 0);
assert.equal(city.researchPlan.selection.categories['scooter-rental'].automaticSubcategoryFilters, false);
assert.equal(city.researchPlan.selection.selectionPrinciples.pricePositioning, 'mostly-affordable-and-midrange');
assert.equal(city.researchPlan.selection.selectionPrinciples.avoidUltraLuxury, true);
assert.equal(city.researchPlan.selection.selectionPrinciples.requireVariety, true);

const editorSelectedCity = emptyDraft('laos', 'editor-selected-city', 'large', 'city');
setEditorialCategoryTarget(editorSelectedCity, 'things-to-do', 24);
assert.equal(editorSelectedCity.cityData.categoryTargets['things-to-do'], 24);
assert.deepEqual(editorSelectedCity.cityData.manualLocks['categoryTargets.things-to-do'], { value: 24, source: 'manual', locked: true });
syncGenerationContract(editorSelectedCity);
assert.equal(editorSelectedCity.cityData.categoryTargets['things-to-do'], 24, 'Generation refresh must preserve the admin/editor activity target');
assert.deepEqual(editorSelectedCity.researchPlan.categoryTargetPolicies['things-to-do'], activityPolicy);
assert.equal(editorSelectedCity.researchPlan.selection.searchArea.maxRadiusKm, 3, 'Generation refresh must preserve the Laos selection contract');

const minimumActivities = emptyDraft('laos', 'minimum-activities', 'compact', 'village');
setEditorialCategoryTarget(minimumActivities, 'things-to-do', 7);
syncGenerationContract(minimumActivities);
assert.equal(minimumActivities.cityData.categoryTargets['things-to-do'], 7);
const maximumActivities = emptyDraft('laos', 'maximum-activities', 'compact', 'village');
setEditorialCategoryTarget(maximumActivities, 'things-to-do', 35);
syncGenerationContract(maximumActivities);
assert.equal(maximumActivities.cityData.categoryTargets['things-to-do'], 35);
assert.throws(() => setEditorialCategoryTarget(emptyDraft('laos', 'too-few', 'compact', 'city'), 'things-to-do', 6), /between 7 and 35/);
assert.throws(() => setEditorialCategoryTarget(emptyDraft('laos', 'too-many', 'compact', 'city'), 'things-to-do', 36), /between 7 and 35/);
assert.throws(() => setEditorialCategoryTarget(emptyDraft('laos', 'wrong-category', 'compact', 'city'), 'restaurants', 20), /not configured for editorial target selection/);

const sameVillage = emptyDraft('laos', 'test-village', 'large', 'village');
assert.deepEqual(sameVillage.cityData.categoryTargets, village.cityData.categoryTargets, 'Automatic targets must stay stable for the same country/city/category regardless of rebuild profile');
assert.deepEqual(sameVillage.researchPlan, village.researchPlan, 'Research plan must stay stable for the same country/city');

const villageRestaurantTargets = new Set(Array.from({ length: 12 }, (_, index) => emptyDraft('laos', `variation-village-${index}`, 'compact', 'village').cityData.categoryTargets.restaurants));
assert.ok(villageRestaurantTargets.size > 1, 'Village restaurant targets should vary between generated places');
const cityRestaurantTargets = new Set(Array.from({ length: 12 }, (_, index) => emptyDraft('laos', `variation-city-${index}`, 'standard', 'city').cityData.categoryTargets.restaurants));
assert.ok(cityRestaurantTargets.size > 1, 'City restaurant targets should vary between generated places');

const unconfiguredCountry = emptyDraft('sri-lanka', 'test-city', 'standard', 'city');
assert.deepEqual(unconfiguredCountry.cityData.categoryTargets, {}, 'Countries without an explicit target contract must not inherit Laos numeric targets');
assert.deepEqual(unconfiguredCountry.researchPlan, {
  categoryTargetPolicies: {},
  subcategoryTargets: {},
  searchPriorities: {},
  selection: { searchArea: null, sourceStrategy: null, selectionPrinciples: null, categories: {} },
});
assert.deepEqual(researchPlan('sri-lanka', 'city', 'sri-lanka/test-city'), unconfiguredCountry.researchPlan);

assert.throws(() => emptyDraft('laos', 'invalid', 'compact'), /Settlement type/);
assert.throws(() => emptyDraft('laos', 'invalid', 'compact', 'hamlet'), /Settlement type/);

console.log('SPA settlement, Laos generation targets, and selection contract tests passed.');
