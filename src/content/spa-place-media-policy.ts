import type { MediaRecord, Place } from '../core/models/types';

const VERIFIED_AT = '2026-08-29';

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

const LUANG_PRABANG_GENERATED_EDITORIAL_IDS = new Set([
  'media-luang-prabang-tamarind',
  'media-luang-prabang-khaiphaen',
  'media-luang-prabang-manda-de-laos',
  'media-luang-prabang-bouang-asian-eatery',
  'media-luang-prabang-popolo',
  'media-luang-prabang-bamboo-garden-restaurant',
  'media-luang-prabang-sa-sa-lao',
  'media-luang-prabang-my-dream-boutique-resort',
  'media-luang-prabang-maison-dalabua',
  'media-luang-prabang-cold-river-guesthouse',
  'media-luang-prabang-mad-monkey-luang-prabang',
  'media-luang-prabang-style-motorbikes-luang-prabang',
]);

const TAD_LO_GENERATED_EDITORIAL_IDS = new Set([
  'media-tad-lo-bolaven-garden',
  'media-tad-lo-samaki-guest-house',
  'media-tad-lo-tad-lo-lodge',
  'media-tad-lo-mama-pap-restaurant',
  'media-tad-lo-fandee-waterpark-restaurant',
]);

const VANG_VIENG_GENERATED_EDITORIAL_IDS = new Set([
  // Restaurants
  'media-vang-vieng-a-m-d-restaurant',
  'media-vang-vieng-laung-xai-kham-restaurant',

  // Cafes
  'media-vang-vieng-vang-vieng-organic-farm-cafe',
  'media-vang-vieng-sakura-bar-coffee',
  'media-vang-vieng-viman-vang-vieng-coffee',

  // Accommodation
  'media-vang-vieng-vang-vieng-rock-backpackers-hostel',
  'media-vang-vieng-vang-vieng-freedom-backpackers',
  'media-vang-vieng-vang-vieng-garden-bungalows',
  'media-vang-vieng-sout-jai-guesthouse',
  'media-vang-vieng-santara-backpackers-hostel',

  // Rental
  'media-vang-vieng-vang-vieng-motorbike-rental',
]);

const THAKHEK_GENERATED_EDITORIAL_IDS = new Set([
  // Restaurants: all except Phubeer Restaurant
  'bonjour-thakhek-card',
  'miss-tang-restaurant-card',
  'orlasone-bbq-card',
  'six-friends-restaurant-card',
  'space-bar-and-restaurant-card',
  'thakhek-view-card',
  'thakheks-secret-bar-card',

  // Cafes
  'dd-bistro-and-cafe-card',
  'organic-cafe-card',
  'vie-de-france-card',

  // Accommodation: all except Bamboo Hostel and STAY HOSTEL
  'bami-thakhek-hostel-card',
  'catty-tourist-house-and-restaurant-card',
  'lao-home-hostel-card',
  'naga-hostel-and-cafe-card',
  'nam-phou-hostel-card',
  'nana-bungalows-card',
  'orlardee-hostel-card',
  'song-lao-guesthouse-card',
  'thakhek-travel-lodge-card',
  'villa-thakhek-card',
  'xoksaysub-hotel-card',

  // Rentals
  'mad-monkey-motorcycle-card',
  'wang-wang-motor-rental-card',

  // Practical services
  'khamouane-province-hospital-card',
]);

const LUANG_PRABANG_OWNER_PERMISSION_IDS = new Set([
  'media-luang-prabang-lulalao-coffee',
  'media-luang-prabang-novelty-cafe',
  'media-luang-prabang-joma-bakery-cafe',
  'media-luang-prabang-le-banneton',
  'media-luang-prabang-sky-motorbike-for-rent',
]);

const TAD_LO_OWNER_PERMISSION_IDS = new Set([
  'media-tad-lo-fandee-island-restaurant',
]);

const VANG_VIENG_OWNER_PERMISSION_IDS = new Set([
  'media-vang-vieng-happy-mango-thai-restaurant',
  'media-vang-vieng-naked-espresso-vang-vieng',
  'media-vang-vieng-pizza-luka',
]);

