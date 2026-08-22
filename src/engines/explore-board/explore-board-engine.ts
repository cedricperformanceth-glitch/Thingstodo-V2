import { getThings } from '../category/category-engine';
import type { City, ThingToDo } from '../../core/models/types';
import { getEditorialMedia } from '../field-card/field-card-editorial';
import { getExploreBoardCopy } from './explore-board-copy';
import exploreBoardOverrides from '../../content/explore-board-overrides.json';

export const EXPLORE_BOARD_LANDMARK_COUNT = 3;

export interface ExploreBoardEntry {
  thing: ThingToDo;
  kicker: string;
  duration: string;
  route: string;
}

type ExploreBoardMetadata = Omit<ExploreBoardEntry, 'thing'>;

interface ExploreBoardOverride {
  featuredThingIds: string[];
  thingMetadata?: Record<string, ExploreBoardMetadata>;
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

const getExploreBoardOverride = (cityId: string): ExploreBoardOverride | undefined =>
  (exploreBoardOverrides as Record<string, ExploreBoardOverride>)[cityId];

export function getExploreBoard(city: City): { things: ExploreBoardEntry[]; intro: string; note: string } {
  const override = getExploreBoardOverride(city.id);
  const configuredIds = override?.featuredThingIds ?? city.exploreBoard.featuredThingIds ?? [];
  if (configuredIds.length !== EXPLORE_BOARD_LANDMARK_COUNT) {
    throw new Error(`Explore Board requires exactly ${EXPLORE_BOARD_LANDMARK_COUNT} configured landmarks: ${city.country}/${city.slug}; received ${configuredIds.length}`);
  }
  if (new Set(configuredIds).size !== configuredIds.length) {
    throw new Error(`Explore Board landmark IDs must be unique: ${city.country}/${city.slug}`);
  }

  const allThings = getThings(city);
  const things = configuredIds.map((id) => {
    const sourceThing = allThings.find((candidate) => candidate.id === id);
    if (!sourceThing) throw new Error(`Explore Board references missing ThingToDo '${id}': ${city.country}/${city.slug}`);

    const overriddenMetadata = override?.thingMetadata?.[id];
    const metadata = overriddenMetadata ?? sourceThing.exploreBoard;
    if (!sourceThing.isLandmark && !overriddenMetadata) {
      throw new Error(`Explore Board entry must be a landmark ThingToDo '${id}': ${city.country}/${city.slug}`);
    }
    if (!metadata) throw new Error(`Explore Board metadata is missing for '${id}': ${city.country}/${city.slug}`);

    const thing = withEditorialHeroAsCardImage(sourceThing);
    return {
      thing,
      kicker: metadata.kicker,
      duration: metadata.duration,
      route: metadata.route,
    };
  });

  return { things, ...getExploreBoardCopy(city, things) };
}
