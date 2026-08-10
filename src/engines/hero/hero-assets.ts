import type { City } from '../../core/models/types';

/**
 * City Hero artwork follows the public asset convention. Country + city slug
 * form the canonical asset identity so destinations can safely share slugs.
 */
export const getCityHeroAssets = (city: City) => {
  const { country, slug } = city;
  const base = `/assets/cities/${country}/${slug}/hero`;

  return {
    stamp: `${base}/stamps/${slug}-hero-stamp.webp`,
    drawing: `${base}/drawings/${slug}-hero-drawing.webp`,
  };
};
