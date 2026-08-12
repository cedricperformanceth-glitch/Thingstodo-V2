import { getThings } from '../category/category-engine';
import type { City, ThingToDo } from '../../core/models/types';
import { getExploreBoardCopy } from './explore-board-copy';

export const EXPLORE_BOARD_LANDMARK_COUNT = 3;

export interface ExploreBoardEntry {
  thing: ThingToDo;
  kicker: string;
  duration: string;
  route: string;
}

export function getExploreBoard(city: City): { things: ExploreBoardEntry[]; intro: string; note: string } {
  const ids = city.exploreBoard.featuredThingIds ?? [];
  if (ids.length !== EXPLORE_BOARD_LANDMARK_COUNT) {
    throw new Error(`Explore Board requires exactly ${EXPLORE_BOARD_LANDMARK_COUNT} landmarks: ${city.country}/${city.slug}; received ${ids.length}`);
  }
  if (new Set(ids).size !== ids.length) {
    throw new Error(`Explore Board landmark IDs must be unique: ${city.country}/${city.slug}`);
  }

  const allThings = getThings(city);
  const things = ids.map((id) => {
    const thing = allThings.find((candidate) => candidate.id === id);
    if (!thing) throw new Error(`Explore Board references missing ThingToDo '${id}': ${city.country}/${city.slug}`);
    if (!thing.isLandmark) throw new Error(`Explore Board entry must be a landmark ThingToDo '${id}': ${city.country}/${city.slug}`);
    if (!thing.exploreBoard) throw new Error(`Explore Board metadata is missing for '${id}': ${city.country}/${city.slug}`);
    return {
      thing,
      kicker: thing.exploreBoard.kicker,
      duration: thing.exploreBoard.duration,
      route: thing.exploreBoard.route,
    };
  });

  return { things, ...getExploreBoardCopy(city, things) };
}
