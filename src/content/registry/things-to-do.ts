import { generatedThings } from '../generated';
import thingCategoryOverrides from '../thing-category-overrides.json';
import { thingRuntimeOverrides } from '../thing-runtime-overrides';
import type { ThingToDo } from '../../core/models/types';

const categoryOverrides = thingCategoryOverrides as Record<string, ThingToDo['category']>;

export const things: ThingToDo[] = generatedThings.map((thing) => {
  const runtimeOverride = thingRuntimeOverrides[thing.id];
  return {
    ...thing,
    ...runtimeOverride,
    category: categoryOverrides[thing.id] ?? thing.category,
  };
});
