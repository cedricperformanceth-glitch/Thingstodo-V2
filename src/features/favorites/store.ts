import type { AtlasEntity, MediaRecord } from '../../core/models/types';
export interface FavoriteSnapshot { type: 'place' | 'thing'; id: string; slug: string; name: string; city: string; country: string; shortDescription: string; cardImage?: Pick<MediaRecord, 'src' | 'alt'>; googleMapsUrl?: string; fieldCardPath?: string; address?: string; isMySelection: boolean; }
export const favoriteKey = (entity: Pick<FavoriteSnapshot, 'id' | 'city' | 'country'>) => `${entity.country}:${entity.city}:${entity.id}`;
export interface FavoritesStore { has(entity: Pick<FavoriteSnapshot, 'id' | 'city' | 'country'>):boolean; toggle(entity:FavoriteSnapshot):void; all():FavoriteSnapshot[]; }
const key = 'things-to-do-atlas:favorites';
export const favoriteSnapshot = (entity: AtlasEntity): FavoriteSnapshot => {
  const isThing = entity.category === 'things-to-do'; const image = 'image' in entity ? entity.image ?? entity.media.card?.image : entity.media.card?.image;
  return { type: isThing ? 'thing' : 'place', id: entity.id, slug: entity.slug, name: entity.name, country: entity.country, city: entity.city, shortDescription: entity.shortDescription, cardImage: image && { src: image.src, alt: image.alt }, googleMapsUrl: 'googleMapsUrl' in entity ? entity.googleMapsUrl : undefined, fieldCardPath: isThing ? `/${entity.country}/${entity.city}/things-to-do/${entity.slug}` : undefined, address: 'address' in entity ? entity.address : undefined, isMySelection: entity.isMySelection };
};
const text = (value: unknown) => typeof value === 'string' && value.trim() ? value : undefined;
const image = (value: unknown): FavoriteSnapshot['cardImage'] => value && typeof value === 'object' && text((value as Record<string, unknown>).src) && typeof (value as Record<string, unknown>).alt === 'string' ? { src: (value as Record<string, string>).src, alt: (value as Record<string, string>).alt } : undefined;
const normalize = (item: unknown): FavoriteSnapshot | undefined => {
  if (!item || typeof item !== 'object') return undefined;
  const record = item as Record<string, unknown>; const id = text(record.id); const slug = text(record.slug); const name = text(record.name); const country = text(record.country); const city = text(record.city);
  if (!id || !slug || !name || !country || !city) return undefined;
  const type = record.type === 'thing' || record.category === 'things-to-do' ? 'thing' : record.type === 'place' || (typeof record.category === 'string' && record.category !== 'things-to-do') ? 'place' : undefined;
  if (!type) return undefined;
  return { type, id, slug, name, country, city, shortDescription: typeof record.shortDescription === 'string' ? record.shortDescription : '', cardImage: image(record.cardImage), googleMapsUrl: text(record.googleMapsUrl), fieldCardPath: text(record.fieldCardPath) ?? (type === 'thing' ? `/${country}/${city}/things-to-do/${slug}` : undefined), address: text(record.address), isMySelection: record.isMySelection === true };
};
const read = () => {
  if (typeof localStorage === 'undefined') return [];
  try { const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]'); return Array.isArray(parsed) ? parsed.map(normalize).filter((item): item is FavoriteSnapshot => Boolean(item)) : []; } catch { return []; }
};
export const favoritesStore: FavoritesStore = {
  has: (entity) => read().some((item) => favoriteKey(item) === favoriteKey(entity)),
  toggle: (entity) => { const items = read(); const entityKey = favoriteKey(entity); localStorage.setItem(key, JSON.stringify(items.some((item) => favoriteKey(item) === entityKey) ? items.filter((item) => favoriteKey(item) !== entityKey) : [...items, entity])); },
  all: read,
};
