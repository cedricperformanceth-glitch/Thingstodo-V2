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
} from '../../core/models/types';
import compactAdditionsData from '../../content/field-card-compact-additions.json';
import compactData from '../../content/field-card-compact-copy.json';
import faqData from '../../content/field-card-faq-copy.json';
import heroData from '../../content/field-card-hero-copy.json';
import mediaData from '../../content/field-card-media-copy.json';
import practicalData from '../../content/field-card-practical-copy.json';
import primaryStoryData from '../../content/field-card-primary-story-copy.json';
import quickReadData from '../../content/field-card-quick-read-copy.json';
import secondaryStoryData from '../../content/field-card-secondary-story-copy.json';
import seoData from '../../content/field-card-seo-copy.json';
import sourceData from '../../content/field-card-source-copy.json';
import spaData from '../../content/spa-thing-card-copy.json';

type FieldCardFaqItem = ThingToDo['fieldCard']['faq'][number];
export type FieldCardSeoOverride = Pick<SeoMetadata, 'title' | 'description'> & { image?: string };
export type EditorialSpaCard = ThingToDoSpaCardContent & { description?: string };
type CompactFieldCardEditorial = {
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

const compact = {
  ...(compactData as unknown as Record<string, CompactFieldCardEditorial>),
  ...(compactAdditionsData as unknown as Record<string, CompactFieldCardEditorial>),
};
const faq = faqData as Record<string, FieldCardFaqItem[]>;
const hero = heroData as Record<string, FieldCardHeroContent>;
const media = mediaData as Record<string, MediaRecord[]>;
const practical = practicalData as Record<string, FieldCardPracticalContent>;
const primaryStory = primaryStoryData as Record<string, FieldCardPrimaryStoryContent>;
const quickRead = quickReadData as Record<string, FieldCardQuickReadContent>;
const secondaryStory = secondaryStoryData as Record<string, FieldCardSecondaryStoryContent | null>;
const seo = seoData as Record<string, FieldCardSeoOverride>;
const sources = sourceData as unknown as Record<string, ResearchSource[]>;
const spa = spaData as Record<string, EditorialSpaCard>;

export const getEditorialFaq = (id: string) => compact[id]?.faq ?? faq[id];
export const getEditorialHero = (id: string) => compact[id]?.hero ?? hero[id];
export const getEditorialMedia = (id: string) => compact[id]?.media ?? media[id];
export const getEditorialPractical = (id: string) => compact[id]?.practical ?? practical[id];
export const getEditorialPrimaryStory = (id: string) => compact[id]?.primaryStory ?? primaryStory[id];
export const getEditorialQuickRead = (id: string) => compact[id]?.quickRead ?? quickRead[id];
export const getEditorialSeo = (id: string) => compact[id]?.seo ?? seo[id];
export const getEditorialSources = (id: string) => compact[id]?.sources ?? sources[id];
export const getEditorialSpa = (id: string) => compact[id]?.spa ?? spa[id];

export const getEditorialSecondaryStory = (id: string) => {
  const compactEntry = compact[id];
  if (compactEntry && Object.prototype.hasOwnProperty.call(compactEntry, 'secondaryStory')) {
    return { hasOverride: true, value: compactEntry.secondaryStory };
  }
  return {
    hasOverride: Object.prototype.hasOwnProperty.call(secondaryStory, id),
    value: secondaryStory[id],
  };
};
