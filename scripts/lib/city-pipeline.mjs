import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import { selectionPlan } from './content-selection.mjs';
import { sourceVerificationPlan } from './source-verification.mjs';

const spaCategoryOrder = JSON.parse(readFileSync(new URL('../../src/core/contracts/spa-categories.json', import.meta.url), 'utf8'));
const contentTargetRules = JSON.parse(readFileSync(new URL('../../pipeline/contracts/content-targets.json', import.meta.url), 'utf8'));

export const CATEGORY_LABELS = {
  'things-to-do': 'Things to do', restaurants: 'Restaurants', cafes: 'Coffee', accommodation: 'Guest Houses',
  'scooter-rental': 'Rental Scooter', gyms: 'Gym & Fitness', markets: 'Market & Shopping', 'practical-services': 'Essential Information',
};
export const SETTLEMENT_CATEGORIES = Object.freeze({
  village: Object.freeze([...spaCategoryOrder.village]),
  city: Object.freeze([...spaCategoryOrder.city]),
});
export const PROFILE_CATEGORIES = SETTLEMENT_CATEGORIES.city;
export const CONTENT_TARGET_RULES = contentTargetRules;
const BLOCKED_MEDIA_HOSTS = ['tripadvisor.', 'booking.com', 'expedia.', 'lonelyplanet.', 'theculturetrip.'];
const EMPTY_RULE = Object.freeze({ categories: {}, subcategories: {}, searchPriorities: {} });

export function slugify(value) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

export function contentRuleFor(country, settlementType) {
  return contentTargetRules[country]?.[settlementType] ?? EMPTY_RULE;
}

function validateRange(range, key) {
  const min = Number(range?.min);
  const max = Number(range?.max);
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) throw new Error(`Invalid content target range for ${key}: ${range?.min ?? '?'}-${range?.max ?? '?'}`);
  return { min, max };
}

export function randomRangeValue(range, key, randomInt = crypto.randomInt) {
  const { min, max } = validateRange(range, key);
  return randomInt(min, max + 1);
}

function defaultTargetRange(rule, key) {
  const hardRange = validateRange(rule, key);
  if (rule?.idealMin === undefined && rule?.idealMax === undefined) return hardRange;
  const idealMin = Number(rule.idealMin);
  const idealMax = Number(rule.idealMax);
  if (!Number.isInteger(idealMin) || !Number.isInteger(idealMax) || idealMin > idealMax || idealMin < hardRange.min || idealMax > hardRange.max) {
    throw new Error(`Invalid ideal content target range for ${key}: ${rule?.idealMin ?? '?'}-${rule?.idealMax ?? '?'}`);
  }
  return { min: idealMin, max: idealMax };
}

function validateTargetValue(value, rule, key) {
  const { min, max } = validateRange(rule, key);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`Content target override for ${key} must be an integer between ${min} and ${max}; received ${value}`);
  return value;
}

function assertAutomaticSelectionMode(rule, key) {
  if (rule?.selectionMode && !['editorial', 'random-once'].includes(rule.selectionMode)) {
    throw new Error(`Unsupported content target selection mode for ${key}: ${rule.selectionMode}`);
  }
}

function avoidUniformAutomaticTargets(targets, rules, automaticCategories, newlyDrawn, country, settlementType) {
  const active = automaticCategories.filter((category) => Number.isInteger(targets[category]));
  if (active.length < 2 || new Set(active.map((category) => targets[category])).size > 1 || newlyDrawn.length === 0) return;

  const category = [...newlyDrawn].reverse().find((candidate) => {
    const range = defaultTargetRange(rules[candidate], `${country}/${settlementType}/${candidate}`);
    return range.min < range.max;
  });
  if (!category) return;

  const key = `${country}/${settlementType}/${category}`;
  const range = defaultTargetRange(rules[category], key);
  const current = targets[category];
  let replacement = current;
  for (let attempt = 0; attempt < 12 && replacement === current; attempt += 1) {
    replacement = randomRangeValue(range, key);
  }
  if (replacement === current) replacement = current === range.min ? range.min + 1 : range.min;
  targets[category] = replacement;
}

export function categoryTargets(country, settlementType, _seed, categories = SETTLEMENT_CATEGORIES[settlementType] ?? [], overrides = {}, existing = {}) {
  const rules = contentRuleFor(country, settlementType).categories ?? {};
  const targets = {};
  const newlyDrawn = [];
  const automaticCategories = [];

  for (const category of categories) {
    const rule = rules[category];
    if (!rule) continue;
    const key = `${country}/${settlementType}/${category}`;
    assertAutomaticSelectionMode(rule, key);
    if (overrides[category] !== undefined) {
      targets[category] = validateTargetValue(overrides[category], rule, key);
      continue;
    }
    if (rule.selectionMode === 'editorial') continue;
    automaticCategories.push(category);
    if (existing[category] !== undefined) {
      targets[category] = validateTargetValue(existing[category], rule, key);
      continue;
    }
    targets[category] = randomRangeValue(defaultTargetRange(rule, key), key);
    newlyDrawn.push(category);
  }

  avoidUniformAutomaticTargets(targets, rules, automaticCategories, newlyDrawn, country, settlementType);
  return targets;
}

