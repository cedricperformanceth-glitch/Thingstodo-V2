import type { Place, ResearchSource } from '../core/models/types';
import type { VenueFieldCardContent } from './venue-field-card-editorial';

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

export const samleesGardenPlace: SourcedPlace = {
  id: 'place-samlees-garden',
  slug: 'samlees-garden',
  name: "Samlee's Garden",
  country: 'laos',
  city: 'pakse',
  category: 'accommodation',
  coordinates: { latitude: 15.113983, longitude: 105.801643 },
  locationScope: 'point',
  shortDescription: 'A tiny Mekong-front guesthouse opposite Pakse night market, with unusually spacious private rooms, river views, a restaurant and a very hands-on local host.',
  media: {
    card: {},
    fieldCard: { gallery: [] },
  },
  spaCard: {
    handwrittenTags: ['Guesthouse', 'Mekong view', 'Personal field note'],
    photoStatus: 'missing',
    photoRequiresManualFill: true,
  },
  verification: {
    decision: 'accept',
    reason: 'User-selected personal venue; official name, location and current accommodation/restaurant operation cross-checked against current lodging and local business sources.',
  },
  sourceMetadata: {
    sourceName: 'Google Maps',
    sourceUrl: 'https://maps.app.goo.gl/jY9duhmNxKHvUjm27',
  },
  manualLocks: {},
  address: 'Mekong Riverside, Pakse 16000, Laos',
  googleMapsUrl: 'https://maps.app.goo.gl/jY9duhmNxKHvUjm27',
  researchSources: [
    {
      sourceName: 'Traveller first-hand knowledge',
      purpose: 'first-party',
      sourceType: 'manual',
    },
    {
      sourceName: 'Google Maps',
      sourceUrl: 'https://maps.app.goo.gl/jY9duhmNxKHvUjm27',
      purpose: 'location',
    },
    {
      sourceName: 'Current lodging listing cross-check',
      sourceUrl: 'https://www.booking.com/hotel/la/samlees-garden.html',
      purpose: 'facts',
    },
  ],
};

export const samleesGardenFieldCard: VenueFieldCardContent = {
  status: 'published',
  kindLabel: 'Guesthouse',
  mediaSlots: 2,
  intro: "Samlee's Garden is tiny, and that is a big part of why I like it. Jay, the French owner, has spent most of the last decade in Laos and previously ran a guesthouse in Thakhek before settling in Pakse. There are only a couple of private guest spaces, but they are unusually generous, with proper room to spread out, comfortable double beds and a terrace looking over the Mekong toward Phou Salao. It feels much more like staying in someone's carefully built place than checking into a conventional hotel.",
  chapters: [
    {
      title: 'Jay knows southern Laos from more than one angle',
      body: "Jay has been living in Laos for roughly seven or eight years and speaks Lao fluently, alongside very good English, French and Spanish. He also organizes tours and works with local guides, so he is one of those people I would actually ask when I want information about the area rather than just a list of standard attractions. Having lived and worked in both Thakhek and Pakse gives him a broader view of southern Laos, and he has the contacts to turn an idea into an actual trip when you need transport, a guide or a route.",
    },
    {
      title: 'Two private rooms, a lot more space than expected',
      body: "This is not a large guesthouse. The accommodation is built around just two private rooms, and the feeling is much closer to a small apartment-style stay than a compact budget room. The rooms are spacious, with two double beds, air conditioning and good Wi-Fi, so it can also work well if you are travelling with friends or as a small group. The terrace is the detail I remember most: you look straight toward the Mekong and Phou Salao, which gives the place a completely different atmosphere from a room buried in the middle of town.",
    },
    {
      title: 'The restaurant follows the same personal philosophy',
      body: "Jay also runs a restaurant here and serves breakfast. His approach to food is quite deliberate: he tries to keep meals balanced, nourishing and made from products he actually cares about, rather than simply loading everything with oil. I would describe it as an eco-conscious, health-minded way of cooking more than a rigid concept. The menu can evolve, but the intention behind it is consistent: simple food, properly prepared, with attention to what goes into it.",
    },
    {
      title: 'Right opposite the night market means accepting a little life outside',
      body: "The location is excellent if you like being on the river: Samlee's Garden is directly opposite the Pakse night market, with the Mekong in front of you. That also means I would not sell it as absolute silence every night. Most evenings calm down around 10 or 10:30 p.m., so under normal circumstances the noise does not drag on very late. During Pi Mai, public holidays or other celebrations, however, Pakse can be louder and I would expect the riverfront to reflect that. For me, that is simply part of choosing this location rather than a defect in the guesthouse.",
    },
  ],
  faq: [
    {
      question: "What makes Samlee's Garden different from a normal Pakse guesthouse?",
      answer: "For me, it is the combination of scale and personality: only a couple of very spacious private rooms, a Mekong-facing terrace, and Jay being directly involved in the stay, the restaurant and local travel arrangements.",
    },
    {
      question: 'Can Jay help organize tours around southern Laos?',
      answer: "Yes. He runs tours, works with guides and knows the region well. He also speaks Lao fluently, which makes him particularly useful when a plan needs more than a standard tourist booking desk.",
    },
    {
      question: 'Is it suitable for more than two people?',
      answer: "Yes. The private rooms are unusually spacious and have two double beds, so the setup can work well for friends or a small group rather than only a couple.",
    },
    {
      question: 'Is it noisy because of the night market?',
      answer: "Usually the riverfront settles down around 10 to 10:30 p.m. I would still expect more noise during Pi Mai, public holidays or special events, because the guesthouse is directly opposite the night market and that is part of the location.",
    },
  ],
};
