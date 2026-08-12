import { readFileSync } from 'node:fs';
import { validateSpaCardCandidate } from './spa-card-generation.mjs';
import { validateCityCategories } from './city-pipeline.mjs';

const contract = JSON.parse(readFileSync(new URL('../../pipeline/contracts/city-publish-qa.json', import.meta.url), 'utf8'));

export const CITY_PUBLISH_QA_CONTRACT = contract;

const clean = (value) => String(value ?? '').trim();
const normalizedIdentity = (value) => clean(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const imageOf = (entity) => entity?.image ?? entity?.media?.card?.image ?? null;
const isAutomaticEntity = (entity) => clean(entity?.sourceMetadata?.sourceName).toLowerCase() !== 'manual';
const normalizedLicense = (value) => clean(value).toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-');
const attributionRequired = (license) => ['cc-by', 'cc-by-sa'].includes(normalizedLicense(license));

function issue(severity, code, message, entity = null) {
  return { severity, code, message, ...(entity ? { entity } : {}) };
}

function uniqueIssues(issues) {
  const seen = new Set();
  return issues.filter((entry) => {
    const key = `${entry.severity}|${entry.code}|${entry.entity ?? ''}|${entry.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function checkDuplicateValues(items, keyFn, label, issues) {
  const seen = new Map();
  for (const item of items) {
    const value = clean(keyFn(item));
    if (!value) continue;
    if (seen.has(value)) {
      issues.push(issue('error', 'duplicate-entity', `Duplicate ${label}: ${value}`, item.slug || item.name));
    } else {
      seen.set(value, item);
    }
  }
}

function checkTargets(draft, entities, issues) {
  const targets = draft?.cityData?.categoryTargets ?? {};
  const counts = Object.fromEntries((draft?.cityData?.categories ?? []).map((category) => [category, 0]));
  for (const entity of entities) counts[entity.category] = (counts[entity.category] ?? 0) + 1;

  const thingsTarget = targets['things-to-do'];
  if (!Number.isInteger(thingsTarget)) {
    issues.push(issue('error', 'missing-things-target', 'Things to do requires the exact admin/editor target before publication.'));
  } else if ((counts['things-to-do'] ?? 0) !== thingsTarget) {
    issues.push(issue('error', 'things-target-mismatch', `Things to do must contain exactly ${thingsTarget} published activities; found ${counts['things-to-do'] ?? 0}.`));
  }

  for (const [category, target] of Object.entries(targets)) {
    if (category === 'things-to-do' || !Number.isInteger(target)) continue;
    if (!(draft?.cityData?.categories ?? []).includes(category)) {
      issues.push(issue('error', 'target-for-disabled-category', `Category target '${category}' exists but the category is not enabled in City.categories.`));
      continue;
    }
    const actual = counts[category] ?? 0;
    if (actual !== target) {
      issues.push(issue('error', 'category-target-mismatch', `${category} must contain exactly its generated target of ${target}; found ${actual}.`));
    }
  }
  return counts;
}

function checkExploreBoard(draft, things, issues) {
  const cityKey = `${draft.country}/${draft.city}`;
  const featuredIds = draft?.cityData?.exploreBoard?.featuredThingIds ?? [];
  if (featuredIds.length !== 3) issues.push(issue('error', 'explore-board-count', `${cityKey}: Explore Board requires exactly 3 landmarks; found ${featuredIds.length}.`));
  if (new Set(featuredIds).size !== featuredIds.length) issues.push(issue('error', 'explore-board-duplicate', `${cityKey}: Explore Board landmark IDs must be unique.`));
  for (const id of featuredIds) {
    const thing = things.find((candidate) => candidate.id === id);
    if (!thing) {
      issues.push(issue('error', 'explore-board-missing-thing', `Explore Board references missing ThingToDo '${id}'.`, id));
      continue;
    }
    if (thing.isLandmark !== true) issues.push(issue('error', 'explore-board-not-landmark', `Explore Board entry '${id}' is not marked as a landmark.`, thing.slug));
    if (!thing.exploreBoard?.kicker || !thing.exploreBoard?.duration || !thing.exploreBoard?.route) {
      issues.push(issue('error', 'explore-board-metadata', `Explore Board metadata is incomplete for '${id}'.`, thing.slug));
    }
    if (!imageOf(thing)?.src) {
      issues.push(issue('error', 'explore-board-photo', `Explore Board landmark '${id}' still requires a real shared activity image.`, thing.slug));
    }
  }
}

function checkEntityIdentity(entity, kind, draft, issues) {
  const label = entity.slug || entity.name || entity.id || 'unnamed';
  if (!clean(entity.id)) issues.push(issue('error', 'missing-entity-id', 'Entity id is required before publication.', label));
  if (!clean(entity.slug)) issues.push(issue('error', 'missing-entity-slug', 'Entity slug is required before publication.', label));
  if (entity.country !== draft.country || entity.city !== draft.city) {
    issues.push(issue('error', 'entity-destination-mismatch', `Entity destination must be ${draft.country}/${draft.city}; received ${entity.country ?? '?'}/${entity.city ?? '?'}.`, label));
  }
  if (kind === 'place' && entity.category === 'things-to-do') {
    issues.push(issue('error', 'entity-kind-category-mismatch', 'Place records cannot use the things-to-do category.', label));
  }
  if (kind === 'thing-to-do' && entity.category !== 'things-to-do') {
    issues.push(issue('error', 'entity-kind-category-mismatch', `ThingToDo records must use the things-to-do category; received '${entity.category ?? ''}'.`, label));
  }
  const latitude = Number(entity?.coordinates?.latitude);
  const longitude = Number(entity?.coordinates?.longitude);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    issues.push(issue('error', 'invalid-coordinates', 'Entity coordinates must contain valid latitude/longitude values.', label));
  }
}

function checkTransientFields(entity, issues) {
  const label = entity.slug || entity.name || entity.id || 'unnamed';
  for (const field of contract.transientGenerationFieldsForbidden ?? []) {
    if (field in (entity ?? {})) {
      issues.push(issue('error', 'transient-generation-field', `Generation-only field '${field}' must not leak into published content.`, label));
    }
  }
  if ('isMySelection' in (entity ?? {})) issues.push(issue('error', 'legacy-selection-field', "Legacy field 'isMySelection' is forbidden.", label));
  if ('selectionRank' in (entity ?? {})) issues.push(issue('error', 'legacy-selection-field', "Legacy field 'selectionRank' is forbidden.", label));
}

function checkMedia(entity, issues) {
  const label = entity.slug || entity.name || entity.id || 'unnamed';
  const image = imageOf(entity);
  if (!image?.src) {
    issues.push(issue('warning', 'missing-spa-photo', 'No qualified photo was found. The empty Photo to add placeholder is valid and requires manual fill.', label));
    return;
  }

  if (contract.media.photoPresentRequiresVerifiedStatus && entity?.spaCard?.photoStatus !== 'verified') {
    issues.push(issue('error', 'photo-status', `A present SPA photo must have photoStatus=verified; received '${entity?.spaCard?.photoStatus ?? 'missing'}'.`, label));
  }
  if (entity?.spaCard?.photoRequiresManualFill === true) {
    issues.push(issue('error', 'photo-status', 'A present SPA photo cannot still require manual fill.', label));
  }

  if (image.manual !== true) {
    const license = normalizedLicense(image.license);
    const accepted = new Set(contract.media.acceptedAutomaticLicenses ?? []);
    if (!accepted.has(license)) {
      issues.push(issue('error', 'photo-license', `Automatic SPA photo license '${license || 'unknown'}' is not publishable.`, label));
    }
    if (!clean(image.sourceUrl)) {
      issues.push(issue('error', 'photo-source', 'Automatic SPA photo must retain its source URL.', label));
    }
  }

  if (attributionRequired(image.license) && (!clean(image.author) || !clean(image.sourceUrl))) {
    issues.push(issue('error', 'photo-attribution', 'CC BY/CC BY-SA photo is missing author or source URL attribution metadata.', label));
  }
}

function checkEntity(entity, kind, draft, allowedCategories, issues) {
  const label = entity.slug || entity.name || entity.id || 'unnamed';
  checkEntityIdentity(entity, kind, draft, issues);
  checkTransientFields(entity, issues);

  if (!allowedCategories.has(entity.category)) {
    issues.push(issue('error', 'invalid-category', `Category '${entity.category ?? ''}' is not enabled in City.categories.`, label));
  }

  const spaValidation = validateSpaCardCandidate(entity, kind);
  for (const message of spaValidation.errors) issues.push(issue('error', 'spa-card-contract', message, label));

  if (isAutomaticEntity(entity)) {
    if (entity?.verification?.decision !== contract.verification.publishableAutomaticEntityDecision) {
      issues.push(issue('error', 'source-verification', `Automatic entity must have verification.decision=accept; received '${entity?.verification?.decision ?? 'missing'}'.`, label));
    }
    if (!Array.isArray(entity.researchSources) || entity.researchSources.length === 0) {
      issues.push(issue('error', 'missing-research-source', 'Automatic entity must retain at least one research source.', label));
    }
  } else if (entity?.verification?.decision && entity.verification.decision !== 'accept') {
    issues.push(issue('error', 'source-verification', `Entity verification is '${entity.verification.decision}', so it cannot be published automatically.`, label));
  }

  checkMedia(entity, issues);
}

export function evaluateCityPublication(draft) {
  const issues = [];
  const settlementType = draft?.cityData?.settlementType;
  const actualCategories = draft?.cityData?.categories ?? [];
  const cityKey = `${draft?.country ?? '?'}/${draft?.city ?? '?'}`;
  let configuredCategories = [];

  try {
    configuredCategories = validateCityCategories(actualCategories, settlementType, cityKey);
  } catch (error) {
    issues.push(issue('error', 'city-category-contract', error instanceof Error ? error.message : String(error)));
  }

  const places = draft?.places ?? [];
  const things = draft?.things ?? [];
  const entities = [...places, ...things];
  const allowedCategories = new Set(configuredCategories);

  checkDuplicateValues(entities, (entity) => entity.id, 'entity ID', issues);
  checkDuplicateValues(entities, (entity) => entity.slug, 'entity slug', issues);
  checkDuplicateValues(entities, (entity) => normalizedIdentity(entity.name), 'normalized entity name', issues);

  for (const place of places) checkEntity(place, 'place', draft, allowedCategories, issues);
  for (const thing of things) checkEntity(thing, 'thing-to-do', draft, allowedCategories, issues);

  const counts = checkTargets(draft, entities, issues);
  checkExploreBoard(draft, things, issues);

  const finalIssues = uniqueIssues(issues);
  const errors = finalIssues.filter((entry) => entry.severity === 'error');
  const warnings = finalIssues.filter((entry) => entry.severity === 'warning');
  const status = errors.length
    ? contract.statuses.blocked
    : warnings.length
      ? contract.statuses.readyWithWarnings
      : contract.statuses.ready;

  return {
    status,
    city: cityKey,
    counts,
    errors,
    warnings,
    summary: {
      errors: errors.length,
      warnings: warnings.length,
      places: places.length,
      thingsToDo: things.length,
    },
  };
}

export function assertCityPublishable(draft) {
  const report = evaluateCityPublication(draft);
  if (report.status === contract.statuses.blocked) {
    const details = report.errors.map((entry) => `${entry.entity ? `${entry.entity}: ` : ''}${entry.message}`).join('\n');
    throw new Error(`City publication QA blocked ${report.city}:\n${details}`);
  }
  return report;
}
