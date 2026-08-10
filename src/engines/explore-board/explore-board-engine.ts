import { getPlaces, getThings } from '../category/category-engine';
import type { City } from '../../core/models/types';
export function getExploreBoard(city: City) { const places = getPlaces(city.slug); const things = getThings(city.slug); return { places: city.exploreBoard.featuredPlaceIds.map((id) => places.find((place) => place.id === id)).filter(Boolean), things: city.exploreBoard.featuredThingIds.map((id) => things.find((thing) => thing.id === id)).filter(Boolean) }; }
