import type { Place, ResearchSource } from '../core/models/types';
import type { VenueFieldCardContent } from './venue-field-card-editorial';
import type { VenueFieldCardLayoutProfile } from './venue-field-card-layouts';

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

export const missNoyMotorbikePlace: SourcedPlace = {
  id: 'place-miss-noy-motorbike',
  slug: 'miss-noy-motorbike',
  name: 'Miss Noy Motorbike',
  country: 'laos',
  city: 'pakse',
  category: 'scooter-rental',
  coordinates: { latitude: 15.12206, longitude: 105.79952 },
  locationScope: 'point',
  shortDescription: 'My reference scooter-rental address in Pakse: Yves combines bikes with a daily 18:00 Bolaven Loop briefing, local advice and an unusually useful range of travel logistics from one counter.',
  media: {
    card: {},
    fieldCard: { gallery: [] },
  },
  spaCard: {
    handwrittenTags: ['Scooter rental', 'Bolaven Loop', 'Personal field note'],
    photoStatus: 'missing',
    photoRequiresManualFill: true,
  },
  verification: {
    decision: 'accept',
    reason: 'User-selected personal venue; identity, Road 13 location, scooter-rental operation and the 18:00 Bolaven Loop briefing are independently supported by current public sources.',
  },
  sourceMetadata: {
    sourceName: 'Google Maps',
    sourceUrl: 'https://maps.app.goo.gl/uaAzcPbASi7g1dHr5',
  },
  manualLocks: {},
  address: '129 Road 13, Pakse 1600, Laos',
  googleMapsUrl: 'https://maps.app.goo.gl/uaAzcPbASi7g1dHr5',
  researchSources: [
    {
      sourceName: 'Traveller first-hand knowledge',
      purpose: 'first-party',
      sourceType: 'manual',
    },
    {
      sourceName: 'Google Maps',
      sourceUrl: 'https://maps.app.goo.gl/uaAzcPbASi7g1dHr5',
      purpose: 'location',
    },
    {
      sourceName: 'Current Miss Noy business listing cross-check',
      sourceUrl: 'https://www.tripadvisor.com/Attraction_Review-g670161-d11867972-Reviews-Miss_Noy_Motorbike-Pakse_Champasak_Province.html',
      purpose: 'facts',
    },
    {
      sourceName: 'Recent Bolaven Loop guide cross-check',
      sourceUrl: 'https://www.novo-monde.com/laos-pakse-plateau-des-bolovens/',
      purpose: 'facts',
    },
  ],
};

export const missNoyMotorbikeFieldCard: VenueFieldCardContent = {
  status: 'published',
  kindLabel: 'Scooter rental & travel desk',
  mediaSlots: 3,
  intro: 'If someone asks me where to start a scooter trip from Pakse, Miss Noy is the reference. Yves has been doing this for years and the rental itself is only one part of what makes the place useful. He knows the roads, the loop, the practical problems travellers run into and the small decisions that can make the difference between a smooth trip and a badly organised one. I would not call it the tourist office, but in practice it comes surprisingly close.',
  chapters: [
    {
      title: 'The 18:00 briefing is part of the rental, not an extra',
      body: 'Every evening around 18:00, Yves gathers people and explains what is around Pakse and how to think about the Bolaven Loop: where the roads go, what is worth seeing, how to organise the route and what questions you should be asking before leaving. For me, that briefing is one of the strongest reasons to rent here. A scooter is easy to hand over; useful context is harder to replace. Yves has accumulated years of local experience, so I would actively ask questions rather than treat the briefing as something to sit through quietly.',
    },
    {
      title: 'Yves is one of the people I trust for practical Pakse knowledge',
      body: 'Yves is Belgian, speaks English and Lao, and has spent enough time operating in Pakse that he understands the city from a very practical angle. He is not there to sell you a poetic version of southern Laos. He knows what travellers actually need before going on the road and he knows the people and services around him. That is why I describe Miss Noy as a reference rather than simply another rental shop. If I have a concrete logistical question, this is one of the places where I would ask it.',
    },
    {
      title: 'You can organise much more than the scooter from the same counter',
      body: 'The useful thing is how many pieces of a trip can be solved in one place. You can rent the scooter, buy a SIM card, organise bus tickets, arrange a tuk-tuk and ask the kind of small logistical questions that usually send travellers from one counter to another. None of those services is spectacular on its own. Together, they make Miss Noy feel like a practical hub in central Pakse. You can arrive with a half-finished plan and leave with most of the moving parts sorted out.',
    },
    {
      title: 'Breakfast next door makes an early departure easier',
      body: 'Right beside the rental, Yves’s wife runs a small restaurant serving mainly Lao food. I like that detail because it fits the way people actually use the place. Before heading out on the loop, you can sit down, eat something and start the day properly instead of collecting the bike and immediately riding away hungry. It is not the reason I would choose the rental, but it makes the whole departure point feel more complete and a lot more human.',
    },
  ],
  faq: [
    {
      question: 'Why do I rate Miss Noy as the reference scooter rental in Pakse?',
      answer: 'Because the value is not limited to the scooter. Yves has years of local experience, gives a proper Bolaven Loop briefing and can help organise several practical parts of a trip from the same place.',
    },
    {
      question: 'What happens at the 18:00 briefing?',
      answer: 'Yves explains the Bolaven Loop and the wider Pakse area, including route choices, places to stop and practical considerations before leaving. I would use the opportunity to ask questions rather than just listen passively.',
    },
    {
      question: 'Can I organise other travel services there?',
      answer: 'Yes. In addition to scooter rental, the place can help with things such as SIM cards, bus tickets and tuk-tuk arrangements, which is why I see it as a practical travel hub rather than only a rental counter.',
    },
    {
      question: 'Can I eat before leaving for the loop?',
      answer: 'Yes. There is a small restaurant directly beside the rental, run by Yves’s wife, serving mainly Lao food. It is an easy place to get something to eat before setting off.',
    },
  ],
};

