import type { Place, ResearchSource } from '../core/models/types';
import type { VenueFieldCardContent } from './venue-field-card-editorial';
import type { VenueFieldCardLayoutProfile } from './venue-field-card-layouts';

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

export const amorCafePlace: SourcedPlace = {
  id: 'place-amor-cafe-pakse',
  slug: 'amor-cafe-pakse',
  name: 'Amor Cafe',
  country: 'laos',
  city: 'pakse',
  category: 'cafes',
  coordinates: { latitude: 15.1221875, longitude: 105.799890625 },
  locationScope: 'point',
  shortDescription: 'A polished central Pakse café with strong green-and-gold styling, comfortable banquettes, proper air conditioning and a small food menu alongside the coffee.',
  media: {
    card: {},
    fieldCard: { gallery: [] },
  },
  spaCard: {
    handwrittenTags: ['Cafe', 'Air-conditioned', 'Personal field note'],
    photoStatus: 'missing',
    photoRequiresManualFill: true,
  },
  verification: {
    decision: 'accept',
    reason: 'User-selected personal venue; identity, Route 13 location, café/restaurant operation and interior character cross-checked against current public listings and venue photos.',
  },
  sourceMetadata: {
    sourceName: 'Google Maps',
    sourceUrl: 'https://maps.app.goo.gl/nkw8ULCeSxD27kkE6',
  },
  manualLocks: {},
  address: '4QCX+VXC, Route 13, Pakse, Laos',
  googleMapsUrl: 'https://maps.app.goo.gl/nkw8ULCeSxD27kkE6',
  researchSources: [
    {
      sourceName: 'Traveller first-hand knowledge',
      purpose: 'first-party',
      sourceType: 'manual',
    },
    {
      sourceName: 'Google Maps',
      sourceUrl: 'https://maps.app.goo.gl/nkw8ULCeSxD27kkE6',
      purpose: 'location',
    },
    {
      sourceName: 'Tripadvisor current listing',
      sourceUrl: 'https://www.tripadvisor.com/Restaurant_Review-g670161-d25435834-Reviews-Amor_Cafe-Pakse_Champasak_Province.html',
      purpose: 'facts',
    },
    {
      sourceName: 'Wongnai venue photos and listing',
      sourceUrl: 'https://www.wongnai.com/restaurants/2212904VQ-amor-cafe-%E0%B8%9B%E0%B8%B2%E0%B8%81%E0%B9%80%E0%B8%8B',
      purpose: 'facts',
    },
  ],
};

export const amorCafeFieldCard: VenueFieldCardContent = {
  status: 'published',
  kindLabel: 'Cafe',
  mediaSlots: 2,
  relatedPlaceIds: ['place-miss-noy-motorbike'],
  intro: 'Amor Cafe is one of the more polished cafés in central Pakse, right on Route 13 and almost opposite the scooter-rental side of town. I would not call it the cheapest coffee stop around, but that is also not really what it is trying to be. You get proper air conditioning, comfortable seating and a very deliberate interior that feels more dressed-up than most nearby cafés. On a hot afternoon, that can be a perfectly good reason to choose it.',
  chapters: [
    {
      title: 'I partly come here for the air conditioning',
      body: 'Amor is a little more expensive than some of the cafés around it, and I think that is worth saying plainly. At the same time, you are paying for a different kind of stop. The room is air-conditioned, the banquettes are comfortable and it is easy to sit down properly rather than just grab a coffee and move on. In Pakse heat, especially in the middle of the day, that changes the value of the place for me. I do not mind paying a little extra when what I actually want is an hour somewhere cool and comfortable.',
    },
    {
      title: 'The place has a very strong idea of what it wants to look like',
      body: 'The interior is probably the most memorable part. Deep green, gold details, decorated ceilings, wood, large visual elements behind the counter and proper upholstered seating give it that slightly luxurious café look. It is definitely styled rather than accidental. Some cafés feel like a room that happens to serve coffee; Amor feels like someone decided exactly what the room should look like before opening it. Whether or not that is your personal style, it gives the café a clear identity and makes it easy to recognise.',
    },
    {
      title: 'There is food, but that is not why I would send someone here',
      body: 'They do more than coffee. There is a small food menu, including things like spaghetti and other simple dishes, so it works perfectly well if you are hungry and do not want to move somewhere else. My own view is that the food is fine, but I would not describe Amor as one of the places I go to for the best meal in Pakse. I come for the café itself: the coffee, the cool room, the banquettes and the atmosphere. The food is useful because it lets you stay longer, not because I think it should be the headline.',
    },
  ],
  faq: [
    {
      question: 'Is Amor Cafe more expensive than other cafés in Pakse?',
      answer: 'In my experience, yes, a little. I think the difference makes more sense once you factor in the air conditioning, comfortable seating and more polished interior rather than comparing only the price of one drink.',
    },
    {
      question: 'Can I eat here or is it only coffee?',
      answer: 'There is a small food menu as well, including spaghetti and other simple dishes. I find the food perfectly fine, but personally I choose Amor more for the café environment than because I consider it one of Pakse’s strongest kitchens.',
    },
    {
      question: 'Why would I choose Amor over another central café?',
      answer: 'For me, the clearest reasons are the air conditioning, the comfortable banquettes and the strong interior atmosphere. It is a good place to sit properly for a while rather than only stop for a quick drink.',
    },
  ],
};

