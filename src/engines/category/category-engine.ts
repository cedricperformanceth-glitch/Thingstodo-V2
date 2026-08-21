import { places } from '../../content/registry/places';
import { things } from '../../content/registry/things-to-do';
import placeOrderSwapsData from '../../content/place-order-swaps.json';
import placeStatusOverrides from '../../content/place-status-overrides.json';
import type { CategorySlug, City, Place } from '../../core/models/types';

type PlaceOrderSwaps = Record<string, Partial<Record<CategorySlug, Array<[string, string]>>>>;
const placeOrderSwaps = placeOrderSwapsData as PlaceOrderSwaps;

const belongsTo = (item:{country:string;city:string}, city:City) => item.country === city.country && item.city === city.slug;
const isActivePlace = (item: Place) => placeStatusOverrides[item.id as keyof typeof placeStatusOverrides] !== 'closed';

const swapPlacePositions = (items: Place[], city: City, category?: CategorySlug) => {
  if (!category) return items;

  const cityKey = `${city.country}/${city.slug}`;
  const swaps = placeOrderSwaps[cityKey]?.[category] ?? [];
  if (!swaps.length) return items;

  const byId = new Map(items.map((item) => [item.id, item]));

  return items.map((item) => {
    for (const [firstId, secondId] of swaps) {
      if (item.id === firstId) return byId.get(secondId) ?? item;
      if (item.id === secondId) return byId.get(firstId) ?? item;
    }
    return item;
  });
};

export const getPlaces = (city:City, category?:CategorySlug) => swapPlacePositions(
  places.filter((item) => isActivePlace(item) && belongsTo(item,city) && (!category || item.category === category)),
  city,
  category,
);
export const getThings = (city:City) => things.filter((item) => belongsTo(item,city));
export const getCategoryEntities = (city:City, category:CategorySlug) => category === 'things-to-do' ? getThings(city) : getPlaces(city,category);
export const getThing = (city:City, slug:string) => things.find((item) => belongsTo(item,city) && item.slug === slug);
