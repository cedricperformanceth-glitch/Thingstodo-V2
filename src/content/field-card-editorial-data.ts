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
import { applyDonDetMediaCorrections } from './field-card-media-don-det-overrides';
import { applyTadLoActivityMediaCorrections } from './field-card-media-tad-lo-overrides';
import { applyThakhekMediaCorrections } from './field-card-media-thakhek-overrides';
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
import mekongSlowBoatEditorial from './field-card-editorial-luang-prabang/thing-mekong-slow-boat-huay-xai-luang-prabang.json';
import namXayViewpointEditorial from './field-card-editorial-vang-vieng/thing-nam-xay-viewpoint.json';
import thamKhanCaveEditorial from './field-card-editorial-vang-vieng/thing-tham-khan-cave.json';
import thamPhuKhamBlueLagoonEditorial from './field-card-editorial-vang-vieng/thing-tham-phu-kham-and-blue-lagoon-1.json';
import thamChangCaveEditorial from './field-card-editorial-vang-vieng/thing-tham-chang-cave.json';
import thamNamWaterCaveEditorial from './field-card-editorial-vang-vieng/thing-tham-nam-water-cave.json';
import thamSangElephantCaveEditorial from './field-card-editorial-vang-vieng/thing-tham-sang-elephant-cave.json';
import phaNgernViewpointEditorial from './field-card-editorial-vang-vieng/thing-pha-ngern-viewpoint.json';
import blueLagoon3Editorial from './field-card-editorial-vang-vieng/thing-blue-lagoon-3.json';
import blueLagoon4Editorial from './field-card-editorial-vang-vieng/thing-blue-lagoon-4.json';
import namSongKayakingEditorial from './field-card-editorial-vang-vieng/thing-nam-song-river-kayaking.json';
import namSongTubingEditorial from './field-card-editorial-vang-vieng/thing-nam-song-river-tubing.json';
import vangViengCyclingEditorial from './field-card-editorial-vang-vieng/thing-vang-vieng-karst-cycling-loop.json';
import watKangEditorial from './field-card-editorial-vang-vieng/thing-wat-kang.json';
import vangViengMorningMarketEditorial from './field-card-editorial-vang-vieng/thing-vang-vieng-morning-market.json';
import phaTangMountainEditorial from './field-card-editorial-vang-vieng/thing-pha-tang-mountain.json';
import phaThatLuangEditorial from './field-card-editorial-vientiane/thing-pha-that-luang.json';
import patuxaiMonumentEditorial from './field-card-editorial-vientiane/thing-patuxai-monument.json';
import watSiSaketEditorial from './field-card-editorial-vientiane/thing-wat-si-saket.json';
import hawPhraKaewEditorial from './field-card-editorial-vientiane/thing-haw-phra-kaew.json';
import copeVisitorCentreEditorial from './field-card-editorial-vientiane/thing-cope-visitor-centre.json';
import buddhaParkEditorial from './field-card-editorial-vientiane/thing-buddha-park.json';
import watSiMuangEditorial from './field-card-editorial-vientiane/thing-wat-si-muang.json';
import talatSaoMorningMarketEditorial from './field-card-editorial-vientiane/thing-talat-sao-morning-market.json';
import chaoAnouvongParkEditorial from './field-card-editorial-vientiane/thing-chao-anouvong-park.json';
import mekongRiversideWalkEditorial from './field-card-editorial-vientiane/thing-mekong-riverside-walk.json';
import luangPrabangMediaData from './field-card-media-luang-prabang.json';
import vangViengMediaData from './field-card-media-vang-vieng.json';
import vientianeMediaData from './field-card-media-vientiane.json';

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

const sharedEditorialRaw = editorialData as unknown as Record<string, FieldCardEditorialEntry>;
const sharedEditorial = Object.fromEntries(
  Object.entries(sharedEditorialRaw).map(([id, entry]) => {
    const thakhekMedia = applyThakhekMediaCorrections(entry.media, id);
    const donDetMedia = applyDonDetMediaCorrections(thakhekMedia, id);
    const media = applyTadLoActivityMediaCorrections(donDetMedia, id, entry.sources);
    return [id, media === entry.media ? entry : { ...entry, media }];
  }),
) as Record<string, FieldCardEditorialEntry>;
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
  ...mekongSlowBoatEditorial,
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
const vangViengBase = {
  ...namXayViewpointEditorial,
  ...thamKhanCaveEditorial,
  ...thamPhuKhamBlueLagoonEditorial,
  ...thamChangCaveEditorial,
  ...thamNamWaterCaveEditorial,
  ...thamSangElephantCaveEditorial,
  ...phaNgernViewpointEditorial,
  ...blueLagoon3Editorial,
  ...blueLagoon4Editorial,
  ...namSongKayakingEditorial,
  ...namSongTubingEditorial,
  ...vangViengCyclingEditorial,
  ...watKangEditorial,
  ...vangViengMorningMarketEditorial,
  ...phaTangMountainEditorial,
} as unknown as Record<string, FieldCardEditorialEntry>;
const vangViengMedia = vangViengMediaData as unknown as Record<string, MediaRecord[]>;
const vangViengEditorial = Object.fromEntries(
  Object.entries(vangViengBase).map(([id, entry]) => {
    const media = vangViengMedia[id];
    return [id, {
      ...entry,
      ...(media?.length ? { media, seo: { ...entry.seo, image: media[0].src } } : {}),
    }];
  }),
) as Record<string, FieldCardEditorialEntry>;
const vientianeBase = {
  ...phaThatLuangEditorial,
  ...patuxaiMonumentEditorial,
  ...watSiSaketEditorial,
  ...hawPhraKaewEditorial,
  ...copeVisitorCentreEditorial,
  ...buddhaParkEditorial,
  ...watSiMuangEditorial,
  ...talatSaoMorningMarketEditorial,
  ...chaoAnouvongParkEditorial,
  ...mekongRiversideWalkEditorial,
} as unknown as Record<string, FieldCardEditorialEntry>;
const vientianeMedia = vientianeMediaData as unknown as Record<string, MediaRecord[]>;
const vientianeEditorial = Object.fromEntries(
  Object.entries(vientianeBase).map(([id, entry]) => {
    const media = vientianeMedia[id];
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
  ...vangViengEditorial,
  ...vientianeEditorial,
};