export function categoryTargetPolicies(country, settlementType, categories = SETTLEMENT_CATEGORIES[settlementType] ?? []) {
  const rules = contentRuleFor(country, settlementType).categories ?? {};
  return Object.fromEntries(categories.flatMap((category) => {
    const rule = rules[category];
    if (rule?.selectionMode !== 'editorial') return [];
    validateRange(rule, `${country}/${settlementType}/${category}`);
    if (rule.idealMin !== undefined || rule.idealMax !== undefined) defaultTargetRange(rule, `${country}/${settlementType}/${category}`);
    return [[category, structuredClone(rule)]];
  }));
}

export function researchPlan(country, settlementType, _seed, categories = SETTLEMENT_CATEGORIES[settlementType] ?? [], existingPlan = {}) {
  const rules = contentRuleFor(country, settlementType);
  const allowedCategories = new Set(categories);
  const existingSubcategoryTargets = existingPlan?.subcategoryTargets ?? {};
  const subcategoryTargets = {};
  for (const [category, subcategories] of Object.entries(rules.subcategories ?? {})) {
    if (!allowedCategories.has(category)) continue;
    subcategoryTargets[category] = Object.fromEntries(Object.entries(subcategories).map(([subcategory, range]) => {
      const key = `${country}/${settlementType}/${category}:${subcategory}`;
      const existing = existingSubcategoryTargets?.[category]?.[subcategory];
      const value = existing !== undefined
        ? validateTargetValue(existing, range, key)
        : randomRangeValue(defaultTargetRange(range, key), key);
      return [subcategory, value];
    }));
  }
  const searchPriorities = Object.fromEntries(Object.entries(rules.searchPriorities ?? {}).filter(([category]) => allowedCategories.has(category)).map(([category, priorities]) => [category, [...priorities]]));
  return {
    categoryTargetPolicies: categoryTargetPolicies(country, settlementType, categories),
    subcategoryTargets,
    searchPriorities,
    selection: selectionPlan(country, categories),
    verification: sourceVerificationPlan(country),
  };
}

export function getManualLock(record, fieldPath) { return record?.manualLocks?.[fieldPath]; }
export function isManualLocked(record, fieldPath) {
  const paths = String(fieldPath).split('.');
  return paths.some((_, index) => {
    const lock = getManualLock(record, paths.slice(0, index + 1).join('.'));
    return lock?.source === 'manual' && lock?.locked === true;
  });
}

export function lockedCategoryTargetOverrides(cityData) {
  return Object.fromEntries(Object.entries(cityData?.categoryTargets ?? {}).filter(([category]) => isManualLocked(cityData, `categoryTargets.${category}`)));
}

export function setEditorialCategoryTarget(draft, category, value) {
  const country = draft?.country ?? draft?.cityData?.country;
  const settlementType = draft?.cityData?.settlementType;
  const rule = contentRuleFor(country, settlementType).categories?.[category];
  if (!rule || rule.selectionMode !== 'editorial') throw new Error(`Category '${category}' is not configured for editorial target selection in ${country}/${settlementType}.`);
  if (!draft?.cityData?.categories?.includes(category)) throw new Error(`Category '${category}' is not enabled for ${country}/${draft?.city ?? draft?.cityData?.slug ?? 'city'}.`);
  const target = validateTargetValue(value, rule, `${country}/${settlementType}/${category}`);
  draft.cityData.categoryTargets ??= {};
  draft.cityData.manualLocks ??= {};
  draft.cityData.categoryTargets[category] = target;
  draft.cityData.manualLocks[`categoryTargets.${category}`] = { value: target, source: 'manual', locked: true };
  return target;
}

export function validateCityCategories(categories, settlementType, key = 'city') {
  const allowedCategories = SETTLEMENT_CATEGORIES[settlementType];
  if (!allowedCategories) throw new Error(`Settlement type must be 'village' or 'city'; received '${settlementType ?? ''}'.`);
  if (!Array.isArray(categories) || categories.length === 0) throw new Error(`City categories are required for ${key}.`);
  if (new Set(categories).size !== categories.length) throw new Error(`City categories must be unique for ${key}.`);
  const allowed = new Set(allowedCategories);
  const invalid = categories.filter((category) => !allowed.has(category));
  if (invalid.length) throw new Error(`City categories are not allowed for ${settlementType} ${key}: ${invalid.join(', ')}`);
  if (!categories.includes('things-to-do')) throw new Error(`City categories must include things-to-do for ${key}.`);
  return [...categories];
}

