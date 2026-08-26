import type { Place, ResearchSource } from '../core/models/types';
import type { VenueFieldCardContent } from './venue-field-card-editorial';
import type { VenueFieldCardLayoutProfile } from './venue-field-card-layouts';

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

export const ninetyVintagePlace: SourcedPlace = {
  id: 'place-90s-vintage-restaurant-and-beer-garden',
  slug: '90s-vintage-restaurant-and-beer-garden',
  name: '90s Vintage Restaurant and Beer Garden',
  country: 'laos',
  city: 'pakse',
  category: 'restaurants',
  coordinates: { latitude: 15.1229, longitude: 105.799 },
  locationScope: 'point',
  shortDescription: 'A lively Lao restaurant and beer garden on a small central Pakse street, with frequent live music, draft beer, outdoor seating and a rock-and-roll vintage interior that gives the place a real personality.',
  media: {
    card: {},
    fieldCard: { gallery: [] },
  },
  spaCard: {
    handwrittenTags: ['Lao restaurant', 'Live music', 'Vintage beer garden'],
    photoStatus: 'missing',
    photoRequiresManualFill: true,
  },
  verification: {
    decision: 'accept',
    reason: 'User-selected personal venue; identity, Ban Thaluang location, beer-garden format, live-music feature and current evening operation cross-checked against current public business data.',
  },
  sourceMetadata: {
    sourceName: 'Google Maps',
    sourceUrl: 'https://maps.app.goo.gl/wGtu1gFFyr8USr6c8',
  },
  manualLocks: {},
  address: 'Th 21, Ban Thaluang, Pakse, Laos',
  googleMapsUrl: 'https://maps.app.goo.gl/wGtu1gFFyr8USr6c8',
  researchSources: [
    {
      sourceName: 'Traveller first-hand knowledge',
      purpose: 'first-party',
      sourceType: 'manual',
    },
    {
      sourceName: 'Google Maps',
      sourceUrl: 'https://maps.app.goo.gl/wGtu1gFFyr8USr6c8',
      purpose: 'location',
    },
    {
      sourceName: 'Current venue cross-check',
      sourceUrl: 'https://untappd.com/v/90s-vintage-restaurant-and-beer-garden/14179751',
      purpose: 'facts',
    },
  ],
};

export const ninetyVintageFieldCard: VenueFieldCardContent = {
  status: 'published',
  kindLabel: 'Lao restaurant & beer garden',
  mediaSlots: 3,
  intro: '90s Vintage is almost next door to SéSé, but I would not describe the two places in the same way. What I like here is the street and the atmosphere around it. This little part of Ban Thaluang stays active into the evening, with backpackers, Lao customers, tourists and a few expats moving between the nearby places. 90s Vintage fits naturally into that rhythm: Lao food, draft beer, frequent live music and a setting that feels much more local than international.',
  chapters: [
    {
      title: 'The street matters almost as much as the restaurant',
      body: 'This is not a pedestrian lane and there is still traffic passing through, but at night the street has a very different rhythm from the bigger roads in Pakse. There are backpacker places nearby and enough bars and restaurants around it that people keep moving through until around midnight or one in the morning before the area finally settles down. I like 90s Vintage partly because it lets you sit inside that little piece of Pakse nightlife rather than hiding from it. You can eat, drink a beer and watch the street continue around you.',
    },
    {
      title: 'It feels Lao first, with travellers mixed into the room',
      body: 'The crowd is much more Lao than foreign, and that is important to the character of the place. You still see tourists and a few expatriates, especially because the area is easy to reach from the backpacker side of town, but I never get the feeling that the restaurant has been built around foreigners. The food is Lao, the music is usually Lao, and the social rhythm is local. For me, the mix works because visitors join an existing atmosphere rather than replacing it.',
    },
    {
      title: 'The live music gives the evening its own rhythm',
      body: 'There is live music very often, although I would not promise a band every single night. Most of the time the musicians play Lao music, and that changes the place completely once the evening gets going. Sometimes the music has also happened inside, but these days I associate the restaurant more with the outdoor setup. Draft beer, small tables, lots of casual seating and live songs make it an easy place to stay longer than you planned without turning the night into a formal dinner.',
    },
    {
      title: 'The decoration is messy in exactly the right way',
      body: 'The visual identity is probably my favourite part. Outside you have simple camping-style chairs and small tables, but the place is full of details that make it feel built by somebody rather than designed from a catalogue. There is a bicycle fixed to the wall, a car cut in half at the entrance and plenty of colour around the terrace. Inside it gets darker and more rock-and-roll: black walls, writing and drawings directly on them, framed pictures everywhere and the little bar sitting inside that whole collage. It has a real soul, which is much harder to create than a polished theme.',
    },
  ],
  faq: [
    {
      question: 'What kind of food does 90s Vintage serve?',
      answer: 'It is a Lao restaurant first. I would come here for Lao food, beer and the evening atmosphere rather than expecting an international menu to be the main point.',
    },
    {
      question: 'Is there live music every night?',
      answer: 'No, I would not promise that. There is live music very often and it is usually Lao music, but the schedule can vary from one evening to another.',
    },
    {
      question: 'Is the crowd mostly local or foreign?',
      answer: 'Mostly Lao in my experience, with tourists and some expatriates mixed in. That balance is one of the things I like because the place keeps a genuinely local character.',
    },
    {
      question: 'Do you sit inside or outside?',
      answer: 'Most of the atmosphere I associate with the place is outside, with lots of casual seating and small tables. The darker indoor bar is worth looking at too because the rock-and-roll decoration is a big part of the identity.',
    },
    {
      question: 'Is this a quiet dinner spot?',
      answer: 'Not really the way I think about it. The street stays active at night and live music is frequent, so I would choose it when I want some life around the table rather than complete silence.',
    },
  ],
  relatedPlaceIds: ['place-sese-wine-and-beer'],
};

