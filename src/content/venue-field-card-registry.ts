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
import {
  italaoFieldCard,
  italaoLayout,
  italaoPlace,
} from './venue-field-card-italao';
import {
  laBoulangeGardenFieldCard,
  laBoulangeGardenLayout,
  laBoulangeGardenPlace,
} from './venue-field-card-la-boulange-garden';

export type { VenueFieldCardChapter, VenueFieldCardContent } from './venue-field-card-editorial';

export const personalVenuePlaces = [
  ...establishedPersonalVenuePlaces,
  samleesGardenPlace,
  seseWineBeerPlace,
  ninetyVintagePlace,
  italaoPlace,
  laBoulangeGardenPlace,
] as const;

export const venueFieldCards = {
  ...establishedVenueFieldCards,
  [samleesGardenPlace.id]: samleesGardenFieldCard,
  [seseWineBeerPlace.id]: seseWineBeerFieldCard,
  [ninetyVintagePlace.id]: ninetyVintageFieldCard,
  [italaoPlace.id]: italaoFieldCard,
  [laBoulangeGardenPlace.id]: laBoulangeGardenFieldCard,
} as const;

export const venueFieldCardLayoutProfiles: Readonly<Record<string, VenueFieldCardLayoutProfile>> = {
  [seseWineBeerPlace.id]: seseWineBeerLayout,
  [ninetyVintagePlace.id]: ninetyVintageLayout,
  [italaoPlace.id]: italaoLayout,
  [laBoulangeGardenPlace.id]: laBoulangeGardenLayout,
};

export const getVenueFieldCard = (placeId: string) => venueFieldCards[placeId as keyof typeof venueFieldCards];
export const hasVenueFieldCard = (placeId: string) => Boolean(getVenueFieldCard(placeId));
