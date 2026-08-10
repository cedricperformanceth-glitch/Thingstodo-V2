import type { AtlasEntity } from '../../core/models/types';
export interface TripStore { addToTrip(entity:AtlasEntity):void; removeFromTrip(id:string):void; }
export const tripStore: TripStore = { addToTrip:() => undefined, removeFromTrip:() => undefined };
export const addToTrip = (entity: AtlasEntity) => tripStore.addToTrip(entity);
export const removeFromTrip = (id: string) => tripStore.removeFromTrip(id);
