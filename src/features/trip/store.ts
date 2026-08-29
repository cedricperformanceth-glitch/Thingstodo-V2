import type { AtlasEntity, Coordinates } from '../../core/models/types';

export const MY_ATLAS_STORAGE_KEY = 'thingsToDoAtlas.makeYourOwnAtlas.v1';
export const MY_ATLAS_EVENT = 'atlas:my-atlas-changed';

export interface TripCardImage {
  src: string;
  alt: string;
}

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
  cardImage?: TripCardImage;
  coordinates?: Coordinates;
  googleMapsUrl?: string;
}

export interface TripStore {
  entries: TripEntry[];
}

export const tripKey = (entry: Pick<TripEntry, 'id' | 'country' | 'city'>) => `${entry.country}:${entry.city}:${entry.id}`;

const emptyStore = (): TripStore => ({ entries: [] });

const isBrowser = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const normalizeCardImage = (value: unknown): TripCardImage | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const image = value as Partial<TripCardImage>;
  if (typeof image.src !== 'string' || !image.src.trim()) return undefined;
  return {
    src: image.src,
    alt: typeof image.alt === 'string' ? image.alt : '',
  };
};

const normalizeCoordinates = (value: unknown): Coordinates | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const coordinates = value as Partial<Coordinates>;
  if (
    typeof coordinates.latitude !== 'number'
    || typeof coordinates.longitude !== 'number'
    || !Number.isFinite(coordinates.latitude)
    || !Number.isFinite(coordinates.longitude)
  ) return undefined;
  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  };
};

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
    cardImage: normalizeCardImage(value.cardImage),
    coordinates: normalizeCoordinates(value.coordinates),
    googleMapsUrl: typeof value.googleMapsUrl === 'string' && value.googleMapsUrl.trim()
      ? value.googleMapsUrl.trim()
      : undefined,
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

const entityCardImage = (entity: AtlasEntity): TripCardImage | undefined => {
  const source = entity as AtlasEntity & { cardImage?: TripCardImage };
  const direct = normalizeCardImage(source.cardImage);
  if (direct) return direct;

  const image = ('image' in source ? source.image : undefined) ?? source.media?.card?.image;
  if (!image?.src) return undefined;
  return { src: image.src, alt: image.alt ?? '' };
};

export const addToTrip = (entity: AtlasEntity, sourcePath = '') => {
  const store = readTripStore();
  if (store.entries.some((entry) => tripKey(entry) === tripKey(entity))) return store;

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
    cardImage: entityCardImage(entity),
    coordinates: entity.coordinates,
    googleMapsUrl: entity.googleMapsUrl,
  });
  writeTripStore(store);
  return store;
};

export const removeFromTrip = (entry: Pick<TripEntry, 'id' | 'country' | 'city'>) => {
  const store = readTripStore();
  store.entries = store.entries.filter((candidate) => tripKey(candidate) !== tripKey(entry));
  writeTripStore(store);
  return store;
};

export const clearTrip = () => {
  const store = emptyStore();
  writeTripStore(store);
  return store;
};
