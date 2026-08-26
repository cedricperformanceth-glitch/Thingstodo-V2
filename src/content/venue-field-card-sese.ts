import type { Place, ResearchSource } from '../core/models/types';
import type { VenueFieldCardContent } from './venue-field-card-editorial';
import type { VenueFieldCardLayoutProfile } from './venue-field-card-layouts';

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

export const seseWineBeerPlace: SourcedPlace = {
  id: 'place-sese-wine-and-beer',
  slug: 'sese-wine-and-beer',
  name: 'SéSé Wine and Beer',
  country: 'laos',
  city: 'pakse',
  category: 'restaurants',
  coordinates: { latitude: 15.12269, longitude: 105.79907 },
  locationScope: 'point',
  shortDescription: 'A small French restaurant and wine bar in Pakse where French recipes, Belgian beer and selected imported products meet an unusually mixed crowd of Lao regulars, expatriates and travellers.',
  media: {
    card: {},
    fieldCard: { gallery: [] },
  },
  spaCard: {
    handwrittenTags: ['French restaurant', 'Belgian beer', 'Personal field note'],
    photoStatus: 'missing',
    photoRequiresManualFill: true,
  },
  verification: {
    decision: 'accept',
    reason: 'User-selected personal venue; identity, location, current evening opening pattern and restaurant/bar operation cross-checked against current public business data.',
  },
  sourceMetadata: {
    sourceName: 'Google Maps',
    sourceUrl: 'https://maps.app.goo.gl/Eu1HJPcPjgTJJkR56',
  },
  manualLocks: {},
  address: 'Parallel Road 13, Ban Thaluang, Pakse 16010, Laos',
  googleMapsUrl: 'https://maps.app.goo.gl/Eu1HJPcPjgTJJkR56',
  researchSources: [
    {
      sourceName: 'Traveller first-hand knowledge',
      purpose: 'first-party',
      sourceType: 'manual',
    },
    {
      sourceName: 'Google Maps',
      sourceUrl: 'https://maps.app.goo.gl/Eu1HJPcPjgTJJkR56',
      purpose: 'location',
    },
    {
      sourceName: 'Current business listing cross-check',
      sourceUrl: 'https://restaurantguru.com/SeSe-Wine-and-Beer-Pakse',
      purpose: 'facts',
    },
  ],
};

export const seseWineBeerFieldCard: VenueFieldCardContent = {
  status: 'published',
  kindLabel: 'Restaurant & wine bar',
  mediaSlots: 3,
  intro: 'SéSé is one of those Pakse addresses that people can describe too quickly as an expat place. Cédric has been settled in Laos for a long time and built his family life here, and the restaurant reflects that better than the label suggests. You can find expatriates, travellers, younger Lao customers coming for a glass of wine and Lao families sharing a table. For me, that mixture is a large part of what makes the place interesting.',
  chapters: [
    {
      title: 'An expat meeting point that became local too',
      body: 'SéSé certainly works as a meeting point for expatriates in Pakse, and on some evenings that side of the place is obvious. But reducing it to an expat headquarters misses what Cédric has built over time. I also see Lao customers coming in for the same things: younger people having a glass of wine, small families eating together, and regulars who are simply comfortable there. Add travellers passing through Pakse and the room can become surprisingly mixed. That matters to me because the restaurant feels connected to the city rather than like a little foreign enclave dropped into it.',
    },
    {
      title: 'French recipes, cooked in a Lao kitchen',
      body: 'The cooking is French in its recipes and references, but the kitchen itself is not pretending to have been transported wholesale from France. The cook is Lao and local ingredients are used whenever that is the sensible choice. You are not eating beef flown in from Europe or rice imported from France. The French side comes through in the recipes, the sauces, the comfort-food logic and the particular products that genuinely make a difference. I find that balance much more natural than trying to make every ingredient prove where the restaurant comes from.',
    },
    {
      title: 'The imported products are the ones worth importing',
      body: 'Where SéSé does look back to Europe is with products that are difficult to replace locally: cheese, charcuterie and wine come from France, while the beer selection leans strongly Belgian. That gives the place a very specific identity without turning the menu into a catalogue of imported ingredients. You can come for a plate of French food, a glass of wine or one of the Belgian beers and understand immediately what Cédric wants the bar to be. A Duvel arriving in the proper Duvel glass is a tiny detail, but it is exactly the sort of detail that makes the whole thing feel intentional.',
    },
    {
      title: 'The small details are part of why I come back',
      body: 'I like that SéSé does not need to make everything complicated. Homemade fries are a good example: they sound like a minor detail until you have spent enough time travelling and start noticing when someone actually makes them properly. The same goes for sitting down for one beer rather than committing to a full dinner. The place works at both speeds. Some people arrive for food, others for wine or Belgian beer, and plenty end up staying longer because they know someone at another table. That loose, familiar rhythm is much more representative of SéSé than any single dish.',
    },
  ],
  faq: [
    {
      question: 'What kind of food does SéSé serve?',
      answer: 'The recipes are mainly French, with a Lao cook in the kitchen and local ingredients used where they make sense. The specifically imported side is concentrated on products such as French cheese, charcuterie and wine rather than every ingredient on the plate.',
    },
    {
      question: 'Is SéSé mainly an expat restaurant?',
      answer: 'It is definitely a regular meeting point for expatriates, but that is only part of the crowd. I also see travellers, younger Lao customers coming for wine and Lao families eating there, which gives the place a much more mixed atmosphere than the usual expat-bar label suggests.',
    },
    {
      question: 'Can I get Belgian beer there?',
      answer: 'Yes. Belgian beer is one of the signatures of the bar. Duvel is one of the small details I associate with the place, right down to being served in the proper Duvel glass.',
    },
    {
      question: 'What time does the kitchen close?',
      answer: 'The useful time to remember is 10 p.m. The restaurant may continue into the evening, but if you want food I would make sure the order is in before the kitchen closes at 22:00.',
    },
    {
      question: 'Is there a small thing I personally recommend?',
      answer: 'I have a soft spot for the crème brûlée. It was 50,000 kip when I had it. I also notice the homemade fries, which are exactly the kind of simple detail I appreciate when they are done properly.',
    },
  ],
};

