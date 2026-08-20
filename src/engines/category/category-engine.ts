import { places } from '../../content/registry/places';
import { things } from '../../content/registry/things-to-do';
import type { CategorySlug, City, Place } from '../../core/models/types';

const belongsTo = (item:{country:string;city:string}, city:City) => item.country === city.country && item.city === city.slug;

const swapPlacePositions = (items: Place[], city: City, category?: CategorySlug) => {
  if (city.country !== 'laos' || city.slug !== 'don-det' || category !== 'restaurants') return items;

  const swaps: Array<[string, string]> = [
    ['place-keas-backpackers-paradise-restaurant-and-bar', 'place-ois-place'],
    ['place-hathim-indian-restaurant', 'place-sahai-bar'],
    ['place-datta-bananaleaf-restaurant', 'place-mama-piang-guesthouse-and-restaurant'],
  ];
  const byId = new Map(items.map((item) => [item.id, item]));

  return items.map((item) => {
    for (const [firstId, secondId] of swaps) {
      if (item.id === firstId) return byId.get(secondId) ?? item;
      if (item.id === secondId) return byId.get(firstId) ?? item;
    }
    return item;
  });
};

export const getPlaces = (city:City, category?:CategorySlug) => swapPlacePositions(places.filter((item) => belongsTo(item,city) && (!category || item.category === category)), city, category);
export const getThings = (city:City) => things.filter((item) => belongsTo(item,city));
export const getCategoryEntities = (city:City, category:CategorySlug) => category === 'things-to-do' ? getThings(city) : getPlaces(city,category);
export const getThing = (city:City, slug:string) => things.find((item) => belongsTo(item,city) && item.slug === slug);
