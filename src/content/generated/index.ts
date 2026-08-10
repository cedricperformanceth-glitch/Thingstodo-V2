import type { City, Place, ThingToDo } from '../../core/models/types';
import { donDet } from '../cities/don-det';
import { donDetPlaces } from '../places/don-det';
import { donDetThings } from '../things-to-do/don-det';

export const generatedCities: City[] = [donDet];
export const generatedPlaces: Place[] = [...donDetPlaces];
export const generatedThings: ThingToDo[] = [...donDetThings];