export const seseWineBeerLayout: VenueFieldCardLayoutProfile = {
  heroDescription: 'SéSé is Cédric’s small French restaurant and wine bar in Pakse, built around French recipes, selected imported cheese, charcuterie and wine, Belgian beer, and a surprisingly mixed crowd of expatriates, travellers and Lao regulars.',
  hero: {
    eyebrow: 'FRENCH TABLE · PAKSE',
    aliases: ['French kitchen', 'Belgian beer', 'Mixed local crowd'],
    steps: ['Come for an evening drink', 'Order French comfort food', 'Stay for the mixed crowd', 'Get food in before 22:00'],
    rhythmNote: 'It feels like an expat address until you notice how many Lao regulars have made it theirs too.',
    photoNote: 'Personal photos to add · Ban Thaluang',
  },
  primaryNote: {
    label: 'MY PICK',
    text: 'The crème brûlée was 50,000 kip when I had it; it is one of my small favourites here.',
  },
  quickRead: {
    time: { primary: 'EVENING', secondary: 'kitchen closes at 22:00' },
    route: { primary: 'BAN THALUANG', secondary: 'central Pakse · near Wat Luang' },
    budget: { primary: 'CHECK THE MENU', secondary: 'wine and imported products can shape the spend' },
    bestFor: { primary: 'MIXED CROWD', secondary: 'locals · expats · travellers · wine drinkers' },
  },
  practicalNotes: {
    items: [
      { label: 'Kitchen', value: 'Closes at 22:00', detail: 'That is the useful cutoff I keep in mind when I want dinner rather than only a drink.' },
      { label: 'Cuisine', value: 'French recipes', detail: 'A Lao cook runs the kitchen, with local ingredients used whenever they are the sensible choice.' },
      { label: 'Imports', value: 'Cheese · charcuterie · wine', detail: 'These are the kinds of French products worth importing; the rest of the kitchen is not artificially imported.' },
      { label: 'Beer', value: 'Belgian selection', detail: 'Belgian beer is part of the identity of the bar, including Duvel.' },
      { label: 'Crowd', value: 'Very mixed', detail: 'Expats, travellers and Lao regulars all use the place, including younger drinkers and families.' },
    ],
  },
  chapterLabels: ['THE CROWD', 'THE KITCHEN', 'THE IMPORTS', 'THE DETAILS'],
  beforeYouLeave: {
    title: 'Remember the kitchen cutoff, not the full opening-hours table',
    body: 'The one time I would actually keep in my head is 22:00, because that is when the kitchen closes. Full opening hours are easy to check on the current Google Maps listing and can change; the practical point is simply not to turn up late expecting a full dinner after the kitchen has finished.',
    note: {
      label: 'DUVEL DETAIL',
      text: 'A Duvel in the proper Duvel glass is exactly the kind of small detail I notice here.',
    },
  },
};
