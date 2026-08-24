import linksData from '../../content/country-field-note-spa-links.json';
import type { City, Country } from '../../core/models/types';
import { getCountry } from '../country/country-engine';
import { countryFieldNoteView } from './country-field-note-engine';

const links = linksData as Record<string, readonly string[]>;
const cityKey = (city: Pick<City, 'country' | 'slug'>) => `${city.country}/${city.slug}`;

export function getCountryFieldNoteSpaTargets(city: City): Country[] {
  const refs = links[cityKey(city)] ?? [];
  const seen = new Set<string>();

  return refs.map((slug) => {
    if (seen.has(slug)) throw new Error(`Duplicate Country Field Note SPA link '${slug}' for ${cityKey(city)}.`);
    seen.add(slug);

    const target = getCountry(slug);
    if (!target) throw new Error(`Unknown Country Field Note SPA target '${slug}' for ${cityKey(city)}.`);
    if (target.slug === city.country) throw new Error(`Country Field Note SPA link cannot target the current country '${slug}'.`);

    const view = countryFieldNoteView(target);
    if (view.media.length !== 4) {
      throw new Error(`Country Field Note SPA target '${slug}' must have exactly 4 media records; found ${view.media.length}.`);
    }

    return target;
  });
}
