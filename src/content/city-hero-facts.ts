/**
 * Editorial facts already validated in the original Laos Heroes.
 * Every other destination falls back to its City.hero.facts data.
 */
export const cityHeroFactOverrides: Readonly<Record<string, readonly string[]>> = {
  'laos/don-det': ['August 2026', 'Bicycle island base', 'Tropical Mekong', 'Si Phan Don'],
  'laos/luang-prabang': ['August 2026', 'UNESCO old town', 'Tropical monsoon', 'Luang Prabang Province'],
  'laos/pakse': ['July 2026', 'Road-trip base', 'Tropical climate', 'Southern Laos'],
  'laos/tad-lo': ['August 2026', 'Walkable village base', 'Waterfalls & coffee', 'Salavan Province'],
  'laos/thakhek': ['August 2026', 'Loop road base', 'Limestone & caves', 'Khammouane Province'],
  'laos/vang-vieng': ['August 2026', 'River & karst base', 'Tropical monsoon', 'Vientiane Province'],
  'laos/vientiane': ['August 2026', 'Capital city base', 'Tropical monsoon', 'Mekong riverfront'],
};
