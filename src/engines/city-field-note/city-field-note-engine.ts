import type { City, Country } from '../../core/models/types';
import { editorialAdSlots } from '../../core/ads/slots';
import {
  getEditorialCityFieldNote,
  getEditorialCityFieldNoteMedia,
  getEditorialCityFieldNoteSources,
} from './city-field-note-editorial';

export interface CityFieldNoteFact { label: string; value: string; }
export interface CityFieldNoteChapter {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  facts?: CityFieldNoteFact[];
  note?: { label: string; text: string };
  photoSlot?: boolean;
}
export interface CityFieldNoteContent {
  typeLabel: string;
  title: string;
  contextLine: string;
  subtitle: string;
  intro: string;
  quickRead: Array<{ label: string; value: string; detail: string }>;
  chapters: CityFieldNoteChapter[];
  closing: { eyebrow: string; title: string; text: string };
}

const titleize = (value: string) => value.split('-').map((part) => part ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : '').join(' ');
const heroFact = (city: City, label: string) => city.hero.facts.find((fact) => fact.label.toLowerCase() === label.toLowerCase())?.value;
const categoryLabel = (category: string) => category === 'things-to-do' ? 'things to do' : titleize(category).toLowerCase();

const generatedChapters = (city: City, country: Country): CityFieldNoteChapter[] => {
  const region = heroFact(city, 'Region') || country.chapter || country.name;
  const base = heroFact(city, 'Base') || `${city.settlementType} base`;
  const climate = heroFact(city, 'Climate') || 'Seasonal conditions to verify';
  const addressCategories = city.categories
    .filter((category) => category !== 'things-to-do')
    .map(categoryLabel);

  return [
    { id:'orientation', eyebrow:'01 · READ THE PLACE', title:`Start with the geography of ${city.name}`, paragraphs:[city.description,`The editorial pass should explain how ${city.name} fits into ${region}: what surrounds it, why travellers base themselves here and which parts of the wider landscape actually shape the stay.`], facts:[{label:'Country',value:country.name},{label:'Region',value:region},{label:'Base',value:base},{label:'Settlement',value:titleize(city.settlementType)}] },
    { id:'rhythm', eyebrow:'02 · FIND THE RHYTHM', title:`How should ${city.name} actually be experienced?`, paragraphs:['Describe the natural pace of a stay rather than turning the destination into a checklist.','The editorial version should explain what belongs together in one day, what deserves more time and where visitors naturally slow down.'], facts:[{label:'Climate cue',value:climate},{label:'Profile',value:titleize(city.profile)},{label:'Atlas scope',value:city.categories.map(categoryLabel).join(' · ')},{label:'Things to do',value:'Editorial selection'}], note:{label:'Editorial note',text:'Replace the generic pace with one clear local rhythm.'} },
    { id:'move', eyebrow:'03 · MOVE THROUGH IT', title:'Turn transport into useful field knowledge', paragraphs:[`Explain how people actually move through ${city.name}: arrival point, useful distances, walking or riding patterns and the routes that lead beyond the centre.`,'Keep only verified movement advice. Seasonal access, safety and transfer details belong here when they materially change the trip.'], note:{label:'Keep close',text:'The final note should contain the one movement rule a first-time visitor is most likely to miss.'} },
    { id:'stay', eyebrow:'04 · CHOOSE YOUR BASE', title:'Choose where to stay by experience, not ranking', paragraphs:[`Explain the real trade-offs between different parts of ${city.name}: convenience, atmosphere, quiet, access, landscape or onward transport.`,'Only create neighbourhood or area distinctions when they are genuinely useful and verified.'], facts:addressCategories.length ? addressCategories.slice(0,4).map((value,index)=>({label:index===0?'Atlas categories':'Also mapped',value})) : undefined, note:{label:'Atlas note',text:'Location should explain the stay before individual properties are compared.'} },
    { id:'conditions', eyebrow:'05 · READ THE CONDITIONS', title:'Let season and conditions change the plan', paragraphs:[`${climate} is only the generated climate cue. The editorial pass should identify what seasonality really changes on the ground.`,'Prioritise consequences over generic weather: road or river access, heat, rain, visibility, opening patterns, crowds or water levels.'], note:{label:'Living guide',text:'Write changing conditions so they can be reconfirmed without rewriting the whole chapter.'} },
    { id:'practical', eyebrow:'06 · PRACTICAL REALITY', title:'Keep the practical details that prevent a bad day', paragraphs:[`Add only the practical constraints that matter specifically in ${city.name}: money, connectivity, healthcare, tickets, local services or limited backup.`,'Ordinary travel advice belongs elsewhere. This chapter should stay short and destination-specific.'], facts:[{label:'Coordinates',value:`${city.coordinates.latitude.toFixed(4)}, ${city.coordinates.longitude.toFixed(4)}`},{label:'Categories',value:`${city.categories.length} planning chapters`},{label:'Inventory',value:addressCategories.length?addressCategories.join(' · '):'No practical categories configured'},{label:'Rule',value:'Reconfirm changing details before publication'}] },
    { id:'pace', eyebrow:'07 · BUILD THE STAY', title:`Give ${city.name} the right amount of time`, paragraphs:['Use the verified activity set and local geography to recommend a realistic stay length. The generic layer deliberately does not invent a number of nights.',`The final version should explain what an extra day unlocks and whether ${city.name} works best as a short stop, a base or a slower chapter in the wider ${country.name} route.`], photoSlot:true }
  ];
};

