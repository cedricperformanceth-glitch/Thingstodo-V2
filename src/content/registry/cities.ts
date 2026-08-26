import { generatedCities } from '../generated';
import { cityRuntimeOverrides } from '../city-runtime-overrides';
import type { City } from '../../core/models/types';

export const cities: City[] = generatedCities.map((city) => {
  const override = cityRuntimeOverrides[city.id];
  return override ? { ...city, ...override } : city;
});
