export type CityProfile = 'compact' | 'standard' | 'large';
export type SourceType = 'manual' | 'wikimedia' | 'public-domain' | 'open-license' | 'first-party-official';
export type CategorySlug = 'restaurants' | 'cafes' | 'accommodation' | 'scooter-rental' | 'gyms' | 'markets' | 'practical-services' | 'things-to-do';

export interface Coordinates { latitude: number; longitude: number; }
export interface SeoMetadata { title: string; description: string; canonicalPath: string; indexable: boolean; image?: string; }
export interface MediaRecord { id: string; src: string; alt: string; sourceType: SourceType; sourceUrl?: string; sourceName?: string; author?: string; license?: string; manual: boolean; locked: boolean; }
export interface MediaManifest { hero: { stamps: MediaRecord[]; drawings: MediaRecord[]; photos: MediaRecord[] }; card?: { image?: MediaRecord }; fieldCard?: { gallery: MediaRecord[] }; }
export interface ManualField<T> { value: T; source: 'manual' | 'generated'; locked: boolean; }
export interface ManualLocks { [field: string]: ManualField<unknown> | undefined; }
export interface Country { id: string; slug: string; name: string; chapter: string; cities: string[]; media: MediaManifest; map: { center: Coordinates; zoom: number }; seo: SeoMetadata; }
export interface ExploreBoardConfig { featuredThingIds: string[]; featuredPlaceIds: string[]; }
export interface CityHero { eyebrow: string; title: string; subtitle: string; media: MediaManifest['hero']; }
export interface City { id: string; slug: string; name: string; country: string; profile: CityProfile; coordinates: Coordinates; description: string; categories: CategorySlug[]; hero: CityHero; exploreBoard: ExploreBoardConfig; media: MediaManifest; seo: SeoMetadata; }
export interface SourceMetadata { sourceName: string; sourceUrl?: string; reviewedAt?: string; }
export interface BaseEntity { id: string; slug: string; name: string; country: string; city: string; category: CategorySlug; coordinates: Coordinates; shortDescription: string; media: MediaManifest; isMySelection: boolean; selectionRank?: number; sourceMetadata: SourceMetadata; manualLocks: ManualLocks; }
export interface Place extends BaseEntity { address: string; googleMapsUrl: string; image?: MediaRecord; }
export interface ThingToDo extends BaseEntity { googleMapsUrl?: string; isLandmark: boolean; longDescription: string; breadcrumbs: string[]; }
export type AtlasEntity = Place | ThingToDo;
