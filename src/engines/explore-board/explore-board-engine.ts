import { getThings } from '../category/category-engine';
import type { City, ThingToDo } from '../../core/models/types';
import { getEditorialMedia } from '../field-card/field-card-editorial';
import { getExploreBoardCopy } from './explore-board-copy';
import thingStatusOverrides from '../../content/thing-status-overrides.json';

export const EXPLORE_BOARD_LANDMARK_COUNT = 3;

export interface ExploreBoardEntry {
  thing: ThingToDo;
  kicker: string;
  duration: string;
  route: string;
}

const withEditorialHeroAsCardImage = (thing: ThingToDo): ThingToDo => {
  const heroImage = getEditorialMedia(thing.id)?.[0];
  if (!heroImage) return thing;

  return {
    ...thing,
    media: {
      ...thing.media,
      card: { image: heroImage },
    },
  };
};

const isRemovedThingId = (id: string) => thingStatusOverrides[id as keyof typeof thingStatusOverrides] === 'removed';

export function getExploreBoard(city: City): { things: ExploreBoardEntry[]; intro: string; note: string } {
  const configuredIds = city.exploreBoard.featuredThingIds ?? [];
  if (configuredIds.length !== EXPLORE_BOARD_LANDMARK_COUNT) {
    throw new Error(`Explore Board requires exactly ${EXPLORE_BOARD_LANDMARK_COUNT} configured landmarks: ${city.country}/${city.slug}; received ${configuredIds.length}`);
  }
  if (new Set(configuredIds).size !== configuredIds.length) {
    throw new Error(`Explore Board landmark IDs must be unique: ${city.country}/${city.slug}`);
  }

  // A deliberately removed Thing may remain in generated source history, but it must not
  // survive into any public surface. Other missing IDs still fail loudly below.
  const ids = configuredIds.filter((id) => !isRemovedThingId(id));
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
