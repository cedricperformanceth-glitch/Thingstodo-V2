import { donDetPlaces } from '../../content/places/don-det';
import { donDetThings } from '../../content/things-to-do/don-det';
import type { AtlasEntity, CategorySlug, Place, ThingToDo } from '../../core/models/types';
const places: Place[] = donDetPlaces; const things: ThingToDo[] = donDetThings;
const selectionFirst = <T extends AtlasEntity>(items:T[]) => [...items].sort((a,b) => Number(b.isMySelection)-Number(a.isMySelection) || (a.selectionRank ?? Number.MAX_SAFE_INTEGER)-(b.selectionRank ?? Number.MAX_SAFE_INTEGER));
export const getPlaces = (city:string, category?:CategorySlug) => selectionFirst(places.filter((item) => item.city === city && (!category || item.category === category)));
export const getThings = (city:string) => selectionFirst(things.filter((item) => item.city === city));
export const getCategoryEntities = (city:string, category:CategorySlug) => category === 'things-to-do' ? getThings(city) : getPlaces(city,category);
export const getThing = (city:string, slug:string) => things.find((item) => item.city === city && item.slug === slug);
