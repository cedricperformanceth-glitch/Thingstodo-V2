import type { Place, ResearchSource } from '../core/models/types';

type PlaceEditorialOverride = Partial<Pick<
  Place,
  'name' | 'shortDescription' | 'coordinates' | 'locationScope' | 'address' | 'googleMapsUrl'
>>;

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

/**
 * Small, manually curated overrides for place cards.
 * Generated city data remains the structural source; this layer is for editorial polish and
 * targeted corrections that must survive future city regeneration.
 */
export const placeCardEditorial: Readonly<Record<string, PlaceEditorialOverride>> = {
  'place-soukjai-cafe': {
    shortDescription: 'A central, low-friction coffee stop for the hours when you are walking the old town, sorting transport or waiting to start the next leg of the Loop.',
  },
  'place-naga-hostel-and-cafe': {
    shortDescription: 'A traveller-focused base that keeps a bed and café under one roof, useful when you want the first or last Loop night to stay simple.',
  },
  'place-kamkhong-home-cafe-by-noungning': {
    shortDescription: 'A home-café pause for a quieter part of the day, better suited to slowing down than rushing through a pre-departure checklist.',
  },
  'place-dd-bistro-and-cafe': {
    shortDescription: 'A café-bistro choice for when coffee needs to become a proper daytime break rather than a five-minute stop between errands.',
  },
  'place-phubeer-restaurant': {
    shortDescription: 'An easy first-night or post-Loop restaurant pick when the priority is sitting down, eating and letting the road day finish.',
  },
  'place-bami-thakhek-hostel': {
    shortDescription: 'A practical hostel base for travellers who want to sleep in Thakhek, organise the bike and leave the Loop departure for the next morning.',
  },
  'place-bike-and-bed-hostel-cafe': {
    shortDescription: 'A traveller-oriented café stop tied to the Loop rhythm: useful for coffee, route planning and a pause among other riders without duplicating it as a stay.',
  },
  'place-thakheks-secret-bar': {
    shortDescription: 'An after-dark food-and-drink stop for the night when helmets are off and you want the Thakhek evening to last a little longer.',
  },
  'place-nana-bungalows': {
    shortDescription: 'A bungalow-format stay for travellers who would rather come back to a separate, slower-feeling base than another conventional hostel room.',
  },
  'place-orlasone-bbq': {
    shortDescription: 'A barbecue-led dinner option for an uncomplicated evening when the plan is simply food, company and no more road.',
  },
  'place-lao-home-hostel': {
    shortDescription: 'A straightforward hostel base for keeping costs and logistics simple before or after several days around Khammouane.',
  },
  'place-catty-tourist-house-and-restaurant': {
    shortDescription: 'A stay-and-meal combination that suits travellers who prefer to settle in once rather than separate accommodation and dinner logistics.',
  },
  'place-villa-thakhek': {
    shortDescription: 'A more private-feeling alternative to the hostel-heavy Loop scene, worth comparing when the town stay matters as much as the departure.',
  },
  'place-yo-and-ko-cafe': {
    shortDescription: 'A compact café stop for a short town pause when you want coffee without turning the break into a destination of its own.',
  },
  'place-vegetarian-house-cafe': {
    shortDescription: 'A useful café to shortlist when a vegetarian-leaning identity matters, especially after several road meals on the Loop.',
  },
  'place-bonjour-thakhek': {
    shortDescription: 'A relaxed town restaurant to keep for an unhurried Thakhek meal, especially on the evening before you commit to an early Loop start.',
  },
  'place-bamboo-hostel-thakhek': {
    shortDescription: 'A hostel base that fits the classic Loop rhythm: arrive, sort the practical details, sleep, then start riding with daylight.',
  },
  'place-stay-hostel-by-m-and-m': {
    shortDescription: 'A traveller hostel to compare when you want the social convenience of a Loop base without making the accommodation itself the main event.',
  },
  'place-thakhek-view': {
    shortDescription: 'A restaurant for turning dinner into part of the Thakhek evening rather than treating food as another pre-Loop task to clear.',
  },
  'place-la-parisian-cafe': {
    shortDescription: 'A café with a more deliberate stop-in feel: use it when you want to sit with coffee and let the town slow down for a while.',
  },
  'place-candy-cafe': {
    shortDescription: 'A casual afternoon café for the quieter hours between sightseeing, route planning and the busier evening riverfront.',
  },
  'place-organic-cafe': {
    shortDescription: 'A café to shortlist when its organic identity appeals to you; check the current menu rather than assuming the name defines every item.',
  },
  'place-miss-tang-restaurant': {
    shortDescription: 'A simple dinner candidate for a flexible evening when you want to eat in town without building the night around a destination restaurant.',
  },
  'place-song-lao-guesthouse': {
    shortDescription: 'A guesthouse-style base for travellers who prefer a quieter night in Thakhek before the road takes over again.',
  },
  'place-xoksaysub-hotel': {
    shortDescription: 'A conventional hotel option for travellers who want a straightforward town room and a clear break from the hostel-and-Loop atmosphere.',
  },
  'place-vie-de-france': {
    shortDescription: 'A café to use when you want a longer coffee pause in town, not just a quick caffeine stop on the way to the rental shop.',
  },
  'place-space-bar-and-restaurant': {
    shortDescription: 'A combined bar-and-restaurant stop for an easy evening when dinner can flow naturally into drinks instead of ending the day immediately.',
  },
  'place-rok-coffee-thakhek': {
    shortDescription: 'A coffee-first stop that fits naturally before route planning or after the bike comes back, giving the Loop day a clean start or finish.',
  },
  'place-room-cafe-thakhek': {
    shortDescription: 'A practical daytime café for sitting down between errands, transport plans and the small tasks that tend to fill a Thakhek preparation day.',
  },
  'place-nam-phou-hostel': {
    shortDescription: 'A hostel option for a no-fuss overnight when the important decision is tomorrow’s route rather than tonight’s room.',
  },
  'place-orlardee-hostel': {
    shortDescription: 'A small hostel base to compare when you want to keep the Loop departure flexible and stay inside Thakhek’s traveller rhythm.',
  },
  'place-thakhek-travel-lodge': {
    shortDescription: 'A lodge-style base suited to travellers who want to settle in properly before taking several days out on the Loop.',
  },
  'place-six-friends-restaurant': {
    shortDescription: 'A secondary town meal option to keep in the mix when timing and convenience matter more than making dinner a destination.',
  },
  'place-geelot-cha': {
    shortDescription: 'A tea-and-coffee alternative for days when you want a lighter pause and something different from the usual coffee-only shortlist.',
  },
  'place-b96-coffee-and-tea': {
    shortDescription: 'A straightforward coffee-and-tea stop for filling the gap between a town errand and the next transport or route decision.',
  },
  'place-mixay-thakhek-motor-rental': {
    shortDescription: 'One of the rental desks to compare seriously on bike condition, helmet, deposit and breakdown terms before trusting it with several Loop days.',
  },
  'place-pokemongo-motorbike-rental': {
    shortDescription: 'A Loop rental option where the useful comparison is mechanical condition and paperwork, not the name: test brakes, tyres and lights before leaving town.',
  },
  'place-wang-wang-motor-rental': {
    shortDescription: 'A rental option for travellers setting their own departure time; compare the bike itself, the deposit and support terms before choosing.',
  },
  'place-mad-monkey-motorcycle': {
    shortDescription: 'A motorcycle-rental option to include in the pre-Loop comparison when you want to inspect several bikes before deciding which one you trust.',
  },
  'place-khamouane-province-hospital': {
    shortDescription: 'The provincial public hospital for Thakhek; save the address before the Loop so an emergency contact point is already in your Atlas.',
  },
  'place-thakhek-tourism-information-center': {
    coordinates: { latitude: 17.40242, longitude: 104.81163 },
    locationScope: 'point',
    shortDescription: 'The city’s tourism information office, useful for current local guidance, Loop questions and practical orientation before you ride beyond Thakhek.',
    address: 'Thakhek, Khammouane Province, Laos',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=17.40242,104.81163',
  },
};

