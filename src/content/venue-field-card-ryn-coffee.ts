import type { Place, ResearchSource } from '../core/models/types';
import type { VenueFieldCardContent } from './venue-field-card-editorial';
import type { VenueFieldCardLayoutProfile } from './venue-field-card-layouts';

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

export const rynCoffeePlace: SourcedPlace = {
  id: 'place-ryn-coffee',
  slug: 'ryn-coffee',
  name: 'RYN Coffee',
  country: 'laos',
  city: 'pakse',
  category: 'cafes',
  coordinates: { latitude: 15.122692, longitude: 105.795143 },
  locationScope: 'point',
  shortDescription: 'One of Pakse’s serious coffee addresses: a small original café with its roaster in view, excellent beans, a leafy interior, a strong local following and a cheesecake I make a point of mentioning.',
  media: {
    card: {},
    fieldCard: { gallery: [] },
  },
  spaCard: {
    handwrittenTags: ['Coffee roaster', 'Original RYN', 'Personal field note'],
    photoStatus: 'missing',
    photoRequiresManualFill: true,
  },
  verification: {
    decision: 'accept',
    reason: 'User-selected original RYN Coffee in Pakse; identity, address, current operation and point coordinates cross-checked against current public map and restaurant listings.',
  },
  sourceMetadata: {
    sourceName: 'Google Maps',
    sourceUrl: 'https://maps.app.goo.gl/1gnQa7TUaziH7PZo6',
  },
  manualLocks: {},
  address: '63 Ban Bung Udom, Pakse, Laos',
  googleMapsUrl: 'https://maps.app.goo.gl/1gnQa7TUaziH7PZo6',
  researchSources: [
    {
      sourceName: 'Traveller first-hand knowledge',
      purpose: 'first-party',
      sourceType: 'manual',
    },
    {
      sourceName: 'Google Maps',
      sourceUrl: 'https://maps.app.goo.gl/1gnQa7TUaziH7PZo6',
      purpose: 'location',
    },
    {
      sourceName: 'Apple Maps current listing',
      sourceUrl: 'https://maps.apple.com/place?place-id=IE96D5B7FA1185509',
      purpose: 'facts',
    },
    {
      sourceName: 'Tripadvisor current listing',
      sourceUrl: 'https://www.tripadvisor.com/Restaurant_Review-g670161-d15009650-Reviews-RYN_Coffee-Pakse_Champasak_Province.html',
      purpose: 'facts',
    },
  ],
};

