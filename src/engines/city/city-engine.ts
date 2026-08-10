import { donDet } from '../../content/cities/don-det';
import type { City } from '../../core/models/types';
const cities: City[] = [donDet];
export const getCity = (country: string, slug: string) => cities.find((city) => city.country === country && city.slug === slug);
export const getCities = () => cities;
