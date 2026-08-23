import { readFileSync } from 'node:fs';
import { selectionPlan } from './content-selection.mjs';

const spaCategoryOrder = JSON.parse(readFileSync(new URL('../../src/core/contracts/spa-categories.json', import.meta.url), 'utf8'));
const sourceVerificationRules = JSON.parse(readFileSync(new URL('../../pipeline/contracts/source-verification.json', import.meta.url), 'utf8'));

export const CATEGORY_LABELS = {
  'things-to-do': 'Things to do', restaurants: 'Restaurants', cafes: 'Coffee', accommodation: 'Guest Houses',
  'scooter-rental': 'Rental Scooter', gyms: 'Gym & Fitness', markets: 'Market & Shopping', 'practical-services': 'Essential Information',
};
export const SETTLEMENT_CATEGORIES = Object.freeze({
  village: Object.freeze([...spaCategoryOrder.village]),
  city: Object.freeze([...spaCategoryOrder.city]),
});
export const PROFILE_CATEGORIES = SETTLEMENT_CATEGORIES.city;
const BLOCKED_MEDIA_HOSTS = ['tripadvisor.', 'booking.com', 'expedia.', 'lonelyplanet.', 'theculturetrip.'];

export function slugify(value) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

export function researchPlan(country, _settlementType, _seed, categories = []) {
  return {
    selection: selectionPlan(country, categories),
    verification: sourceVerificationRules[country] ? structuredClone(sourceVerificationRules[country]) : null,
  };
}

export function setCategoryTarget(draft, category, value) {
  if (!draft?.cityData?.categories?.includes(category)) throw new Error(`Category '${category}' is not enabled for ${draft?.country ?? draft?.cityData?.country ?? 'city'}/${draft?.city ?? draft?.cityData?.slug ?? 'city'}.`);
  if (!Number.isInteger(value) || value < 0) throw new Error(`Category count for '${category}' must be a non-negative integer; received ${value}.`);
  draft.cityData.categoryTargets ??= {};
  draft.cityData.categoryTargets[category] = value;
  return value;
}

export function getManualLock(record, fieldPath) { return record?.manualLocks?.[fieldPath]; }
export function isManualLocked(record, fieldPath) {
  const paths = String(fieldPath).split('.');
  return paths.some((_, index) => {
    const lock = getManualLock(record, paths.slice(0, index + 1).join('.'));
    return lock?.source === 'manual' && lock?.locked === true;
  });
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
  draft.cityData.categories = categories;
  draft.cityData.categoryTargets = Object.fromEntries(
    Object.entries(draft.cityData?.categoryTargets ?? {}).filter(([category]) => categories.includes(category)),
  );
  draft.researchPlan = researchPlan(draft.country, settlementType, `${draft.country}/${draft.city}`, categories);
  return draft;
}

export function emptyDraft(country, city, profile, settlementType) {
  const categories = SETTLEMENT_CATEGORIES[settlementType];
  if (!categories) throw new Error(`Settlement type must be 'village' or 'city'; received '${settlementType ?? ''}'.`);
  const name = city.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
  const plan = researchPlan(country, settlementType, `${country}/${city}`, categories);
  return { schemaVersion: 1, country, city, profile, researchPlan: plan, cityData: {
    id: `city-${country}-${city}`, slug: city, name, country, profile, settlementType, coordinates: { latitude: 0, longitude: 0 }, description: '',
    categories: [...categories], categoryTargets: {},
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
