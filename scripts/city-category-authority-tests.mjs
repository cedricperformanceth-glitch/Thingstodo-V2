import assert from 'node:assert/strict';
import { emptyDraft, syncGenerationContract, validateCityCategories } from './lib/city-pipeline.mjs';
import { evaluateCityPublication } from './lib/city-publish-qa.mjs';

const draft = emptyDraft('laos', 'editor-categories', 'compact', 'village');
draft.cityData.categories = ['things-to-do', 'cafes', 'practical-services'];
syncGenerationContract(draft);

assert.deepEqual(
  draft.cityData.categories,
  ['things-to-do', 'cafes', 'practical-services'],
  'Generation must preserve the explicit City.categories decision.',
);
assert.deepEqual(Object.keys(draft.cityData.categoryTargets), ['cafes']);
assert.equal(draft.researchPlan.selection.categories.restaurants, undefined);
assert.ok(draft.researchPlan.selection.categories['things-to-do']);
assert.ok(draft.researchPlan.selection.categories.cafes);
assert.ok(draft.researchPlan.selection.categories['practical-services']);

assert.throws(
  () => validateCityCategories(['things-to-do', 'gyms'], 'village', 'laos/test'),
  /not allowed/,
);
assert.throws(
  () => validateCityCategories(['cafes'], 'village', 'laos/test'),
  /must include things-to-do/,
);
assert.throws(
  () => validateCityCategories(['things-to-do', 'cafes', 'cafes'], 'village', 'laos/test'),
  /must be unique/,
);

const qaDraft = structuredClone(draft);
qaDraft.city = 'editor-categories';
qaDraft.cityData.categoryTargets['things-to-do'] = 5;
qaDraft.cityData.manualLocks['categoryTargets.things-to-do'] = { value: 5, source: 'manual', locked: true };
qaDraft.things = [];
qaDraft.places = [];
const qa = evaluateCityPublication(qaDraft);
assert.equal(
  qa.errors.some((entry) => entry.code === 'city-category-contract'),
  false,
  'Publication QA must accept an explicit subset/order of settlement-allowed City.categories.',
);
assert.equal(
  qa.errors.some((entry) => entry.code === 'things-target-mismatch'),
  true,
  'Other publication checks must continue to run normally.',
);

console.log('City.categories authority tests passed.');
