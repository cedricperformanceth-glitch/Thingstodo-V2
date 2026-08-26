import type { CategorySlug, City, Country, Place, ThingToDo } from '../models/types';

export const countryPath = (country: Country) => `/${country.slug}`;
export const countryFieldNotePath = (country: Country) => `${countryPath(country)}/field-note`;
export const cityPath = (city: City) => `/${city.country}/${city.slug}`;
export const cityFieldNotePath = (city: City) => `${cityPath(city)}/field-note`;
export const categoryPath = (city: City, category: CategorySlug) => `${cityPath(city)}/${category}`;
export const thingPath = (city: City, thing: ThingToDo) => `${categoryPath(city, 'things-to-do')}/${thing.slug}`;
export const placeFieldCardPath = (place: Place) => `/${place.country}/${place.city}/places/${place.slug}`;
