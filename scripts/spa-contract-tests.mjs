import assert from 'node:assert/strict';
import { emptyDraft, researchPlan, setEditorialCategoryTarget, SETTLEMENT_CATEGORIES, syncGenerationContract } from './lib/city-pipeline.mjs';

const village = emptyDraft('laos', 'test-village', 'compact', 'village');
assert.deepEqual(village.cityData.categories, SETTLEMENT_CATEGORIES.village);
assert.deepEqual(village.cityData.categoryTargets, {}, 'A new city has no generated category quotas.');

setEditorialCategoryTarget(village, 'things-to-do', 4);
setEditorialCategoryTarget(village, 'cafes', 8);
setEditorialCategoryTarget(village, 'restaurants', 0);
syncGenerationContract(village);
assert.deepEqual(village.cityData.categoryTargets, { 'things-to-do': 4, cafes: 8, restaurants: 0 });
assert.deepEqual(village.researchPlan.categoryTargetPolicies, {});
assert.deepEqual(village.researchPlan.subcategoryTargets, {});

assert.throws(() => setEditorialCategoryTarget(village, 'gyms', 1), /not enabled/);
assert.throws(() => setEditorialCategoryTarget(village, 'cafes', -1), /non-negative integer/);
assert.throws(() => setEditorialCategoryTarget(village, 'cafes', 1.5), /non-negative integer/);

const city = emptyDraft('laos', 'test-city', 'standard', 'city');
setEditorialCategoryTarget(city, 'things-to-do', 18);
setEditorialCategoryTarget(city, 'restaurants', 12);
setEditorialCategoryTarget(city, 'cafes', 8);
syncGenerationContract(city);
assert.deepEqual(city.cityData.categoryTargets, { 'things-to-do': 18, restaurants: 12, cafes: 8 });

assert.deepEqual(researchPlan('sri-lanka', 'city', 'sri-lanka/test-city').categoryTargetPolicies, {});
console.log('SPA settlement and admin-controlled category target tests passed.');