const generatedContent = (city: City, country: Country): CityFieldNoteContent => {
  const region = heroFact(city, 'Region') || country.chapter || country.name;
  const edition = heroFact(city, 'Updated') || 'Living guide';
  const base = heroFact(city, 'Base') || `${titleize(city.settlementType)} base`;
  return {
    typeLabel:`${titleize(city.settlementType)} notes`, title:city.name, contextLine:`${region} · ${base}`,
    subtitle:city.hero.subtitle, intro:city.description,
    quickRead:[
      {label:'Chapters',value:'7 field notes',detail:'A destination overview, not a checklist.'},
      {label:'Use it for',value:`Reading ${city.name}`,detail:'Context first; individual stops second.'},
      {label:'Scope',value:region,detail:`${city.categories.length} Atlas planning categories.`},
      {label:'Edition',value:edition,detail:'Generated framework before editorial research.'}
    ],
    chapters:generatedChapters(city,country),
    closing:{eyebrow:'BACK TO THE CITY',title:`Start exploring ${city.name}`,text:`Keep these notes as context, then return to ${city.name} for activities, addresses and the practical side of the stay.`}
  };
};

const generatedCountryChapters = (country: Country): CityFieldNoteChapter[] => [
  {
    id: 'orientation', eyebrow: '01 · READ THE PLACE', title: `Start with the scale of ${country.name}`,
    paragraphs: [
      `${country.name} is too large to plan as one destination. Use this field note to separate the country into meaningful regions, travel corridors and different kinds of days before opening individual cities.`,
      `The first editorial pass should explain how ${country.chapter.toLowerCase()} shape the country and which regional contrasts actually change a traveller's route.`
    ],
    facts: [{label:'Country',value:country.name},{label:'Atlas chapter',value:country.chapter},{label:'Planning scale',value:'Country · regions · cities · routes'},{label:'Map centre',value:`${country.map.center.latitude.toFixed(2)}, ${country.map.center.longitude.toFixed(2)}`}],
    note: { label: 'Atlas note', text: 'Read the country by regions first. Individual attractions belong later.' }
  },
  {
    id: 'rhythm', eyebrow: '02 · FIND THE RHYTHM', title: `Build ${country.name} as several travel chapters`,
    paragraphs: [
      'A country route works better when each region keeps its own rhythm instead of becoming a chain of famous pins.',
      'The editorial version should identify which areas deserve slower stays, which work as transport hubs and where a long transfer should count as part of the day rather than invisible time.'
    ],
    facts: [{label:'Route logic',value:'One region at a time'},{label:'Strong principle',value:'Protect transfer days'},{label:'Use the Atlas for',value:'Opening cities after the country shape is clear'},{label:'Current layer',value:'Generic framework'}],
    note: { label: 'Editorial note', text: 'Replace generic pacing with a clear north / centre / south or equivalent regional rhythm during research.' }
  },
  {
    id: 'move', eyebrow: '03 · MOVE THROUGH IT', title: 'Treat transport as part of the geography',
    paragraphs: [
      `Country-scale movement in ${country.name} should explain the major rail, road, air, river or ferry corridors that genuinely change itinerary design.`,
      'The researched version should separate long-distance transport from local movement and highlight the handovers most likely to create friction.'
    ],
    note: { label: 'Keep close', text: 'A country map can hide travel time. The final note should make the real transfer scale visible.' }
  },
  {
    id: 'stay', eyebrow: '04 · CHOOSE YOUR BASES', title: 'Choose a sequence of bases, not one perfect route',
    paragraphs: [
      `A useful ${country.name} itinerary is usually a sequence of bases with different jobs: arrival city, heritage stop, landscape base, coast or countryside, then the next transport gateway.`,
      'The editorial pass should explain when changing base saves meaningful time and when staying put produces a better day.'
    ],
    note: { label: 'Atlas note', text: 'Country planning is base planning. Move only when the next base changes the experience.' }
  },
  {
    id: 'conditions', eyebrow: '05 · READ THE CONDITIONS', title: 'A national season can hide regional weather',
    paragraphs: [
      `${country.name} should not be reduced to one dry-season / wet-season sentence. The researched version should identify the regional weather differences that materially change routes, landscapes or access.`,
      'Use seasonal information to change decisions rather than decorate the page: heat, rain, sea state, mountain visibility, flooding, air quality or festival pressure only belong when they affect the trip.'
    ],
    note: { label: 'Living guide', text: 'Country weather is regional. Check the part of the country you are actually entering.' }
  },
  {
    id: 'practical', eyebrow: '06 · PRACTICAL REALITY', title: 'Keep country-level rules at country level',
    paragraphs: [
      `Border entry, money, national transport systems, connectivity and major health or administrative constraints belong here when they apply across ${country.name}.`,
      'City-level practical details should remain in city notes. This layer should contain only the rules that prevent the same information being repeated across every destination.'
    ],
    facts: [{label:'Country page',value:`/${country.slug}`},{label:'Field note',value:`/${country.slug}/field-note`},{label:'SEO state',value:country.seo.indexable?'Indexable':'Draft / noindex'},{label:'Rule',value:'Reconfirm live national requirements before publication'}]
  },
  {
    id: 'pace', eyebrow: '07 · BUILD THE ROUTE', title: `Let the route through ${country.name} grow from regions, not attraction count`,
    paragraphs: [
      'The generic layer deliberately does not invent a minimum trip length. The researched version should explain what a short route can realistically connect and what extra time unlocks at country scale.',
      `Use this country note as the planning layer above individual ${country.name} cities: country first, then regions, then bases, then activities.`
    ],
    photoSlot: true
  }
];

