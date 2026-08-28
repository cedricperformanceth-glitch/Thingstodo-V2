import type { Place, ResearchSource } from '../core/models/types';
import type { VenueFieldCardContent } from './venue-field-card-editorial';
import type { VenueFieldCardLayoutProfile } from './venue-field-card-layouts';

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

export const laoBurgerPlace: SourcedPlace = {
  id: 'place-lao-burger-pakse',
  slug: 'lao-burger-pakse',
  name: 'Lao Burger',
  country: 'laos',
  city: 'pakse',
  category: 'restaurants',
  coordinates: { latitude: 15.1202, longitude: 105.7989 },
  locationScope: 'area',
  shortDescription: 'A tiny fixed street-food cart in central Pakse where a Vietnamese grandmother serves cheap Lao-style burgers and bánh mì from morning until early afternoon.',
  media: {
    card: {},
    fieldCard: { gallery: [] },
  },
  spaCard: {
    handwrittenTags: ['Street food', 'Burger & bánh mì', 'Personal field note'],
    photoStatus: 'missing',
    photoRequiresManualFill: true,
  },
  verification: {
    decision: 'accept',
    reason: 'User-selected first-hand street-food venue. The supplied Google Maps listing is kept as the navigation source; coordinates remain area-scoped until the exact point is normalized.',
  },
  sourceMetadata: {
    sourceName: 'Google Maps',
    sourceUrl: 'https://maps.app.goo.gl/f5y2S7zkbZqt5w5o8',
  },
  manualLocks: {},
  address: 'Central Pakse, Pakse 16000, Laos',
  googleMapsUrl: 'https://maps.app.goo.gl/f5y2S7zkbZqt5w5o8',
  researchSources: [
    {
      sourceName: 'Traveller first-hand knowledge',
      purpose: 'first-party',
      sourceType: 'manual',
    },
    {
      sourceName: 'Google Maps',
      sourceUrl: 'https://maps.app.goo.gl/f5y2S7zkbZqt5w5o8',
      purpose: 'location',
    },
    {
      sourceName: 'Southern Laos pumpkin burger context',
      sourceUrl: 'https://intentionaldetours.com/ultimate-guide-to-backpacking-don-det/',
      purpose: 'facts',
    },
  ],
};

export const laoBurgerFieldCard: VenueFieldCardContent = {
  status: 'published',
  kindLabel: 'Street-food cart',
  mediaSlots: 2,
  intro: 'Lao Burger is exactly the kind of place that is easy to walk past because it looks so ordinary. It is a fixed little cart in central Pakse, run by a Vietnamese grandmother who is there through the morning and into the early afternoon. I stop for the cheap burgers and bánh mì, and for me this is one of those small addresses that makes the city feel more personal than another sit-down restaurant ever could.',
  chapters: [
    {
      title: 'A fixed little cart that feels like part of the street',
      body: 'The cart does not really move around: this is her regular spot, and she is usually there from the morning until the beginning of the afternoon. There is nothing polished or designed about the experience. You order from a Vietnamese grandmother working from a small street-food setup in the middle of town, take what she makes and carry on with your day. That simplicity is the whole point for me. It is visible, central and not remotely secret, yet it still feels like a small Pakse gem because so many travellers can pass places like this without ever trying them.',
    },
    {
      title: 'The burger is the cheap little order I keep coming back for',
      body: 'The burger has been 25,000 kip in my recent experience, while the bánh mì comes in larger options around 30,000 and 40,000 kip. I have always understood the Lao-style burger here to use a pumpkin-based patty rather than meat, and pumpkin burgers are a real southern-Laos thing, but I would still tell a strict vegetarian to confirm the ingredients and cooking on the day rather than rely on that assumption. The bánh mì is not vegetarian. Either way, this is not a place I recommend because it is elaborate. I recommend it because it is cheap, local, quick and I genuinely enjoy eating there.',
    },
  ],
  faq: [
    {
      question: 'When should I go?',
      answer: 'Go in the morning or before the beginning of the afternoon. This is a daytime street-food cart rather than an evening stop.',
    },
    {
      question: 'How much are the burgers and bánh mì?',
      answer: 'In my recent experience, the small burger was 25,000 kip and the bánh mì options were around 30,000 and 40,000 kip depending on size. Street-food prices can change, so treat those as useful current reference points rather than a permanent menu.',
    },
    {
      question: 'Is the burger vegetarian?',
      answer: 'I have always understood the burger here to be made with a pumpkin-based patty rather than meat, but if you are strictly vegetarian or vegan I would confirm the ingredients and cooking directly at the cart. The bánh mì is not vegetarian.',
    },
  ],
};

export const laoBurgerLayout: VenueFieldCardLayoutProfile = {
  heroDescription: 'A Vietnamese grandmother, a fixed little cart, 25,000-kip Lao-style burgers and bánh mì: one of my simplest food stops in central Pakse, and one I genuinely enjoy.',
  hero: {
    eyebrow: 'STREET FOOD · PAKSE',
    aliases: ['Vietnamese grandma', '25k burger', 'Morning stop'],
    steps: ['Find the fixed cart', 'Order the little burger', 'Add a bánh mì if hungry', 'Go before early afternoon'],
    rhythmNote: 'There is nothing hidden about it. The charm is simply stopping at a very ordinary-looking cart and finding something I keep wanting to eat again.',
    photoNote: 'Personal photos to add · central Pakse street cart',
  },
  primaryNote: {
    label: 'HIDDEN GEM, SORT OF',
    text: 'It is right there in central Pakse and everyone can see it. The hidden part is simply deciding not to walk past.',
  },
  quickRead: {
    time: { primary: 'MORNING', secondary: 'through the beginning of the afternoon' },
    route: { primary: 'CENTRAL PAKSE', secondary: 'fixed street-food cart · use the Maps pin' },
    budget: { primary: '25K–40K KIP', secondary: 'burger 25k · bánh mì around 30k / 40k in my recent experience' },
    bestFor: { primary: 'CHEAP STREET FOOD', secondary: 'quick burger · bánh mì · local daytime stop' },
  },
  practicalNotes: {
    items: [
      { label: 'Format', value: 'Fixed street-food cart', detail: 'She works from the same regular spot rather than moving around town with the cart.' },
      { label: 'Best time', value: 'Morning to early afternoon', detail: 'I would not plan this as an evening food stop.' },
      { label: 'Burger', value: '25,000 kip', detail: 'Recent personal price reference.' },
      { label: 'Bánh mì', value: '30,000 / 40,000 kip', detail: 'Different sizes in my recent experience; these are not vegetarian.' },
      { label: 'Patty', value: 'Pumpkin-based, as I understand it', detail: 'Strict vegetarians should still confirm ingredients and cooking directly at the cart.' },
      { label: 'Style', value: 'Take it as it is', detail: 'This is a tiny street-food address, not a polished restaurant experience.' },
    ],
  },
  chapterLabels: ['THE CART', 'WHAT I ORDER'],
};
