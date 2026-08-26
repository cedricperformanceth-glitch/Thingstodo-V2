import type { Place, ResearchSource } from '../core/models/types';
import type { VenueFieldCardContent } from './venue-field-card-editorial';
import type { VenueFieldCardLayoutProfile } from './venue-field-card-layouts';

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

export const laBoulangeGardenPlace: SourcedPlace = {
  id: 'place-la-boulange-garden',
  slug: 'la-boulange-garden',
  name: 'La Boulange Garden',
  country: 'laos',
  city: 'pakse',
  category: 'cafes',
  coordinates: { latitude: 15.1315, longitude: 105.786 },
  locationScope: 'area',
  shortDescription: 'A traditional French bakery and garden restaurant on the quieter edge of Pakse, where serious bread and viennoiserie meet daily dishes, coffee, a small lake, pétanque and the kind of place that rewards staying for a while.',
  media: {
    card: {},
    fieldCard: { gallery: [] },
  },
  spaCard: {
    handwrittenTags: ['French bakery', 'Garden restaurant', 'Personal field note'],
    photoStatus: 'missing',
    photoRequiresManualFill: true,
  },
  verification: {
    decision: 'accept',
    reason: 'User-selected personal venue. The supplied Google Maps listing is the navigation source; current public material independently confirms that the long-running La Boulange baker has opened La Boulange Garden near Pakse airport. Exact point coordinates remain area-scoped until the Maps short link is normalized.',
  },
  sourceMetadata: {
    sourceName: 'Google Maps',
    sourceUrl: 'https://maps.app.goo.gl/cTUPnXRC7EfWcoLA9',
  },
  manualLocks: {},
  address: 'Near Pakse International Airport, outskirts of Pakse, Champasak, Laos',
  googleMapsUrl: 'https://maps.app.goo.gl/cTUPnXRC7EfWcoLA9',
  researchSources: [
    {
      sourceName: 'Traveller first-hand knowledge',
      purpose: 'first-party',
      sourceType: 'manual',
    },
    {
      sourceName: 'Google Maps',
      sourceUrl: 'https://maps.app.goo.gl/cTUPnXRC7EfWcoLA9',
      purpose: 'location',
    },
    {
      sourceName: 'Petit Futé 2026 cross-check',
      sourceUrl: 'https://www.petitfute.com/v52387-pakse/c1165-restaurants/c126-restauration-rapide-a-domicile/c135-sur-place-a-emporter/1647771-la-boulange.html',
      purpose: 'facts',
    },
  ],
};

export const laBoulangeGardenFieldCard: VenueFieldCardContent = {
  status: 'published',
  kindLabel: 'Bakery & restaurant',
  mediaSlots: 3,
  intro: 'La Boulange Garden is one of the places in Pakse I would send someone to even if they told me they were not especially looking for a bakery. Chili is a traditional French baker in the real sense of the word: bread, croissants and food built on years of craft rather than a French-looking menu. For me, his bread is the best in Laos and the best I have had in Asia. The croissant is in the same category. The difference now is that the bakery has moved out of the centre and into the large garden around his home, so the place has become something you should actually make time for rather than somewhere you grab a sandwich before a bus.',
  chapters: [
    {
      title: 'The bread and croissants are the reason I make the trip',
      body: 'I am not cautious about this one: for me, Chili makes the best bread in Laos, and I would put it ahead of most bakeries I know in France. I also call his croissant the best croissant in Asia. That is not a line I am using to decorate the page; it is genuinely how I rate it. The quality comes from very traditional French bakery technique, serious know-how and a baker who has spent his working life around food. Everything feels made by someone who understands why the dough, texture and timing matter rather than simply reproducing the shape of a French pastry.',
    },
    {
      title: 'This is no longer a grab-and-go bakery in the centre',
      body: 'The old version of La Boulange worked perfectly for central Pakse: people stopped for bread, a croissant or a sandwich, then caught a bus or disappeared towards the Bolaven Plateau. La Boulange Garden changes the rhythm completely. Chili has moved the bakery to the large property where he lives, out towards the airport and the quieter edge of Pakse. It is the first proper season for this version of the place, and I think it makes much more sense to come with time. Have breakfast, stay for coffee, eat something later, walk around the garden and let the place unfold instead of treating it as a five-minute bakery stop.',
    },
    {
      title: 'The bakery is only half of what Chili cooks here',
      body: 'This is also a restaurant. Chili cooks daily dishes and simple French food with the same instinct he brings to the bakery, and the food is excellent. One of my favourites is what we jokingly call the “7-Eleven toast”. The name is the joke; the execution is the opposite. The sandwich bread is homemade, the meat is prepared in-house, the cheese can be imported from France, and the rest is built from proper ingredients rather than convenience food. My version is the ham and mozzarella toast. Add the croissants, bread, hot chocolate and whatever dish Chili happens to be making that day, and there is easily enough here to justify coming for more than coffee.',
    },
    {
      title: 'The garden is part of the experience, not decoration',
      body: 'The setting is unusual for Pakse and that is a big part of why I like it. There is space for pétanque and badminton, a small lake that has become a favourite photo spot for local customers, and a much more Lao, residential feeling than you get in the centre. The clientele is already very local, with people coming for coffee, food and photos, and I expect the new location to attract travellers who are happy to slow down as well. Four very friendly dogs — Panda, Popeye, Misère and Momo — wander around asking for attention and, if they can get away with it, food. Give them the cuddles; do not feed them. More importantly, if Chili has a quiet moment, talk to him. He is a baker and restaurateur, a bon vivant who has lived here for years, and I find the conversation more interesting when it goes beyond the usual checklist of waterfalls and scooter routes.',
    },
  ],
  faq: [
    {
      question: 'Is La Boulange Garden only a bakery?',
      answer: 'No. Bread and viennoiserie are central to the place, but Chili also runs it as a restaurant, with daily dishes, sandwiches, toasts and other food alongside coffee and bakery products.',
    },
    {
      question: 'What would I personally order first?',
      answer: 'The croissant first. I call it the best croissant in Asia and I mean it. The hot chocolate is another must for me, and my favourite savoury order is the homemade ham-and-mozzarella toast that we jokingly call the “7-Eleven toast”.',
    },
    {
      question: 'Is the bread really worth going out of central Pakse for?',
      answer: 'Yes. For me, this is the best bread in Laos and the best bread I have had in Asia. The new location is less convenient for a five-minute stop than the old central bakery, but that is exactly why I would turn it into a proper morning or afternoon rather than a quick errand.',
    },
    {
      question: 'What is there to do besides eat?',
      answer: 'The property has a real garden atmosphere with pétanque, badminton and a small lake. Local customers also use the setting as a photo spot, so the place feels more like somewhere to spend time than a conventional bakery counter.',
    },
    {
      question: 'What are the dogs like?',
      answer: 'Panda, Popeye, Misère and Momo are friendly and affectionate. They will happily ask for cuddles and may also try their luck for food. The cuddles are fine; do not feed them.',
    },
  ],
};

