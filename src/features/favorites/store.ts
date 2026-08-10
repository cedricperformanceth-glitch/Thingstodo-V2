import type { AtlasEntity, MediaRecord } from '../../core/models/types';
export interface FavoriteSnapshot { type: 'place' | 'thing'; id: string; slug: string; name: string; city: string; country: string; shortDescription: string; cardImage?: Pick<MediaRecord, 'src' | 'alt'>; googleMapsUrl?: string; fieldCardPath?: string; address?: string; isMySelection: boolean; }
export const favoriteKey = (entity: Pick<FavoriteSnapshot, 'id' | 'city' | 'country'>) => `${entity.country}:${entity.city}:${entity.id}`;
export interface FavoritesStore { has(entity: Pick<FavoriteSnapshot, 'id' | 'city' | 'country'>):boolean; toggle(entity:FavoriteSnapshot):void; all():FavoriteSnapshot[]; }
const key = 'things-to-do-atlas:favorites';
export const favoriteSnapshot = (entity: AtlasEntity): FavoriteSnapshot => {
  const isThing = entity.category === 'things-to-do'; const image = 'image' in entity ? entity.image ?? entity.media.card?.image : entity.media.card?.image;
  return { type: isThing ? 'thing' : 'place', id: entity.id, slug: entity.slug, name: entity.name, country: entity.country, city: entity.city, shortDescription: entity.shortDescription, cardImage: image && { src: image.src, alt: image.alt }, googleMapsUrl: 'googleMapsUrl' in entity ? entity.googleMapsUrl : undefined, fieldCardPath: isThing ? `/${entity.country}/${entity.city}/things-to-do/${entity.slug}` : undefined, address: 'address' in entity ? entity.address : undefined, isMySelection: entity.isMySelection };
};
const normalize = (item: Partial<FavoriteSnapshot> & Record<string, unknown>): FavoriteSnapshot => ({ type: item.type === 'thing' || item.category === 'things-to-do' ? 'thing' : 'place', id: String(item.id), slug: String(item.slug), name: String(item.name), country: String(item.country), city: String(item.city), shortDescription: String(item.shortDescription ?? ''), cardImage: item.cardImage as FavoriteSnapshot['cardImage'], googleMapsUrl: item.googleMapsUrl as string | undefined, fieldCardPath: item.fieldCardPath as string | undefined, address: item.address as string | undefined, isMySelection: item.isMySelection === true });
const read = () => typeof localStorage === 'undefined' ? [] : (JSON.parse(localStorage.getItem(key) ?? '[]') as Array<Partial<FavoriteSnapshot> & Record<string, unknown>>).map(normalize);
export const favoritesStore: FavoritesStore = {
  has: (entity) => read().some((item) => favoriteKey(item) === favoriteKey(entity)),
  toggle: (entity) => { const items = read(); const entityKey = favoriteKey(entity); localStorage.setItem(key, JSON.stringify(items.some((item) => favoriteKey(item) === entityKey) ? items.filter((item) => favoriteKey(item) !== entityKey) : [...items, entity])); },
  all: read,
};
