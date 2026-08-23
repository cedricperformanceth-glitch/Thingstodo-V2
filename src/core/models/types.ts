export type CityProfile = 'compact' | 'standard' | 'large';
export type SettlementType = 'village' | 'city';
export type LocationScope = 'point' | 'area';
export type SourceType = 'manual' | 'wikimedia' | 'public-domain' | 'first-party-official';
export type CategorySlug = 'restaurants' | 'cafes' | 'accommodation' | 'scooter-rental' | 'gyms' | 'markets' | 'practical-services' | 'things-to-do';

export interface Coordinates { latitude: number; longitude: number; }
export interface SeoMetadata { title: string; description: string; canonicalPath: string; indexable: boolean; image?: string; imageAlt?: string; }
export interface MediaRecord { id: string; src: string; alt: string; sourceType: SourceType; sourceUrl?: string; sourceName?: string; author?: string; license?: string; manual: boolean; locked: boolean; }
export interface ActivityPhotoReserveEntry extends MediaRecord { width: number; height: number; subjectConfidence: number; sourceConfidence: number; }
export interface MediaResearch { activityPhotoReserve?: ActivityPhotoReserveEntry[]; }
export interface CountryMediaManifest { hero: { stamps: MediaRecord[]; drawings: MediaRecord[]; photos: MediaRecord[] }; card?: { image?: MediaRecord }; fieldCard?: { gallery: MediaRecord[] }; }
export interface EntityMediaManifest { card?: { image?: MediaRecord }; fieldCard?: { gallery: MediaRecord[] }; research?: MediaResearch; }
export interface HeroFact { label: string; value: string; }
export interface FieldCardHeroContent { eyebrow: string; aliases: string[]; description: string; steps: string[]; rhythmNote: string; photoNote: string; }
export interface FieldCardQuickReadItem { primary: string; secondary: string; }
export interface FieldCardQuickReadContent { time: FieldCardQuickReadItem; route: FieldCardQuickReadItem; budget: FieldCardQuickReadItem; bestFor: FieldCardQuickReadItem; }
export interface FieldCardPracticalItem { label: string; value: string; detail?: string; }
export interface FieldCardPracticalContent { items: FieldCardPracticalItem[]; }
export interface FieldCardSection { title: string; body: string; }
export interface FieldCardStoryNote { label: string; text: string; }
export interface FieldCardPrimaryStoryChapter { label?: string; title: string; body: string; }
export interface FieldCardPrimaryStoryContent { chapters: FieldCardPrimaryStoryChapter[]; note: FieldCardStoryNote; }
export interface FieldCardSecondaryStoryChapter { label: string; title: string; body: string; }
export interface FieldCardBeforeYouLeaveContent { title: string; body: string; note: FieldCardStoryNote; }
export interface FieldCardSecondaryStoryContent { chapters: FieldCardSecondaryStoryChapter[]; beforeYouLeave: FieldCardBeforeYouLeaveContent; }
export interface FieldCardContent { template: 'compact' | 'deep'; hero?: FieldCardHeroContent; quickRead?: FieldCardQuickReadContent; practicalNotes?: FieldCardPracticalContent; primaryStory?: FieldCardPrimaryStoryContent; secondaryStory?: FieldCardSecondaryStoryContent; whyGo: string; practical: string; access: string; notes?: string; faq: Array<{ question: string; answer: string }>; sections?: FieldCardSection[]; }
// Exact SPA tag cardinality is enforced by the generation and publication contracts.
// Generated JSON is inferred as string[], so the model keeps the serializable shape here.
export interface SpaCardContent { handwrittenTags: string[]; openingHours?: string; photoStatus?: 'verified' | 'missing'; photoRequiresManualFill?: boolean; }
export interface ThingToDoSpaCardContent extends SpaCardContent { gettingThere: string; duration: string; costType: 'free' | 'paid'; bestTime: string; }
export interface VerificationMetadata { decision: 'accept' | 'manual-review' | 'reject-closed'; reason: string; }
export interface ManualField<T> { value: T; source: 'manual' | 'generated'; locked: boolean; }
export interface ManualLocks { [field: string]: ManualField<unknown> | undefined; }
export interface Country { id: string; slug: string; name: string; chapter: string; accentColor: string; media: CountryMediaManifest; map: { center: Coordinates; zoom: number }; seo: SeoMetadata; }
export interface ExploreBoardConfig { featuredThingIds: string[]; }
export interface ExploreBoardCardContent { kicker: string; duration: string; route: string; }
export interface CityHero { eyebrow: string; title: string; subtitle: string; facts: HeroFact[]; }
export interface City { id: string; slug: string; name: string; country: string; profile: CityProfile; settlementType: SettlementType; coordinates: Coordinates; description: string; categories: CategorySlug[]; hero: CityHero; exploreBoard: ExploreBoardConfig; manualLocks: ManualLocks; seo: SeoMetadata; }
export interface SourceMetadata { sourceName: string; sourceUrl?: string; }
export interface ResearchSource extends SourceMetadata { purpose: 'candidate-discovery' | 'facts' | 'location' | 'media' | 'first-party'; sourceType?: SourceType; }
export interface BaseEntity { id: string; slug: string; name: string; country: string; city: string; category: CategorySlug; coordinates: Coordinates; locationScope?: LocationScope; shortDescription: string; media: EntityMediaManifest; spaCard?: SpaCardContent; verification?: VerificationMetadata; sourceMetadata: SourceMetadata; manualLocks: ManualLocks; }
export interface Place extends BaseEntity { address: string; googleMapsUrl: string; image?: MediaRecord; spaCard?: SpaCardContent; }
export interface ThingToDo extends BaseEntity { googleMapsUrl: string; isLandmark: boolean; longDescription: string; breadcrumbs: string[]; spaCard?: ThingToDoSpaCardContent; fieldCard: FieldCardContent; exploreBoard?: ExploreBoardCardContent; }
export type AtlasEntity = Place | ThingToDo;
