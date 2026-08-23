import assert from 'node:assert/strict';
import {
  emptyDraft,
  researchPlan,
  setCategoryTarget,
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

const village = emptyDraft('laos', 'test-village', 'compact', 'village');
assert.equal(village.cityData.settlementType, 'village');
assert.deepEqual(village.cityData.categories, SETTLEMENT_CATEGORIES.village);
assert.deepEqual(village.cityData.categoryTargets, {}, 'New cities must not invent numeric category counts.');
assert.deepEqual(village.researchPlan.selection.searchArea, {
  scope: 'settlement-first',
  preferredRadiusKm: 2,
  maxRadiusKm: 3,
  appliesTo: ['restaurants', 'cafes', 'accommodation', 'practical-services'],
});
assert.equal(village.researchPlan.selection.searchArea.appliesTo.includes('things-to-do'), false, 'Practical-address radius must not constrain Things to do');
assert.equal(village.researchPlan.selection.categories['things-to-do'].useExistingAtlasDatabaseAsPrioritySeed, true);
assert.equal(village.researchPlan.selection.categories['things-to-do'].locationScope, 'destination-linked-without-fixed-radius');
assert.equal(village.researchPlan.selection.categories['things-to-do'].avoidNearDuplicates, true);
assert.equal('hardMin' in village.researchPlan.selection.categories['things-to-do'], false);
assert.equal('hardMax' in village.researchPlan.selection.categories['things-to-do'], false);
assert.equal('targetControlledByAdmin' in village.researchPlan.selection.categories['things-to-do'], false);
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

setCategoryTarget(village, 'things-to-do', 3);
setCategoryTarget(village, 'restaurants', 2);
setCategoryTarget(village, 'cafes', 1);
setCategoryTarget(village, 'accommodation', 0);
assert.deepEqual(village.cityData.categoryTargets, {
  'things-to-do': 3,
  restaurants: 2,
  cafes: 1,
  accommodation: 0,
});
syncGenerationContract(village);
assert.deepEqual(village.cityData.categoryTargets, {
  'things-to-do': 3,
  restaurants: 2,
  cafes: 1,
  accommodation: 0,
}, 'Generation refresh must preserve admin-selected counts exactly.');
assert.deepEqual(Object.keys(village.researchPlan).sort(), ['selection', 'verification']);

const city = emptyDraft('laos', 'test-city', 'standard', 'city');
assert.equal(city.cityData.settlementType, 'city');
assert.deepEqual(city.cityData.categories, SETTLEMENT_CATEGORIES.city);
assert.deepEqual(city.cityData.categoryTargets, {});
assert.deepEqual(city.researchPlan.selection.searchArea.appliesTo, ['restaurants', 'cafes', 'accommodation', 'scooter-rental', 'gyms', 'markets', 'practical-services']);
assert.deepEqual(city.researchPlan.selection.categories.markets.venueTypes, ['market', 'night-market']);
assert.equal('minimum' in city.researchPlan.selection.categories.markets, false);
assert.equal('minimum' in city.researchPlan.selection.categories.gyms, false);
assert.equal('groups' in city.researchPlan.selection.categories.gyms, false);
assert.equal(city.researchPlan.selection.categories['scooter-rental'].automaticSubcategoryFilters, false);
assert.equal(city.researchPlan.selection.selectionPrinciples.pricePositioning, 'mostly-affordable-and-midrange');
assert.equal(city.researchPlan.selection.selectionPrinciples.avoidUltraLuxury, true);
assert.equal(city.researchPlan.selection.selectionPrinciples.requireVariety, true);

const arbitraryCounts = emptyDraft('laos', 'arbitrary-counts', 'large', 'city');
for (const [category, value] of Object.entries({
  'things-to-do': 2,
  restaurants: 8,
  cafes: 4,
  accommodation: 6,
  'scooter-rental': 1,
  gyms: 0,
  markets: 2,
  'practical-services': 1,
})) setCategoryTarget(arbitraryCounts, category, value);
syncGenerationContract(arbitraryCounts);
assert.deepEqual(arbitraryCounts.cityData.categoryTargets, {
  'things-to-do': 2,
  restaurants: 8,
  cafes: 4,
  accommodation: 6,
  'scooter-rental': 1,
  gyms: 0,
  markets: 2,
  'practical-services': 1,
}, 'Admin counts are arbitrary non-negative integers and must not be constrained by country ranges.');
assert.equal(Object.keys(arbitraryCounts.cityData.manualLocks).some((key) => key.startsWith('categoryTargets.')), false, 'Admin category counts do not need duplicate manual-lock records.');

assert.throws(() => setCategoryTarget(emptyDraft('laos', 'bad-count', 'compact', 'city'), 'restaurants', -1), /non-negative integer/);
assert.throws(() => setCategoryTarget(emptyDraft('laos', 'wrong-category', 'compact', 'village'), 'gyms', 2), /not enabled/);

const unconfiguredCountry = emptyDraft('sri-lanka', 'test-city', 'standard', 'city');
assert.deepEqual(unconfiguredCountry.cityData.categoryTargets, {});
assert.deepEqual(unconfiguredCountry.researchPlan, {
  selection: { searchArea: null, sourceStrategy: null, selectionPrinciples: null, categories: {} },
  verification: null,
});
assert.deepEqual(researchPlan('sri-lanka', 'city', 'sri-lanka/test-city'), unconfiguredCountry.researchPlan);

assert.throws(() => emptyDraft('laos', 'invalid', 'compact'), /Settlement type/);
assert.throws(() => emptyDraft('laos', 'invalid', 'compact', 'hamlet'), /Settlement type/);

console.log('SPA settlement, admin category counts, selection, and source verification contract tests passed.');
