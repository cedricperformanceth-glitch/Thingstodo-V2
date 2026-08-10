import type { City } from '../../core/models/types';
import { cityPresentation } from '../spa/city-presentation';
import { getCityHeroAssets } from './hero-assets';

const stableIndex = (key: string, length: number) => [...key].reduce((total, char) => total + char.charCodeAt(0), 0) % Math.max(length, 1);
const pick = (items: City['hero']['media']['photos'], key: string) => items.length ? items[stableIndex(key, items.length)] : undefined;
export const getHero = (city: City) => ({
  ...city.hero,
  profile: city.profile,
  presentation: cityPresentation[city.profile],
  photo: pick(city.hero.media.photos, `${city.id}:hero-photo`),
  cityAssets: getCityHeroAssets(city),
});
