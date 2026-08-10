import type { City } from '../../core/models/types';
import { cityPresentation } from '../spa/city-presentation';
export const getHero = (city: City) => ({ ...city.hero, profile: city.profile, presentation: cityPresentation[city.profile] });
