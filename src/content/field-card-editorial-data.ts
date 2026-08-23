import type {
  FieldCardHeroContent,
  FieldCardPracticalContent,
  FieldCardPrimaryStoryContent,
  FieldCardQuickReadContent,
  FieldCardSecondaryStoryContent,
  MediaRecord,
  ResearchSource,
  SeoMetadata,
  ThingToDo,
  ThingToDoSpaCardContent,
} from '../core/models/types';
import compactAdditionsData from './field-card-compact-additions.json';
import compactData from './field-card-compact-copy.json';
import editorialOverridesData from './field-card-editorial-overrides.json';
import thakhekEditorialData from './field-card-editorial-thakhek.json';
import thakhekEditorialAdditionsData from './field-card-editorial-thakhek-additions.json';
import hinNamNoEditorialData from './field-card-editorial-hin-nam-no.json';
import faqData from './field-card-faq-copy.json';
import heroData from './field-card-hero-copy.json';
import mediaAdditionsData from './field-card-media-additions.json';
import mediaData from './field-card-media-copy.json';
import practicalData from './field-card-practical-copy.json';
import primaryStoryData from './field-card-primary-story-copy.json';
import quickReadData from './field-card-quick-read-copy.json';
import secondaryStoryData from './field-card-secondary-story-copy.json';
import seoData from './field-card-seo-copy.json';
import sourceData from './field-card-source-copy.json';
import spaBestTimeData from './spa-thing-card-best-time-copy.json';
import spaDescriptionData from './spa-thing-card-description-copy.json';
import spaGettingThereData from './spa-thing-card-getting-there-copy.json';
import spaData from './spa-thing-card-copy.json';
import thingDisplayNameData from './thing-display-name-copy.json';

export type FieldCardFaqItem = ThingToDo['fieldCard']['faq'][number];
export type FieldCardSeoOverride = Pick<SeoMetadata, 'title' | 'description'> & { image?: string };
export type EditorialSpaCard = ThingToDoSpaCardContent & { description?: string };
export type CompactFieldCardEditorial = {
  faq?: FieldCardFaqItem[];
  hero?: FieldCardHeroContent;
  media?: MediaRecord[];
  practical?: FieldCardPracticalContent;
  primaryStory?: FieldCardPrimaryStoryContent;
  quickRead?: FieldCardQuickReadContent;
  secondaryStory?: FieldCardSecondaryStoryContent | null;
  seo?: FieldCardSeoOverride;
  sources?: ResearchSource[];
  spa?: EditorialSpaCard;
};

export const compact = {
  ...(compactData as unknown as Record<string, CompactFieldCardEditorial>),
  ...(compactAdditionsData as unknown as Record<string, CompactFieldCardEditorial>),
  ...(editorialOverridesData as unknown as Record<string, CompactFieldCardEditorial>),
  ...(thakhekEditorialData as unknown as Record<string, CompactFieldCardEditorial>),
  ...(thakhekEditorialAdditionsData as unknown as Record<string, CompactFieldCardEditorial>),
  ...(hinNamNoEditorialData as unknown as Record<string, CompactFieldCardEditorial>),
};

export const faq = faqData as Record<string, FieldCardFaqItem[]>;
export const hero = heroData as Record<string, FieldCardHeroContent>;
export const mediaAdditions = mediaAdditionsData as Record<string, MediaRecord[]>;
export const media = mediaData as Record<string, MediaRecord[]>;
export const practical = practicalData as Record<string, FieldCardPracticalContent>;
export const primaryStory = primaryStoryData as Record<string, FieldCardPrimaryStoryContent>;
export const quickRead = quickReadData as Record<string, FieldCardQuickReadContent>;
export const secondaryStory = secondaryStoryData as Record<string, FieldCardSecondaryStoryContent | null>;
export const seo = seoData as Record<string, FieldCardSeoOverride>;
export const sources = sourceData as unknown as Record<string, ResearchSource[]>;
export const spaBestTime = spaBestTimeData as Record<string, string>;
export const spaDescription = spaDescriptionData as Record<string, string>;
export const spaGettingThere = spaGettingThereData as Record<string, string>;
export const spa = spaData as Record<string, EditorialSpaCard>;
export const thingDisplayName = thingDisplayNameData as Record<string, string>;
