import { generatedThings } from '../generated';
import { supplementalThings } from '../supplemental-things-to-do';
import thingCategoryOverrides from '../thing-category-overrides.json';
import { fieldCardEditorial } from '../field-card-editorial-data';
import { thingRuntimeOverrides } from '../thing-runtime-overrides';
import type { ThingToDo } from '../../core/models/types';

const categoryOverrides = thingCategoryOverrides as Record<string, ThingToDo['category']>;
const generatedIds = new Set(generatedThings.map((thing) => thing.id));
const allThings: ThingToDo[] = [
  ...generatedThings,
  ...supplementalThings.filter((thing) => !generatedIds.has(thing.id)),
];

export const things: ThingToDo[] = allThings.map((thing) => {
  const runtimeOverride = thingRuntimeOverrides[thing.id];
  const editorialMedia = fieldCardEditorial[thing.id]?.media ?? [];
  const hasEditorialMedia = editorialMedia.length > 0;
  const media = hasEditorialMedia
    ? {
        ...thing.media,
        card: { ...thing.media.card, image: editorialMedia[0] },
        fieldCard: { ...thing.media.fieldCard, gallery: editorialMedia },
      }
    : thing.media;
  const spaCard = thing.spaCard
    ? {
        ...thing.spaCard,
        ...(hasEditorialMedia ? { photoStatus: 'verified' as const, photoRequiresManualFill: false } : {}),
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
