import type { City } from '../../core/models/types';
import { cityHeroDrawingCaptions } from '../../content/city-hero-drawing-captions';

/**
 * City Hero artwork follows the public asset convention. Country + city slug
 * form the canonical asset identity so destinations can safely share slugs.
 * Drawing captions are content metadata resolved by the same destination key.
 */
export const getCityHeroAssets = (city: City) => {
  const { country, slug } = city;
  const base = `/assets/cities/${country}/${slug}/hero`;
  const key = `${country}/${slug}`;

  return {
    stamp: `${base}/stamps/${slug}-hero-stamp.webp`,
    drawing: `${base}/drawings/${slug}-hero-drawing.webp`,
    drawingCaption: cityHeroDrawingCaptions[key] ?? '',
  };
};
