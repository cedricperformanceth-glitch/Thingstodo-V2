import { places } from '../../content/registry/places';
import { things } from '../../content/registry/things-to-do';
import type { AtlasEntity, CategorySlug, City } from '../../core/models/types';
const selectionFirst = <T extends AtlasEntity>(items:T[]) => [...items].sort((a,b) => Number(b.isMySelection)-Number(a.isMySelection) || (a.selectionRank ?? Number.MAX_SAFE_INTEGER)-(b.selectionRank ?? Number.MAX_SAFE_INTEGER));
const belongsTo = (item:{country:string;city:string}, city:City) => item.country === city.country && item.city === city.slug;
export const getPlaces = (city:City, category?:CategorySlug) => selectionFirst(places.filter((item) => belongsTo(item,city) && (!category || item.category === category)));
export const getThings = (city:City) => selectionFirst(things.filter((item) => belongsTo(item,city)));
export const getCategoryEntities = (city:City, category:CategorySlug) => category === 'things-to-do' ? getThings(city) : getPlaces(city,category);
export const getThing = (city:City, slug:string) => things.find((item) => belongsTo(item,city) && item.slug === slug);
