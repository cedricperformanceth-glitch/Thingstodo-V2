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
import vatPhouEditorial from './field-card-editorial-pakse/thing-vat-phou.json';
import tadFaneEditorial from './field-card-editorial-pakse/thing-tad-fane.json';
import tadYuangEditorial from './field-card-editorial-pakse/thing-tad-yuang.json';
import bolavenCoffeeRouteEditorial from './field-card-editorial-pakse/thing-bolaven-coffee-route.json';
import watPhouSalaoEditorial from './field-card-editorial-pakse/thing-wat-phou-salao.json';
import watLuangEditorial from './field-card-editorial-pakse/thing-wat-luang.json';
import daoHeuangMarketEditorial from './field-card-editorial-pakse/thing-dao-heuang-market.json';
import tadChampeeEditorial from './field-card-editorial-pakse/thing-tad-champee.json';
import champasakRiversideEditorial from './field-card-editorial-pakse/thing-champasak-riverside.json';
import luangPrabangEditorialData from './field-card-editorial-luang-prabang.json';
import luangPrabangMediaData from './field-card-media-luang-prabang.json';

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

const sharedEditorial = editorialData as unknown as Record<string, FieldCardEditorialEntry>;
const pakseEditorial = {
  ...vatPhouEditorial,
  ...tadFaneEditorial,
  ...tadYuangEditorial,
  ...bolavenCoffeeRouteEditorial,
  ...watPhouSalaoEditorial,
  ...watLuangEditorial,
  ...daoHeuangMarketEditorial,
  ...tadChampeeEditorial,
  ...champasakRiversideEditorial,
} as unknown as Record<string, FieldCardEditorialEntry>;
const luangPrabangBase = luangPrabangEditorialData as unknown as Record<string, FieldCardEditorialEntry>;
const luangPrabangMedia = luangPrabangMediaData as unknown as Record<string, MediaRecord[]>;
const luangPrabangEditorial = Object.fromEntries(
  Object.entries(luangPrabangBase).map(([id, entry]) => {
    const media = luangPrabangMedia[id];
    return [id, {
      ...entry,
      ...(media?.length ? { media, seo: { ...entry.seo, image: media[0].src } } : {}),
    }];
  }),
) as Record<string, FieldCardEditorialEntry>;

export const fieldCardEditorial: Record<string, FieldCardEditorialEntry> = {
  ...sharedEditorial,
  ...pakseEditorial,
  ...luangPrabangEditorial,
};
