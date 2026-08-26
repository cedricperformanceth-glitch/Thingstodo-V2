import linksData from '../../content/city-field-note-spa-links.json';
import type { City } from '../../core/models/types';
import { getCity } from '../city/city-engine';
import { getCountryFieldNote } from '../../content/country-field-notes';
import { countryFieldNoteCity, countryFieldNoteView } from '../country-field-note/country-field-note-engine';
import { getEditorialCityFieldNote } from './city-field-note-editorial';

const links = linksData as Record<string, readonly string[]>;
const cityKey = (city: Pick<City, 'country' | 'slug'>) => `${city.country}/${city.slug}`;

export function getCityFieldNoteSpaTargets(city: City): City[] {
  const refs = links[cityKey(city)] ?? [];
  const seen = new Set<string>();

  return refs.map((ref) => {
    if (seen.has(ref)) throw new Error(`Duplicate Field Note SPA link '${ref}' for ${cityKey(city)}.`);
    seen.add(ref);

    const parts = ref.split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error(`Invalid Field Note SPA target '${ref}' for ${cityKey(city)}.`);
    }

    if (parts[0] === 'country') {
      const targetCountry = getCountryFieldNote(parts[1]);
      if (!targetCountry) throw new Error(`Unknown Country Field Note SPA target '${ref}' for ${cityKey(city)}.`);
      if (targetCountry.slug === city.country) throw new Error(`Country Field Note SPA link cannot target the current country '${targetCountry.slug}'.`);
      const view = countryFieldNoteView(targetCountry);
      if (view.media.length !== 4) throw new Error(`Country Field Note SPA target '${ref}' must have exactly 4 media records; found ${view.media.length}.`);
      return countryFieldNoteCity(targetCountry, city.country);
    }

    const target = getCity(parts[0], parts[1]);
    if (!target) throw new Error(`Unknown City Field Note SPA target '${ref}' for ${cityKey(city)}.`);
    if (target.id === city.id) throw new Error(`City Field Note SPA link cannot target itself: ${cityKey(city)}.`);
    if (!getEditorialCityFieldNote(target.id)) {
      throw new Error(`City Field Note SPA target '${ref}' has no canonical editorial bundle.`);
    }

    return target;
  });
}
