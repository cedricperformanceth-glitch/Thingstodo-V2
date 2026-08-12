import assert from 'node:assert/strict';
import {
  CONTENT_TARGET_RULES,
  emptyDraft,
  randomRangeValue,
  researchPlan,
  rerollAutomaticCategoryTargets,
  setEditorialCategoryTarget,
  SETTLEMENT_CATEGORIES,
  syncGenerationContract,
} from './lib/city-pipeline.mjs';

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
const activityPolicy = { min: 5, max: 25, selectionMode: 'editorial' };

assert.equal(CONTENT_TARGET_RULES.laos.village.categories.restaurants.selectionMode, 'random-once');
assert.equal(CONTENT_TARGET_RULES.laos.village.categories.cafes.selectionMode, 'random-once');
assert.equal(CONTENT_TARGET_RULES.laos.village.categories.accommodation.selectionMode, 'random-once');
assert.equal(CONTENT_TARGET_RULES.laos.city.categories['scooter-rental'].selectionMode, 'random-once');
assert.equal(randomRangeValue({ min: 10, max: 15 }, 'test-min', (min) => min), 10);
assert.equal(randomRangeValue({ min: 10, max: 15 }, 'test-max', (_min, max) => max - 1), 15);

const village = emptyDraft('laos', 'test-village', 'compact', 'village');
assert.equal(village.cityData.settlementType, 'village');
assert.deepEqual(village.cityData.categories, SETTLEMENT_CATEGORIES.village);
assert.deepEqual(Object.keys(village.cityData.categoryTargets), ['restaurants', 'cafes', 'accommodation']);
assert.equal(village.cityData.categoryTargets['things-to-do'], undefined, 'Activities must wait for an editorial/admin target choice');
within(village.cityData.categoryTargets.restaurants, 10, 15, 'Village restaurants');
within(village.cityData.categoryTargets.cafes, 10, 15, 'Village cafes');
within(village.cityData.categoryTargets.accommodation, 12, 19, 'Village guesthouses');
assert.ok(new Set([
  village.cityData.categoryTargets.restaurants,
  village.cityData.categoryTargets.cafes,
  village.cityData.categoryTargets.accommodation,
]).size > 1, 'Automatic sibling targets must not publish as a uniform repeated number such as 15/15/15');
assert.equal(village.cityData.categoryTargets['practical-services'], undefined);
assert.equal(village.cityData.categoryTargets.gyms, undefined);
assert.equal(village.cityData.categoryTargets.markets, undefined);
assert.deepEqual(village.researchPlan.categoryTargetPolicies['things-to-do'], activityPolicy);
within(village.researchPlan.subcategoryTargets.restaurants.bar, 3, 5, 'Village bars');
assert.deepEqual(village.researchPlan.searchPriorities['practical-services'], ['hospital', 'tourism-office', 'immigration-office']);
assert.deepEqual(village.researchPlan.selection.searchArea, {
  scope: 'settlement-first',
  preferredRadiusKm: 2,
  maxRadiusKm: 3,
  appliesTo: ['restaurants', 'cafes', 'accommodation', 'practical-services'],
});
assert.equal(village.researchPlan.selection.searchArea.appliesTo.includes('things-to-do'), false, 'Practical-address radius must not constrain Things to do');
assert.equal(village.researchPlan.selection.categories['things-to-do'].targetControlledByAdmin, true);
assert.equal(village.researchPlan.selection.categories['things-to-do'].hardMin, 5);
assert.equal(village.researchPlan.selection.categories['things-to-do'].hardMax, 25);
assert.equal(village.researchPlan.selection.categories['things-to-do'].useExistingAtlasDatabaseAsPrioritySeed, true);
assert.equal(village.researchPlan.selection.categories['things-to-do'].locationScope, 'destination-linked-without-fixed-radius');
assert.equal(village.researchPlan.selection.categories['things-to-do'].avoidNearDuplicates, true);
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
assert.deepEqual(village.researchPlan.selection.categories['practical-services'].officialOnly, ['immigration-office']);
assert.deepEqual(village.researchPlan.selection.categories['practical-services'].exclude, ['visa-agency', 'travel-agency']);

assert.equal(village.researchPlan.verification.discoveryBudget.initialQueriesPerCategory, 4);
assert.equal(village.researchPlan.verification.discoveryBudget.maxQueriesPerCategory, 12);
assert.equal(village.researchPlan.verification.acceptance.businessOrOperator.minimumIndependentCurrentSignals, 2);
assert.equal(village.researchPlan.verification.acceptance.businessOrOperator.requireAtLeastOneStrongSignal, true);
assert.equal(village.researchPlan.verification.acceptance.staticLandmarkOrNaturalSite.singleCurrentAuthoritativeSourceCanConfirmExistence, true);
assert.equal(village.researchPlan.verification.existenceVerification.permanentClosure.independentExplicitClosureReportsThreshold, 3);
assert.equal(village.researchPlan.verification.existenceVerification.permanentClosure.closureReportMaxAgeMonths, 18);
assert.equal(village.researchPlan.verification.existenceVerification.permanentClosure.requireNoNewerOperationalSignal, true);
assert.equal(village.researchPlan.verification.existenceVerification.googleMapsPolicy.noReviewScraping, true);
assert.deepEqual(village.researchPlan.verification.sourceClasses['open-media'], ['wikimedia-commons']);
assert.equal(village.researchPlan.verification.reusePolicy.media.automaticDiscoverySource, 'wikimedia-commons');
assert.equal(village.researchPlan.verification.reusePolicy.media.requirePerAssetLicenseCheck, true);
assert.ok(village.researchPlan.verification.reusePolicy.media.allowedWhenCompliant.includes('cc-by-sa'));
assert.ok(village.researchPlan.verification.reusePolicy.media.rejectForCommercialAtlasUse.includes('cc-by-nc'));
assert.equal(village.researchPlan.verification.reusePolicy.domainSpecific['wikimedia-commons'], 'only-automatic-photo-search-source-check-each-file-license');
assert.equal('openverse' in village.researchPlan.verification.reusePolicy.domainSpecific, false, 'Openverse must not return to automatic photo discovery');
assert.equal('flickr' in village.researchPlan.verification.reusePolicy.domainSpecific, false, 'Flickr must not return to automatic photo discovery');
assert.equal(village.researchPlan.verification.reusePolicy.domainSpecific.unesco, 'authoritative-research-source-but-not-an-automatic-photo-source');