/**
 * Keep selected manually reviewed places available even when the generated draft has not yet
 * materialised them. The registry de-duplicates these by id, so a future generation can absorb
 * the entity without creating a duplicate card.
 */
export const supplementalPlaces: readonly SourcedPlace[] = [
  {
    id: 'place-thakhek-tourism-information-center',
    slug: 'thakhek-tourism-information-center',
    name: 'Thakhek Tourism Information Center',
    country: 'laos',
    city: 'thakhek',
    category: 'practical-services',
    coordinates: { latitude: 17.40242, longitude: 104.81163 },
    locationScope: 'point',
    shortDescription: 'The city’s tourism information office, useful for current local guidance, Loop questions and practical orientation before you ride beyond Thakhek.',
    media: {
      card: {},
      fieldCard: { gallery: [] },
    },
    spaCard: {
      handwrittenTags: ['Tourism office', 'Loop planning', 'Local guidance'],
      photoStatus: 'missing',
      photoRequiresManualFill: true,
    },
    verification: {
      decision: 'accept',
      reason: 'Existing Atlas Thakhek research candidate cross-checked against current mapped tourism-office data.',
    },
    sourceMetadata: {
      sourceName: 'Khammouane Tourism / Atlas V2 Thakhek research',
    },
    manualLocks: {},
    address: 'Thakhek, Khammouane Province, Laos',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=17.40242,104.81163',
    researchSources: [
      {
        sourceName: 'Khammouane Tourism',
        sourceUrl: 'https://www.khammouanetourism.org/en',
        purpose: 'candidate-discovery',
      },
      {
        sourceName: 'OpenStreetMap-derived current location cross-check',
        sourceUrl: 'https://www.openstreetmap.org/way/45015051',
        purpose: 'location',
      },
    ],
  },
];
