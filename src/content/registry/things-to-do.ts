import { generatedThings } from '../generated';
import thingStatusOverrides from '../thing-status-overrides.json';
import type { ThingToDo } from '../../core/models/types';

const isActiveThing = (thing: ThingToDo) => thingStatusOverrides[thing.id as keyof typeof thingStatusOverrides] !== 'removed';

export const things: ThingToDo[] = generatedThings.filter(isActiveThing);
