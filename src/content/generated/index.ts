import type { City, Place, ThingToDo } from '../../core/models/types';
import { city as city0, places as places0, things as things0 } from './laos/don-det';
import { city as city1, places as places1, things as things1 } from './laos/tad-lo';
import { city as city2, places as places2, things as things2 } from './laos/thakhek';
export const generatedCities: City[] = [city0, city1, city2];
export const generatedPlaces: Place[] = [...places0, ...places1, ...places2];
export const generatedThings: ThingToDo[] = [...things0, ...things1, ...things2];
