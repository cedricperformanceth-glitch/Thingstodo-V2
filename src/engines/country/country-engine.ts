import { laos } from '../../content/countries/laos';
import type { Country } from '../../core/models/types';
const countries: Country[] = [laos];
export const getCountry = (slug: string) => countries.find((country) => country.slug === slug);
export const getCountries = () => countries;
