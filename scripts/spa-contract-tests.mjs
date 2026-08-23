import assert from 'node:assert/strict';
import { emptyDraft, researchPlan, SETTLEMENT_CATEGORIES, syncGenerationContract } from './lib/city-pipeline.mjs';

const village = emptyDraft('laos', 'test-village', 'compact', 'village');
assert.deepEqual(village.cityData.categories, SETTLEMENT_CATEGORIES.village);
syncGenerationContract(village);
assert.equal('categoryTargets' in village.cityData, false, 'A city must not carry category quotas.');

const city = emptyDraft('laos', 'test-city', 'standard', 'city');
syncGenerationContract(city);
assert.equal('categoryTargets' in city.cityData, false);
assert.ok(researchPlan('sri-lanka', 'city', 'sri-lanka/test-city').selection);
console.log('SPA settlement and category authority tests passed.');
