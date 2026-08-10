export interface CityHeroCopyOverride {
  drawingCaption: string;
  messageLines: string[];
}

/**
 * Editorial copy already validated in the original Laos city Heroes.
 * Future destinations do not need entries here: the Hero copy engine
 * generates their drawing caption and envelope lines automatically.
 */
export const cityHeroCopyOverrides: Readonly<Record<string, CityHeroCopyOverride>> = {
  'laos/don-det': {
    drawingCaption: 'Mekong islands · the road becomes a river',
    messageLines: [
      'A small Mekong island where bicycles, hammocks and river paths',
      'replace the road. Don Det is a base for Don Khon, the southern',
      'waterfalls and the onward journey toward Cambodia.',
    ],
  },
  'laos/luang-prabang': {
    drawingCaption: 'Temple roofs · river mornings · northern roads',
    messageLines: [
      'A quiet old royal capital where temple roofs meet the Mekong and Nam Khan.',
      'Use the old town as a walking base, then continue toward waterfalls, river roads',
      'and the northern railway connections beyond the peninsula.',
    ],
  },
  'laos/pakse': {
    drawingCaption: 'Mekong · the road beside the river',
    messageLines: [
      'The gateway to Southern Laos. More than a list of city sights,',
      'Pakse is a relaxed riverside base for the Bolaven Plateau,',
      'Wat Phou and the roads that continue south.',
    ],
  },
  'laos/tad-lo': {
    drawingCaption: 'Waterfalls · a slower road south',
    messageLines: [
      'Waterfalls, coffee, village life and forest roads with enough time',
      'to notice where you are. Tad Lo is a small, walkable base for a',
      'slower chapter on the Bolaven Plateau.',
    ],
  },
  'laos/thakhek': {
    drawingCaption: 'Road notes · the loop turns east',
    messageLines: [
      'A Mekong town that becomes a starting line for limestone roads,',
      'cave country and the long arc of the Thakhek Loop. Stay for the',
      'old streets, then let the road carry the chapter east.',
    ],
  },
  'laos/vang-vieng': {
    drawingCaption: 'Water paths · limestone beyond town',
    messageLines: [
      'Karst cliffs rise beyond rice fields and the Nam Song, while caves,',
      'lagoons and viewpoints spread along the roads outside town.',
      'Vang Vieng is a compact base shaped by water and limestone.',
    ],
  },
  'laos/vientiane': {
    drawingCaption: 'Capital notes · temple roofs beside the Mekong',
    messageLines: [
      'A low-rise capital of temple roofs, shaded streets and Mekong evenings.',
      'Vientiane brings national monuments, practical city services and the main',
      'connections north, south and across the Thai border into one calm base.',
    ],
  },
};
