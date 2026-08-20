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
        `This generated city note treats ${city.name} as part of ${region}, not as an isolated checklist. The editorial pass should sharpen the geography, local rhythm and reason to stay here before adding destination-specific claims.`
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
      title: `Work out how ${city.name} should actually be experienced`,
      paragraphs: [
        `Use the city structure to explain the natural pace of a stay: how visitors move, what belongs together in one day and what deserves its own chapter. Avoid turning the guide into a list of attractions.`,
        `The editorial pass should replace generic planning language with verified local patterns: arrival rhythm, useful neighbourhoods or sides of town, realistic day shapes and the moments when slowing down improves the trip.`
      ],
      facts: [
        { label: 'Climate cue', value: climate },
        { label: 'City profile', value: titleize(city.profile) },
        { label: 'Atlas scope', value: categorySummary(city) },
        { label: 'Things to do', value: thingsTarget ? `${thingsTarget} generated candidates` : 'Editorial selection' }
      ]
    },
    {
      id: 'move',
      eyebrow: '03 · MOVE THROUGH IT',
      title: 'Turn transport and geography into useful field knowledge',
      paragraphs: [
        `Explain the practical movement logic around ${city.name}: arrival points, distances, walking or riding patterns, local transport and the routes that connect the destination to its surrounding landscape.`,
        `This block is intentionally generic until research is complete. The editorial layer should add only verified routes, realistic transfer advice and any safety or seasonal constraint that materially changes how the destination works.`
      ],
      note: { label: 'EDITORIAL PASS', text: 'Replace this note with the one movement rule a first-time visitor is most likely to misunderstand.' }
    },
    {
      id: 'stay',
      eyebrow: '04 · CHOOSE YOUR BASE',
      title: 'Explain where to stay by experience, not by hotel ranking',
      paragraphs: [
        `Use the accommodation geography to describe the trade-offs that shape a stay in ${city.name}: convenience, atmosphere, access, quiet, nightlife, landscape or onward transport.`,
        `The editorial pass should identify meaningful areas only when the distinction is real and verified. The purpose is to help someone choose the right part of the destination before they compare individual properties.`
      ],
      facts: addressTargets.length ? addressTargets.slice(0, 4).map((value, index) => ({ label: index === 0 ? 'Generated inventory' : 'Also mapped', value })) : undefined
    },
    {
      id: 'conditions',
      eyebrow: '05 · READ THE CONDITIONS',
      title: 'Make season, weather and local conditions part of the plan',
      paragraphs: [
        `${climate} is the current generated climate cue for ${city.name}. Use it only as orientation until the editorial pass verifies what seasonality actually changes on the ground.`,
        `Add the conditions that alter the experience rather than generic weather prose: road or river access, heat, rain, visibility, opening patterns, crowds, water levels or any other destination-specific constraint supported by reliable sources.`
      ],
      note: { label: 'KEEP CLOSE', text: 'Time-sensitive conditions should be written so they can be reconfirmed without rewriting the whole guide.' }
    },
    {
      id: 'practical',
      eyebrow: '06 · PRACTICAL REALITY',
      title: 'Record the small details that prevent a bad travel day',
      paragraphs: [
        `Build a compact practical layer for ${city.name}: money, connectivity, healthcare, opening patterns, tickets, local services and any limitation that matters more here than it would in a larger destination.`,
        `Do not pad this chapter. If a practical issue is ordinary or already handled elsewhere in the Atlas, leave it out. The editorial version should keep only the details a traveller benefits from knowing before arrival.`
      ],
      facts: [
        { label: 'Coordinates', value: `${city.coordinates.latitude.toFixed(4)}, ${city.coordinates.longitude.toFixed(4)}` },
        { label: 'Categories mapped', value: `${city.categories.length}` },
        { label: 'Generated addresses', value: addressTargets.length ? addressTargets.join(' · ') : 'No address targets configured' },
        { label: 'Rule', value: 'Verify changing details before publication' }
      ]
    },
    {
      id: 'pace',
      eyebrow: '07 · BUILD THE STAY',
      title: `Give ${city.name} enough time for its strongest chapters`,
      paragraphs: [
        `Use the verified activity set and local geography to recommend a realistic stay length. The generic layer does not invent a number of nights: that decision belongs to research and editorial judgement.`,
        `The final version should explain what an extra day unlocks, what can sensibly be combined and when ${city.name} works better as a short stop, a base or a slower chapter in the wider ${country.name} route.`
      ],
      note: { label: 'ATLAS NOTE', text: 'The final chapter should end with a point of view, not another checklist.' }
    }
  ];
};

export const cityFieldNoteView = (city: City, country: Country) => {
  const region = heroFact(city, 'Region') || country.chapter || country.name;
  const edition = heroFact(city, 'Updated') || 'Living guide';
  const content: CityFieldNoteContent = {
    typeLabel: `${titleize(city.settlementType)} field note`,
    title: city.name,
    subtitle: `${city.hero.subtitle} A generated editorial framework for reading the destination before the detailed Atlas planning layer.`,
    intro: city.description,
    edition,
    warning: 'This is the generated city-note layer. Time-sensitive transport, prices, opening patterns, border procedures, safety advice and seasonal conditions must be verified during the editorial pass.',
    quickRead: [
      { label: 'Read it for', value: 'Context before checklist', detail: 'Understand the destination first; plan individual stops second.' },
      { label: 'Base', value: heroFact(city, 'Base') || `${titleize(city.settlementType)} base`, detail: city.description },
      { label: 'Scope', value: region, detail: `${city.categories.length} Atlas planning categories are attached to this destination.` },
      { label: 'Edition', value: edition, detail: 'Generated structure first; researched editorial layer follows.' }
    ],
    chapters: generatedChapters(city, country),
    closing: {
      eyebrow: 'BACK TO THE ATLAS',
      title: `Start exploring ${city.name}`,
      text: `Keep the city note as context, then return to ${city.name} for activities, addresses and the practical planning layer.`
    }
  };

  const media: MediaRecord[] = [];
  return { ...content, media, adSlots: editorialAdSlots.slice(0, 4) };
};
