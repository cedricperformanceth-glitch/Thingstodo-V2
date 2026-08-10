import type { AtlasEntity } from '../../core/models/types';
export interface FavoritesStore { has(id:string):boolean; toggle(entity:Pick<AtlasEntity,'id'|'slug'|'name'>):void; all():string[]; }
const key = 'things-to-do-atlas:favorites';
const read = () => typeof localStorage === 'undefined' ? [] : JSON.parse(localStorage.getItem(key) ?? '[]') as string[];
export const favoritesStore: FavoritesStore = { has:(id) => read().includes(id), toggle:(entity) => { const ids = read(); localStorage.setItem(key, JSON.stringify(ids.includes(entity.id) ? ids.filter((id) => id !== entity.id) : [...ids,entity.id])); }, all:read };
