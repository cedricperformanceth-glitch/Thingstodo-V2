import type { ThingToDo } from '../core/models/types';

type ThingRuntimeOverride = Partial<Pick<
  ThingToDo,
  'name' | 'coordinates' | 'locationScope' | 'googleMapsUrl'
>>;

/** Targeted manual corrections that must stay stable across generated city refreshes. */
export const thingRuntimeOverrides: Readonly<Record<string, ThingRuntimeOverride>> = {
  'thing-sikhottabong-stupa': {
    coordinates: { latitude: 17.34939, longitude: 104.80709 },
    locationScope: 'point',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=17.34939,104.80709',
  },
  'thing-thalang-nam-theun-reservoir': {
    name: 'Thalang & Nam Theun 2 Reservoir',
  },
};
