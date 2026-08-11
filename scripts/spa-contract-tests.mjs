import assert from 'node:assert/strict';
import { emptyDraft, SETTLEMENT_CATEGORIES } from './lib/city-pipeline.mjs';

assert.deepEqual(SETTLEMENT_CATEGORIES.village, [
  'restaurants',
  'cafes',
  'accommodation',
  'things-to-do',
  'practical-services',
]);

assert.deepEqual(SETTLEMENT_CATEGORIES.city, [
  'restaurants',
  'cafes',
  'accommodation',
  'scooter-rental',
  'gyms',
  'markets',
  'practical-services',
]);

const within = (value, min, max, label) => assert.ok(Number.isInteger(value) && value >= min && value <= max, `${label} must be an integer between ${min} and ${max}; received ${value}`);

const village = emptyDraft('laos', 'test-village', 'compact', 'village');
assert.equal(village.cityData.settlementType, 'village');
assert.deepEqual(village.cityData.categories, SETTLEMENT_CATEGORIES.village);
assert.deepEqual(Object.keys(village.cityData.categoryTargets), ['restaurants', 'cafes', 'accommodation']);
within(village.cityData.categoryTargets.restaurants, 10, 15, 'Village restaurants');
within(village.cityData.categoryTargets.cafes, 10, 15, 'Village cafes');
within(village.cityData.categoryTargets.accommodation, 12, 19, 'Village guesthouses');
assert.equal(village.cityData.categoryTargets['practical-services'], undefined);
assert.equal(village.cityData.categoryTargets.gyms, undefined);
assert.equal(village.cityData.categoryTargets.markets, undefined);
within(village.researchPlan.subcategoryTargets.restaurants.bar, 3, 5, 'Village bars');
assert.deepEqual(village.researchPlan.searchPriorities['practical-services'], ['hospital', 'tourism-office', 'visa-extension']);

const city = emptyDraft('laos', 'test-city', 'standard', 'city');
assert.equal(city.cityData.settlementType, 'city');
assert.deepEqual(city.cityData.categories, SETTLEMENT_CATEGORIES.city);
assert.deepEqual(Object.keys(city.cityData.categoryTargets), ['restaurants', 'cafes', 'accommodation', 'scooter-rental']);
within(city.cityData.categoryTargets.restaurants, 19, 25, 'City restaurants');
within(city.cityData.categoryTargets.cafes, 19, 25, 'City cafes');
within(city.cityData.categoryTargets.accommodation, 19, 25, 'City guesthouses');
within(city.cityData.categoryTargets['scooter-rental'], 5, 12, 'City scooter rentals');
assert.equal(city.cityData.categoryTargets.gyms, undefined);
assert.equal(city.cityData.categoryTargets.markets, undefined);
assert.equal(city.cityData.categoryTargets['practical-services'], undefined);
assert.deepEqual(city.researchPlan.subcategoryTargets, {});
assert.deepEqual(city.researchPlan.searchPriorities['practical-services'], ['hospital', 'tourism-office', 'visa-extension']);

const sameVillage = emptyDraft('laos', 'test-village', 'large', 'village');
assert.deepEqual(sameVillage.cityData.categoryTargets, village.cityData.categoryTargets, 'Targets must stay stable for the same country/city/category regardless of rebuild profile');
assert.deepEqual(sameVillage.researchPlan, village.researchPlan, 'Research plan must stay stable for the same country/city');

const villageRestaurantTargets = new Set(Array.from({ length: 12 }, (_, index) => emptyDraft('laos', `variation-village-${index}`, 'compact', 'village').cityData.categoryTargets.restaurants));
assert.ok(villageRestaurantTargets.size > 1, 'Village restaurant targets should vary between generated places');
const cityRestaurantTargets = new Set(Array.from({ length: 12 }, (_, index) => emptyDraft('laos', `variation-city-${index}`, 'standard', 'city').cityData.categoryTargets.restaurants));
assert.ok(cityRestaurantTargets.size > 1, 'City restaurant targets should vary between generated places');

const unconfiguredCountry = emptyDraft('sri-lanka', 'test-city', 'standard', 'city');
assert.deepEqual(unconfiguredCountry.cityData.categoryTargets, {}, 'Countries without an explicit target contract must not inherit Laos numeric targets');
assert.deepEqual(unconfiguredCountry.researchPlan, { subcategoryTargets: {}, searchPriorities: {} });

assert.throws(() => emptyDraft('laos', 'invalid', 'compact'), /Settlement type/);
assert.throws(() => emptyDraft('laos', 'invalid', 'compact', 'hamlet'), /Settlement type/);

console.log('SPA settlement and Laos generation contract tests passed.');
