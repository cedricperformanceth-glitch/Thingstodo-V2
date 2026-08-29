import type { MediaRecord, ResearchSource } from '../core/models/types';
import { applyDonDetCityFieldNoteMediaCorrections, applyDonDetMediaCorrections } from './field-card-media-don-det-overrides';
import { applyLuangPrabangActivityMediaCorrections, applyLuangPrabangCityFieldNoteMediaCorrections } from './field-card-media-luang-prabang-overrides';
import { applyConfirmedOwnerActivityMedia } from './field-card-media-owner-confirmations';
import { applyPakseActivityMediaCorrections, applyPakseCityFieldNoteMediaCorrections } from './field-card-media-pakse-overrides';
import { applyTadLoActivityMediaCorrections, applyTadLoCityFieldNoteMediaCorrections } from './field-card-media-tad-lo-overrides';
import { applyThakhekApprovedCommonsReplacements } from './field-card-media-thakhek-replacements';
import { applyThakhekCityFieldNoteMediaCorrections, applyThakhekMediaCorrections } from './field-card-media-thakhek-overrides';
import { applyVangViengActivityMediaCorrections, applyVangViengCityFieldNoteMediaCorrections } from './field-card-media-vang-vieng-overrides';
import { applyVientianeActivityMediaCorrections, applyVientianeCityFieldNoteMediaCorrections } from './field-card-media-vientiane-overrides';
import { applyCanonicalActivityDepictionPolicy, applyCanonicalCityFieldDepictionPolicy } from './field-card-media-depiction-policy';
import { normalizeMediaRightsRecord } from './field-card-media-rights';

const TAD_LO_ACTIVITY_IDS = new Set([
  'thing-tad-hang-waterfall',
  'thing-tad-lo-waterfall',
  'thing-tad-soung-waterfall',
  'thing-katu-weaving-workshop',
  'thing-lao-cooking-class-with-nyay',
  'thing-tad-lo-treasure-hunt',
  'thing-fandee-adventure-park',
  'thing-coffee-and-katu-culture-with-mr-hook',
  'thing-coffee-from-tree-to-cup-with-mr-vieng',
  'thing-vat-paa-forest-buddha-and-mystery-cave',
  'thing-tad-lo-half-day-guided-trek',
  'thing-tad-lo-two-day-village-trek',
  'thing-traditional-lao-massage-in-tad-lo',
  'thing-tad-lo-riverside-village-walk',
]);

const normalizeRights = (
  media: MediaRecord[] | undefined,
  entityId: string,
  usage: string,
): MediaRecord[] | undefined => media?.map((record) => normalizeMediaRightsRecord(record, entityId, usage));

export const applyCanonicalActivityMediaPolicy = (
  media?: MediaRecord[],
  entityId?: string,
  sources?: ResearchSource[],
): MediaRecord[] | undefined => {
  if (!media?.length || !entityId) return media;

  let corrected = media;
  corrected = applyThakhekApprovedCommonsReplacements(corrected, entityId) ?? corrected;
  corrected = applyThakhekMediaCorrections(corrected, entityId) ?? corrected;
  corrected = applyDonDetMediaCorrections(corrected, entityId) ?? corrected;
  corrected = applyTadLoActivityMediaCorrections(corrected, entityId, sources) ?? corrected;
  corrected = applyPakseActivityMediaCorrections(corrected, entityId) ?? corrected;
  corrected = applyLuangPrabangActivityMediaCorrections(corrected, entityId) ?? corrected;
  corrected = applyVangViengActivityMediaCorrections(corrected, entityId) ?? corrected;
  corrected = applyVientianeActivityMediaCorrections(corrected, entityId) ?? corrected;

  const handledByCityPolicy = corrected !== media || TAD_LO_ACTIVITY_IDS.has(entityId);
  if (!handledByCityPolicy) return media;

  corrected = normalizeRights(corrected, entityId, 'monetized-activity-page') ?? corrected;
  corrected = applyCanonicalActivityDepictionPolicy(corrected, entityId) ?? corrected;
  corrected = applyConfirmedOwnerActivityMedia(corrected, entityId) ?? corrected;
  return corrected;
};

export const applyCanonicalCityFieldMediaPolicy = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || !entityId) return media;

  let corrected: MediaRecord[] | undefined;
  switch (entityId) {
    case 'city-don-det':
      corrected = applyDonDetCityFieldNoteMediaCorrections(media, entityId);
      break;
    case 'city-tad-lo':
      corrected = applyTadLoCityFieldNoteMediaCorrections(media, entityId);
      break;
    case 'city-laos-pakse':
      corrected = applyPakseCityFieldNoteMediaCorrections(media, entityId);
      break;
    case 'city-laos-thakhek':
      corrected = applyThakhekCityFieldNoteMediaCorrections(media, entityId);
      break;
    case 'city-laos-luang-prabang':
      corrected = applyLuangPrabangCityFieldNoteMediaCorrections(media, entityId);
      break;
    case 'city-laos-vang-vieng':
      corrected = applyVangViengCityFieldNoteMediaCorrections(media, entityId);
      break;
    case 'city-laos-vientiane':
      corrected = applyVientianeCityFieldNoteMediaCorrections(media, entityId);
      break;
    default:
      return media;
  }

  corrected = normalizeRights(corrected ?? media, entityId, 'monetized-city-field-note') ?? corrected ?? media;
  corrected = applyCanonicalCityFieldDepictionPolicy(corrected, entityId) ?? corrected;
  return corrected;
};
