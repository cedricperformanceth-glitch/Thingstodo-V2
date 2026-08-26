import type { EntityMediaManifest, MediaRecord } from '../core/models/types';

const bolavenGardenImage: MediaRecord = {
  id: 'media-tad-lo-bolaven-garden',
  src: '/images/places/tad-lo/bolaven-garden.webp',
  alt: 'Bolaven Garden in Tad Lo, Laos',
  sourceType: 'manual',
  sourceName: 'Provided Tad Lo venue media',
  manual: true,
  locked: true,
};

const samakiGuestHouseImage: MediaRecord = {
  id: 'media-tad-lo-samaki-guest-house',
  src: '/images/places/tad-lo/samaki-guest-house.webp',
  alt: 'Samaki Guest House in Tad Lo, Laos',
  sourceType: 'manual',
  sourceName: 'Provided Tad Lo venue media',
  manual: true,
  locked: true,
};

/**
 * Reuse an existing venue asset for another SPA card representing the same physical place.
 * These overrides reference the original file path; they never create duplicate image assets.
 */
export const placeMediaOverrides: Readonly<Record<string, EntityMediaManifest>> = {
  'place-bolaven-garden-coffee': {
    card: { image: bolavenGardenImage },
    fieldCard: { gallery: [bolavenGardenImage] },
  },
  'place-samaki-coffee': {
    card: { image: samakiGuestHouseImage },
    fieldCard: { gallery: [samakiGuestHouseImage] },
  },
};
