import type { City, Country, MediaRecord } from '../../core/models/types';
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
  subtitle: string;
  intro: string;
  edition: string;
  warning: string;
  quickRead: Array<{ label: string; value: string; detail: string }>;
  chapters: CityFieldNoteChapter[];
  closing: { eyebrow: string; title: string; text: string };
}

const titleize = (value: string) => value.split('-').map((part) => part ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : '').join(' ');
const heroFact = (city: City, label: string) => city.hero.facts.find((fact) => fact.label.toLowerCase() === label.toLowerCase())?.value;
const categoryLabel = (category: string) => category === 'things-to-do' ? 'things to do' : titleize(category).toLowerCase();
const categorySummary = (city: City) => city.categories.map(categoryLabel).join(' · ');

const generatedChapters = (city: City, country: Country): CityFieldNoteChapter[] => {
  const region = heroFact(city, 'Region') || country.chapter || country.name;
  const base = heroFact(city, 'Base') || `${city.settlementType} base`;
  const climate = heroFact(city, 'Climate') || 'Check seasonal conditions';
  const thingsTarget = city.categoryTargets['things-to-do'];
  const addressTargets = city.categories
    .filter((category) => category !== 'things-to-do')
    .map((category) => city.categoryTargets[category] ? `${city.categoryTargets[category]} ${categoryLabel(category)}` : categoryLabel(category));

  return [
    {
      id: 'orientation',
      eyebrow: '01 · READ THE PLACE',
      title: `Start by understanding ${city.name} as a base`,
      paragraphs: [
        city.description,
        `${city.name} belongs to a wider ${region} chapter. The final guide should explain that geography before listing individual stops.`,
        'Editorial task: define the local character, the real reason to stay here and the relationship with the surrounding area.'
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
        'This chapter should describe the natural pace of a stay rather than turn the destination into a checklist.',
        'Explain what belongs together in one day, what deserves more time and where the visitor naturally slows down.',
        'Editorial task: replace this framework with verified arrival patterns, local areas and realistic day shapes.'
      ],
      facts: [
        { label: 'Climate cue', value: climate },
        { label: 'Profile', value: titleize(city.profile) },
        { label: 'Atlas scope', value: categorySummary(city) },
        { label: 'Things to do', value: thingsTarget ? `${thingsTarget} generated candidates` : 'Editorial selection' }
      ]
    },
    {
      id: 'move',
      eyebrow: '03 · MOVE THROUGH IT',
      title: 'Turn geography into useful field knowledge',
      paragraphs: [
        `Map the practical movement logic around ${city.name}: arrival points, distances and the easiest ways to move locally.`,
        'Then connect the destination to the surrounding landscape and the routes travellers are actually likely to use.',
        'Editorial task: add only verified transport, transfer and seasonal constraints.'
      ],
      note: { label: 'EDITORIAL PASS', text: 'Find the one movement rule a first-time visitor is most likely to misunderstand.' }
    },
    {
      id: 'stay',
      eyebrow: '04 · CHOOSE YOUR BASE',
      title: 'Where you stay changes the trip',
      paragraphs: [
        `Describe the meaningful location choices inside ${city.name}: convenience, atmosphere, quiet, access or onward transport.`,
        'The goal is not to rank hotels. It is to explain the experience of staying in one area rather than another.',
        'Editorial task: keep only distinctions that are real, useful and locally verified.'
      ],
      facts: addressTargets.length ? addressTargets.slice(0, 4).map((value, index) => ({ label: index === 0 ? 'Generated inventory' : 'Also mapped', value })) : undefined
    },
    {
      id: 'conditions',
      eyebrow: '05 · READ THE CONDITIONS',
      title: 'Season and conditions should change the advice',
      paragraphs: [
        `${climate} is the generated climate cue for ${city.name}. It is orientation, not finished editorial guidance.`,
        'Focus on what conditions actually change: access, heat, rain, visibility, crowds, water levels or opening patterns.',
        'Editorial task: remove generic weather prose and keep only consequences a traveller can act on.'
      ],
      note: { label: 'KEEP CLOSE', text: 'Write changing conditions so they can be reconfirmed without rewriting the whole guide.' }
    },
    {
      id: 'practical',
      eyebrow: '06 · PRACTICAL REALITY',
      title: 'Keep only the details that prevent a bad travel day',
      paragraphs: [
        `Build the practical layer for ${city.name}: money, connectivity, healthcare, tickets and local service limits.`,
        'Ordinary information does not need another paragraph just because space is available.',
        'Editorial task: retain only the details that are genuinely useful before arrival or before leaving for the day.'
      ],
      facts: [
        { label: 'Coordinates', value: `${city.coordinates.latitude.toFixed(4)}, ${city.coordinates.longitude.toFixed(4)}` },
        { label: 'Categories mapped', value: `${city.categories.length}` },
        { label: 'Inventory', value: addressTargets.length ? addressTargets.join(' · ') : 'No address targets configured' },
        { label: 'Rule', value: 'Verify changing details before publication' }
      ]
    },
    {
      id: 'pace',
      eyebrow: '07 · BUILD THE STAY',
      title: `How much time does ${city.name} deserve?`,
      paragraphs: [
        'Use the verified activity set and local geography to recommend a realistic stay length.',
        'Do not invent a number of nights in the generic layer. Explain what an extra day genuinely unlocks.',
        `Editorial task: decide whether ${city.name} works best as a short stop, a base or a slower chapter in the wider ${country.name} route.`
      ],
      note: { label: 'ATLAS NOTE', text: 'End with a point of view, not another checklist.' }
    }
  ];
};

export const cityFieldNoteView = (city: City, country: Country) => {
  const region = heroFact(city, 'Region') || country.chapter || country.name;
  const edition = heroFact(city, 'Updated') || 'Living guide';
  const content: CityFieldNoteContent = {
    typeLabel: `${titleize(city.settlementType)} field note`,
    title: city.name,
    subtitle: city.hero.subtitle,
    intro: city.description,
    edition,
    warning: 'Generated city-note framework. Transport, prices, opening patterns, border procedures, safety advice and seasonal conditions must be verified during the editorial pass.',
    quickRead: [
      { label: 'Read it for', value: 'Context first', detail: 'Understand the place before opening individual stops.' },
      { label: 'Base', value: heroFact(city, 'Base') || `${titleize(city.settlementType)} base`, detail: `${city.name} · ${country.name}` },
      { label: 'Scope', value: region, detail: `${city.categories.length} Atlas chapters` },
      { label: 'Edition', value: edition, detail: 'Generated framework · editorial pass next' }
    ],
    chapters: generatedChapters(city, country),
    closing: {
      eyebrow: 'BACK TO THE ATLAS',
      title: `Start exploring ${city.name}`,
      text: `Keep this note as context, then return to ${city.name} for activities, addresses and practical planning.`
    }
  };

  const media: MediaRecord[] = [];
  return { ...content, media, adSlots: editorialAdSlots.slice(0, 4) };
};
