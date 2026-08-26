import type { Place, ResearchSource } from '../core/models/types';
import type { VenueFieldCardContent } from './venue-field-card-editorial';
import type { VenueFieldCardLayoutProfile } from './venue-field-card-layouts';

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

export const italaoPlace: SourcedPlace = {
  id: 'place-italao-restaurant',
  slug: 'italao-restaurant',
  name: 'ITALAO Restaurant',
  country: 'laos',
  city: 'pakse',
  category: 'restaurants',
  coordinates: { latitude: 15.119917, longitude: 105.79872 },
  locationScope: 'area',
  shortDescription: 'A recent Italian restaurant in central Pakse where a strong Italian-Lao duo works the pizza station in full view of the street, backed by handmade dough, imported Italian products, pasta and a lot of personality.',
  media: {
    card: {},
    fieldCard: { gallery: [] },
  },
  spaCard: {
    handwrittenTags: ['Italian restaurant', 'Pizza counter', 'Personal field note'],
    photoStatus: 'missing',
    photoRequiresManualFill: true,
  },
  verification: {
    decision: 'accept',
    reason: 'User-selected personal venue; current operation and central Pakse location cross-checked against the supplied Google Maps listing and a recent Pakse dining guide. Coordinates remain area-scoped until the exact point is normalized from the Maps listing.',
  },
  sourceMetadata: {
    sourceName: 'Google Maps',
    sourceUrl: 'https://maps.app.goo.gl/jr7PMLhZeXxA3Qpe7',
  },
  manualLocks: {},
  address: 'Central Pakse, near Sanga Hostel and the market, Pakse 16000, Laos',
  googleMapsUrl: 'https://maps.app.goo.gl/jr7PMLhZeXxA3Qpe7',
  researchSources: [
    {
      sourceName: 'Traveller first-hand knowledge',
      purpose: 'first-party',
      sourceType: 'manual',
    },
    {
      sourceName: 'Google Maps',
      sourceUrl: 'https://maps.app.goo.gl/jr7PMLhZeXxA3Qpe7',
      purpose: 'location',
    },
    {
      sourceName: 'Recent Pakse dining guide cross-check',
      sourceUrl: 'https://bananarchy.in/guide/pakse-complete-guide-for-indian-travelers-what-to-see-do-know-before-you-go/',
      purpose: 'facts',
    },
  ],
};

export const italaoFieldCard: VenueFieldCardContent = {
  status: 'published',
  kindLabel: 'Italian restaurant',
  mediaSlots: 3,
  intro: 'ITALAO still feels like a new address in Pakse, but it already has a very clear personality. The Italian owner is the maestro behind the food, and Stiki — a Lao who spent most of his life in the United States before coming back to Laos — works beside him at the front. They are both big characters, both good company, and when they are making pizzas together the restaurant feels less like a quiet kitchen and more like a little performance happening directly on the street.',
  chapters: [
    {
      title: 'The maestro and Stiki are half the reason I like the place',
      body: 'There are cooks and servers working behind the scenes, but the two people I immediately associate with ITALAO are the Italian owner and Stiki. They both have strong personalities, they are warm, funny and very much what I would call bons vivants. That matters because you do not feel a hard separation between the people making the food and the people eating it. The pizza station is right at the front, so conversation, jokes and the work itself all happen in the same space. For me, that human side gives the restaurant much more character than a technically perfect but anonymous Italian dining room ever could.',
    },
    {
      title: 'You can watch the pizzas being made from the street',
      body: 'The pizza side of the restaurant is deliberately visible. Walking past, you can see the dough being handled, the toppings going on and the two of them working at the front. The dough is made by the maestro himself, and it is one of the things I rate most highly here. Pasta and the rest of the cooking happen farther back in a kitchen guests do not really see, so the pizza counter becomes the public face of the restaurant. It makes the place feel alive before you have even sat down.',
    },
    {
      title: 'I come back for the food, even if I order a lot of mojitos',
      body: 'The joke, in my case, is that the thing I probably consume most often at ITALAO is the mojito. But I genuinely like the food. The pizzas are excellent, I enjoy the pasta, and the restaurant uses selected products imported from Italy where that makes a real difference to the result. I would recommend the place very easily, but as a personal recommendation rather than because every Italian dish has to fit one fixed definition of authenticity. What I like is the combination of good ingredients, very good pizza dough and two people at the front who clearly care about what they are serving.',
    },
    {
      title: 'A young restaurant that is already building its own little production system',
      body: 'ITALAO only opened roughly a year to a year and a half ago, so it is still a relatively young restaurant in Pakse. The next step is a small laboratory in the neighbouring street where part of the food preparation can be handled separately from the dining space. I find that worth noting because it shows the project is already moving beyond simply opening a restaurant and serving from one kitchen. It is starting to build its own production rhythm while keeping the front counter small, visible and personal.',
    },
  ],
  faq: [
    {
      question: 'What makes ITALAO different from another Italian restaurant?',
      answer: 'For me, it is the combination of the food and the two people at the front. The Italian owner and Stiki have huge personalities, and the pizza station is open to the street, so the preparation itself becomes part of the atmosphere.',
    },
    {
      question: 'Are the pizzas made in front of you?',
      answer: 'Yes. The pizza station is right at the front and visible from the street. You can watch the dough and pizzas being worked while the pasta and other kitchen preparation happen farther behind the public area.',
    },
    {
      question: 'What do I personally like to order?',
      answer: 'I like both the pizzas and the pasta, and I recommend the food strongly. In practice, though, I probably order more mojitos here than anything else.',
    },
    {
      question: 'Does the restaurant use imported Italian products?',
      answer: 'Yes, selected products are imported from Italy. I would not describe every ingredient as imported; the important point is that Italian products are used where they contribute something specific to the food.',
    },
    {
      question: 'Is ITALAO an established old Pakse restaurant?',
      answer: 'No. It is still relatively new, opened roughly a year to a year and a half ago, and the team is continuing to develop the operation, including a small preparation laboratory nearby.',
    },
  ],
};

