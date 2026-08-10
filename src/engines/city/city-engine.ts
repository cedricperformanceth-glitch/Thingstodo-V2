import { cities } from '../../content/registry/cities';
import type { City } from '../../core/models/types';
export const getCity = (country: string, slug: string) => cities.find((city) => city.country === country && city.slug === slug);
export const getCities = () => cities;
export const getCitiesForCountry = (country: string) => cities.filter((city) => city.country === country);
