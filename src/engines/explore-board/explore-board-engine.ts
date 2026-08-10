import { getPlaces, getThings } from '../category/category-engine';
import type { City, Place, ThingToDo } from '../../core/models/types';
const distance = (a: City['coordinates'], b: ThingToDo['coordinates']) => Math.hypot(a.latitude - b.latitude, a.longitude - b.longitude);
export function getExploreBoard(city: City): { places: Place[]; things: ThingToDo[] } {
  const places = getPlaces(city);
  const allThings = getThings(city);
  const manual = city.exploreBoard.featuredThingIds?.map((id) => allThings.find((thing) => thing.id === id)).filter((thing): thing is ThingToDo => Boolean(thing));
  const things = manual?.length ? manual : allThings.filter((thing) => thing.isLandmark).sort((a, b) => distance(city.coordinates, a.coordinates) - distance(city.coordinates, b.coordinates)).slice(0, city.exploreBoard.landmarkLimit);
  return { places: city.exploreBoard.featuredPlaceIds?.map((id) => places.find((place) => place.id === id)).filter((place): place is Place => Boolean(place)) ?? [], things };
}