const THAKHEK_OWNER_PERMISSION_IDS = new Set([
  // Restaurant
  'phubeer-restaurant-card',

  // Cafes: all except DD Bistro, Organic Cafe and Vie de France
  'b96-coffee-and-tea-card',
  'bike-and-bed-hostel-cafe-card',
  'candy-cafe-card',
  'geelot-cha-card',
  'kamkhong-home-cafe-by-noungning-card',
  'la-parisian-cafe-card',
  'rok-coffee-thakhek-card',
  'room-cafe-thakhek-card',
  'soukjai-cafe-card',
  'vegetarian-house-cafe-card',
  'yo-and-ko-cafe-card',

  // Accommodation
  'bamboo-hostel-thakhek-card',
  'stay-hostel-by-m-and-m-card',

  // Rentals
  'mixay-thakhek-motor-rental-card',
  'pokemongo-motorbike-rental-card',
]);

const TAD_LO_PERSONAL_AI_REFINED_IDS = new Set([
  'media-tad-lo-fandee-island-1',
  'media-tad-lo-fandee-island-2',
  'media-tad-lo-fandee-island-3',
]);

const TAD_LO_VISIT_TAD_LO_PARTNER_IDS = new Set([
  'media-mr-hook-coffee-katu-visit-tad-lo',
  'media-mr-vieng-coffee-visit-tad-lo',
]);

const SAFFRON_COFFEE_COMMONS_ID = 'commons-69180651';

const CITY_LABELS: Readonly<Record<string, string>> = {
  'don-det': 'Don Det',
  'luang-prabang': 'Luang Prabang',
  'tad-lo': 'Tad Lo',
  'vang-vieng': 'Vang Vieng',
  thakhek: 'Thakhek',
};

const SUPPORTED_SPA_MEDIA_POLICY_CITIES = new Set(Object.keys(CITY_LABELS));

const GENERATED_EDITORIAL_IDS_BY_CITY: Readonly<Record<string, ReadonlySet<string>>> = {
  'don-det': DON_DET_GENERATED_EDITORIAL_DRAWING_IDS,
  'luang-prabang': LUANG_PRABANG_GENERATED_EDITORIAL_IDS,
  'tad-lo': TAD_LO_GENERATED_EDITORIAL_IDS,
  'vang-vieng': VANG_VIENG_GENERATED_EDITORIAL_IDS,
  thakhek: THAKHEK_GENERATED_EDITORIAL_IDS,
};

const OWNER_PERMISSION_IDS_BY_CITY: Readonly<Record<string, ReadonlySet<string>>> = {
  'luang-prabang': LUANG_PRABANG_OWNER_PERMISSION_IDS,
  'tad-lo': TAD_LO_OWNER_PERMISSION_IDS,
  'vang-vieng': VANG_VIENG_OWNER_PERMISSION_IDS,
  thakhek: THAKHEK_OWNER_PERMISSION_IDS,
};

const classifyGeneratedEditorialDrawing = (record: MediaRecord, place: Place): MediaRecord => {
  const generatedIds = GENERATED_EDITORIAL_IDS_BY_CITY[place.city];
  if (!generatedIds?.has(record.id)) return record;

  const destination = CITY_LABELS[place.city] ?? place.city;
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
  const ownerAuthorizedIds = OWNER_PERMISSION_IDS_BY_CITY[place.city];
  if (!ownerAuthorizedIds?.has(record.id)) return record;

  const destination = CITY_LABELS[place.city] ?? place.city;
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
  if (place.country !== 'laos' || !SUPPORTED_SPA_MEDIA_POLICY_CITIES.has(place.city)) return place;

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
export const VANG_VIENG_GENERATED_EDITORIAL_COUNT = VANG_VIENG_GENERATED_EDITORIAL_IDS.size;
export const VANG_VIENG_OWNER_PERMISSION_COUNT = VANG_VIENG_OWNER_PERMISSION_IDS.size;
export const THAKHEK_GENERATED_EDITORIAL_COUNT = THAKHEK_GENERATED_EDITORIAL_IDS.size;
export const THAKHEK_OWNER_PERMISSION_COUNT = THAKHEK_OWNER_PERMISSION_IDS.size;
