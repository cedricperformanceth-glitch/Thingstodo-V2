import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

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

function deterministicRangeValue(seed, key, range) {
  const { min, max } = validateRange(range, key);
  const hash = crypto.createHash('sha256').update(`${seed}:${key}`).digest().readUInt32BE(0);
  return min + (hash % (max - min + 1));
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

export function categoryTargets(country, settlementType, seed, categories = SETTLEMENT_CATEGORIES[settlementType] ?? [], overrides = {}) {
  const rules = contentRuleFor(country, settlementType).categories ?? {};
  return Object.fromEntries(categories.flatMap((category) => {
    const rule = rules[category];
    if (!rule) return [];
    if (overrides[category] !== undefined) return [[category, validateTargetValue(overrides[category], rule, `${country}/${settlementType}/${category}`)]];
    if (rule.selectionMode === 'editorial') return [];
    return [[category, deterministicRangeValue(seed, category, defaultTargetRange(rule, `${country}/${settlementType}/${category}`))]];
  }));
}

export function categoryTargetPolicies(country, settlementType, categories = SETTLEMENT_CATEGORIES[settlementType] ?? []) {
  const rules = contentRuleFor(country, settlementType).categories ?? {};
  return Object.fromEntries(categories.flatMap((category) => {
    const rule = rules[category];
    if (!rule?.selectionMode) return [];
    validateRange(rule, `${country}/${settlementType}/${category}`);
    if (rule.idealMin !== undefined || rule.idealMax !== undefined) defaultTargetRange(rule, `${country}/${settlementType}/${category}`);
    return [[category, structuredClone(rule)]];
  }));
}

export function researchPlan(country, settlementType, seed, categories = SETTLEMENT_CATEGORIES[settlementType] ?? []) {
  const rules = contentRuleFor(country, settlementType);
  const allowedCategories = new Set(categories);
  const subcategoryTargets = {};
  for (const [category, subcategories] of Object.entries(rules.subcategories ?? {})) {
    if (!allowedCategories.has(category)) continue;
    subcategoryTargets[category] = Object.fromEntries(Object.entries(subcategories).map(([subcategory, range]) => [
      subcategory,
      deterministicRangeValue(seed, `${category}:${subcategory}`, range),
    ]));
  }
  const searchPriorities = Object.fromEntries(Object.entries(rules.searchPriorities ?? {}).filter(([category]) => allowedCategories.has(category)).map(([category, priorities]) => [category, [...priorities]]));
  return { categoryTargetPolicies: categoryTargetPolicies(country, settlementType, categories), subcategoryTargets, searchPriorities };
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
  const target = validateTargetValue(value, rule, `${country}/${settlementType}/${category}`);
  draft.cityData.categoryTargets ??= {};
  draft.cityData.manualLocks ??= {};
  draft.cityData.categoryTargets[category] = target;
  draft.cityData.manualLocks[`categoryTargets.${category}`] = { value: target, source: 'manual', locked: true };
  return target;
}

export function syncGenerationContract(draft) {
  const settlementType = draft.cityData?.settlementType;
  const categories = SETTLEMENT_CATEGORIES[settlementType];
  if (!categories) throw new Error(`Settlement type must be 'village' or 'city'; received '${settlementType ?? ''}'.`);
  const seed = `${draft.country}/${draft.city}`;
  const overrides = lockedCategoryTargetOverrides(draft.cityData);
  draft.cityData.categories = [...categories];
  draft.cityData.categoryTargets = categoryTargets(draft.country, settlementType, seed, categories, overrides);
  draft.researchPlan = researchPlan(draft.country, settlementType, seed, categories);
  return draft;
}

export function emptyDraft(country, city, profile, settlementType) {
  const categories = SETTLEMENT_CATEGORIES[settlementType];
  if (!categories) throw new Error(`Settlement type must be 'village' or 'city'; received '${settlementType ?? ''}'.`);
  const name = city.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
  const seed = `${country}/${city}`;
  return { schemaVersion: 1, country, city, profile, generatedAt: null, researchPlan: researchPlan(country, settlementType, seed, categories), cityData: {
    id: `city-${country}-${city}`, slug: city, name, country, profile, settlementType, coordinates: { latitude: 0, longitude: 0 }, description: '',
    categories: [...categories], categoryTargets: categoryTargets(country, settlementType, seed, categories),
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
