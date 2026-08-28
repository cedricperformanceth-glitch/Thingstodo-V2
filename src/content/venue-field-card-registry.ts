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
import {
  missNoyMotorbikeFieldCard,
  missNoyMotorbikeLayout,
  missNoyMotorbikePlace,
} from './venue-field-card-miss-noy';
import {
  amorCafeFieldCard,
  amorCafeLayout,
  amorCafePlace,
} from './venue-field-card-amor-cafe';
import {
  rynCoffeeFieldCard,
  rynCoffeeLayout,
  rynCoffeePlace,
} from './venue-field-card-ryn-coffee';
import {
  laoBurgerFieldCard,
  laoBurgerLayout,
  laoBurgerPlace,
} from './venue-field-card-lao-burger';
import {
  fandeeIslandFieldCard,
  fandeeIslandLayout,
  fandeeIslandPlaceId,
} from './venue-field-card-fandee-island';

export type { VenueFieldCardChapter, VenueFieldCardContent } from './venue-field-card-editorial';

export const personalVenuePlaces = [
  ...establishedPersonalVenuePlaces,
  samleesGardenPlace,
  seseWineBeerPlace,
  ninetyVintagePlace,
  italaoPlace,
  laBoulangeGardenPlace,
  missNoyMotorbikePlace,
  amorCafePlace,
  rynCoffeePlace,
  laoBurgerPlace,
] as const;

export const venueFieldCards = {
  ...establishedVenueFieldCards,
  [samleesGardenPlace.id]: samleesGardenFieldCard,
  [seseWineBeerPlace.id]: seseWineBeerFieldCard,
  [ninetyVintagePlace.id]: ninetyVintageFieldCard,
  [italaoPlace.id]: italaoFieldCard,
  [laBoulangeGardenPlace.id]: laBoulangeGardenFieldCard,
  [missNoyMotorbikePlace.id]: missNoyMotorbikeFieldCard,
  [amorCafePlace.id]: amorCafeFieldCard,
  [rynCoffeePlace.id]: rynCoffeeFieldCard,
  [laoBurgerPlace.id]: laoBurgerFieldCard,
  [fandeeIslandPlaceId]: fandeeIslandFieldCard,
} as const;

export const venueFieldCardLayoutProfiles: Readonly<Record<string, VenueFieldCardLayoutProfile>> = {
  [seseWineBeerPlace.id]: seseWineBeerLayout,
  [ninetyVintagePlace.id]: ninetyVintageLayout,
  [italaoPlace.id]: italaoLayout,
  [laBoulangeGardenPlace.id]: laBoulangeGardenLayout,
  [missNoyMotorbikePlace.id]: missNoyMotorbikeLayout,
  [amorCafePlace.id]: amorCafeLayout,
  [rynCoffeePlace.id]: rynCoffeeLayout,
  [laoBurgerPlace.id]: laoBurgerLayout,
  [fandeeIslandPlaceId]: fandeeIslandLayout,
};

export const getVenueFieldCard = (placeId: string) => venueFieldCards[placeId as keyof typeof venueFieldCards];
export const hasVenueFieldCard = (placeId: string) => Boolean(getVenueFieldCard(placeId));
