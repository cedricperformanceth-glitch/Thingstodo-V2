import type { City } from '../../core/models/types';
import { cityPresentation } from '../spa/city-presentation';
import { getCityHeroAssets } from './hero-assets';
import { getCityHeroCopy } from './hero-copy';
import { getCityHeroFacts } from './hero-facts';
import { getCityHeroPartners } from './hero-partners';

export const getHero = (city: City) => ({
  ...city.hero,
  profile: city.profile,
  presentation: cityPresentation[city.profile],
  cityAssets: getCityHeroAssets(city),
  copy: getCityHeroCopy(city),
  displayFacts: getCityHeroFacts(city),
  partners: getCityHeroPartners(city),
});
