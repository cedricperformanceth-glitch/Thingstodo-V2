import type { Place, ResearchSource } from '../core/models/types';

export interface VenueFieldCardChapter {
  title: string;
  body: string;
}

export interface VenueFieldCardContent {
  status: 'draft' | 'published';
  kindLabel: string;
  mediaSlots: 2 | 3;
  intro?: string;
  chapters: VenueFieldCardChapter[];
  faq: Array<{ question: string; answer: string }>;
}

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

/**
 * User-selected venues only.
 *
 * This registry is intentionally NOT generated for every SPA place. A venue appears here only
 * after the traveller explicitly selects a place they personally visited. Personal editorial
 * copy is added later from first-hand notes; never infer or fabricate lived experience.
 */
export const personalVenuePlaces: readonly SourcedPlace[] = [
  {
    id: 'place-sabai-ca-baille-guesthouse',
    slug: 'sabai-ca-baille-guesthouse',
    name: 'Sabai ça Baille Guesthouse',
    country: 'laos',
    city: 'pakse',
    category: 'accommodation',
    coordinates: { latitude: 15.123187, longitude: 105.802175 },
    locationScope: 'point',
    shortDescription: 'A small guesthouse on No.24 Road in central Pakse, with a garden and terrace around a quiet inner-courtyard setting.',
    media: {
      card: {},
      fieldCard: { gallery: [] },
    },
    spaCard: {
      handwrittenTags: ['Guesthouse', 'No.24 Road', 'Personal field note'],
      photoStatus: 'missing',
      photoRequiresManualFill: true,
    },
    verification: {
      decision: 'accept',
      reason: 'User-selected first-hand venue; identity and location cross-checked against current public lodging data.',
    },
    sourceMetadata: {
      sourceName: 'Google Maps',
      sourceUrl: 'https://maps.app.goo.gl/6wjbkBUXtq1EN4Vt8',
    },
    manualLocks: {},
    address: 'No.24 Road, 01600 Pakse, Laos',
    googleMapsUrl: 'https://maps.app.goo.gl/6wjbkBUXtq1EN4Vt8',
    researchSources: [
      {
        sourceName: 'Google Maps',
        sourceUrl: 'https://maps.app.goo.gl/6wjbkBUXtq1EN4Vt8',
        purpose: 'location',
      },
      {
        sourceName: 'Current lodging listing cross-check',
        sourceUrl: 'https://www.booking.com/hotel/la/sabai-ca-baille-guesthouse.html',
        purpose: 'facts',
      },
    ],
  },
];

export const venueFieldCards: Readonly<Record<string, VenueFieldCardContent>> = {
  'place-sabai-ca-baille-guesthouse': {
    status: 'published',
    kindLabel: 'Guesthouse',
    mediaSlots: 2,
    intro: 'What stayed with me most at Sabai ça Baille was not one particular feature of the building, but the feeling that the place is genuinely looked after. Pierre and Benoît run the guesthouse with a relaxed manner, but behind that there is a lot of order: the rooms and bathrooms were extremely clean during my stay, the atmosphere was calm, and the whole place felt cared for rather than simply managed.',
    chapters: [
      {
        title: 'Pierre, Benoît and the kind of local advice that actually helps',
        body: 'Pierre and Benoît are French and know the area around Pakse very well. They are both keen on getting out and exploring Laos rather than only staying behind the reception desk: Pierre sometimes goes cycling, while Benoît regularly heads out around the region with his wife. That local knowledge is one of the useful things about staying here. You can ask about the surroundings and get the impression you are speaking with people who actually spend time exploring them. They are also big basketball fans, which explains the hoop in the little courtyard at the front of the guesthouse. Benoît’s wife also works at a massage salon not far away, so that can be another useful local recommendation if you are looking for a massage nearby.',
      },
      {
        title: 'Quiet, clean and more spacious than the frontage suggests',
        body: 'From the street, you first see the small front courtyard and the reception area, but most of the guesthouse extends behind the front of the building and is much larger than it initially looks. On the left is the little courtyard with the basketball hoop; on the right is a covered restaurant area. The part I appreciated most was how clean and orderly everything felt. The rooms and toilets were very clean when I stayed, and Pierre and Benoît clearly make an effort to keep the guesthouse peaceful as well. In normal circumstances things settle down around 10:30 p.m. Of course, a guesthouse is still a guesthouse and a lively group can occasionally make more noise, but this is not a place where late-night noise is encouraged for no reason.',
      },
      {
        title: 'The small practical details I remember',
        body: 'Scooter security is taken seriously. The access gate is closed after about 10 p.m. and there is a night guard who can open it when someone needs to come in later. Check-in was possible around the clock when I was there, which is useful if you arrive in Pakse at an awkward hour. Breakfast was another small highlight of my stay. Last year they were serving, among other things, little homemade waffles prepared by a local Lao mama, and they were excellent. I would not assume the exact breakfast is unchanged this year, but it is the kind of detail that made the place feel personal rather than standardized.',
      },
    ],
    faq: [
      {
        question: 'Is Sabai ça Baille quiet at night?',
        answer: 'In my experience, yes. Pierre and Benoît try to keep the guesthouse calm and things normally settle down around 10:30 p.m. Guest behaviour can obviously vary, but late-night noise is not the atmosphere they are trying to create.',
      },
      {
        question: 'Can I leave a scooter there overnight?',
        answer: 'During my stay, scooters were kept behind the access gate, which was closed after about 10 p.m. There was also a night guard who could open the gate for late arrivals.',
      },
      {
        question: 'Can I arrive late for check-in?',
        answer: 'Check-in was available 24 hours a day when I stayed. If you know you will arrive very late, I would still message the guesthouse beforehand so they know when to expect you.',
      },
      {
        question: 'Are the owners useful for local recommendations?',
        answer: 'Yes. Pierre and Benoît spend time exploring the area themselves, by bike or on trips around the region, so they know the surroundings well and are good people to ask when you want ideas beyond the obvious Pakse stops.',
      },
    ],
  },
};

export const getVenueFieldCard = (placeId: string) => venueFieldCards[placeId];
export const hasVenueFieldCard = (placeId: string) => Boolean(getVenueFieldCard(placeId));