export const italaoLayout: VenueFieldCardLayoutProfile = {
  heroDescription: 'ITALAO is a young Italian restaurant in central Pakse where the maestro and Stiki work a street-facing pizza station with handmade dough, strong personalities and a kitchen I keep coming back to for pizza, pasta and, very often, mojitos.',
  hero: {
    eyebrow: 'ITALIAN KITCHEN · PAKSE',
    aliases: ['Street-side pizza', 'Handmade dough', 'Two big characters'],
    steps: ['Meet the maestro and Stiki', 'Watch the pizza station', 'Pick pizza or pasta', 'Stay for a mojito'],
    rhythmNote: 'The food is good, but the personalities at the front are what stop ITALAO from feeling like an anonymous Italian restaurant.',
    photoNote: 'Personal photos to add · central Pakse',
  },
  primaryNote: {
    label: 'MY HABIT',
    text: 'I probably order more mojitos here than anything else, even though I genuinely come back for the food.',
  },
  quickRead: {
    time: { primary: 'DINNER', secondary: 'a relaxed central Pakse Italian night' },
    route: { primary: 'CENTRAL PAKSE', secondary: 'near Sanga Hostel · opposite the market area' },
    budget: { primary: 'ITALIAN DINNER', secondary: 'check the current menu for prices' },
    bestFor: { primary: 'PIZZA + CHARACTER', secondary: 'handmade dough · pasta · mojitos · open counter' },
  },
  practicalNotes: {
    items: [
      { label: 'Pizza station', value: 'Visible from the street', detail: 'The front counter lets you watch the pizzas being prepared while you sit or walk past.' },
      { label: 'Pizza dough', value: 'Made by the maestro', detail: 'The dough is one of the strongest parts of the pizzas for me.' },
      { label: 'Pasta', value: 'Prepared in the back kitchen', detail: 'The pasta side of the operation is less visible than the street-facing pizza counter.' },
      { label: 'Team', value: 'Italian maestro + Stiki', detail: 'Stiki is Lao, spent most of his life in the United States and has now returned to Laos.' },
      { label: 'Imports', value: 'Selected Italian products', detail: 'Imported ingredients are used where they contribute something specific rather than as a claim that every product comes from Italy.' },
      { label: 'My drink', value: 'Mojito', detail: 'It is probably what I personally order most often here.' },
    ],
  },
  chapterLabels: ['THE DUO', 'THE PIZZA', 'MY TAKE', 'THE LAB'],
  beforeYouLeave: {
    title: 'Sit where the pizza counter is part of the evening',
    body: 'For me, ITALAO makes the most sense when you treat the open pizza counter as part of the restaurant rather than background machinery. The front is where the character is: you see the dough being worked, you see the two personalities behind it, and the whole place feels more alive because the kitchen is not completely hidden from the street.',
    note: {
      label: 'KEEP IT CURRENT',
      text: 'Opening days and closing times are easier to check on the current Google Maps listing.',
    },
  },
};
