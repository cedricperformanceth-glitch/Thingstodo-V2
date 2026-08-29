import type { MediaRecord, Place } from '../core/models/types';

const VERIFIED_AT = '2026-08-29';

/**
 * Don Det SPA venue assets explicitly confirmed by the site owner as project-generated
 * editorial drawings. Keep this list asset-specific: do not infer generated provenance for
 * future local files merely because they live in the same directory.
 */
const DON_DET_GENERATED_EDITORIAL_DRAWING_IDS = new Set([
  // Restaurants
  'banana-restaurant-and-bar-card',
  'crazy-gecko-card',
  'datta-bananaleaf-restaurant-card',
  'hathim-indian-restaurant-card',
  'keas-backpackers-paradise-restaurant-and-bar-card',
  'mama-leuah-restaurant-card',
  'mama-piang-guesthouse-and-restaurant-card',
  'ois-place-card',
  'restaurant-naly-card',
  'sahai-bar-card',
  'the-4000-island-bar-card',
  'the-boathouse-card',
  'wrap-and-roll-card',

  // Cafes
  'allnew-coffee-and-restaurant-card',
  'dondet-coffee-house-and-gift-shop-card',
  'jimmee-restaurant-card',
  'kamphong-riverside-restaurant-card',
  'mama-tanon-guest-house-and-restaurant-card',
  'ms-ning-restaurant-and-guesthouse-card',
  'paradise-restaurant-cafe-and-bar-card',
  'street-view-restaurant-card',

  // Accommodation
  'baba-guesthouse-card',
  'boonmy-bungalows-and-restaurant-don-det-4000-islands-card',
  'dodand-studio-and-sunset-riverside-guesthouse-card',
  'don-det-hotel-card',
  'dondet-garden-guest-house-card',
  'dondet-vixay-sunset-and-river-view-card',
  'green-guesthouse-card',
  'moon-by-night-card',
  'namknong-view-card',
  'noupad-sunset-guesthouse-card',
  'rivergarden-guesthouse-card',
  'tawan-daeng-guesthouse-card',
  'thiptavanh-guesthouse-card',
  'yommalay-guesthouse-card',
]);

/**
 * Luang Prabang SPA assets explicitly confirmed by the site owner as AI-generated editorial
 * illustrations. The IDs are explicit so future venue uploads are never inferred as AI media.
 */
const LUANG_PRABANG_GENERATED_EDITORIAL_IDS = new Set([
  // Restaurants
  'media-luang-prabang-tamarind',
  'media-luang-prabang-khaiphaen',
  'media-luang-prabang-manda-de-laos',
  'media-luang-prabang-bouang-asian-eatery',
  'media-luang-prabang-popolo',
  'media-luang-prabang-bamboo-garden-restaurant',

  // Accommodation
  'media-luang-prabang-sa-sa-lao',
  'media-luang-prabang-my-dream-boutique-resort',
  'media-luang-prabang-maison-dalabua',
  'media-luang-prabang-cold-river-guesthouse',
  'media-luang-prabang-mad-monkey-luang-prabang',

  // Rental
  'media-luang-prabang-style-motorbikes-luang-prabang',
]);

/**
 * Tad Lo SPA assets explicitly confirmed by the site owner as project-generated editorial
 * illustrations. Several are intentionally reused by accommodation, restaurant and cafe cards
 * representing the same physical venue; the asset keeps one provenance wherever it is reused.
 */
const TAD_LO_GENERATED_EDITORIAL_IDS = new Set([
  'media-tad-lo-bolaven-garden',
  'media-tad-lo-samaki-guest-house',
  'media-tad-lo-tad-lo-lodge',
  'media-tad-lo-mama-pap-restaurant',
  'media-tad-lo-fandee-waterpark-restaurant',
]);

/**
 * Luang Prabang venue photographs whose use on Things To Do Atlas was explicitly confirmed by
 * the site owner as authorized by the venue owner. Permission is for publication/use; separate
 * modification or attribution conditions are not invented when they were not stated.
 */
