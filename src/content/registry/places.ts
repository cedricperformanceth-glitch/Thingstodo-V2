import { generatedPlaces } from '../generated';
import { placeCardEditorial, supplementalPlaces } from '../place-card-editorial';
import type { Place } from '../../core/models/types';

const generatedIds = new Set(generatedPlaces.map((place) => place.id));

const applyEditorial = (place: Place): Place => {
  const override = placeCardEditorial[place.id];
  return override ? { ...place, ...override } : place;
};

export const places: Place[] = [
  ...generatedPlaces.map(applyEditorial),
  ...supplementalPlaces.filter((place) => !generatedIds.has(place.id)).map(applyEditorial),
];
