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
  shortDescription: 'A small French restaurant and wine bar in Pakse with French recipes, Belgian beer, selected French wine, cheese and charcuterie, and a crowd that mixes Lao regulars, expatriates and travellers.',
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
  intro: 'SéSé is a small French restaurant and bar that has become one of the easy meeting points in Pakse. Cédric has lived in Laos for years and has a family here, so the place never feels like a French restaurant sealed off from the city around it. On the same evening you can find Lao couples, families, expatriates and travellers sharing the room. Come for dinner, a glass of French wine or a Belgian beer; the atmosphere usually does the rest.',
  chapters: [
    {
      title: 'More Pakse meeting point than expat bubble',
      body: 'SéSé is popular with expatriates, but calling it an expat bar gives the wrong picture. Lao customers are part of the place too, from younger people stopping for wine or beer to families coming for dinner. Travellers naturally join that mix. It makes the restaurant useful in a way that goes beyond the menu: this is the kind of table where conversations start easily and where people who live in Pakse cross paths with people who have only just arrived.',
    },
    {
      title: 'French recipes without pretending the kitchen is in France',
      body: 'The food follows French recipes, but the kitchen is Lao and uses local ingredients whenever that makes sense. That distinction is important. SéSé is not trying to import an entire French pantry into southern Laos. The French identity comes from the recipes, sauces and familiar bistro-style dishes, while the ingredients that genuinely need to come from France are treated separately. It feels more natural, and much less forced, than trying to make every plate prove its nationality.',
    },
    {
      title: 'Wine, cheese, charcuterie — and Belgian beer',
      body: 'The imports are specific: French wine, cheese and charcuterie. Beer is a different story, with Belgian labels forming a real part of the bar rather than an afterthought. That combination is probably the clearest way to understand SéSé. You can sit down for a French-style dinner, share cheese or charcuterie, order wine, or simply stop for a Belgian beer. Duvel served in the proper Duvel glass is a small touch, but it tells you that the beer side is taken seriously.',
    },
    {
      title: 'The details I remember',
      body: 'My own reasons for coming back are not complicated. The fries are homemade. The crème brûlée was 50,000 kip when I had it and is still one of the things I associate with the place. And SéSé works just as well when you only want one drink as when you want a full meal. It generally starts its evening around 17:00, while the kitchen closes at 22:00, so I would not leave dinner until the very end of the night.',
    },
  ],
  faq: [
    {
      question: 'What kind of food does SéSé serve?',
      answer: 'The kitchen is built mainly around French recipes. A Lao cook prepares the food, using local ingredients where they make sense rather than trying to import everything from Europe.',
    },
    {
      question: 'What is actually imported from France?',
      answer: 'The French imports to remember are the wine, cheese and charcuterie. The rest of the kitchen should not be described as if every ingredient came from France.',
    },
    {
      question: 'Is SéSé only for expatriates and tourists?',
      answer: 'No. Expatriates and travellers are part of the crowd, but so are Lao customers, including younger people coming for a drink and families coming to eat. That mix is one of the reasons the place feels established in Pakse rather than detached from it.',
    },
    {
      question: 'Does SéSé have Belgian beer?',
      answer: 'Yes. Belgian beer is one of the signatures of the bar. Duvel is a good example, including the small but appreciated detail of serving it in the proper Duvel glass.',
    },
    {
      question: 'When should I go for dinner?',
      answer: 'SéSé generally starts its evening around 17:00 and the kitchen closes at 22:00. If food is the reason for going, I would arrive with that kitchen cutoff in mind rather than relying on the bar staying open later.',
    },
    {
      question: 'Is there anything you personally recommend?',
      answer: 'I like the homemade fries, and I have a soft spot for the crème brûlée. It was 50,000 kip when I had it, so treat that as a personal price reference rather than a guaranteed current menu price.',
    },
  ],
};

export const seseWineBeerLayout: VenueFieldCardLayoutProfile = {
  heroDescription: 'A small French table in Pakse for French recipes, selected wine, cheese and charcuterie, Belgian beer and an evening crowd that naturally mixes Lao regulars, expatriates and travellers.',
  hero: {
    eyebrow: 'FRENCH TABLE · PAKSE',
    aliases: ['French kitchen', 'Belgian beer', 'Mixed Pakse crowd'],
    steps: ['Arrive from around 17:00', 'Choose dinner or just a drink', 'Try the Belgian beer selection', 'Order food before 22:00'],
    rhythmNote: 'A familiar evening address where Pakse regulars and passing travellers often end up at neighbouring tables.',
    photoNote: 'Personal photos to add · Ban Thaluang',
  },
  primaryNote: {
    label: 'MY PICK',
    text: 'The crème brûlée was 50,000 kip when I had it. Along with the homemade fries, it is one of the simple details I remember here.',
  },
  quickRead: {
    time: { primary: 'FROM 17:00', secondary: 'kitchen closes at 22:00' },
    route: { primary: 'BAN THALUANG', secondary: 'central Pakse · near Wat Luang' },
    budget: { primary: 'CHECK THE MENU', secondary: 'French imports and wine can raise the spend' },
    bestFor: { primary: 'DINNER & DRINKS', secondary: 'French food · Belgian beer · mixed crowd' },
  },
  practicalNotes: {
    items: [
      { label: 'Evening', value: 'From around 17:00', detail: 'SéSé is primarily an evening address; current public listings should still be checked for day-to-day opening changes.' },
      { label: 'Kitchen', value: 'Closes at 22:00', detail: 'If you are going for dinner, this is the useful cutoff to keep in mind.' },
      { label: 'Cuisine', value: 'French recipes · Lao kitchen', detail: 'A Lao cook prepares French recipes, with local ingredients used whenever they are the sensible choice.' },
      { label: 'French imports', value: 'Wine · cheese · charcuterie', detail: 'These are the products specifically brought from France; the whole kitchen should not be described as imported.' },
      { label: 'Beer', value: 'Belgian selection', detail: 'Belgian beers are a real part of the bar identity, including Duvel served in its proper glass.' },
      { label: 'Crowd', value: 'Lao · expats · travellers', detail: 'The room can mix local couples and families, expatriates and people passing through Pakse.' },
    ],
  },
  chapterLabels: ['THE CROWD', 'THE KITCHEN', 'THE BAR', 'MY NOTES'],
  beforeYouLeave: {
    title: 'Think of SéSé as an evening address',
    body: 'The useful rhythm is simple: the place gets going from around 17:00 and the kitchen finishes at 22:00. Opening days and full bar hours can change, so check the current listing if timing is important. For dinner, the kitchen cutoff is the part worth remembering.',
    note: {
      label: 'SMALL DETAIL',
      text: 'Homemade fries, crème brûlée and a Duvel in the right glass: SéSé makes a stronger impression through details than through spectacle.',
    },
  },
};
