import { getThings } from '../category/category-engine';
import type { City, MediaRecord, ThingToDo } from '../../core/models/types';
import fieldCardMediaEditorial from '../../content/field-card-media-copy.json';
import { getExploreBoardCopy } from './explore-board-copy';

export const EXPLORE_BOARD_LANDMARK_COUNT = 3;

const editorialMedia = fieldCardMediaEditorial as Record<string, MediaRecord[]>;

export interface ExploreBoardEntry {
  thing: ThingToDo;
  kicker: string;
  duration: string;
  route: string;
}

const withEditorialHeroAsCardImage = (thing: ThingToDo): ThingToDo => {
  const heroImage = editorialMedia[thing.id]?.[0];
  if (!heroImage) return thing;

  return {
    ...thing,
    media: {
      ...thing.media,
      card: { image: heroImage },
    },
  };
};

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
    const sourceThing = allThings.find((candidate) => candidate.id === id);
    if (!sourceThing) throw new Error(`Explore Board references missing ThingToDo '${id}': ${city.country}/${city.slug}`);
    if (!sourceThing.isLandmark) throw new Error(`Explore Board entry must be a landmark ThingToDo '${id}': ${city.country}/${city.slug}`);
    if (!sourceThing.exploreBoard) throw new Error(`Explore Board metadata is missing for '${id}': ${city.country}/${city.slug}`);

    const thing = withEditorialHeroAsCardImage(sourceThing);
    return {
      thing,
      kicker: sourceThing.exploreBoard.kicker,
      duration: sourceThing.exploreBoard.duration,
      route: sourceThing.exploreBoard.route,
    };
  });

  return { things, ...getExploreBoardCopy(city, things) };
}
