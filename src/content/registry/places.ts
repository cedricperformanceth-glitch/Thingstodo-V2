import { generatedPlaces } from '../generated';
import { placeCardEditorial, supplementalPlaces } from '../place-card-editorial';
import type { Place, ResearchSource } from '../../core/models/types';

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

const generatedIds = new Set(generatedPlaces.map((place) => place.id));
const DON_DET_CENTROID = { latitude: 13.9709, longitude: 105.9215 } as const;

const applyEditorial = (place: SourcedPlace): SourcedPlace => {
  const override = placeCardEditorial[place.id];
  return override ? { ...place, ...override } : place;
};

const normalizePublicationMetadata = (place: SourcedPlace): SourcedPlace => {
  const hasCardImage = Boolean(place.media.card?.image);
  const spaCard = place.spaCard
    ? {
        ...place.spaCard,
        ...(hasCardImage ? { photoStatus: 'verified' as const, photoRequiresManualFill: false } : {}),
      }
    : place.spaCard;

  const researchSources = place.city === 'don-det' && place.researchSources?.length
    ? place.researchSources.map((source) => (
        source.sourceName === 'Google Maps'
        && /^https:\/\/(?:www\.)?google\.com\/maps\/?$/i.test(source.sourceUrl ?? '')
        && place.googleMapsUrl
          ? { ...source, sourceUrl: place.googleMapsUrl }
          : source
      ))
    : place.researchSources;

  const usesDonDetCentroid = place.city === 'don-det'
    && place.coordinates.latitude === DON_DET_CENTROID.latitude
    && place.coordinates.longitude === DON_DET_CENTROID.longitude;

  return {
    ...place,
    spaCard,
    ...(researchSources ? { researchSources } : {}),
    ...(usesDonDetCentroid ? { locationScope: 'area' as const } : {}),
  };
};

const publish = (place: SourcedPlace): SourcedPlace => normalizePublicationMetadata(applyEditorial(place));

export const places: Place[] = [
  ...generatedPlaces.map((place) => publish(place as SourcedPlace)),
  ...supplementalPlaces.filter((place) => !generatedIds.has(place.id)).map((place) => publish(place as SourcedPlace)),
];
