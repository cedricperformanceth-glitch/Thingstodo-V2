import type { City, Place, ThingToDo } from '../../core/models/types';

// The create-city command adds generated city modules here. Public rendering only
// reads versioned data; it never performs research or calls third-party services.
export const generatedCities: City[] = [];
export const generatedPlaces: Place[] = [];
export const generatedThings: ThingToDo[] = [];
