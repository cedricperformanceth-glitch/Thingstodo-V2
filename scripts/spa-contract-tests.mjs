import assert from 'node:assert/strict';
import { emptyDraft, SETTLEMENT_CATEGORIES } from './lib/city-pipeline.mjs';

assert.deepEqual(SETTLEMENT_CATEGORIES.village, [
  'things-to-do',
  'accommodation',
  'restaurants',
  'cafes',
  'practical-services',
]);

assert.deepEqual(SETTLEMENT_CATEGORIES.city, [
  'things-to-do',
  'accommodation',
  'restaurants',
  'cafes',
  'scooter-rental',
  'gyms',
  'markets',
  'practical-services',
]);

const village = emptyDraft('laos', 'test-village', 'compact', 'village');
assert.equal(village.cityData.settlementType, 'village');
assert.deepEqual(village.cityData.categories, SETTLEMENT_CATEGORIES.village);
assert.deepEqual(Object.keys(village.cityData.categoryTargets), ['accommodation', 'restaurants', 'cafes', 'practical-services']);

const city = emptyDraft('laos', 'test-city', 'standard', 'city');
assert.equal(city.cityData.settlementType, 'city');
assert.deepEqual(city.cityData.categories, SETTLEMENT_CATEGORIES.city);
assert.deepEqual(Object.keys(city.cityData.categoryTargets), ['accommodation', 'restaurants', 'cafes', 'scooter-rental', 'gyms', 'markets', 'practical-services']);

assert.throws(() => emptyDraft('laos', 'invalid', 'compact'), /Settlement type/);
assert.throws(() => emptyDraft('laos', 'invalid', 'compact', 'hamlet'), /Settlement type/);

console.log('SPA settlement contract tests passed.');
