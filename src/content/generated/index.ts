import type { City, Place, ThingToDo } from '../../core/models/types';
import { city as city0, places as places0, things as things0 } from './laos/don-det';
import { city as city1, places as places1, things as things1 } from './laos/thakhek';
export const generatedCities: City[] = [city0, city1];
export const generatedPlaces: Place[] = [...places0, ...places1];
export const generatedThings: ThingToDo[] = [...things0, ...things1];
