import type { AtlasEntity, MediaRecord, SpaCardContent, ThingToDoSpaCardContent } from '../../core/models/types';

export interface FavoriteSnapshot {
  type: 'place' | 'thing';
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  category: string;
  shortDescription: string;
  cardImage?: Pick<MediaRecord, 'src' | 'alt' | 'sourceUrl' | 'sourceName' | 'author' | 'license'>;
  googleMapsUrl?: string;
  fieldCardPath?: string;
  address?: string;
  handwrittenTags?: string[];
  openingHours?: string;
  gettingThere?: string;
  duration?: string;
  costType?: 'free' | 'paid';
  bestTime?: string;
  countryAccent?: string;
}

export interface FavoriteSnapshotOverrides {
  shortDescription?: string;
  cardImage?: MediaRecord;
  spaCard?: SpaCardContent | ThingToDoSpaCardContent;
  countryAccent?: string;
}

export const favoriteKey = (entity: Pick<FavoriteSnapshot, 'id' | 'city' | 'country'>) => `${entity.country}:${entity.city}:${entity.id}`;
export interface FavoritesStore {
  has(entity: Pick<FavoriteSnapshot, 'id' | 'city' | 'country'>): boolean;
  toggle(entity: FavoriteSnapshot): void;
  all(): FavoriteSnapshot[];
  refresh(fresh: FavoriteSnapshot[]): FavoriteSnapshot[];
}

const key = 'things-to-do-atlas:favorites';
const mediaSnapshot = (image?: MediaRecord): FavoriteSnapshot['cardImage'] => image ? {
  src: image.src,
  alt: image.alt,
  sourceUrl: image.sourceUrl,
  sourceName: image.sourceName,
  author: image.author,
  license: image.license,
} : undefined;

export const favoriteSnapshot = (entity: AtlasEntity, overrides: FavoriteSnapshotOverrides = {}): FavoriteSnapshot => {
  const isThing = entity.category === 'things-to-do';
  const rawImage = 'image' in entity ? entity.image ?? entity.media.card?.image : entity.media.card?.image;
  const image = overrides.cardImage ?? rawImage;
  const spaCard = overrides.spaCard ?? entity.spaCard;
  const activitySpa = spaCard && 'gettingThere' in spaCard
    ? spaCard as typeof spaCard & { gettingThere?: string; duration?: string; costType?: 'free' | 'paid'; bestTime?: string }
    : undefined;

  return {
    type: isThing ? 'thing' : 'place',
    id: entity.id,
    slug: entity.slug,
    name: entity.name,
    country: entity.country,
    city: entity.city,
    category: entity.category,
    shortDescription: overrides.shortDescription ?? entity.shortDescription,
    cardImage: mediaSnapshot(image),
    googleMapsUrl: 'googleMapsUrl' in entity ? entity.googleMapsUrl : undefined,
    fieldCardPath: isThing ? `/${entity.country}/${entity.city}/things-to-do/${entity.slug}` : undefined,
    address: 'address' in entity ? entity.address : undefined,
    handwrittenTags: spaCard?.handwrittenTags ? [...spaCard.handwrittenTags] : undefined,
    openingHours: spaCard?.openingHours,
    gettingThere: activitySpa?.gettingThere,
    duration: activitySpa?.duration,
    costType: activitySpa?.costType,
    bestTime: activitySpa?.bestTime,
    countryAccent: overrides.countryAccent,
  };
};

const text = (value: unknown) => typeof value === 'string' && value.trim() ? value : undefined;
const stringArray = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim())) : undefined;
const image = (value: unknown): FavoriteSnapshot['cardImage'] => {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const src = text(record.src);
  if (!src || typeof record.alt !== 'string') return undefined;
  return {
    src,
    alt: record.alt,
    sourceUrl: text(record.sourceUrl),
    sourceName: text(record.sourceName),
    author: text(record.author),
    license: text(record.license),
  };
};

const normalize = (item: unknown): FavoriteSnapshot | undefined => {
  if (!item || typeof item !== 'object') return undefined;
  const record = item as Record<string, unknown>;
  const id = text(record.id);
  const slug = text(record.slug);
  const name = text(record.name);
  const country = text(record.country);
  const city = text(record.city);
  if (!id || !slug || !name || !country || !city) return undefined;
  const type = record.type === 'thing' || record.category === 'things-to-do' ? 'thing' : record.type === 'place' || (typeof record.category === 'string' && record.category !== 'things-to-do') ? 'place' : undefined;
  if (!type) return undefined;
  const category = text(record.category) ?? (type === 'thing' ? 'things-to-do' : 'practical-services');
  const costType = record.costType === 'free' || record.costType === 'paid' ? record.costType : undefined;

  return {
    type,
    id,
    slug,
    name,
    country,
    city,
    category,
    shortDescription: typeof record.shortDescription === 'string' ? record.shortDescription : '',
    cardImage: image(record.cardImage),
    googleMapsUrl: text(record.googleMapsUrl),
    fieldCardPath: text(record.fieldCardPath) ?? (type === 'thing' ? `/${country}/${city}/things-to-do/${slug}` : undefined),
    address: text(record.address),
    handwrittenTags: stringArray(record.handwrittenTags),
    openingHours: text(record.openingHours),
    gettingThere: text(record.gettingThere),
    duration: text(record.duration),
    costType,
    bestTime: text(record.bestTime),
    countryAccent: text(record.countryAccent),
  };
};

const read = () => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed.map(normalize).filter((item): item is FavoriteSnapshot => Boolean(item)) : [];
  } catch {
    return [];
  }
};

const write = (items: FavoriteSnapshot[]) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(items));
};

export const favoritesStore: FavoritesStore = {
  has: (entity) => read().some((item) => favoriteKey(item) === favoriteKey(entity)),
  toggle: (entity) => {
    const items = read();
    const entityKey = favoriteKey(entity);
    write(items.some((item) => favoriteKey(item) === entityKey) ? items.filter((item) => favoriteKey(item) !== entityKey) : [...items, entity]);
  },
  all: read,
  refresh: (fresh) => {
    const items = read();
    if (!items.length || !fresh.length) return items;
    const freshByKey = new Map(fresh.map((item) => [favoriteKey(item), item]));
    const next = items.map((item) => freshByKey.get(favoriteKey(item)) ?? item);
    if (JSON.stringify(next) !== JSON.stringify(items)) write(next);
    return next;
  },
};