const LUANG_PRABANG_OWNER_PERMISSION_IDS = new Set([
  'media-luang-prabang-lulalao-coffee',
  'media-luang-prabang-novelty-cafe',
  'media-luang-prabang-joma-bakery-cafe',
  'media-luang-prabang-le-banneton',
  'media-luang-prabang-sky-motorbike-for-rent',
]);

/**
 * Tad Lo venue media explicitly confirmed as authorized by the venue owner. The same Fandee
 * Island asset is reused by its restaurant and coffee SPA cards, so both inherit the same rights
 * provenance without claiming that the image is a personal site-owner photograph.
 */
const TAD_LO_OWNER_PERMISSION_IDS = new Set([
  'media-tad-lo-fandee-island-restaurant',
]);

/**
 * Personal Fandee Island photographs supplied by the site owner and subsequently AI-refined.
 * They remain user-owned photographs; AI refinement changes the depiction note, not ownership.
 */
const TAD_LO_PERSONAL_AI_REFINED_IDS = new Set([
  'media-tad-lo-fandee-island-1',
  'media-tad-lo-fandee-island-2',
  'media-tad-lo-fandee-island-3',
]);

/**
 * Visit Tad Lo partner media reused from the corresponding activities. Owner permission,
 * attribution and the Visit Tad Lo link are already part of the source evidence and are kept.
 */
const TAD_LO_VISIT_TAD_LO_PARTNER_IDS = new Set([
  'media-mr-hook-coffee-katu-visit-tad-lo',
  'media-mr-vieng-coffee-visit-tad-lo',
]);

const SAFFRON_COFFEE_COMMONS_ID = 'commons-69180651';

const classifyGeneratedEditorialDrawing = (record: MediaRecord, place: Place): MediaRecord => {
  const isDonDet = place.city === 'don-det' && DON_DET_GENERATED_EDITORIAL_DRAWING_IDS.has(record.id);
  const isLuangPrabang = place.city === 'luang-prabang' && LUANG_PRABANG_GENERATED_EDITORIAL_IDS.has(record.id);
  const isTadLo = place.city === 'tad-lo' && TAD_LO_GENERATED_EDITORIAL_IDS.has(record.id);
  if (!isDonDet && !isLuangPrabang && !isTadLo) return record;

  const destination = isDonDet ? 'Don Det' : isLuangPrabang ? 'Luang Prabang' : 'Tad Lo';
  return {
    ...record,
    sourceName: 'Things To Do Atlas · AI-generated editorial illustration',
    author: 'Things To Do Atlas',
    license: 'Project-generated AI editorial illustration',
    assetId: record.assetId ?? record.id,
    entityId: place.id,
    usage: 'spa-place-card',
    availabilityStatus: 'present',
    rightsSourceType: 'generated-editorial',
    rightsVerificationStatus: 'verified',
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
    attribution: undefined,
    verificationStatus: 'verified',
    verifiedAt: VERIFIED_AT,
    verificationMethod: 'site-owner-generated-editorial-confirmation',
    depictionType: 'illustrative',
    depictionSubject: place.name,
    subjectMatch: 'illustrative',
    depictionNote: `AI-generated editorial drawing representing ${place.name} in the ${destination} SPA. It is illustrative rather than documentary photography and does not claim to reproduce the venue's exact current appearance.`,
  };
};

const classifyOwnerAuthorizedVenuePhoto = (record: MediaRecord, place: Place): MediaRecord => {
  const isLuangPrabang = place.city === 'luang-prabang' && LUANG_PRABANG_OWNER_PERMISSION_IDS.has(record.id);
  const isTadLo = place.city === 'tad-lo' && TAD_LO_OWNER_PERMISSION_IDS.has(record.id);
  if (!isLuangPrabang && !isTadLo) return record;

  const destination = isLuangPrabang ? 'Luang Prabang' : 'Tad Lo';
  return {
    ...record,
    sourceName: `${place.name} · owner-authorized venue media`,
    author: undefined,
    license: 'Used with venue owner permission for Things To Do Atlas',
    assetId: record.assetId ?? record.id,
    entityId: place.id,
    usage: 'spa-place-card',
    availabilityStatus: 'present',
    rightsSourceType: 'user-permission',
    rightsVerificationStatus: 'verified',
    commercialUseAllowed: true,
    verificationStatus: 'verified',
    verifiedAt: VERIFIED_AT,
    verificationMethod: 'site-owner-confirmed-venue-owner-authorization',
    depictionType: 'exact-place',
    depictionSubject: place.name,
    subjectMatch: 'exact',
    depictionNote: `Venue-owner-authorized photograph used for ${place.name} in the ${destination} SPA. Permission for Things To Do Atlas publication is confirmed; modification and attribution conditions are not inferred beyond that permission.`,
  };
};

