import type { City } from '../../core/models/types';
import { cityHeroEditorial, type CityHeroPartner } from '../../content/city-hero-editorial';

export const MAX_CITY_HERO_PARTNERS = 3;

export const getCityHeroPartners = (city: City): readonly CityHeroPartner[] => {
  const key = `${city.country}/${city.slug}`;
  const partners = cityHeroEditorial[key]?.partners ?? [];

  if (partners.length > MAX_CITY_HERO_PARTNERS) {
    throw new Error(`City Hero supports at most ${MAX_CITY_HERO_PARTNERS} partners: ${key}`);
  }

  return partners;
};

export type { CityHeroPartner };
