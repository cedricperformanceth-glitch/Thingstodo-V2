import { generatedThings } from '../generated';
import { supplementalThings } from '../supplemental-things-to-do';
import thingCategoryOverrides from '../thing-category-overrides.json';
import { fieldCardEditorial } from '../field-card-editorial-data';
import { applyPakseActivityMediaCorrections } from '../field-card-media-pakse-overrides';
import { thingRuntimeOverrides } from '../thing-runtime-overrides';
import type { MediaRecord, MediaVerificationStatus, ThingToDo } from '../../core/models/types';

const categoryOverrides = thingCategoryOverrides as Record<string, ThingToDo['category']>;
const generatedIds = new Set(generatedThings.map((thing) => thing.id));
const allThings: ThingToDo[] = [
  ...generatedThings,
  ...supplementalThings.filter((thing) => !generatedIds.has(thing.id)),
];

const resolvePhotoRightsStatus = (media: MediaRecord[]): MediaVerificationStatus | undefined => {
  if (!media.length) return undefined;
  const statuses = media.map((image) => image.rightsVerificationStatus ?? image.verificationStatus ?? 'partial');
  if (statuses.every((status) => status === 'verified')) return 'verified';
  if (statuses.some((status) => status === 'review-needed')) return 'review-needed';
  return 'partial';
};

export const things: ThingToDo[] = allThings.map((thing) => {
  const runtimeOverride = thingRuntimeOverrides[thing.id];
  const editorialMedia = fieldCardEditorial[thing.id]?.media ?? [];
  const hasEditorialMedia = editorialMedia.length > 0;
  const isDonDetPilot = thing.country === 'laos' && thing.city === 'don-det';
  const isTadLoPilot = thing.country === 'laos' && thing.city === 'tad-lo';
  const isMediaRightsPilot = isDonDetPilot || isTadLoPilot;
  const photoRightsStatus = isMediaRightsPilot ? resolvePhotoRightsStatus(editorialMedia) : undefined;

  const isPakseMonetizablePilot = thing.country === 'laos' && thing.city === 'pakse';
  const pakseFieldGallery = isPakseMonetizablePilot
    ? applyPakseActivityMediaCorrections(thing.media.fieldCard?.gallery, thing.id)
    : thing.media.fieldCard?.gallery;
  const baseMedia = isPakseMonetizablePilot && pakseFieldGallery !== thing.media.fieldCard?.gallery
    ? {
        ...thing.media,
        fieldCard: { ...thing.media.fieldCard, gallery: pakseFieldGallery ?? [] },
      }
    : thing.media;

  const media = hasEditorialMedia
    ? {
        ...baseMedia,
        card: { ...baseMedia.card, image: editorialMedia[0] },
        fieldCard: { ...baseMedia.fieldCard, gallery: editorialMedia },
      }
    : baseMedia;
  const spaCard = thing.spaCard
    ? {
        ...thing.spaCard,
        ...(hasEditorialMedia ? { photoStatus: 'verified' as const, photoRequiresManualFill: false } : {}),
        ...(isMediaRightsPilot ? {
          photoAvailabilityStatus: hasEditorialMedia ? 'present' as const : 'missing' as const,
          ...(photoRightsStatus ? { photoRightsStatus } : {}),
        } : {}),
      }
    : thing.spaCard;

  return {
    ...thing,
    ...runtimeOverride,
    media,
    spaCard,
    category: categoryOverrides[thing.id] ?? thing.category,
  };
});
