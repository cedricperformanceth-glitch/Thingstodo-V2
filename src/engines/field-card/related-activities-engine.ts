import type { City, MediaRecord, ThingToDo } from '../../core/models/types';
import { thingPath } from '../../core/routing/paths';
import { getThings } from '../category/category-engine';
import { getEditorialMedia } from './field-card-editorial';

export interface FieldCardRelatedActivity {
  id: string;
  name: string;
  path: string;
  eyebrow: string;
  description: string;
  duration?: string;
  image?: MediaRecord;
}

const compactDescription = (value: string, maxWords = 20) => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return value.trim();
  return `${words.slice(0, maxWords).join(' ')}…`;
};

const activityEyebrow = (thing: ThingToDo) => {
  const exploreLabel = thing.exploreBoard?.kicker
    ?.split('·')
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(' · ');
  if (exploreLabel) return exploreLabel;

  const tags = thing.spaCard?.handwrittenTags?.filter(Boolean).slice(0, 2) ?? [];
  if (tags.length) return tags.join(' · ');

  return thing.isLandmark ? 'LANDMARK' : 'EXPERIENCE';
};

const activityImage = (thing: ThingToDo) =>
  getEditorialMedia(thing.id)?.[0]
  ?? thing.media.card?.image
  ?? thing.media.fieldCard?.gallery?.[0]
  ?? thing.media.research?.activityPhotoReserve?.[0];

export const fieldCardRelatedActivities = (city: City, currentThing: ThingToDo): FieldCardRelatedActivity[] =>
  getThings(city)
    .filter((thing) => thing.id !== currentThing.id)
    .map((thing) => ({
      id: thing.id,
      name: thing.name,
      path: thingPath(city, thing),
      eyebrow: activityEyebrow(thing),
      description: compactDescription(thing.shortDescription),
      duration: thing.spaCard?.duration,
      image: activityImage(thing),
    }));
