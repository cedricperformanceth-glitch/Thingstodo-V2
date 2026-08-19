import type { City } from '../../core/models/types';
import { cityHeroPartners, type CityHeroPartner } from '../../content/city-hero-partners';

export const MAX_CITY_HERO_PARTNERS = 3;

/**
 * Partnerships are never generated. They are explicit editorial content keyed by
 * country/city; the Hero layout only provides the shared reserved presentation slot.
 */
export const getCityHeroPartners = (city: City): readonly CityHeroPartner[] => {
  const key = `${city.country}/${city.slug}`;
  const partners = cityHeroPartners[key] ?? [];

  if (partners.length > MAX_CITY_HERO_PARTNERS) {
    throw new Error(`City Hero supports at most ${MAX_CITY_HERO_PARTNERS} partners: ${key}`);
  }

  return partners;
};

export type { CityHeroPartner };