export const amorCafeLayout: VenueFieldCardLayoutProfile = {
  heroDescription: 'Amor Cafe is one of central Pakse’s more polished coffee stops: slightly pricier than some neighbours, but properly air-conditioned, comfortable and built around a very deliberate green-and-gold interior.',
  hero: {
    eyebrow: 'CAFE · CENTRAL PAKSE',
    aliases: ['Air-conditioned', 'Green + gold interior', 'Coffee + light food'],
    steps: ['Escape the heat', 'Take a banquette', 'Order a coffee', 'Add food if you need it'],
    rhythmNote: 'I come here when comfort matters as much as the coffee: cool air, a proper seat and a room with a strong identity.',
    photoNote: 'Personal photos to add · Route 13, central Pakse',
  },
  primaryNote: {
    label: 'MY TAKE',
    text: 'You pay a little more than at some nearby cafés, but the air-con is part of what you are paying for.',
  },
  quickRead: {
    time: { primary: 'COFFEE BREAK', secondary: 'or stay longer when the heat is getting old' },
    route: { primary: 'CENTRAL PAKSE', secondary: 'Route 13 · opposite the scooter-rental area' },
    budget: { primary: 'A LITTLE HIGHER', secondary: 'than some nearby cafés in my experience' },
    bestFor: { primary: 'AIR-CON + COMFORT', secondary: 'banquettes · coffee · a polished interior' },
  },
  practicalNotes: {
    items: [
      { label: 'Air conditioning', value: 'Yes', detail: 'For me, this is one of the main reasons the slightly higher price can make sense.' },
      { label: 'Seating', value: 'Comfortable banquettes', detail: 'The café is designed for sitting down properly rather than only grabbing a drink.' },
      { label: 'Food', value: 'Small menu available', detail: 'Spaghetti and other simple dishes make it possible to eat without leaving the café.' },
      { label: 'My food take', value: 'Fine, not the headline', detail: 'I use the food as a convenient extra; I come here primarily for the café itself.' },
      { label: 'Location', value: 'Central Route 13', detail: 'It sits almost opposite the scooter-rental area, so it is an easy stop in the middle of town.' },
    ],
  },
  chapterLabels: ['THE COMFORT', 'THE LOOK', 'THE FOOD'],
  beforeYouLeave: {
    title: 'Choose it for the room, not only the cup',
    body: 'If all I wanted was the cheapest coffee nearby, Amor would not automatically be my first choice. What makes it useful is the whole package: central location, cool air, comfortable seating and an interior that feels much more deliberate than the average quick coffee stop. That is when the slightly higher price makes sense to me.',
    note: {
      label: 'BEST USE',
      text: 'A good central pause when you want to get out of the heat and actually sit down for a while.',
    },
  },
};