const classifyTadLoPersonalAiRefinedPhoto = (record: MediaRecord, place: Place): MediaRecord => {
  if (place.city !== 'tad-lo' || !TAD_LO_PERSONAL_AI_REFINED_IDS.has(record.id)) return record;

  return {
    ...record,
    sourceType: 'manual',
    sourceName: 'Site owner personal photo · AI-refined',
    author: 'Site owner',
    license: 'Site-owner personal photo; AI-refined editorially',
    assetId: record.assetId ?? record.id,
    entityId: place.id,
    usage: 'spa-place-card',
    availabilityStatus: 'present',
    rightsSourceType: 'user-owned',
    rightsVerificationStatus: 'verified',
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
    attribution: undefined,
    verificationStatus: 'verified',
    verifiedAt: VERIFIED_AT,
    verificationMethod: 'site-owner-personal-photo-confirmation-ai-refined',
    depictionType: 'exact-place',
    depictionSubject: 'Fandee Island, Tad Lo',
    subjectMatch: 'exact',
    depictionNote: 'Personal photograph taken/provided by the Things To Do Atlas site owner and AI-refined editorially. The underlying photograph is site-owner-owned and depicts Fandee Island; AI refinement does not change that rights provenance.',
  };
};

const classifyVisitTadLoPartnerPhoto = (record: MediaRecord, place: Place): MediaRecord => {
  if (place.city !== 'tad-lo' || !TAD_LO_VISIT_TAD_LO_PARTNER_IDS.has(record.id)) return record;

  return {
    ...record,
    sourceType: 'first-party-official',
    sourceName: 'Visit Tad Lo',
    assetId: record.assetId ?? record.id,
    entityId: place.id,
    usage: 'spa-place-card',
    availabilityStatus: 'present',
    rightsSourceType: 'user-permission',
    rightsVerificationStatus: 'verified',
    commercialUseAllowed: true,
    attributionRequired: true,
    attribution: 'Visit Tad Lo partner media — used with owner permission',
    verificationStatus: 'verified',
    verifiedAt: VERIFIED_AT,
    verificationMethod: 'visit-tad-lo-partner-owner-authorization',
    depictionType: 'exact-place',
    depictionSubject: place.name,
    subjectMatch: 'exact',
    depictionNote: `Visit Tad Lo partner photograph reused from the corresponding Tad Lo activity for ${place.name}. Owner permission is confirmed; the existing source link and required Visit Tad Lo attribution are preserved.`,
  };
};

const classifySaffronCommonsPhoto = (record: MediaRecord, place: Place): MediaRecord => {
  if (place.id !== 'place-saffron-coffee' || record.id !== SAFFRON_COFFEE_COMMONS_ID) return record;

  return {
    ...record,
    sourceType: 'wikimedia',
    sourceName: 'Wikimedia Commons',
    sourcePage: record.sourcePage ?? record.sourceUrl,
    author: 'Caitriana Nicholson',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    originalFile: 'Saffron Coffee (32754817893).jpg',
    assetId: record.assetId ?? record.id,
    entityId: place.id,
    usage: 'spa-place-card',
    availabilityStatus: 'present',
    rightsSourceType: 'wikimedia-open-license',
    rightsVerificationStatus: 'verified',
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: true,
    attribution: 'Caitriana Nicholson — CC BY-SA 2.0',
    verificationStatus: 'verified',
    verifiedAt: VERIFIED_AT,
    verificationMethod: 'wikimedia-commons-license-page-review',
    depictionType: 'exact-place',
    depictionSubject: 'Saffron Coffee, Luang Prabang',
    subjectMatch: 'exact',
    depictionNote: 'Wikimedia Commons photograph identified as Saffron Coffee in Luang Prabang. Commons records the file as CC BY-SA 2.0 and confirms the Flickr-origin licence review.',
  };
};

