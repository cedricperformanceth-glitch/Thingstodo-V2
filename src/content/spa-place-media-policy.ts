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

const classifyGeneratedEditorialDrawing = (record: MediaRecord, place: Place): MediaRecord => {
  if (!DON_DET_GENERATED_EDITORIAL_DRAWING_IDS.has(record.id)) return record;

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
    depictionNote: `AI-generated editorial drawing representing ${place.name} in the Don Det SPA. It is illustrative rather than documentary photography and does not claim to reproduce the venue's exact current appearance.`,
  };
};

/**
 * Canonical SPA place-media publication policy.
 * Rights provenance and visual depiction are deliberately separate from the legacy SPA
 * photoStatus flag, which only indicates whether a card has an image available.
 */
export const applySpaPlaceMediaPolicy = (place: Place): Place => {
  if (place.country !== 'laos' || place.city !== 'don-det') return place;

  const cardImage = place.media.card?.image;
  const legacyImage = place.image;
  const classifiedCardImage = cardImage ? classifyGeneratedEditorialDrawing(cardImage, place) : undefined;
  const classifiedLegacyImage = legacyImage ? classifyGeneratedEditorialDrawing(legacyImage, place) : undefined;
  const cardChanged = Boolean(cardImage && classifiedCardImage !== cardImage);
  const legacyChanged = Boolean(legacyImage && classifiedLegacyImage !== legacyImage);

  if (!cardChanged && !legacyChanged) return place;

  return {
    ...place,
    ...(legacyImage ? { image: classifiedLegacyImage } : {}),
    media: {
      ...place.media,
      card: place.media.card
        ? { ...place.media.card, ...(classifiedCardImage ? { image: classifiedCardImage } : {}) }
        : place.media.card,
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
