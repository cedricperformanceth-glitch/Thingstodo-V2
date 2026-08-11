import crypto from 'node:crypto';

export const CATEGORY_LABELS = {
  'things-to-do': 'Things to do', restaurants: 'Restaurants', cafes: 'Cafés', accommodation: 'Accommodation',
  'scooter-rental': 'Scooter rental', gyms: 'Gyms & fitness', markets: 'Markets & shopping', 'practical-services': 'Essential information',
};
export const PROFILE_CATEGORIES = ['things-to-do', 'restaurants', 'cafes', 'accommodation', 'scooter-rental', 'markets', 'practical-services'];
const PRACTICAL = new Set(['restaurants', 'cafes', 'accommodation', 'scooter-rental', 'gyms', 'markets', 'practical-services']);
const RANGES = { compact: [15, 19], standard: [18, 22], large: [21, 25] };
const BLOCKED_MEDIA_HOSTS = ['tripadvisor.', 'booking.com', 'expedia.', 'lonelyplanet.', 'theculturetrip.'];

export function slugify(value) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
export function categoryTargets(profile, seed) {
  const [min, max] = RANGES[profile];
  return Object.fromEntries(PROFILE_CATEGORIES.filter((category) => PRACTICAL.has(category)).map((category) => {
    const hash = crypto.createHash('sha256').update(`${seed}:${category}`).digest()[0];
    return [category, min + (hash % (max - min + 1))];
  }));
}
export function emptyDraft(country, city, profile) {
  const name = city.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
  return { schemaVersion: 1, country, city, profile, generatedAt: null, cityData: {
    id: `city-${country}-${city}`, slug: city, name, country, profile, coordinates: { latitude: 0, longitude: 0 }, description: '',
    categories: PROFILE_CATEGORIES, categoryTargets: categoryTargets(profile, `${country}/${city}`),
    hero: { eyebrow: country, title: name, subtitle: '', facts: [] },
    exploreBoard: { featuredThingIds: [] },
    manualLocks: {}, seo: { title: `${name} travel guide | Things To Do Atlas`, description: '', canonicalPath: `/${country}/${city}`, indexable: true },
  }, places: [], things: [] };
}
// One lock convention applies to city, place and ThingToDo records:
// record.manualLocks['nested.field'] = { source: 'manual', locked: true, value }
export function getManualLock(record, fieldPath) { return record?.manualLocks?.[fieldPath]; }
export function isManualLocked(record, fieldPath) {
  const paths = String(fieldPath).split('.');
  return paths.some((_, index) => {
    const lock = getManualLock(record, paths.slice(0, index + 1).join('.'));
    return lock?.source === 'manual' && lock?.locked === true;
  });
}
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
