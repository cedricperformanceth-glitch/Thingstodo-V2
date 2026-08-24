import type { City, ExploreBoardCardContent } from '../core/models/types';

interface ExploreBoardThingOverride {
  isLandmark?: boolean;
  exploreBoard?: ExploreBoardCardContent;
}

export interface ExploreBoardEditorialEntry {
  featuredThingIds?: readonly string[];
  thingOverrides?: Readonly<Record<string, ExploreBoardThingOverride>>;
}

const exploreBoardEditorial: Readonly<Record<string, ExploreBoardEditorialEntry>> = {
  'laos/vang-vieng': {
    featuredThingIds: [
      'thing-pha-ngern-viewpoint',
      'thing-nam-xay-viewpoint',
      'thing-tham-khan-cave',
    ],
    thingOverrides: {
      'thing-pha-ngern-viewpoint': {
        isLandmark: true,
        exploreBoard: {
          duration: '2–3 hours',
          kicker: 'VIEWPOINT · VANG VIENG',
          route: 'From Vang Vieng town',
        },
      },
    },
  },
};

export const getExploreBoardEditorial = (city: City): ExploreBoardEditorialEntry | undefined =>
  exploreBoardEditorial[`${city.country}/${city.slug}`];
