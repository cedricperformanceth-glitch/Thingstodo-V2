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
    status: 'draft',
    kindLabel: 'Guesthouse',
    mediaSlots: 2,
    chapters: [],
    faq: [],
  },
};

export const getVenueFieldCard = (placeId: string) => venueFieldCards[placeId];
export const hasVenueFieldCard = (placeId: string) => Boolean(getVenueFieldCard(placeId));
