import assert from 'node:assert/strict';
import fs from 'node:fs';
import { places as sourcePlaces } from '../pipeline/sources/laos/don-det.places.mjs';
import { assertValidSpaCardCandidate } from './lib/spa-card-generation.mjs';
import { evaluateCityPublication } from './lib/city-publish-qa.mjs';

const draft = JSON.parse(fs.readFileSync('pipeline/cities/laos/don-det.json', 'utf8'));
const expected = { restaurants: 15, cafes: 15, accommodation: 15, 'practical-services': 2 };
const countByCategory = (items) => Object.fromEntries(Object.keys(expected).map((category) => [category, items.filter((item) => item.category === category).length]));

assert.equal(sourcePlaces.length, 47, 'Don Det practical source shard must contain exactly 47 selected places for this pilot');
assert.deepEqual(countByCategory(sourcePlaces), expected, 'Don Det source shard must preserve the selected category volumes');
assert.equal(new Set(sourcePlaces.map((item) => item.id)).size, sourcePlaces.length, 'Don Det practical source IDs must be unique');
assert.equal(new Set(sourcePlaces.map((item) => item.slug)).size, sourcePlaces.length, 'Don Det practical source slugs must be unique');
assert.equal(new Set(sourcePlaces.map((item) => item.name.toLowerCase())).size, sourcePlaces.length, 'Don Det practical source names must be unique');

assert.equal(draft.places.length, sourcePlaces.length, 'Published Don Det must contain every selected practical place');
assert.deepEqual(countByCategory(draft.places), expected, 'Published Don Det must expose 15 restaurants, 15 coffee, 15 stays and 2 essential-information cards');
assert.deepEqual(draft.places.map((item) => item.id), sourcePlaces.map((item) => item.id), 'Published Don Det practical cards must match the versioned place source shard exactly');
assert.equal(draft.cityData.categoryTargets.restaurants, 15);
assert.equal(draft.cityData.categoryTargets.cafes, 15);
assert.equal(draft.cityData.categoryTargets.accommodation, 15);
assert.deepEqual(draft.cityData.categories, ['things-to-do', 'restaurants', 'cafes', 'accommodation', 'practical-services']);

for (const place of draft.places) {
  assert.equal('isMySelection' in place, false, `${place.name}: legacy isMySelection must be absent`);
  assert.equal('selectionRank' in place, false, `${place.name}: legacy selectionRank must be absent`);
  assertValidSpaCardCandidate(place, 'place');
  assert.equal(place.spaCard?.handwrittenTags?.length, 3, `${place.name}: exactly three handwritten tags are required`);
  assert.equal(place.spaCard?.photoStatus, 'missing', `${place.name}: unverified generic photos must not be published`);
  assert.equal(place.spaCard?.photoRequiresManualFill, true, `${place.name}: missing real photo must remain visibly flagged for manual fill`);
  assert.equal(place.verification?.decision, 'accept', `${place.name}: source verification must be accepted`);
  assert.ok(place.researchSources?.length, `${place.name}: source provenance must be retained`);
}

const normalizedNames = [...draft.places, ...draft.things].map((item) => item.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim());
assert.equal(new Set(normalizedNames).size, normalizedNames.length, 'No establishment may be duplicated across SPA categories');
assert.equal(draft.places.some((item) => /immigration office|tourism office/i.test(item.name)), false, 'Missing official services must not be invented to fill Essential Information');

const report = evaluateCityPublication(draft);
assert.equal(report.errors.length, 0, report.errors.map((entry) => `${entry.code}: ${entry.message}`).join('\n'));
assert.equal(report.status, 'ready-with-warnings', 'Missing verified photos are warnings, not publication blockers');
assert.deepEqual(report.counts, {
  'things-to-do': 11,
  restaurants: 15,
  cafes: 15,
  accommodation: 15,
  'practical-services': 2,
});

console.log('Don Det full SPA pilot');
console.log('Things to do: 11');
console.log('Restaurants: 15');
console.log('Coffee: 15');
console.log('Guest Houses: 15');
console.log('Essential Information: 2');
console.log(`Publication QA: ${report.status} · ${report.errors.length} errors · ${report.warnings.length} warnings`);
console.log('Don Det full SPA publication test passed.');
