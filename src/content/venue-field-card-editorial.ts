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
  relatedPlaceIds?: string[];
}

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

/**
 * User-selected venues only.
 *
 * This registry is intentionally NOT generated for every SPA place. A venue appears here only
 * after the traveller explicitly selects a place they personally know or visited. Personal
 * editorial copy is written from their own knowledge and notes; never fabricate lived experience.
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
  {
    id: 'place-sanga-hostel',
    slug: 'sanga-hostel',
    name: 'Sanga Hostel',
    country: 'laos',
    city: 'pakse',
    category: 'accommodation',
    coordinates: { latitude: 15.119917, longitude: 105.79872 },
    locationScope: 'point',
    shortDescription: 'A remarkably polished central Pakse hostel with spotless dorms, a restaurant, strong practical services and an owner who seems able to solve almost anything.',
    media: {
      card: {},
      fieldCard: { gallery: [] },
    },
    spaCard: {
      handwrittenTags: ['Hostel', 'Central Pakse', 'Personal field note'],
      photoStatus: 'missing',
      photoRequiresManualFill: true,
    },
    verification: {
      decision: 'accept',
      reason: 'User-selected personal venue; identity, official name, address and current operation cross-checked against public and first-party sources.',
    },
    sourceMetadata: {
      sourceName: 'Google Maps',
      sourceUrl: 'https://maps.app.goo.gl/LMMmiwjg5Jqm9bfh7',
    },
    manualLocks: {},
    address: 'Ban Wat Louang, Street No. 5, House No. 0407, 16000 Pakse, Laos',
    googleMapsUrl: 'https://maps.app.goo.gl/LMMmiwjg5Jqm9bfh7',
    researchSources: [
      {
        sourceName: 'Traveller first-hand knowledge',
        purpose: 'first-party',
        sourceType: 'manual',
      },
      {
        sourceName: 'Google Maps',
        sourceUrl: 'https://maps.app.goo.gl/LMMmiwjg5Jqm9bfh7',
        purpose: 'location',
      },
      {
        sourceName: 'Sanga Hostel official website',
        sourceUrl: 'https://www.sangahostel.com/',
        purpose: 'facts',
        sourceType: 'first-party-official',
      },
    ],
  },
  {
    id: 'place-sanga-rooftop-hostel',
    slug: 'sanga-rooftop-hostel',
    name: 'Sanga Rooftop Hostel',
    country: 'laos',
    city: 'pakse',
    category: 'accommodation',
    coordinates: { latitude: 15.12167, longitude: 105.799342 },
    locationScope: 'point',
    shortDescription: 'The newer Sanga hostel in central Pakse, built around the same hands-on hospitality with comfortable dorm beds, a rooftop restaurant and bar, and a fresh first-season feel.',
    media: {
      card: {},
      fieldCard: { gallery: [] },
    },
    spaCard: {
      handwrittenTags: ['Hostel', 'Rooftop', 'Personal field note'],
      photoStatus: 'missing',
      photoRequiresManualFill: true,
    },
    verification: {
      decision: 'accept',
      reason: 'User-selected personal venue; identity and address cross-checked against current lodging data. Point coordinates normalized from local business location data.',
    },
    sourceMetadata: {
      sourceName: 'Google Maps',
      sourceUrl: 'https://maps.app.goo.gl/8UMCod9ajTmBDqzdA',
    },
    manualLocks: {},
    address: 'Ban Lukmeuang, Street No. 12, House No. 120, 16000 Pakse, Laos',
    googleMapsUrl: 'https://maps.app.goo.gl/8UMCod9ajTmBDqzdA',
    researchSources: [
      {
        sourceName: 'Traveller first-hand knowledge',
        purpose: 'first-party',
        sourceType: 'manual',
      },
      {
        sourceName: 'Google Maps',
        sourceUrl: 'https://maps.app.goo.gl/8UMCod9ajTmBDqzdA',
        purpose: 'location',
      },
      {
        sourceName: 'Current lodging listing cross-check',
        sourceUrl: 'https://www.booking.com/hotel/la/sanga-rooftop-hostel.html',
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
  'place-sanga-hostel': {
    status: 'published',
    kindLabel: 'Hostel',
    mediaSlots: 2,
    intro: 'Sanga Hostel is one of those places where the price almost makes the level of care feel improbable. I have not slept in the dorms myself, so I am not going to pretend this is a conventional hotel review. I know the owner personally, I spend time at the hostel, I teach Muay Thai to some of her guests, and I hear a lot of direct feedback from the people staying there. What I see consistently is a hostel that is exceptionally clean, extremely organized and run with a level of energy that is unusual anywhere, never mind at this price in Pakse.',
    chapters: [
      {
        title: 'The person behind Sanga is a big part of the place',
        body: 'The owner is difficult to describe without sounding excessive because she genuinely seems to do everything. She is charming, charismatic and relentlessly hardworking. One moment she can be helping with a booking or finding a bus, the next she is in the kitchen, sorting out a practical problem, helping someone with cash, or calling the right person in town. Her English is excellent and, more importantly, she has the kind of local network that makes travel problems much easier to solve. Sanga Hostel was her first hostel in Pakse, and the fact that she has now opened Sanga Rooftop Hostel nearby says a lot about how seriously she has built the business.',
      },
      {
        title: 'Dormitory standards that do not feel budget',
        body: 'The dormitory is large and there are plenty of beds, but the thing that stands out is the cleanliness and organization. For me, that is the real story here. The beds are very good, the Wi-Fi is excellent, and the feedback I get from guests is remarkably consistent about how well the place is maintained. There is also a night guard, and late arrivals can be handled when necessary. The crowd is naturally younger than in many Pakse guesthouses because this is a hostel built around dorms, but it is not a place that feels careless or improvised.',
      },
      {
        title: 'The street is part of the experience',
        body: 'Sanga sits right in central Pakse, close to the market, opposite the Pakse Hotel area and within easy reach of the hospital and transport connections. The street is active during the day, which I actually like in the morning. There are a couple of little tables outside, the temperature is still comfortable, and you can sit there and watch Pakse wake up and get on with its day. By midday, I would not choose the pavement seats: there is traffic, movement and heat, and the frontage has no air conditioning or fan. Inside is a different story, with the restaurant and cooler indoor space making it much more comfortable.',
      },
      {
        title: 'A hostel, restaurant, little shop and useful address all at once',
        body: 'The entrance has more going on than a simple reception desk. There is a small craft and souvenir shop with traditional pieces, baskets, hats, postcards and other small items, much of it leaning toward things women might actually want to browse rather than generic travel souvenirs. There is also a restaurant inside. It makes the hostel feel connected to the street and to local small businesses instead of being a sealed-off dormitory building.',
      },
      {
        title: 'The laundry service is one of those details locals notice',
        body: 'One practical service I would not overlook is the laundry. The owner runs a professional laundry operation that also handles work for other hotels in Pakse, so this is not just a washing machine in a back room. Cold wash, hot wash and ironing can all be handled, and in my experience the standard is excellent. Because it is her own operation, it can also make more sense on price than paying another hotel to send the same work out through a middleman.',
      },
    ],
    faq: [
      {
        question: 'Have I personally slept at Sanga Hostel?',
        answer: 'No. I know the owner personally, spend time at the hostel and teach Muay Thai to some of her guests, so my view comes from repeated first-hand contact with the place and a lot of direct feedback from people staying there rather than from pretending I booked a dorm bed myself.',
      },
      {
        question: 'Is Sanga Hostel clean?',
        answer: 'This is the part I am most confident about. The hostel is exceptionally clean and organized, and that standard is one of the things I hear about repeatedly from the guests I meet there.',
      },
      {
        question: 'Is it a good location if I do not have a scooter?',
        answer: 'Yes. It is right in central Pakse, close to the market and everyday services, with transport connections within easy reach. It is one of the easiest locations in town for doing a lot on foot.',
      },
      {
        question: 'Can the hostel help with buses and practical travel arrangements?',
        answer: 'Yes. This is one of the owner’s strengths. She knows the local network extremely well and regularly helps travellers sort out buses, bookings and other practical problems.',
      },
      {
        question: 'Is the laundry service worth using?',
        answer: 'I think so. It is a proper professional laundry operation, not an improvised hostel extra, and it can handle washing at different temperatures as well as ironing.',
      },
    ],
    relatedPlaceIds: ['place-sanga-rooftop-hostel'],
  },
  'place-sanga-rooftop-hostel': {
    status: 'published',
    kindLabel: 'Hostel',
    mediaSlots: 2,
    intro: 'Sanga Rooftop is the newer sister hostel to Sanga Hostel, only a short walk away in the centre of Pakse. It is the owner’s second hostel and, for me, the interesting part is watching the same obsessive attention to service move into a newer, more open format with a rooftop restaurant and bar. This is its first season, so I am still interested to see how the atmosphere develops over time rather than pretending I already know what it will feel like every month of the year.',
    chapters: [
      {
        title: 'The second Sanga, not a copy of the first one',
        body: 'The two hostels are close enough that it would have been easy to make the Rooftop feel like an extension of the original. It does not. The newer place has its own identity, with the rooftop restaurant and bar giving it a more open social space and a different rhythm. What it shares with the original is the owner behind it: the same person who can organize transport, solve practical problems, call a tuk-tuk, answer in excellent English and somehow keep several things moving at once.',
      },
      {
        title: 'New beds, strong basics and the same obsession with order',
        body: 'For a dormitory, the beds are genuinely good and the whole place still has that new-hostel feeling. The Wi-Fi is excellent, the practical setup is well thought through and there is a night guard for late access when needed. Those are simple details, but they are exactly the details that decide whether a budget stay feels tiring or easy. The standard here is clearly not being treated as “good enough because it is a hostel.”',
      },
      {
        title: 'A rooftop changes how you use the place',
        body: 'The rooftop is the obvious difference. There is a small restaurant and bar up there, which gives you somewhere to stay at the hostel without feeling as if you are simply sitting beside the dorms. In Pakse, where the centre becomes much calmer in the evening, that kind of space can be useful: you can come back, have something to eat or drink and still feel connected to the city rather than disappearing into your room.',
      },
      {
        title: 'Same central Pakse, one street over',
        body: 'The Rooftop is roughly a couple of hundred metres from the original Sanga, in the neighbouring streets of central Pakse. So most of the same location logic applies: the market, restaurants, everyday services and transport are all close, and you can do a lot without needing a scooter. What I would not do yet is tell you exactly what the long-term hostel atmosphere will be, because this is still the first season. The building and service are already there; I want to see what kind of community develops around them.',
      },
    ],
    faq: [
      {
        question: 'How is Sanga Rooftop related to Sanga Hostel?',
        answer: 'It is the second hostel opened by the same owner. The original Sanga Hostel is only a short walk away, but the Rooftop has its own building and a different identity built around the rooftop restaurant and bar.',
      },
      {
        question: 'Is Sanga Rooftop still new?',
        answer: 'Yes. This is its first season, which is why I am deliberately not pretending to know yet how the atmosphere will evolve across a full year.',
      },
      {
        question: 'How are the beds and Wi-Fi?',
        answer: 'From what I know of the hostel directly, the dorm beds are very good and the Wi-Fi is excellent. The whole setup feels new, organized and carefully maintained.',
      },
      {
        question: 'Is it central?',
        answer: 'Very. It is in the same central Pakse area as the original Sanga Hostel, only a neighbouring street away, so the market, food, services and transport are all close.',
      },
    ],
    relatedPlaceIds: ['place-sanga-hostel'],
  },
};

export const getVenueFieldCard = (placeId: string) => venueFieldCards[placeId];
export const hasVenueFieldCard = (placeId: string) => Boolean(getVenueFieldCard(placeId));
