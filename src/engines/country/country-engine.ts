import { countries } from '../../content/registry/countries';
export const getCountry = (slug: string) => countries.find((country) => country.slug === slug);
export const getCountries = () => countries;