export function syncGenerationContract(draft) {
  const settlementType = draft.cityData?.settlementType;
  const defaultCategories = SETTLEMENT_CATEGORIES[settlementType];
  if (!defaultCategories) throw new Error(`Settlement type must be 'village' or 'city'; received '${settlementType ?? ''}'.`);
  const categories = validateCityCategories(
    Array.isArray(draft.cityData?.categories) && draft.cityData.categories.length ? draft.cityData.categories : defaultCategories,
    settlementType,
    `${draft.country}/${draft.city}`,
  );
  const seed = `${draft.country}/${draft.city}`;
  const overrides = lockedCategoryTargetOverrides(draft.cityData);
  const existingTargets = structuredClone(draft.cityData?.categoryTargets ?? {});
  const existingPlan = structuredClone(draft.researchPlan ?? {});
  draft.cityData.categories = categories;
  draft.cityData.categoryTargets = categoryTargets(draft.country, settlementType, seed, categories, overrides, existingTargets);
  draft.researchPlan = researchPlan(draft.country, settlementType, seed, categories, existingPlan);
  return draft;
}

export function rerollAutomaticCategoryTargets(draft) {
  draft.cityData.categoryTargets = lockedCategoryTargetOverrides(draft.cityData);
  if (draft.researchPlan) draft.researchPlan.subcategoryTargets = {};
  return syncGenerationContract(draft);
}

export function emptyDraft(country, city, profile, settlementType) {
  const categories = SETTLEMENT_CATEGORIES[settlementType];
  if (!categories) throw new Error(`Settlement type must be 'village' or 'city'; received '${settlementType ?? ''}'.`);
  const name = city.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
  const seed = `${country}/${city}`;
  const targets = categoryTargets(country, settlementType, seed, categories);
  const plan = researchPlan(country, settlementType, seed, categories);
  return { schemaVersion: 1, country, city, profile, generatedAt: null, researchPlan: plan, cityData: {
    id: `city-${country}-${city}`, slug: city, name, country, profile, settlementType, coordinates: { latitude: 0, longitude: 0 }, description: '',
    categories: [...categories], categoryTargets: targets,
    hero: { eyebrow: country, title: name, subtitle: '', facts: [] },
    exploreBoard: { featuredThingIds: [] },
    manualLocks: {}, seo: { title: `${name} travel guide | Things To Do Atlas`, description: '', canonicalPath: `/${country}/${city}`, indexable: true },
  }, places: [], things: [] };
}
// One lock convention applies to city, place and ThingToDo records:
// record.manualLocks['nested.field'] = { source: 'manual', locked: true, value }
function setPath(record, fieldPath, value) {
  const paths = String(fieldPath).split('.');
  const last = paths.pop();
  const parent = paths.reduce((current, key) => (current[key] ??= {}), record);
  parent[last] = value;
}
export function assignUnlocked(record, fieldPath, value) { if (!isManualLocked(record, fieldPath)) setPath(record, fieldPath, value); }
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const clone = (value) => value === undefined ? value : structuredClone(value);
// Generated values are merged into editorial records one path at a time. Existing
// manualLocks are never generated data, so they are deliberately skipped.
export function mergeGenerated(existing, incoming, path = '', lockOwner = existing) {
  if (incoming === undefined) return existing;
  if (isManualLocked(lockOwner, path) && path) return existing;
  if (!isObject(incoming) || !isObject(existing)) return clone(incoming);
  const result = existing;
  for (const [key, value] of Object.entries(incoming)) {
    if (key === 'manualLocks') continue;
    const childPath = path ? `${path}.${key}` : key;
    if (isManualLocked(lockOwner, childPath)) continue;
    if (isObject(value) && isObject(result[key])) result[key] = mergeGenerated(result[key], value, childPath, lockOwner);
    else result[key] = clone(value);
  }
  return result;
}
export function validateSource(source) {
  const url = (source.sourceUrl ?? '').toLowerCase();
  if (source.purpose === 'candidate-discovery' && source.sourceName?.toLowerCase().includes('tripadvisor') && source.use !== 'name-only') throw new Error('TripAdvisor may only be used for name-only candidate discovery.');
  if (source.purpose !== 'candidate-discovery' && /tripadvisor|booking\.com/.test(url)) throw new Error(`Competing guide/booking source is not publishable: ${source.sourceUrl}`);
  if (source.purpose === 'media' && BLOCKED_MEDIA_HOSTS.some((host) => url.includes(host))) throw new Error(`Media source is not permitted: ${source.sourceUrl}`);
}
export function chooseFieldCardTemplate(candidate) { return (candidate.facts?.length ?? 0) >= 5 || (candidate.sections?.length ?? 0) >= 5 ? 'deep' : 'compact'; }
export function tsModule(draft) {
  const output = { city: draft.cityData, places: draft.places, things: draft.things };
  return `import type { City, Place, ThingToDo } from '../../../core/models/types';\n\n// Generated by the development-only Atlas pipeline. Manual locks are retained in the source container.\nconst data = ${JSON.stringify(output, null, 2)};\nexport const city = data.city as City;\nexport const places = data.places as Place[];\nexport const things = data.things as ThingToDo[];\n`;
}
