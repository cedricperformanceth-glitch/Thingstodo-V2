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
    shortDescription: 'A quiet, well-kept guesthouse just off central Pakse’s main road, with clean air-conditioned rooms, strong Wi-Fi and a relaxed courtyard.',
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
    intro: 'What stayed with me most at Sabai ça Baille was how many of the basics they simply get right. Pierre and Benoît run the guesthouse in a relaxed way, but behind that there is a lot of order: my room and the bathrooms were extremely clean, the bed was genuinely comfortable, the air conditioning worked very well, the Wi-Fi was strong, and the atmosphere stayed calm. Add a location right in central Pakse without the traffic of the main road, and for me it becomes one of the best-value guesthouses in town.',
    chapters: [
      {
        title: 'Pierre, Benoît and the kind of local advice that actually helps',
        body: 'Pierre and Benoît are French and know the area around Pakse very well. They are both keen on getting out and exploring Laos rather than only staying behind the reception desk: Pierre sometimes goes cycling, while Benoît regularly heads out around the region with his wife. That local knowledge is one of the useful things about staying here. You can ask about the surroundings and feel that you are speaking with people who actually spend time exploring them. They are also big basketball fans, which explains the hoop in the little courtyard at the front of the guesthouse. Benoît’s wife also works at a massage salon not far away, so that can be another useful local recommendation if you are looking for a massage nearby.',
      },
      {
        title: 'A room that gets the essentials right',
        body: 'I stayed in an air-conditioned room with a large bed, and the comfort level was much better than I expected for the price. The bed was very comfortable, the air conditioning worked properly throughout my stay, and the Wi-Fi connection was very good. The bathrooms were also exceptionally clean. That consistency matters more to me than decorative details, especially in a guesthouse: you want to come back after a day outside, take a clean shower, cool the room down and sleep well. Sabai ça Baille delivered exactly that for me.',
      },
      {
        title: 'Quiet enough to rest, central enough to walk everywhere',
        body: 'The location is one of the strongest parts of the guesthouse. It sits on a side street rather than directly on Pakse’s main road, so there is very little passing traffic and the atmosphere is noticeably quieter. At the same time, the main road is only a very short walk away, so you are still right in the centre with easy access to the places you need around town. From the street you first see the small courtyard and reception, but most of the guesthouse extends behind the front of the building and is much larger than it initially looks. On the left is the little courtyard with the basketball hoop; on the right is a covered restaurant area.',
      },
      {
        title: 'Calm, secure and never completely anonymous',
        body: 'Pierre and Benoît make a real effort to keep the guesthouse peaceful. In normal circumstances things settle down around 10:30 p.m. A lively group can obviously change the atmosphere for an evening, but this is not a place where unnecessary late-night noise is encouraged. The access gate is closed after about 10 p.m. to keep scooters secure, and there is a night guard who can open it for late arrivals. The guest mix was also one of the things I liked: I met a very varied, international crowd rather than one single type of traveller, so the atmosphere can change from one stay to the next without the place losing its identity.',
      },
      {
        title: 'The small practical details I remember',
        body: 'Check-in was possible around the clock when I was there, which is useful if you arrive in Pakse at an awkward hour. Breakfast was another small highlight of my stay. Last year they were serving, among other things, little homemade waffles prepared by a local Lao mama, and they were excellent. I would not assume the exact breakfast is unchanged this year, but it is the kind of detail that made the place feel personal rather than standardized. Taken together with the cleanliness, comfort, location and atmosphere, it is why I consider Sabai ça Baille one of the strongest value-for-money options I have found in Pakse.',
      },
    ],
    faq: [
      {
        question: 'Is Sabai ça Baille quiet at night?',
        answer: 'In my experience, yes. It is on a quieter side street away from most passing traffic, and Pierre and Benoît try to keep the guesthouse calm. Things normally settle down around 10:30 p.m., although guest behaviour can obviously vary.',
      },
      {
        question: 'How are the rooms, air conditioning and Wi-Fi?',
        answer: 'I stayed in a room with a large bed and air conditioning. The bed was very comfortable, the air conditioning worked very well, the Wi-Fi was strong, and the bathrooms were extremely clean during my stay.',
      },
      {
        question: 'Is the guesthouse well located for walking around Pakse?',
        answer: 'Yes. It is just off the main road in central Pakse, which gives you the advantage of a quieter street while keeping the centre and everyday services only a very short walk away.',
      },
      {
        question: 'Can I leave a scooter there overnight?',
        answer: 'During my stay, scooters were kept behind the access gate, which was closed after about 10 p.m. There was also a night guard who could open the gate for late arrivals.',
      },
      {
        question: 'Can I arrive late for check-in?',
        answer: 'Check-in was available 24 hours a day when I stayed. If you know you will arrive very late, I would still message the guesthouse beforehand so they know when to expect you.',
      },
    ],
  },
};

export const getVenueFieldCard = (placeId: string) => venueFieldCards[placeId];
export const hasVenueFieldCard = (placeId: string) => Boolean(getVenueFieldCard(placeId));
