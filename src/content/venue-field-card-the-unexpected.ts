import type { Place, ResearchSource } from '../core/models/types';
import type { VenueFieldCardContent } from './venue-field-card-editorial';
import type { VenueFieldCardLayoutProfile } from './venue-field-card-layouts';

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

export const theUnexpectedPlace: SourcedPlace = {
  id: 'place-the-unexpected-pakse',
  slug: 'the-unexpected-pakse',
  name: 'The Unexpected',
  country: 'laos',
  city: 'pakse',
  category: 'restaurants',
  coordinates: { latitude: 15.1202, longitude: 105.7989 },
  locationScope: 'area',
  shortDescription: 'My safest local-food bet in Pakse: a young family restaurant serving fresh Lao and Thai dishes on one of the city’s busiest everyday food streets.',
  media: {
    card: {},
    fieldCard: { gallery: [] },
  },
  spaCard: {
    handwrittenTags: ['Lao & Thai food', 'Local favourite', 'Personal field note'],
    photoStatus: 'missing',
    photoRequiresManualFill: true,
  },
  verification: {
    decision: 'accept',
    reason: 'User-selected first-hand restaurant. The supplied Google Maps pin remains the navigation source; the listing itself uses a Lao-script name, while The Unexpected is the Atlas editorial display name. Coordinates remain area-scoped until the exact point and Lao-script title are normalized from the Maps listing.',
  },
  sourceMetadata: {
    sourceName: 'Google Maps',
    sourceUrl: 'https://maps.app.goo.gl/a5iVtvzE4SZpZQJt7',
  },
  manualLocks: {},
  address: 'Central Pakse food street, Pakse 16000, Laos',
  googleMapsUrl: 'https://maps.app.goo.gl/a5iVtvzE4SZpZQJt7',
  researchSources: [
    {
      sourceName: 'Traveller first-hand knowledge',
      purpose: 'first-party',
      sourceType: 'manual',
    },
    {
      sourceName: 'Google Maps',
      sourceUrl: 'https://maps.app.goo.gl/a5iVtvzE4SZpZQJt7',
      purpose: 'location',
    },
  ],
};

export const theUnexpectedFieldCard: VenueFieldCardContent = {
  status: 'published',
  kindLabel: 'Lao & Thai family restaurant',
  mediaSlots: 3,
  intro: 'On Google Maps this little restaurant is listed under its Lao-script name. On the Atlas I call it The Unexpected, because that is exactly how it has felt to me. I have watched a young family build the place little by little, from something even simpler than the setup you see now into a proper little local restaurant. And somewhere along the way it became my safest answer in Pakse when I simply want very good local food.',
  chapters: [
    {
      title: 'I call it The Unexpected because it quietly became my local reference',
      body: 'There are plenty of Lao restaurants in Pakse, including places that look more established or more obvious from the street. This one won me over by being consistently good. If I want fried rice, curry, pad Thai or simply a local plate that I know will be fresh, generous and properly cooked, this is where I go. For me it is the best local food in the city. That is a personal judgement, but it is also one of the recommendations I make with the least hesitation because I have kept coming back and the kitchen keeps delivering.',
    },
    {
      title: 'The food sits naturally between Laos and Thailand',
      body: 'The menu is broad but stays firmly in Lao and Thai territory. The flavours can be punchy and the kitchen is not afraid of chilli. One day I brought my coach here and, on his first bite, he immediately said that it tasted like Thailand. Coming from him, that was a compliment. That little moment probably explains the food better than a long menu description: the seasoning has confidence and the dishes taste familiar in the right way. If you do not want heat, say “bo phet” when you order and make the request clear.',
    },
    {
      title: 'I have watched a young family grow the place bit by bit',
      body: 'Part of my attachment to the restaurant comes from seeing it develop. At the beginning the setup was even smaller and they did not yet have the container structure that is there now. It has grown gradually rather than arriving as a fully designed concept. That makes the place feel honest to me: a young family building a business step by step, serving a varied menu, improving the physical space and earning regular customers through the food rather than through a polished tourist image.',
    },
    {
      title: 'The street is part of the meal',
      body: 'This is not an air-conditioned restaurant. You sit outside under cover, with fans above the tables, and on hot Pakse days you will still feel the heat. But the location is one of the reasons I like eating here. The surrounding street is a real everyday food strip: small restaurants, soup stalls, grocery shops selling in larger quantities, sweets, fruit juice and young locals stopping after basketball or sport. There is movement, noise and people coming and going. You are eating in the middle of a piece of ordinary Pakse life rather than inside a restaurant designed to isolate you from it.',
    },
  ],
  faq: [
    {
      question: 'Why is it called The Unexpected on the Atlas?',
      answer: 'The Google Maps listing uses the restaurant’s original Lao-script name. The Unexpected is my editorial nickname for it because I watched this small family place grow gradually and did not expect it to become my most reliable local-food recommendation in Pakse.',
    },
    {
      question: 'What kind of food should I expect?',
      answer: 'A varied Lao and Thai menu: rice dishes, curries, noodles such as pad Thai and other everyday local plates. For me, the strength is not one single signature dish but how reliably good the cooking is across the kind of food I actually want to eat regularly.',
    },
    {
      question: 'Is the food spicy?',
      answer: 'It can be. If you do not want chilli, say “bo phet” and make the request clear when ordering. I would not assume every dish will automatically be mild for foreign visitors.',
    },
    {
      question: 'Is this an evening restaurant?',
      answer: 'No. I treat it as a daytime local-food stop. It normally starts around late morning and is not one of my places for a late dinner; check the current Google Maps listing for the day’s exact hours.',
    },
  ],
};

