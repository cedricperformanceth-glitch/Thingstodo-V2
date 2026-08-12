import assert from 'node:assert/strict';
import fs from 'node:fs';
import { places as sourcePlaces } from '../pipeline/sources/laos/don-det.places.mjs';
import { assertValidSpaCardCandidate } from './lib/spa-card-generation.mjs';
import { evaluateCityPublication } from './lib/city-publish-qa.mjs';
import { evaluateCandidateAcceptance } from './lib/verification-engine.mjs';

const draft = JSON.parse(fs.readFileSync('pipeline/cities/laos/don-det.json', 'utf8'));
const sourcePool = { restaurants: 15, cafes: 15, accommodation: 19, 'practical-services': 2 };
const automaticCategories = ['restaurants', 'cafes', 'accommodation'];
const countByCategory = (items) => Object.fromEntries(Object.keys(sourcePool).map((category) => [category, items.filter((item) => item.category === category).length]));
const NOW = new Date('2026-08-12T00:00:00Z');

assert.equal(sourcePlaces.length, 51, 'Don Det practical source shard must contain the full 51-candidate research pool');
assert.deepEqual(countByCategory(sourcePlaces), sourcePool, 'Don Det source shard must cover every automatic target range plus verified Essential Information');
assert.equal(new Set(sourcePlaces.map((item) => item.id)).size, sourcePlaces.length, 'Don Det practical source IDs must be unique');
assert.equal(new Set(sourcePlaces.map((item) => item.slug)).size, sourcePlaces.length, 'Don Det practical source slugs must be unique');
assert.equal(new Set(sourcePlaces.map((item) => item.name.toLowerCase())).size, sourcePlaces.length, 'Don Det practical source names must be unique');

for (const candidate of sourcePlaces) {
  assert.equal('verification' in candidate, false, `${candidate.name}: source shard must not pre-write the acceptance verdict`);
  assert.equal(candidate.verificationKind, 'business', `${candidate.name}: practical Place verification kind must be business`);
  assert.ok(Array.isArray(candidate.verificationSignals) && candidate.verificationSignals.length >= 2, `${candidate.name}: at least two independent current signals are required`);
  assert.ok(candidate.verificationSignals.some((signal) => signal.strength === 'strong'), `${candidate.name}: at least one strong current signal is required`);
  const decision = evaluateCandidateAcceptance({ kind: candidate.verificationKind, signals: candidate.verificationSignals }, 'laos', NOW);
  assert.equal(decision.decision, 'accept', `${candidate.name}: verification engine must accept the practical candidate`);
}

const targets = draft.cityData.categoryTargets;
assert.ok(Number.isInteger(targets.restaurants) && targets.restaurants >= 10 && targets.restaurants <= 15, 'Don Det restaurant target must stay inside 10–15');
assert.ok(Number.isInteger(targets.cafes) && targets.cafes >= 10 && targets.cafes <= 15, 'Don Det coffee target must stay inside 10–15');
assert.ok(Number.isInteger(targets.accommodation) && targets.accommodation >= 12 && targets.accommodation <= 19, 'Don Det guesthouse target must stay inside 12–19');
assert.ok(new Set(automaticCategories.map((category) => targets[category])).size > 1, 'Don Det automatic targets must not collapse into a repeated uniform number such as 15/15/15');
assert.equal(targets['things-to-do'], 11, 'Don Det Things to do target remains the manually locked editorial target');

for (const category of automaticCategories) {
  assert.ok(sourcePool[category] >= targets[category], `${category}: candidate pool must cover the persisted target`);
  assert.equal(draft.places.filter((item) => item.category === category).length, targets[category], `${category}: published count must exactly equal the persisted random-once target`);
}
assert.equal(draft.places.filter((item) => item.category === 'practical-services').length, 2, 'Essential Information publishes only the two verified useful services');

const expectedPublishedIds = [
  ...sourcePlaces.filter((item) => item.category === 'restaurants').slice(0, targets.restaurants),
  ...sourcePlaces.filter((item) => item.category === 'cafes').slice(0, targets.cafes),
  ...sourcePlaces.filter((item) => item.category === 'accommodation').slice(0, targets.accommodation),
  ...sourcePlaces.filter((item) => item.category === 'practical-services'),
].map((item) => item.id);
assert.deepEqual(draft.places.map((item) => item.id), expectedPublishedIds, 'Published Don Det practical cards must follow the ranked source pool up to each persisted target');
assert.deepEqual(draft.cityData.categories, ['things-to-do', 'restaurants', 'cafes', 'accommodation', 'practical-services']);

for (const place of draft.places) {
  assert.equal('isMySelection' in place, false, `${place.name}: legacy isMySelection must be absent`);
  assert.equal('selectionRank' in place, false, `${place.name}: legacy selectionRank must be absent`);
  assertValidSpaCardCandidate(place, 'place');
  assert.equal(place.spaCard?.handwrittenTags?.length, 3, `${place.name}: exactly three handwritten tags are required`);
  assert.equal(place.spaCard?.photoStatus, 'missing', `${place.name}: unverified generic photos must not be published`);
  assert.equal(place.spaCard?.photoRequiresManualFill, true, `${place.name}: missing real photo must remain visibly flagged for manual fill`);
  assert.equal(place.verification?.decision, 'accept', `${place.name}: persisted source verification must be accepted`);
  assert.ok(place.researchSources?.length, `${place.name}: source provenance must be retained`);
}

const normalizedNames = [...draft.places, ...draft.things].map((item) => item.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim());
assert.equal(new Set(normalizedNames).size, normalizedNames.length, 'No establishment may be duplicated across SPA categories');
assert.equal(draft.places.some((item) => /immigration office|tourism office/i.test(item.name)), false, 'Missing official services must not be invented to fill Essential Information');

const featuredIds = draft.cityData.exploreBoard?.featuredThingIds ?? [];
assert.equal(featuredIds.length, 3, 'Don Det Explore Board must always publish exactly three landmarks');
for (const id of featuredIds) {
  const thing = draft.things.find((candidate) => candidate.id === id);
  assert.ok(thing?.isLandmark, `${id}: Explore Board entry must be a landmark`);
  assert.ok(thing?.exploreBoard?.kicker && thing?.exploreBoard?.duration && thing?.exploreBoard?.route, `${id}: Explore Board metadata is required`);
  assert.ok(thing?.media?.card?.image?.src, `${id}: Explore Board landmark requires a real verified photo`);
}

const report = evaluateCityPublication(draft);
assert.equal(report.errors.length, 0, report.errors.map((entry) => `${entry.code}: ${entry.message}`).join('\n'));
assert.equal(report.status, 'ready-with-warnings', 'Missing verified photos are warnings, not publication blockers');
assert.equal(report.counts['things-to-do'], 11);
assert.equal(report.counts.restaurants, targets.restaurants);
assert.equal(report.counts.cafes, targets.cafes);
assert.equal(report.counts.accommodation, targets.accommodation);
assert.equal(report.counts['practical-services'], 2);

console.log('Don Det full SPA pilot');
console.log('Things to do: 11');
console.log(`Restaurants: ${targets.restaurants}`);
console.log(`Coffee: ${targets.cafes}`);
console.log(`Guest Houses: ${targets.accommodation}`);
console.log('Essential Information: 2');
console.log(`Explore Board landmarks: ${featuredIds.length}`);
console.log(`Publication QA: ${report.status} · ${report.errors.length} errors · ${report.warnings.length} warnings`);
console.log('Don Det full SPA publication test passed.');