export const rynCoffeeFieldCard: VenueFieldCardContent = {
  status: 'published',
  kindLabel: 'Coffee roaster',
  mediaSlots: 2,
  intro: 'RYN is the café I think of when someone in Pakse actually cares about the coffee itself. There are now two RYN addresses in town, but this is the original one I wanted in the Atlas. The roaster is right there, beans are part of the identity of the place, and among locals and expats RYN is very easily in the conversation when people start naming the best coffee in Pakse. For me, it belongs in the city’s top five without much discussion.',
  chapters: [
    {
      title: 'Come here because you care about the coffee',
      body: 'This is not just a café with an espresso machine sitting behind the counter. You see the roasting setup, you can buy beans, and the whole place feels built around people who take coffee seriously. That is the main reason I would send somebody here. Pakse has plenty of places where you can get a decent drink, but RYN is one of the addresses where the coffee itself is the point. The reputation is strong with both Lao customers and expats, and from my own experience that reputation makes sense.',
    },
    {
      title: 'Small from the street, much nicer once you are inside',
      body: 'From outside it is easy to underestimate the place. Inside, the café opens up much better than you expect: there is greenery, water moving through a small fountain feature, and enough detail to give the room a real atmosphere without making it feel over-designed. It is still a small café and there is plenty of movement because people are constantly stopping for takeaway coffee, but the interior breathes surprisingly well. Two little cats are usually part of the scenery too, which only adds to the character.',
    },
    {
      title: 'A place to enjoy, not somewhere I would turn into an office',
      body: 'The crowd is quite young and very Pakse. You see local students and young people stopping for coffee, taking photos, checking their phones or meeting somebody for a while. I like that energy. If I am with someone, this is exactly the kind of café I would choose for a good coffee and a conversation. I can also sit here alone for a while. What I personally would not do is arrive with a laptop and plan to work for half a day. The place is too active for that, and I think it is better enjoyed for what it actually is.',
    },
  ],
  faq: [
    {
      question: 'Is RYN worth seeking out specifically for the coffee?',
      answer: 'Yes. For me, this is one of Pakse’s top coffee addresses, and the café takes the beans and roasting seriously rather than treating coffee as just one item on a large menu.',
    },
    {
      question: 'Can I buy coffee beans here?',
      answer: 'Yes. Beans are part of the identity of RYN, and the roasting setup is visible at the café.',
    },
    {
      question: 'Is there anything I would order besides coffee?',
      answer: 'The cheesecake deserves a special mention. Good Western-style pastries can be surprisingly inconsistent in this part of Asia, and this is one I genuinely enjoy.',
    },
    {
      question: 'Is RYN a good café for working on a laptop?',
      answer: 'Not for me. I would happily sit here with someone, scroll on my phone or enjoy a coffee alone, but the steady movement and social atmosphere make it a café I prefer to enjoy rather than use as an office.',
    },
  ],
};

export const rynCoffeeLayout: VenueFieldCardLayoutProfile = {
  heroDescription: 'The original RYN is one of the Pakse cafés I would send a real coffee drinker to first: beans, roasting, a strong local following, a small leafy interior and a café culture that feels genuinely lived-in.',
  hero: {
    eyebrow: 'COFFEE ROASTER · PAKSE',
    aliases: ['Original RYN', 'Beans + roasting', 'Local coffee crowd'],
    steps: ['Order the coffee first', 'Look at the roasting setup', 'Add the cheesecake', 'Stay for the atmosphere'],
    rhythmNote: 'This is a coffee-first address. The room is pleasant, but the reason to remember RYN is what is in the cup.',
    photoNote: 'Personal photos to add · original RYN Coffee, Pakse',
  },
  primaryNote: {
    label: 'SMALL DETAIL',
    text: 'Two little cats are usually around. They are part of the atmosphere almost as much as the greenery and the sound of the water.',
  },
  quickRead: {
    time: { primary: '30–60 MIN', secondary: 'coffee, cheesecake and a proper pause' },
    route: { primary: 'CENTRAL PAKSE', secondary: '63 Ban Bung Udom · original RYN address' },
    budget: { primary: 'CAFÉ STOP', secondary: 'check the current menu for prices' },
    bestFor: { primary: 'REAL COFFEE', secondary: 'beans · roasting · cheesecake · local atmosphere' },
  },
  practicalNotes: {
    items: [
      { label: 'Coffee', value: 'One of my Pakse top five', detail: 'This is a personal ranking, but one I hear echoed often among locals and expats.' },
      { label: 'Beans', value: 'Available to buy', detail: 'The coffee side of the business goes beyond drinks served at the counter.' },
      { label: 'Roasting', value: 'Roaster on site', detail: 'The roasting setup is part of what makes this feel like a serious coffee address.' },
      { label: 'Cheesecake', value: 'Special mention', detail: 'It is one of the pastries I specifically come back for.' },
      { label: 'Atmosphere', value: 'Leafy + lively', detail: 'Greenery, moving water, young local customers and a steady takeaway flow.' },
      { label: 'Laptop', value: 'Not my work café', detail: 'I prefer RYN for a coffee, a conversation or a short solo stop rather than a long computer session.' },
    ],
  },
  chapterLabels: ['THE COFFEE', 'THE ROOM', 'HOW I USE IT'],
};
