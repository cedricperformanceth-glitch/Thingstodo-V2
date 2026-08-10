import type { City } from '../../core/models/types';

/**
 * City Hero artwork follows one public asset convention. Country + city slug
 * form the canonical identity; supplying the files is enough to wire the Hero.
 */
export const getCityHeroAssets = (city: City) => {
  const { country, slug } = city;
  const base = `/assets/cities/${country}/${slug}/hero`;

  return {
    stamp: `${base}/stamps/${slug}-hero-stamp.webp`,
    drawing: `${base}/drawings/${slug}-hero-drawing.webp`,
    photo: `${base}/photos/${slug}-hero-photo.webp`,
  };
};
