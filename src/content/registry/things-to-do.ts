import { generatedThings } from '../generated';
import thingCategoryOverrides from '../thing-category-overrides.json';
import type { ThingToDo } from '../../core/models/types';

const categoryOverrides = thingCategoryOverrides as Record<string, ThingToDo['category']>;

export const things: ThingToDo[] = generatedThings.map((thing) => ({
  ...thing,
  category: categoryOverrides[thing.id] ?? thing.category,
}));
