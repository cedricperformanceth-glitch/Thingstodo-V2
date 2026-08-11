import type { AtlasEntity } from '../../core/models/types';

export const MY_ATLAS_STORAGE_KEY = 'thingsToDoAtlas.makeYourOwnAtlas.v1';
export const MY_ATLAS_EVENT = 'atlas:my-atlas-changed';

export interface TripEntry {
  id: string;
  slug: string;
  name: string;
  country: string;
  city: string;
  category: string;
  shortDescription: string;
  kind: 'place' | 'thing-to-do';
  sourcePath: string;
  savedAt: string;
}

export interface TripStore {
  entries: TripEntry[];
}

const emptyStore = (): TripStore => ({ entries: [] });

const isBrowser = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const normalizeEntry = (value: Partial<TripEntry>): TripEntry | null => {
  if (!value.id || !value.name || !value.country || !value.city) return null;
  return {
    id: String(value.id),
    slug: String(value.slug ?? ''),
    name: String(value.name),
    country: String(value.country),
    city: String(value.city),
    category: String(value.category ?? 'things-to-do'),
    shortDescription: String(value.shortDescription ?? ''),
    kind: value.kind === 'thing-to-do' ? 'thing-to-do' : 'place',
    sourcePath: String(value.sourcePath ?? ''),
    savedAt: String(value.savedAt ?? new Date().toISOString()),
  };
};

export const readTripStore = (): TripStore => {
  if (!isBrowser()) return emptyStore();
  try {
    const parsed = JSON.parse(localStorage.getItem(MY_ATLAS_STORAGE_KEY) ?? 'null');
    if (!parsed || !Array.isArray(parsed.entries)) return emptyStore();
    return {
      entries: parsed.entries
        .map((entry: Partial<TripEntry>) => normalizeEntry(entry))
        .filter((entry: TripEntry | null): entry is TripEntry => Boolean(entry)),
    };
  } catch {
    return emptyStore();
  }
};

const writeTripStore = (store: TripStore) => {
  if (!isBrowser()) return;
  localStorage.setItem(MY_ATLAS_STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(MY_ATLAS_EVENT, { detail: store }));
};

const entityKind = (entity: AtlasEntity): TripEntry['kind'] =>
  'isLandmark' in entity ? 'thing-to-do' : 'place';

export const addToTrip = (entity: AtlasEntity, sourcePath = '') => {
  const store = readTripStore();
  if (store.entries.some((entry) => entry.id === entity.id)) return store;

  store.entries.push({
    id: entity.id,
    slug: entity.slug,
    name: entity.name,
    country: entity.country,
    city: entity.city,
    category: entity.category,
    shortDescription: entity.shortDescription,
    kind: entityKind(entity),
    sourcePath,
    savedAt: new Date().toISOString(),
  });
  writeTripStore(store);
  return store;
};

export const removeFromTrip = (id: string) => {
  const store = readTripStore();
  store.entries = store.entries.filter((entry) => entry.id !== id);
  writeTripStore(store);
  return store;
};

export const clearTrip = () => {
  const store = emptyStore();
  writeTripStore(store);
  return store;
};
