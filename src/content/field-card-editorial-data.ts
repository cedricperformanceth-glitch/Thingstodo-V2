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
import editorialData from './field-card-editorial.json';

export type FieldCardFaqItem = ThingToDo['fieldCard']['faq'][number];
export type FieldCardSeoOverride = Pick<SeoMetadata, 'title' | 'description'> & { image?: string };
export type EditorialSpaCard = ThingToDoSpaCardContent & { description?: string };
export interface FieldCardEditorialEntry {
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
  spaBestTime?: string;
  spaDescription?: string;
  spaGettingThere?: string;
  displayName?: string;
  practicalItemLabels?: string[];
}

export const fieldCardEditorial = editorialData as unknown as Record<string, FieldCardEditorialEntry>;
