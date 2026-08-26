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
import {
  ninetyVintageFieldCard,
  ninetyVintageLayout,
  ninetyVintagePlace,
} from './venue-field-card-90s-vintage';

export type { VenueFieldCardChapter, VenueFieldCardContent } from './venue-field-card-editorial';

export const personalVenuePlaces = [
  ...establishedPersonalVenuePlaces,
  samleesGardenPlace,
  seseWineBeerPlace,
  ninetyVintagePlace,
] as const;

export const venueFieldCards = {
  ...establishedVenueFieldCards,
  [samleesGardenPlace.id]: samleesGardenFieldCard,
  [seseWineBeerPlace.id]: seseWineBeerFieldCard,
  [ninetyVintagePlace.id]: ninetyVintageFieldCard,
} as const;

export const venueFieldCardLayoutProfiles: Readonly<Record<string, VenueFieldCardLayoutProfile>> = {
  [seseWineBeerPlace.id]: seseWineBeerLayout,
  [ninetyVintagePlace.id]: ninetyVintageLayout,
};

export const getVenueFieldCard = (placeId: string) => venueFieldCards[placeId as keyof typeof venueFieldCards];
export const hasVenueFieldCard = (placeId: string) => Boolean(getVenueFieldCard(placeId));