export const laBoulangeGardenLayout: VenueFieldCardLayoutProfile = {
  heroDescription: 'La Boulange Garden is Chili’s traditional French bakery and restaurant on the quieter edge of Pakse: exceptional bread and croissants, daily food, coffee, a garden, a small lake and enough personality that I would come here to spend time rather than simply buy bread.',
  hero: {
    eyebrow: 'FRENCH BAKERY · GARDEN · PAKSE',
    aliases: ['Traditional bakery', 'Garden restaurant', 'Slow morning'],
    steps: ['Start with the croissant', 'Order a hot chocolate', 'Stay for the garden', 'Come back for a daily dish'],
    rhythmNote: 'The old bakery was a quick central stop; the Garden makes more sense when you deliberately give it part of your day.',
    photoNote: 'Personal photos to add · Pakse outskirts near the airport',
  },
  primaryNote: {
    label: 'MY VERDICT',
    text: 'Best croissant in Asia. I am not hedging that one.',
  },
  quickRead: {
    time: { primary: 'MORNING → 18:00', secondary: 'better when you are not in a rush' },
    route: { primary: 'PAKSE OUTSKIRTS', secondary: 'towards the airport · short ride from the centre' },
    budget: { primary: 'BAKERY + CAFÉ', secondary: 'add a daily dish if you stay longer' },
    bestFor: { primary: 'BREAD + SLOW TIME', secondary: 'croissants · coffee · lunch · garden · local atmosphere' },
  },
  practicalNotes: {
    items: [
      { label: 'Bread', value: 'Best in Asia — for me', detail: 'I rate Chili’s bread above anything else I have had in Laos and Asia, and above a lot of bakeries in France.' },
      { label: 'Croissant', value: 'Best in Asia', detail: 'This is my strongest recommendation here and I mean it literally.' },
      { label: 'Hot chocolate', value: 'Essential', detail: 'One of the small orders I would not skip.' },
      { label: 'My savoury pick', value: 'Ham + mozzarella toast', detail: 'Our “7-Eleven toast” joke hides a genuinely homemade sandwich: house bread, house-prepared meat and proper ingredients.' },
      { label: 'Restaurant', value: 'Daily dishes + bakery food', detail: 'The Garden is not only a bakery counter; Chili also cooks proper food and changing dishes.' },
      { label: 'Closing time', value: '18:00', detail: 'This is the useful cutoff to keep in mind at the new Garden location.' },
      { label: 'Dogs', value: 'Panda · Popeye · Misère · Momo', detail: 'Very friendly. Cuddles encouraged; feeding them is not.' },
    ],
  },
  chapterLabels: ['THE CRAFT', 'THE NEW RHYTHM', 'THE FOOD', 'THE GARDEN'],
  beforeYouLeave: {
    title: 'Do not come here with a bus-departure mindset',
    body: 'The move out of central Pakse changes the point of La Boulange. I would not come here thinking only about buying one croissant and leaving. Give yourself a proper morning or afternoon, especially while the Garden is still finding the rhythm of its first season in this location. Eat, sit outside, play a little pétanque or badminton, watch the local crowd come and go, and if Chili has time, have a real conversation with him.',
    note: {
      label: 'DO NOT SKIP',
      text: 'The hot chocolate is essential. My other personal favourite is the ham-and-mozzarella “7-Eleven toast”.',
    },
  },
};
