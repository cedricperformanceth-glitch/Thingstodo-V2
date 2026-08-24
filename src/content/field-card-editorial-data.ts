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
import luangPrabangHeritageWalkEditorial from './field-card-editorial-luang-prabang/thing-luang-prabang-heritage-walk.json';
import watXiengThongEditorial from './field-card-editorial-luang-prabang/thing-wat-xieng-thong.json';
import phouSiMountainEditorial from './field-card-editorial-luang-prabang/thing-phou-si-mountain.json';
import royalPalaceMuseumEditorial from './field-card-editorial-luang-prabang/thing-royal-palace-museum.json';
import takBatAlmsEditorial from './field-card-editorial-luang-prabang/thing-tak-bat-alms.json';
import kuangSiWaterfallsEditorial from './field-card-editorial-luang-prabang/thing-kuang-si-waterfalls.json';
import pakOuCavesEditorial from './field-card-editorial-luang-prabang/thing-pak-ou-caves.json';
import watVisounEditorial from './field-card-editorial-luang-prabang/thing-wat-visoun.json';
import uxoLaoVisitorCentreEditorial from './field-card-editorial-luang-prabang/thing-uxo-lao-visitor-centre.json';
import traditionalArtsEthnologyCentreEditorial from './field-card-editorial-luang-prabang/thing-traditional-arts-ethnology-centre.json';
import ockPopTokLivingCraftsCentreEditorial from './field-card-editorial-luang-prabang/thing-ock-pop-tok-living-crafts-centre.json';
import banXangKhongWeavingVillageEditorial from './field-card-editorial-luang-prabang/thing-ban-xang-khong-weaving-village.json';
import luangPrabangMediaData from './field-card-media-luang-prabang.json';
import vangViengMediaData from './field-card-media-vang-vieng.json';

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
const luangPrabangBase = {
  ...luangPrabangHeritageWalkEditorial,
  ...watXiengThongEditorial,
  ...phouSiMountainEditorial,
  ...royalPalaceMuseumEditorial,
  ...takBatAlmsEditorial,
  ...kuangSiWaterfallsEditorial,
  ...pakOuCavesEditorial,
  ...watVisounEditorial,
  ...uxoLaoVisitorCentreEditorial,
  ...traditionalArtsEthnologyCentreEditorial,
  ...ockPopTokLivingCraftsCentreEditorial,
  ...banXangKhongWeavingVillageEditorial,
} as unknown as Record<string, FieldCardEditorialEntry>;
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
const vangViengMedia = vangViengMediaData as unknown as Record<string, MediaRecord[]>;
const vangViengEditorial = Object.fromEntries(
  Object.entries(vangViengMedia).map(([id, media]) => [id, { media }]),
) as Record<string, FieldCardEditorialEntry>;

export const fieldCardEditorial: Record<string, FieldCardEditorialEntry> = {
  ...sharedEditorial,
  ...pakseEditorial,
  ...luangPrabangEditorial,
  ...vangViengEditorial,
};
