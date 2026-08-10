import type { City } from '../../core/models/types';

/**
 * City Hero artwork follows the public asset convention. The resolver keeps
 * presentation components free from destination-specific file paths.
 */
export const getCityHeroAssets = (city: City) => {
  const { slug } = city;

  return {
    stamp: `/assets/cities/${slug}/hero/stamps/${slug}-hero-stamp.webp`,
    drawing: `/assets/cities/${slug}/hero/drawings/${slug}-hero-drawing.webp`,
  };
};