const generatedCountryContent = (country: Country): CityFieldNoteContent => ({
  typeLabel: 'Country field note',
  title: country.name,
  contextLine: `${country.chapter} · Southeast Asia`,
  subtitle: `A country-scale planning layer for ${country.name}: regions, routes, seasons and the bases that connect them.`,
  intro: `${country.name} is presented here as a country-scale travel chapter. Use the national shape first, then open individual cities and activities once the route makes sense.`,
  quickRead: [
    {label:'Chapters',value:'7 country notes',detail:'Country context before individual destinations.'},
    {label:'Use it for',value:`Building the ${country.name} route`,detail:'Regions first; city and activity cards second.'},
    {label:'Scope',value:country.chapter,detail:'A national planning layer above the city Atlas.'},
    {label:'Edition',value:'Generated framework',detail:'Generic Country Field Note before the full editorial research pass.'}
  ],
  chapters: generatedCountryChapters(country),
  closing: {eyebrow:`BACK TO ${country.name.toUpperCase()}`,title:`Now open the ${country.name} destinations`,text:'Keep the country note as the top planning layer, then move into individual cities, routes and activities as they are added to the Atlas.'}
});

export const cityFieldNoteView = (city: City, country: Country) => {
  const isCountryFieldNote = city.id === country.id;
  const content = getEditorialCityFieldNote(city.id) ?? (isCountryFieldNote ? generatedCountryContent(country) : generatedContent(city, country));
  const media = getEditorialCityFieldNoteMedia(city.id);
  return {
    ...content,
    media,
    sources: getEditorialCityFieldNoteSources(city.id),
    isEditorial: Boolean(getEditorialCityFieldNote(city.id)),
    adSlots: editorialAdSlots.slice(0, 3),
  };
};
