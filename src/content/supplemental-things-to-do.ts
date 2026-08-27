import type { ResearchSource, ThingToDo } from '../core/models/types';

type SourcedThing = ThingToDo & { researchSources?: ResearchSource[] };

/**
 * Manually curated activities that should remain available even when a generated city draft
 * has not yet absorbed them. The public registry de-duplicates these by id, so a future city
 * regeneration can take over without creating a duplicate activity.
 */
export const supplementalThings: readonly SourcedThing[] = [
  {
    id: 'thing-mekong-slow-boat-huay-xai-luang-prabang',
    slug: 'mekong-slow-boat-huay-xai-luang-prabang',
    name: 'Mekong Slow Boat to Luang Prabang',
    country: 'laos',
    city: 'luang-prabang',
    category: 'things-to-do',
    coordinates: { latitude: 19.8845, longitude: 102.1347 },
    locationScope: 'area',
    shortDescription: 'Ride the classic two-day slow boat from Huay Xai to Luang Prabang, sleeping in Pak Beng and watching northern Laos unfold from the Mekong.',
    media: {
      card: {},
      fieldCard: { gallery: [] },
    },
    spaCard: {
      handwrittenTags: ['Two-day Mekong', 'Pak Beng overnight', 'Social journey'],
      bestTime: 'Morning departure',
      duration: '2 days · 1 night',
      gettingThere: 'Huay Xai · Pak Beng · Luang Prabang',
      costType: 'paid',
      photoStatus: 'missing',
      photoRequiresManualFill: true,
    },
    verification: {
      decision: 'accept',
      reason: 'Official Luang Prabang tourism confirms the two-day slow-boat connection with an overnight in Pak Beng, while Tourism Laos identifies Houay Xai as a Mekong slow-boat port for Pak Beng and Luang Prabang.',
    },
    sourceMetadata: {
      sourceName: 'Official Tourism Luang Prabang / Tourism Laos',
      sourceUrl: 'https://tourismluangprabang.org/travel-guide/access/',
    },
    manualLocks: {},
    googleMapsUrl: 'https://maps.app.goo.gl/Nu6gY9tALqA6SiAq7',
    isLandmark: false,
    longDescription: 'Make the journey itself part of northern Laos: two long days on the Mekong from Huay Xai to Luang Prabang, a night in Pak Beng, huge river landscapes and a boat full of travellers beginning the same route through the country.',
    breadcrumbs: ['laos', 'luang-prabang', 'things-to-do'],
    fieldCard: {
      template: 'deep',
      whyGo: 'The slow boat turns a border-to-city transfer into two days of Mekong scenery, shared travel and one of northern Laos’s classic backpacker experiences.',
      practical: 'Plan for two long days on the boat and one independent overnight in Pak Beng. Confirm the current ticket, departure arrangements and accommodation before travelling.',
      access: 'The classic downstream route starts in Huay Xai on the Lao side of the Thai border, stops overnight in Pak Beng and reaches Luang Prabang on day two.',
      notes: 'Comfort is basic and the days are long, but the slow pace, scenery and people you meet are a large part of why the journey is memorable.',
      faq: [],
      sections: [],
    },
    researchSources: [
      {
        sourceName: 'Official Tourism Luang Prabang · Access by boat',
        sourceUrl: 'https://tourismluangprabang.org/travel-guide/access/',
        purpose: 'facts',
        sourceType: 'first-party-official',
      },
      {
        sourceName: 'Official Tourism Luang Prabang · Slow boat & river cruise',
        sourceUrl: 'https://tourismluangprabang.org/things-to-do/nature/slow-boat-river-cruise/',
        purpose: 'facts',
        sourceType: 'first-party-official',
      },
      {
        sourceName: 'Tourism Laos · Bokeo Province',
        sourceUrl: 'https://www.tourismlaos.org/northern-provinces/bokeo/',
        purpose: 'facts',
        sourceType: 'first-party-official',
      },
      {
        sourceName: 'User-provided Google Maps location',
        sourceUrl: 'https://maps.app.goo.gl/Nu6gY9tALqA6SiAq7',
        purpose: 'location',
      },
    ],
  },
];
