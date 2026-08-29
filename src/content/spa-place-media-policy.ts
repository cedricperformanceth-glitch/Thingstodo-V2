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

const SAFFRON_COFFEE_COMMONS_ID = 'commons-69180651';

const classifyGeneratedEditorialDrawing = (record: MediaRecord, place: Place): MediaRecord => {
  const isDonDet = place.city === 'don-det' && DON_DET_GENERATED_EDITORIAL_DRAWING_IDS.has(record.id);
  const isLuangPrabang = place.city === 'luang-prabang' && LUANG_PRABANG_GENERATED_EDITORIAL_IDS.has(record.id);
  if (!isDonDet && !isLuangPrabang) return record;

  const destination = isDonDet ? 'Don Det' : 'Luang Prabang';
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
  if (place.city !== 'luang-prabang' || !LUANG_PRABANG_OWNER_PERMISSION_IDS.has(record.id)) return record;

  return {
    ...record,
    sourceName: `${place.name} · owner-authorized venue media`,
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
    depictionNote: `Venue-owner-authorized photograph used for ${place.name} in the Luang Prabang SPA. Permission for Things To Do Atlas publication is confirmed; modification and attribution conditions are not inferred beyond that permission.`,
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

  return classifySaffronCommonsPhoto(record, place);
};

/**
 * Canonical SPA place-media publication policy.
 * Rights provenance and visual depiction are deliberately separate from the legacy SPA
 * photoStatus flag, which only indicates whether a card has an image available.
 */
export const applySpaPlaceMediaPolicy = (place: Place): Place => {
  if (place.country !== 'laos' || (place.city !== 'don-det' && place.city !== 'luang-prabang')) return place;

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
