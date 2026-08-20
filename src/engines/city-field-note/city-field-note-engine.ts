import type { City, Country } from '../../core/models/types';
import { editorialAdSlots } from '../../core/ads/slots';

export interface CityFieldNoteFact { label: string; value: string; }
export interface CityFieldNoteChapter {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  facts?: CityFieldNoteFact[];
  note?: { label: string; text: string };
}
export interface CityFieldNoteContent {
  typeLabel: string;
  title: string;
  contextLine: string;
  subtitle: string;
  intro: string;
  warning: string;
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
  const thingsTarget = city.categoryTargets['things-to-do'];
  const addressTargets = city.categories
    .filter((category) => category !== 'things-to-do')
    .map((category) => city.categoryTargets[category] ? `${city.categoryTargets[category]} ${categoryLabel(category)}` : categoryLabel(category));

  return [
    {
      id: 'orientation',
      eyebrow: '01 · READ THE PLACE',
      title: `Start with the geography of ${city.name}`,
      paragraphs: [
        city.description,
        `The editorial pass should explain how ${city.name} fits into ${region}: what surrounds it, why travellers base themselves here and which parts of the wider landscape actually shape the stay.`
      ],
      facts: [
        { label: 'Country', value: country.name },
        { label: 'Region', value: region },
        { label: 'Base', value: base },
        { label: 'Settlement', value: titleize(city.settlementType) }
      ]
    },
    {
      id: 'rhythm',
      eyebrow: '02 · FIND THE RHYTHM',
      title: `How should ${city.name} actually be experienced?`,
      paragraphs: [
        'Describe the natural pace of a stay rather than turning the destination into a checklist.',
        'The editorial version should explain what belongs together in one day, what deserves more time and where visitors naturally slow down.'
      ],
      facts: [
        { label: 'Climate cue', value: climate },
        { label: 'Profile', value: titleize(city.profile) },
        { label: 'Atlas scope', value: city.categories.map(categoryLabel).join(' · ') },
        { label: 'Things to do', value: thingsTarget ? `${thingsTarget} generated candidates` : 'Editorial selection' }
      ],
      note: { label: 'Editorial note', text: 'Replace the generic pace with one clear local rhythm.' }
    },
    {
      id: 'move',
      eyebrow: '03 · MOVE THROUGH IT',
      title: 'Turn transport into useful field knowledge',
      paragraphs: [
        `Explain how people actually move through ${city.name}: arrival point, useful distances, walking or riding patterns and the routes that lead beyond the centre.`,
        'Keep only verified movement advice. Seasonal access, safety and transfer details belong here when they materially change the trip.'
      ],
      note: { label: 'Keep close', text: 'The final note should contain the one movement rule a first-time visitor is most likely to miss.' }
    },
    {
      id: 'stay',
      eyebrow: '04 · CHOOSE YOUR BASE',
      title: 'Choose where to stay by experience, not ranking',
      paragraphs: [
        `Explain the real trade-offs between different parts of ${city.name}: convenience, atmosphere, quiet, access, landscape or onward transport.`,
        'Only create neighbourhood or area distinctions when they are genuinely useful and verified.'
      ],
      facts: addressTargets.length ? addressTargets.slice(0, 4).map((value, index) => ({ label: index === 0 ? 'Generated inventory' : 'Also mapped', value })) : undefined,
      note: { label: 'Atlas note', text: 'Location should explain the stay before individual properties are compared.' }
    },
    {
      id: 'conditions',
      eyebrow: '05 · READ THE CONDITIONS',
      title: 'Let season and conditions change the plan',
      paragraphs: [
        `${climate} is only the generated climate cue. The editorial pass should identify what seasonality really changes on the ground.`,
        'Prioritise consequences over generic weather: road or river access, heat, rain, visibility, opening patterns, crowds or water levels.'
      ],
      note: { label: 'Living guide', text: 'Write changing conditions so they can be reconfirmed without rewriting the whole chapter.' }
    },
    {
      id: 'practical',
      eyebrow: '06 · PRACTICAL REALITY',
      title: 'Keep the practical details that prevent a bad day',
      paragraphs: [
        `Add only the practical constraints that matter specifically in ${city.name}: money, connectivity, healthcare, tickets, local services or limited backup.`,
        'Ordinary travel advice belongs elsewhere. This chapter should stay short and destination-specific.'
      ],
      facts: [
        { label: 'Coordinates', value: `${city.coordinates.latitude.toFixed(4)}, ${city.coordinates.longitude.toFixed(4)}` },
        { label: 'Categories', value: `${city.categories.length} planning chapters` },
        { label: 'Inventory', value: addressTargets.length ? addressTargets.join(' · ') : 'No address targets configured' },
        { label: 'Rule', value: 'Reconfirm changing details before publication' }
      ]
    },
    {
      id: 'pace',
      eyebrow: '07 · BUILD THE STAY',
      title: `Give ${city.name} the right amount of time`,
      paragraphs: [
        'Use the verified activity set and local geography to recommend a realistic stay length. The generic layer deliberately does not invent a number of nights.',
        `The final version should explain what an extra day unlocks and whether ${city.name} works best as a short stop, a base or a slower chapter in the wider ${country.name} route.`
      ],
      note: { label: 'Atlas note', text: 'End with a point of view about the stay, not another checklist.' }
    }
  ];
};

export const cityFieldNoteView = (city: City, country: Country) => {
  const region = heroFact(city, 'Region') || country.chapter || country.name;
  const edition = heroFact(city, 'Updated') || 'Living guide';
  const base = heroFact(city, 'Base') || `${titleize(city.settlementType)} base`;
  const content: CityFieldNoteContent = {
    typeLabel: `${titleize(city.settlementType)} notes`,
    title: city.name,
    contextLine: `${region} · ${base}`,
    subtitle: city.hero.subtitle,
    intro: city.description,
    warning: 'This page is still the generated city-note layer. Transport, prices, opening patterns, safety advice and seasonal conditions must be verified during the editorial pass.',
    quickRead: [
      { label: 'Chapters', value: '7 field notes', detail: 'A destination overview, not a checklist.' },
      { label: 'Use it for', value: `Reading ${city.name}`, detail: 'Context first; individual stops second.' },
      { label: 'Scope', value: region, detail: `${city.categories.length} Atlas planning categories.` },
      { label: 'Edition', value: edition, detail: 'Generated framework before editorial research.' }
    ],
    chapters: generatedChapters(city, country),
    closing: {
      eyebrow: 'BACK TO THE CITY',
      title: `Start exploring ${city.name}`,
      text: `Keep these notes as context, then return to ${city.name} for activities, addresses and the practical side of the stay.`
    }
  };

  return { ...content, adSlots: editorialAdSlots.slice(0, 3) };
};