export const missNoyMotorbikeLayout: VenueFieldCardLayoutProfile = {
  heroDescription: 'Miss Noy is my reference scooter-rental address in Pakse: Yves combines the bikes with years of local knowledge, an 18:00 Bolaven Loop briefing and enough practical travel services that the place almost functions like an informal visitor desk.',
  hero: {
    eyebrow: 'SCOOTER RENTAL · PAKSE',
    aliases: ['Bolaven Loop briefing', 'Travel logistics', 'Yves’s local knowledge'],
    steps: ['Ask about the loop', 'Join the 18:00 briefing', 'Sort the practical details', 'Leave after breakfast'],
    rhythmNote: 'The scooter gets you moving; the real value is leaving Pakse with a much clearer idea of where you are going and how to handle the trip.',
    photoNote: 'Personal photos to add · Road 13, Pakse',
  },
  primaryNote: {
    label: 'MY TAKE',
    text: 'For scooter rental in Pakse, this is the reference. I would ask Yves questions before I left rather than trying to figure everything out on the road.',
  },
  quickRead: {
    time: { primary: '18:00 BRIEFING', secondary: 'daily Bolaven Loop orientation' },
    route: { primary: 'ROAD 13', secondary: 'central Pakse departure point' },
    budget: { primary: 'CHECK CURRENT RATE', secondary: 'rental and travel-service prices can change' },
    bestFor: { primary: 'THE BOLAVEN LOOP', secondary: 'scooter rental · route advice · travel logistics' },
  },
  practicalNotes: {
    items: [
      { label: 'Briefing', value: '18:00', detail: 'Yves explains the Bolaven Loop and useful practical details before people head out.' },
      { label: 'Rental', value: 'Scooters', detail: 'This is the core service and the reason most travellers first come through the door.' },
      { label: 'Languages', value: 'English · Lao', detail: 'Yves is Belgian and can handle practical questions directly in both languages.' },
      { label: 'Travel desk', value: 'SIM · bus · tuk-tuk', detail: 'Several common travel logistics can be arranged from the same place.' },
      { label: 'Food', value: 'Restaurant next door', detail: 'Yves’s wife runs a small Lao-food restaurant beside the rental, useful before an early departure.' },
      { label: 'Location', value: '129 Road 13', detail: 'A very central Pakse base for sorting the last details before heading onto the loop.' },
    ],
  },
  chapterLabels: ['THE BRIEFING', 'YVES', 'THE HUB', 'BEFORE THE ROAD'],
  beforeYouLeave: {
    title: 'Use the briefing as a conversation, not a lecture',
    body: 'The useful part of Miss Noy is not only receiving a route on a map. Yves has years of accumulated local knowledge, so if something about your plan is unclear, ask. Road conditions, stops, timing and transport details can change, and this is exactly the kind of place where a direct question before departure is worth more than another hour of generic online research.',
    note: {
      label: 'START FED',
      text: 'The little restaurant next door is an easy place to eat before taking the scooter and heading onto the loop.',
    },
  },
};
