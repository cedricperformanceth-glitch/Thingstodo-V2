import type { AtlasEntity } from '../../core/models/types';
export type FavoriteSnapshot = Pick<AtlasEntity, 'id' | 'slug' | 'name' | 'city' | 'country' | 'shortDescription'>;
export interface FavoritesStore { has(id:string):boolean; toggle(entity:FavoriteSnapshot):void; all():FavoriteSnapshot[]; }
const key = 'things-to-do-atlas:favorites';
const read = () => typeof localStorage === 'undefined' ? [] : JSON.parse(localStorage.getItem(key) ?? '[]') as FavoriteSnapshot[];
export const favoritesStore: FavoritesStore = { has:(id) => read().some((item) => item.id === id), toggle:(entity) => { const items = read(); localStorage.setItem(key, JSON.stringify(items.some((item) => item.id === entity.id) ? items.filter((item) => item.id !== entity.id) : [...items,entity])); }, all:read };
