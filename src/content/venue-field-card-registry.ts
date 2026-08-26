import {
  personalVenuePlaces as establishedPersonalVenuePlaces,
  venueFieldCards as establishedVenueFieldCards,
} from './venue-field-card-editorial';
import { samleesGardenFieldCard, samleesGardenPlace } from './venue-field-card-samlees';

export type { VenueFieldCardChapter, VenueFieldCardContent } from './venue-field-card-editorial';

export const personalVenuePlaces = [
  ...establishedPersonalVenuePlaces,
  samleesGardenPlace,
] as const;

export const venueFieldCards = {
  ...establishedVenueFieldCards,
  [samleesGardenPlace.id]: samleesGardenFieldCard,
} as const;

export const getVenueFieldCard = (placeId: string) => venueFieldCards[placeId as keyof typeof venueFieldCards];
export const hasVenueFieldCard = (placeId: string) => Boolean(getVenueFieldCard(placeId));
