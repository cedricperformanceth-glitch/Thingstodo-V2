import type { AtlasEntity } from '../../core/models/types';
export type FavoriteSnapshot = Pick<AtlasEntity, 'id' | 'slug' | 'name' | 'city' | 'country' | 'shortDescription'>;
export const favoriteKey = (entity: Pick<FavoriteSnapshot, 'id' | 'city' | 'country'>) => `${entity.country}:${entity.city}:${entity.id}`;
export interface FavoritesStore { has(entity: Pick<FavoriteSnapshot, 'id' | 'city' | 'country'>):boolean; toggle(entity:FavoriteSnapshot):void; all():FavoriteSnapshot[]; }
const key = 'things-to-do-atlas:favorites';
const read = () => typeof localStorage === 'undefined' ? [] : JSON.parse(localStorage.getItem(key) ?? '[]') as FavoriteSnapshot[];
export const favoritesStore: FavoritesStore = {
  has: (entity) => read().some((item) => favoriteKey(item) === favoriteKey(entity)),
  toggle: (entity) => { const items = read(); const entityKey = favoriteKey(entity); localStorage.setItem(key, JSON.stringify(items.some((item) => favoriteKey(item) === entityKey) ? items.filter((item) => favoriteKey(item) !== entityKey) : [...items, entity])); },
  all: read,
};
