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
import editorialOverridesData from '../../content/field-card-editorial-overrides.json';
import thakhekEditorialData from '../../content/field-card-editorial-thakhek.json';
import thakhekEditorialAdditionsData from '../../content/field-card-editorial-thakhek-additions.json';
import hinNamNoEditorialData from '../../content/field-card-editorial-hin-nam-no.json';
import faqData from '../../content/field-card-faq-copy.json';
import heroData from '../../content/field-card-hero-copy.json';
import mediaAdditionsData from '../../content/field-card-media-additions.json';
import mediaData from '../../content/field-card-media-copy.json';
import practicalData from '../../content/field-card-practical-copy.json';
import primaryStoryData from '../../content/field-card-primary-story-copy.json';
import quickReadData from '../../content/field-card-quick-read-copy.json';
import secondaryStoryData from '../../content/field-card-secondary-story-copy.json';
import seoData from '../../content/field-card-seo-copy.json';
import sourceData from '../../content/field-card-source-copy.json';
import spaBestTimeData from '../../content/spa-thing-card-best-time-copy.json';
import spaDescriptionData from '../../content/spa-thing-card-description-copy.json';
import spaGettingThereData from '../../content/spa-thing-card-getting-there-copy.json';
import spaData from '../../content/spa-thing-card-copy.json';
import thingDisplayNameData from '../../content/thing-display-name-copy.json';

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
  ...(editorialOverridesData as unknown as Record<string, CompactFieldCardEditorial>),
  ...(thakhekEditorialData as unknown as Record<string, CompactFieldCardEditorial>),
  ...(thakhekEditorialAdditionsData as unknown as Record<string, CompactFieldCardEditorial>),
  ...(hinNamNoEditorialData as unknown as Record<string, CompactFieldCardEditorial>),
};
const faq = faqData as Record<string, FieldCardFaqItem[]>;
const hero = heroData as Record<string, FieldCardHeroContent>;
const mediaAdditions = mediaAdditionsData as Record<string, MediaRecord[]>;
const media = mediaData as Record<string, MediaRecord[]>;
const practical = practicalData as Record<string, FieldCardPracticalContent>;
const primaryStory = primaryStoryData as Record<string, FieldCardPrimaryStoryContent>;
const quickRead = quickReadData as Record<string, FieldCardQuickReadContent>;
const secondaryStory = secondaryStoryData as Record<string, FieldCardSecondaryStoryContent | null>;
const seo = seoData as Record<string, FieldCardSeoOverride>;
const sources = sourceData as unknown as Record<string, ResearchSource[]>;
const spaBestTime = spaBestTimeData as Record<string, string>;
const spaDescription = spaDescriptionData as Record<string, string>;
const spaGettingThere = spaGettingThereData as Record<string, string>;
const spa = spaData as Record<string, EditorialSpaCard>;
const thingDisplayName = thingDisplayNameData as Record<string, string>;

export const getEditorialFaq = (id: string) => compact[id]?.faq ?? faq[id];
export const getEditorialHero = (id: string) => compact[id]?.hero ?? hero[id];
export const getEditorialMedia = (id: string) => compact[id]?.media ?? mediaAdditions[id] ?? media[id];
export const getEditorialPractical = (id: string) => compact[id]?.practical ?? practical[id];
export const getEditorialPrimaryStory = (id: string) => compact[id]?.primaryStory ?? primaryStory[id];
export const getEditorialQuickRead = (id: string) => compact[id]?.quickRead ?? quickRead[id];
export const getEditorialSeo = (id: string) => compact[id]?.seo ?? seo[id];
export const getEditorialSources = (id: string) => compact[id]?.sources ?? sources[id];
export const getEditorialSpa = (id: string) => compact[id]?.spa ?? spa[id];
export const getEditorialSpaBestTime = (id: string) => spaBestTime[id];
export const getEditorialSpaDescription = (id: string) => spaDescription[id];
export const getEditorialSpaGettingThere = (id: string) => spaGettingThere[id];
export const getEditorialThingName = (id: string) => thingDisplayName[id];

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