export const ninetyVintageLayout: VenueFieldCardLayoutProfile = {
  heroDescription: '90s Vintage is a Lao restaurant and beer garden in a lively little Ban Thaluang street: frequent Lao live music, draft beer, a mostly local crowd and a deliberately eccentric rock-and-roll decor give it much more personality than a standard evening restaurant.',
  hero: {
    eyebrow: 'LAO NIGHT OUT · PAKSE',
    aliases: ['Live Lao music', 'Vintage beer garden', 'Ban Thaluang nights'],
    steps: ['Come after the street wakes up', 'Order Lao food and draft beer', 'Stay when the music starts', 'Look properly at the decor'],
    rhythmNote: 'I like this place because it has an actual soul: local crowd, live music and a decor that feels collected rather than manufactured.',
    photoNote: 'Personal photos to add · Ban Thaluang',
  },
  primaryNote: {
    label: 'MY TAKE',
    text: 'The half-car, wall bicycle and black rock-and-roll interior tell you immediately this place has a personality.',
  },
  quickRead: {
    time: { primary: 'EVENING', secondary: 'the street stays lively late' },
    route: { primary: 'BAN THALUANG', secondary: 'small central street · close to SéSé and backpacker stays' },
    budget: { primary: 'CASUAL NIGHT OUT', secondary: 'Lao food · draft beer · easy group tables' },
    bestFor: { primary: 'LOCAL ATMOSPHERE', secondary: 'live music · Lao crowd · unusual decor' },
  },
  practicalNotes: {
    items: [
      { label: 'Food', value: 'Lao cuisine', detail: 'The restaurant feels local first rather than built around an international menu.' },
      { label: 'Music', value: 'Live very often', detail: 'Usually Lao music, but I would not assume a live set every single night.' },
      { label: 'Beer', value: 'Draft beer available', detail: 'It suits the casual beer-garden side of the place.' },
      { label: 'Seating', value: 'Mostly casual outdoor tables', detail: 'Camping-style chairs, small tables and plenty of places to sit outside.' },
      { label: 'Crowd', value: 'Mostly Lao', detail: 'Tourists and some expatriates mix in without changing the local character.' },
      { label: 'Street', value: 'Active into the night', detail: 'Not pedestrian and not silent; the surrounding little street can stay lively until around midnight or 01:00.' },
    ],
  },
  chapterLabels: ['THE STREET', 'THE CROWD', 'THE MUSIC', 'THE DECOR'],
  beforeYouLeave: {
    title: 'Come for some life around the table, not for silence',
    body: 'For me, 90s Vintage works best when the surrounding street is part of the evening. There can be traffic, people moving between nearby places and live music at the restaurant. That is not background noise I would try to hide; it is the reason I would choose this address over a quieter dinner somewhere else.',
    note: {
      label: 'LOOK AROUND',
      text: 'Do not stop at the terrace: the darker rock-and-roll bar inside is part of the whole point.',
    },
  },
};