const persistedVillageTargets = structuredClone(village.cityData.categoryTargets);
const persistedVillageSubtargets = structuredClone(village.researchPlan.subcategoryTargets);
syncGenerationContract(village);
assert.deepEqual(village.cityData.categoryTargets, persistedVillageTargets, 'A normal generation refresh must never reroll automatic city targets');
assert.deepEqual(village.researchPlan.subcategoryTargets, persistedVillageSubtargets, 'A normal generation refresh must never reroll automatic subcategory targets');

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
assert.deepEqual(city.researchPlan.selection.searchArea.appliesTo, ['restaurants', 'cafes', 'accommodation', 'scooter-rental', 'gyms', 'markets', 'practical-services']);
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
setEditorialCategoryTarget(editorSelectedCity, 'things-to-do', 18);
assert.equal(editorSelectedCity.cityData.categoryTargets['things-to-do'], 18);
assert.deepEqual(editorSelectedCity.cityData.manualLocks['categoryTargets.things-to-do'], { value: 18, source: 'manual', locked: true });
const automaticBeforeRefresh = structuredClone(editorSelectedCity.cityData.categoryTargets);
syncGenerationContract(editorSelectedCity);
assert.equal(editorSelectedCity.cityData.categoryTargets['things-to-do'], 18, 'Generation refresh must preserve the admin/editor activity target');
assert.equal(editorSelectedCity.cityData.categoryTargets.restaurants, automaticBeforeRefresh.restaurants, 'Generation refresh must preserve the random-once restaurant target');
assert.deepEqual(editorSelectedCity.researchPlan.categoryTargetPolicies['things-to-do'], activityPolicy);
assert.equal(editorSelectedCity.researchPlan.selection.searchArea.maxRadiusKm, 3, 'Generation refresh must preserve the Laos selection contract');
assert.equal(editorSelectedCity.researchPlan.verification.existenceVerification.permanentClosure.independentExplicitClosureReportsThreshold, 3);

rerollAutomaticCategoryTargets(editorSelectedCity);
assert.equal(editorSelectedCity.cityData.categoryTargets['things-to-do'], 18, 'Explicit reroll must never alter the manually locked Things to do target');
within(editorSelectedCity.cityData.categoryTargets.restaurants, 19, 25, 'Rerolled city restaurants');
within(editorSelectedCity.cityData.categoryTargets.cafes, 19, 25, 'Rerolled city cafes');
within(editorSelectedCity.cityData.categoryTargets.accommodation, 19, 25, 'Rerolled city guesthouses');
within(editorSelectedCity.cityData.categoryTargets['scooter-rental'], 5, 12, 'Rerolled city scooter rentals');

const minimumActivities = emptyDraft('laos', 'minimum-activities', 'compact', 'village');
setEditorialCategoryTarget(minimumActivities, 'things-to-do', 5);
syncGenerationContract(minimumActivities);
assert.equal(minimumActivities.cityData.categoryTargets['things-to-do'], 5);
const maximumActivities = emptyDraft('laos', 'maximum-activities', 'compact', 'village');
setEditorialCategoryTarget(maximumActivities, 'things-to-do', 25);
syncGenerationContract(maximumActivities);
assert.equal(maximumActivities.cityData.categoryTargets['things-to-do'], 25);
assert.throws(() => setEditorialCategoryTarget(emptyDraft('laos', 'too-few', 'compact', 'city'), 'things-to-do', 4), /between 5 and 25/);
assert.throws(() => setEditorialCategoryTarget(emptyDraft('laos', 'too-many', 'compact', 'city'), 'things-to-do', 26), /between 5 and 25/);
assert.throws(() => setEditorialCategoryTarget(emptyDraft('laos', 'wrong-category', 'compact', 'city'), 'restaurants', 20), /not configured for editorial target selection/);

const unconfiguredCountry = emptyDraft('sri-lanka', 'test-city', 'standard', 'city');
assert.deepEqual(unconfiguredCountry.cityData.categoryTargets, {}, 'Countries without an explicit target contract must not inherit Laos numeric targets');
assert.deepEqual(unconfiguredCountry.researchPlan, {
  categoryTargetPolicies: {},
  subcategoryTargets: {},
  searchPriorities: {},
  selection: { searchArea: null, sourceStrategy: null, selectionPrinciples: null, categories: {} },
  verification: null,
});
assert.deepEqual(researchPlan('sri-lanka', 'city', 'sri-lanka/test-city'), unconfiguredCountry.researchPlan);

assert.throws(() => emptyDraft('laos', 'invalid', 'compact'), /Settlement type/);
assert.throws(() => emptyDraft('laos', 'invalid', 'compact', 'hamlet'), /Settlement type/);

console.log('SPA settlement, random-once Laos targets, selection, activities, and source verification contract tests passed.');