const classifySpaMediaRecord = (record: MediaRecord, place: Place): MediaRecord => {
  const generated = classifyGeneratedEditorialDrawing(record, place);
  if (generated !== record) return generated;

  const ownerAuthorized = classifyOwnerAuthorizedVenuePhoto(record, place);
  if (ownerAuthorized !== record) return ownerAuthorized;

  const personalAiRefined = classifyTadLoPersonalAiRefinedPhoto(record, place);
  if (personalAiRefined !== record) return personalAiRefined;

  const visitTadLoPartner = classifyVisitTadLoPartnerPhoto(record, place);
  if (visitTadLoPartner !== record) return visitTadLoPartner;

  return classifySaffronCommonsPhoto(record, place);
};

/**
 * Canonical SPA place-media publication policy.
 * Rights provenance and visual depiction are deliberately separate from the legacy SPA
 * photoStatus flag, which only indicates whether a card has an image available.
 */
export const applySpaPlaceMediaPolicy = (place: Place): Place => {
  if (
    place.country !== 'laos'
    || (place.city !== 'don-det' && place.city !== 'luang-prabang' && place.city !== 'tad-lo')
  ) return place;

  const cardImage = place.media.card?.image;
  const legacyImage = place.image;
  const gallery = place.media.fieldCard?.gallery;
  const classifiedCardImage = cardImage ? classifySpaMediaRecord(cardImage, place) : undefined;
  const classifiedLegacyImage = legacyImage ? classifySpaMediaRecord(legacyImage, place) : undefined;
  const classifiedGallery = gallery?.map((record) => classifySpaMediaRecord(record, place));
  const cardChanged = Boolean(cardImage && classifiedCardImage !== cardImage);
  const legacyChanged = Boolean(legacyImage && classifiedLegacyImage !== legacyImage);
  const galleryChanged = Boolean(gallery && classifiedGallery?.some((record, index) => record !== gallery[index]));

  if (!cardChanged && !legacyChanged && !galleryChanged) return place;

  return {
    ...place,
    ...(legacyImage ? { image: classifiedLegacyImage } : {}),
    media: {
      ...place.media,
      card: place.media.card
        ? { ...place.media.card, ...(classifiedCardImage ? { image: classifiedCardImage } : {}) }
        : place.media.card,
      fieldCard: place.media.fieldCard
        ? { ...place.media.fieldCard, ...(classifiedGallery ? { gallery: classifiedGallery } : {}) }
        : place.media.fieldCard,
    },
    spaCard: place.spaCard
      ? {
          ...place.spaCard,
          photoStatus: 'verified',
          photoRequiresManualFill: false,
          photoAvailabilityStatus: 'present',
          photoRightsStatus: 'verified',
        }
      : place.spaCard,
  };
};

export const DON_DET_GENERATED_EDITORIAL_DRAWING_COUNT = DON_DET_GENERATED_EDITORIAL_DRAWING_IDS.size;
export const LUANG_PRABANG_GENERATED_EDITORIAL_COUNT = LUANG_PRABANG_GENERATED_EDITORIAL_IDS.size;
export const LUANG_PRABANG_OWNER_PERMISSION_COUNT = LUANG_PRABANG_OWNER_PERMISSION_IDS.size;
export const TAD_LO_GENERATED_EDITORIAL_COUNT = TAD_LO_GENERATED_EDITORIAL_IDS.size;
export const TAD_LO_OWNER_PERMISSION_COUNT = TAD_LO_OWNER_PERMISSION_IDS.size;
export const TAD_LO_PERSONAL_AI_REFINED_COUNT = TAD_LO_PERSONAL_AI_REFINED_IDS.size;
export const TAD_LO_VISIT_TAD_LO_PARTNER_COUNT = TAD_LO_VISIT_TAD_LO_PARTNER_IDS.size;
