export interface CityHeroPartner {
  label: string;
  href: string;
}

export interface CityHeroEditorialEntry {
  copy?: {
    drawingCaption: string;
    messageLines: string[];
  };
  facts?: readonly string[];
  partners?: readonly CityHeroPartner[];
}

/** Destination-specific Hero editorial content. Shared Hero engines own only fallback and presentation logic. */
export const cityHeroEditorial: Readonly<Record<string, CityHeroEditorialEntry>> = {
  'laos/don-det': {
    copy: {
      drawingCaption: 'Mekong islands · the road becomes a river',
      messageLines: [
        'A small Mekong island where bicycles, hammocks and river paths',
        'replace the road. Don Det is a base for Don Khon, the southern',
        'waterfalls and the onward journey toward Cambodia.',
      ],
    },
    facts: ['August 2026', 'Bicycle island base', 'Tropical Mekong', 'Si Phan Don'],
  },
  'laos/luang-prabang': {
    copy: {
      drawingCaption: 'Temple roofs · river mornings · northern roads',
      messageLines: [
        'A quiet old royal capital where temple roofs meet the Mekong and Nam Khan.',
        'Use the old town as a walking base, then continue toward waterfalls, river roads',
        'and the northern railway connections beyond the peninsula.',
      ],
    },
    facts: ['August 2026', 'UNESCO old town', 'Tropical monsoon', 'Luang Prabang Province'],
  },
  'laos/pakse': {
    copy: {
      drawingCaption: 'Mekong · the road beside the river',
      messageLines: [
        'The gateway to Southern Laos. More than a list of city sights,',
        'Pakse is a relaxed riverside base for the Bolaven Plateau,',
        'Wat Phou and the roads that continue south.',
      ],
    },
    facts: ['July 2026', 'Road-trip base', 'Tropical climate', 'Southern Laos'],
  },
  'laos/tad-lo': {
    copy: {
      drawingCaption: 'Waterfalls · a slower road south',
      messageLines: [
        'Waterfalls, coffee, village life and forest roads with enough time',
        'to notice where you are. Tad Lo is a small, walkable base for a',
        'slower chapter on the Bolaven Plateau.',
      ],
    },
    facts: ['August 2026', 'Walkable village base', 'Waterfalls & coffee', 'Salavan Province'],
    partners: [
      { label: 'Visit Tad Lo', href: 'https://visit-tadlo.com/' },
      { label: 'Samaki Laos', href: 'https://samaki-laos.com/' },
      { label: 'Fandee Island', href: 'https://fandee-island.com/' },
    ],
  },
  'laos/thakhek': {
    copy: {
      drawingCaption: 'Road notes · the loop turns east',
      messageLines: [
        'A Mekong town that becomes a starting line for limestone roads,',
        'cave country and the long arc of the Thakhek Loop. Stay for the',
        'old streets, then let the road carry the chapter east.',
      ],
    },
    facts: ['August 2026', 'Loop road base', 'Limestone & caves', 'Khammouane Province'],
  },
  'laos/vang-vieng': {
    copy: {
      drawingCaption: 'Water paths · limestone beyond town',
      messageLines: [
        'Karst cliffs rise beyond rice fields and the Nam Song, while caves,',
        'lagoons and viewpoints spread along the roads outside town.',
        'Vang Vieng is a compact base shaped by water and limestone.',
      ],
    },
    facts: ['August 2026', 'River & karst base', 'Tropical monsoon', 'Vientiane Province'],
  },
  'laos/vientiane': {
    copy: {
      drawingCaption: 'Capital notes · temple roofs beside the Mekong',
      messageLines: [
        'A low-rise capital of temple roofs, shaded streets and Mekong evenings.',
        'Vientiane brings national monuments, practical city services and the main',
        'connections north, south and across the Thai border into one calm base.',
      ],
    },
    facts: ['August 2026', 'Capital city base', 'Tropical monsoon', 'Mekong riverfront'],
  },
};
