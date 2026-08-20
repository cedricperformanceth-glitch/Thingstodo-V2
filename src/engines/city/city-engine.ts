import { cities } from '../../content/registry/cities';
import categoryTargetOverrides from '../../content/city-category-target-overrides.json';
import type { City } from '../../core/models/types';

const applyCategoryTargetOverrides = (city: City): City => {
  const overrides = categoryTargetOverrides[city.id as keyof typeof categoryTargetOverrides];
  if (!overrides) return city;
  return {
    ...city,
    categoryTargets: {
      ...city.categoryTargets,
      ...overrides,
    },
  };
};

export const getCity = (country: string, slug: string) => {
  const city = cities.find((item) => item.country === country && item.slug === slug);
  return city ? applyCategoryTargetOverrides(city) : undefined;
};
export const getCities = () => cities.map(applyCategoryTargetOverrides);
export const getCitiesForCountry = (country: string) => cities.filter((city) => city.country === country).map(applyCategoryTargetOverrides);
