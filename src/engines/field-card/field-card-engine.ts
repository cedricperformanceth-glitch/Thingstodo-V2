import type { ThingToDo } from '../../core/models/types';
export const fieldCardView = (thing: ThingToDo) => ({ thing, relatedLabel: thing.isLandmark ? 'Landmark' : 'Experience' });
