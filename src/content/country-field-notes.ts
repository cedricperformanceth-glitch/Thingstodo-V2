import type { Country } from '../core/models/types';
import { thailand } from './countries/thailand';
import { cambodia } from './countries/cambodia';
import { vietnam } from './countries/vietnam';

export const countryFieldNotes: readonly Country[] = [thailand, cambodia, vietnam];
export const getCountryFieldNote = (slug: string) => countryFieldNotes.find((country) => country.slug === slug);