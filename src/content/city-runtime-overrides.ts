import type { City } from '../core/models/types';

type CityRuntimeOverride = Partial<Pick<City, 'description'>> & { seo?: Partial<City['seo']> };

/**
 * Small destination corrections that must remain stable across generated city refreshes.
 * Keep generated payloads structural; publication-facing SEO and reviewed corrections live here.
 */
export const cityRuntimeOverrides: Readonly<Record<string, CityRuntimeOverride>> = {
  // The seven Laos city chapters are approved for Google indexing.
  // Runtime overrides keep this decision stable when generated city data is refreshed.
  'city-laos-luang-prabang': {
    seo: {
      indexable: true,
      description: 'Explore Luang Prabang: Buddhist temples, Kuang Si waterfalls, Mekong river trips, local cafés, stays and practical advice for travelling in northern Laos.',
    },
  },
  'city-laos-pakse': {
    seo: { indexable: true },
  },
  'city-tad-lo': {
    seo: { indexable: true },
  },
  'city-laos-thakhek': {
    seo: { indexable: true },
  },
  'city-laos-vang-vieng': {
    seo: {
      indexable: true,
      description: 'Explore Vang Vieng in Laos: karst viewpoints, river activities, blue lagoons, caves and practical advice for planning your stay.',
    },
  },
  'city-laos-vientiane': {
    seo: {
      indexable: true,
      description: 'Explore Vientiane, the capital of Laos, with temples, riverside sights, local places, practical stops and ideas for planning your visit.',
    },
  },
  'city-don-det': {
    seo: {
      title: 'Don Det travel guide | Things To Do Atlas',
      description: 'Plan Don Det in Si Phan Don with practical notes for Don Khon, Mekong boat trips, waterfalls, cycling, kayaking, tubing, stays and island logistics.',
      canonicalPath: '/laos/don-det',
      indexable: true,
    },
  },
};
