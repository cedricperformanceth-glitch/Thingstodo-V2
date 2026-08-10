import type { CategorySlug, City, Country, ThingToDo } from '../models/types';

export const countryPath = (country: Country) => `/${country.slug}`;
export const cityPath = (city: City) => `/${city.country}/${city.slug}`;
export const categoryPath = (city: City, category: CategorySlug) => `${cityPath(city)}/${category}`;
export const thingPath = (city: City, thing: ThingToDo) => `${categoryPath(city, 'things-to-do')}/${thing.slug}`;
