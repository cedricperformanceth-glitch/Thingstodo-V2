import type { City } from '../core/models/types';

type CityRuntimeOverride = Partial<Pick<City, 'description' | 'seo'>>;

/**
 * Small destination corrections that must remain stable across generated city refreshes.
 * Keep generated payloads structural; publication-facing SEO and reviewed corrections live here.
 */
export const cityRuntimeOverrides: Readonly<Record<string, CityRuntimeOverride>> = {
  'city-don-det': {
    seo: {
      title: 'Don Det travel guide | Things To Do Atlas',
      description: 'Plan Don Det in Si Phan Don with practical notes for Don Khon, Mekong boat trips, waterfalls, cycling, kayaking, tubing, stays and island logistics.',
      canonicalPath: '/laos/don-det',
      indexable: true,
    },
  },
};