export const theUnexpectedLayout: VenueFieldCardLayoutProfile = {
  heroDescription: 'The little family restaurant I did not expect to become my safest local-food recommendation in Pakse: fresh Lao and Thai cooking, real chilli when you want it, and a table right in the middle of a busy local food street.',
  hero: {
    eyebrow: 'LOCAL FOOD · PAKSE',
    aliases: ['The Unexpected', 'Lao Maps name', 'My local safe bet'],
    steps: ['Find the Lao-script Maps pin', 'Pick a Lao or Thai plate', 'Say “bo phet” if needed', 'Stay for the street atmosphere'],
    rhythmNote: 'I have watched the family grow the restaurant little by little, and the food is the reason I keep returning.',
    photoNote: 'Personal photos to add · central Pakse food street',
  },
  primaryNote: {
    label: 'FIRST BITE',
    text: 'My coach took one bite and said: “This tastes like Thailand.” Coming from him, that was a compliment.',
  },
  quickRead: {
    time: { primary: 'DAYTIME', secondary: 'late morning into the afternoon · check current Maps hours' },
    route: { primary: 'FOOD STREET', secondary: 'central Pakse · busy local commercial strip' },
    budget: { primary: 'LOCAL VALUE', secondary: 'check the current menu for today’s prices' },
    bestFor: { primary: 'LAO + THAI FOOD', secondary: 'rice · curry · noodles · reliable local cooking' },
  },
  practicalNotes: {
    items: [
      { label: 'Cuisine', value: 'Lao & Thai', detail: 'A broad everyday menu rather than one single speciality.' },
      { label: 'My verdict', value: 'Best local food in Pakse', detail: 'That is my personal judgement and the reason this is one of my safest recommendations.' },
      { label: 'Spice', value: 'Can be properly spicy', detail: 'Say “bo phet” if you want the dish without chilli and make the request clear.' },
      { label: 'Seating', value: 'Covered outdoor tables', detail: 'No air-conditioning; fans hang above the tables.' },
      { label: 'Street', value: 'Very active local food strip', detail: 'Restaurants, soup stalls, groceries, sweets, juice and plenty of local foot traffic.' },
      { label: 'Timing', value: 'Daytime stop', detail: 'I associate it with late morning and afternoon rather than evening; use Maps for current opening hours.' },
    ],
  },
  chapterLabels: ['WHY UNEXPECTED', 'THE FOOD', 'THE FAMILY', 'THE STREET'],
  beforeYouLeave: {
    title: 'Do not overthink the order',
    body: 'I come here because I trust the kitchen across ordinary local dishes, not because I am chasing one famous plate. Pick what you actually feel like eating — rice, curry, noodles — and if you are sensitive to chilli, say “bo phet” before the wok starts. Then accept that you are sitting outside in a busy Pakse food street: the heat, fans and movement are part of the place.',
    note: {
      label: 'MY SAFE BET',
      text: 'If I want local food and do not want to gamble on the result, this is where I go.',
    },
  },
};
