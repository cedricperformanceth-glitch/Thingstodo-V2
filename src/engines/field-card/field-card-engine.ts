import type { ThingToDo } from '../../core/models/types';
import { editorialAdSlots } from '../../core/ads/slots';
export const fieldCardView = (thing: ThingToDo) => ({ thing, relatedLabel: thing.isLandmark ? 'Landmark' : 'Experience', template: thing.fieldCard.template, adSlots: editorialAdSlots.slice(0, thing.fieldCard.template === 'deep' ? 4 : 2) });
