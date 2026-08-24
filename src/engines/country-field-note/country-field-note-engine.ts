import type { City, Country } from '../../core/models/types';
import { cityFieldNoteView } from '../city-field-note/city-field-note-engine';

export const countryFieldNoteCity = (country: Country, hostCountry = country.slug): City => ({
  id: country.id,
  slug: '',
  name: country.name,
  country: hostCountry,
  profile: 'large',
  settlementType: 'city',
  coordinates: country.map.center,
  description: `${country.name} is presented here as a country-scale travel chapter: regions, routes, seasons and the practical logic that connects individual destinations.`,
  categories: [],
  categoryExtensions: [],
  hero: {
    eyebrow: 'Country field note',
    title: country.name,
    subtitle: `Read ${country.name} at country scale before opening individual cities and routes.`,
    facts: [
      { label: 'Region', value: country.chapter },
      { label: 'Base', value: 'Country overview' },
    ],
  },
  exploreBoard: { featuredThingIds: [] },
  manualLocks: {},
  seo: country.seo,
});

export const countryFieldNoteView = (country: Country) => cityFieldNoteView(countryFieldNoteCity(country), country);
