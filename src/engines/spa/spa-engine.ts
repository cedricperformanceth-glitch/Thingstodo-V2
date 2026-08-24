import type { CategorySlug, City, SettlementType } from '../../core/models/types';
import spaCategoryOrder from '../../core/contracts/spa-categories.json';
import spaCategoryExtensions from '../../core/contracts/spa-category-extensions.json';
import { getCategoryEntities } from '../category/category-engine';
import { getCityFieldNoteSpaTargets } from '../city-field-note/city-field-note-spa-links';

export type SpaTabSlug = CategorySlug | 'favorites';
export type SpaTabIcon = 'explore' | 'guesthouses' | 'restaurants' | 'cafes' | 'scooter' | 'gyms' | 'markets' | 'essential' | 'favorites';

export interface SpaTabDefinition {
  slug: SpaTabSlug;
  title: string;
  icon: SpaTabIcon;
  count: number | null;
  countLabel: string;
}

const categoryOrder = spaCategoryOrder as Record<SettlementType, readonly CategorySlug[]>;

const definitions: Record<CategorySlug, { title: string; icon: Exclude<SpaTabIcon, 'favorites'>; singular: string; plural: string }> = {
  'things-to-do': { title: 'Things to do', icon: 'explore', singular: 'activity', plural: 'activities' },
  accommodation: { title: 'Guest Houses', icon: 'guesthouses', singular: 'stay', plural: 'stays' },
  restaurants: { title: 'Restaurants', icon: 'restaurants', singular: 'place', plural: 'places' },
  cafes: { title: 'Coffee', icon: 'cafes', singular: 'place', plural: 'places' },
  'scooter-rental': { title: 'Rental Scooter', icon: 'scooter', singular: 'rental', plural: 'rentals' },
  gyms: { title: 'Gym & Fitness', icon: 'gyms', singular: 'place', plural: 'places' },
  markets: { title: 'Market & Shopping', icon: 'markets', singular: 'place', plural: 'places' },
  'practical-services': { title: 'Essential Information', icon: 'essential', singular: 'address', plural: 'addresses' },
};

export const spaCategoriesFor = (settlementType: SettlementType): readonly CategorySlug[] => categoryOrder[settlementType];

export function getSpaTabs(city: City): SpaTabDefinition[] {
  const allowedCategories = categoryOrder[city.settlementType];
  if (!allowedCategories) throw new Error(`Unknown SPA settlement type for ${city.country}/${city.slug}: ${city.settlementType}`);

  const categories = city.categories;
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error(`City categories are required for ${city.country}/${city.slug}.`);
  }

  const approvedExtensions = (spaCategoryExtensions[city.settlementType] ?? []) as CategorySlug[];
  const extensions = city.categoryExtensions ?? [];
  const invalidExtension = extensions.find((slug) => !approvedExtensions.includes(slug));
  if (invalidExtension) throw new Error('Category extension ' + invalidExtension + ' is not allowed for ' + city.settlementType + ' settlement ' + city.country + '/' + city.slug + '.');
  const allowed = new Set<CategorySlug>([...allowedCategories, ...extensions]);
  for (const slug of categories) {
    if (!allowed.has(slug)) {
      throw new Error(`Category '${slug}' is not allowed for ${city.settlementType} settlement ${city.country}/${city.slug}.`);
    }
  }

  const fieldNoteActivityCount = getCityFieldNoteSpaTargets(city).length;
  const tabs = categories.map((slug) => {
    const definition = definitions[slug];
    const localCount = getCategoryEntities(city, slug).length;
    const count = localCount + (slug === 'things-to-do' ? fieldNoteActivityCount : 0);
    return {
      slug,
      title: definition.title,
      icon: definition.icon,
      count,
      countLabel: `${count} ${count === 1 ? definition.singular : definition.plural}`,
    } satisfies SpaTabDefinition;
  });

  return [
    ...tabs,
    { slug: 'favorites', title: 'My Favorites', icon: 'favorites', count: null, countLabel: 'Saved across Atlas' },
  ];
}
