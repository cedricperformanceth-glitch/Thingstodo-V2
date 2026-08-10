import type { City, HeroFact } from '../../core/models/types';
import { cityHeroFactOverrides } from '../../content/city-hero-facts';

export type CityHeroFactIcon = 'calendar' | 'road' | 'climate' | 'location';
export interface CityHeroDisplayFact { icon: CityHeroFactIcon; text: string; }

const slots: Array<{ icon: CityHeroFactIcon; pattern: RegExp; fallbackIndex: number }> = [
  { icon: 'calendar', pattern: /date|updated|season|month|year|when/i, fallbackIndex: 0 },
  { icon: 'road', pattern: /road|base|setting|best for|profile|pace|transport|access/i, fallbackIndex: 1 },
  { icon: 'climate', pattern: /climate|weather|terrain|landscape|environment/i, fallbackIndex: 2 },
  { icon: 'location', pattern: /location|province|region|district|area/i, fallbackIndex: 3 },
];

const titleCaseSlug = (value: string) => value.split('-').map((part) => part ? `${part[0].toUpperCase()}${part.slice(1)}` : part).join(' ');
const factText = (fact?: HeroFact) => fact?.value?.trim() || fact?.label?.trim() || '';

const generatedFacts = (city: City): string[] => {
  const source = city.hero.facts;
  const used = new Set<number>();

  const pick = (pattern: RegExp, fallbackIndex: number) => {
    const semanticIndex = source.findIndex((fact, index) => !used.has(index) && pattern.test(fact.label));
    const index = semanticIndex >= 0
      ? semanticIndex
      : source.findIndex((fact, candidateIndex) => candidateIndex >= fallbackIndex && !used.has(candidateIndex) && factText(fact));
    if (index < 0) return '';
    used.add(index);
    return factText(source[index]);
  };

  const values = slots.map(({ pattern, fallbackIndex }) => pick(pattern, fallbackIndex));
  if (!values[0]) values[0] = city.hero.eyebrow.trim() || 'Atlas field notes';
  if (!values[1]) values[1] = `${titleCaseSlug(city.profile)} travel base`;
  if (!values[2]) values[2] = city.hero.subtitle.trim() || 'Local conditions';
  if (!values[3]) values[3] = `${city.name}, ${titleCaseSlug(city.country)}`;
  return values;
};

/**
 * Four fixed semantic slots keep one visual language everywhere.
 * Laos retains its validated V1 copy; future cities are populated from
 * City.hero.facts without destination-specific component logic.
 */
export const getCityHeroFacts = (city: City): CityHeroDisplayFact[] => {
  const key = `${city.country}/${city.slug}`;
  const values = cityHeroFactOverrides[key] ?? generatedFacts(city);
  return slots.map(({ icon }, index) => ({ icon, text: values[index] ?? '' }));
};
