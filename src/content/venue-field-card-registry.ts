import {
  personalVenuePlaces as establishedPersonalVenuePlaces,
  venueFieldCards as establishedVenueFieldCards,
} from './venue-field-card-editorial';
import type { VenueFieldCardLayoutProfile } from './venue-field-card-layouts';
import { samleesGardenFieldCard, samleesGardenPlace } from './venue-field-card-samlees';
import {
  seseWineBeerFieldCard,
  seseWineBeerLayout,
  seseWineBeerPlace,
} from './venue-field-card-sese';

export type { VenueFieldCardChapter, VenueFieldCardContent } from './venue-field-card-editorial';

export const personalVenuePlaces = [
  ...establishedPersonalVenuePlaces,
  samleesGardenPlace,
  seseWineBeerPlace,
] as const;

export const venueFieldCards = {
  ...establishedVenueFieldCards,
  [samleesGardenPlace.id]: samleesGardenFieldCard,
  [seseWineBeerPlace.id]: seseWineBeerFieldCard,
} as const;

export const venueFieldCardLayoutProfiles: Readonly<Record<string, VenueFieldCardLayoutProfile>> = {
  [seseWineBeerPlace.id]: seseWineBeerLayout,
};

export const getVenueFieldCard = (placeId: string) => venueFieldCards[placeId as keyof typeof venueFieldCards];
export const hasVenueFieldCard = (placeId: string) => Boolean(getVenueFieldCard(placeId));
