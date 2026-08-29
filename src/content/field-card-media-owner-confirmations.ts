import type { MediaRecord } from '../core/models/types';

const VERIFIED_AT = '2026-08-29';

type OwnerConfirmation = {
  entityId: string;
  aiRefined: boolean;
};

/**
 * Asset-specific ownership confirmations supplied directly by the site owner on 2026-08-29.
 * Do not extend this map by inference: a local/manual/user-supplied asset is not user-owned
 * unless the owner has explicitly confirmed that exact file.
 */
const OWNER_CONFIRMED_MEDIA: Readonly<Record<string, OwnerConfirmation>> = {
  'sandstone-buddhas-card': {
    entityId: 'thing-sandstone-buddhas',
    aiRefined: true,
  },
  'sandstone-buddhas-detail': {
    entityId: 'thing-sandstone-buddhas',
    aiRefined: true,
  },
  'tad-lo-waterfall-photo-2': {
    entityId: 'thing-tad-lo-waterfall',
    aiRefined: false,
  },
  'tad-lo-waterfall-photo-3': {
    entityId: 'thing-tad-lo-waterfall',
    aiRefined: false,
  },
};

const applyOwnerConfirmation = (record: MediaRecord, entityId: string): MediaRecord => {
  const confirmation = OWNER_CONFIRMED_MEDIA[record.id];
  if (!confirmation || confirmation.entityId !== entityId) return record;

  const provenanceNote = confirmation.aiRefined
    ? 'Site-owner personal photograph; the owner confirmed the source photo is theirs and that this displayed asset is AI-refined from that owner-controlled photograph.'
    : 'Site-owner personal photograph supplied directly by the owner; no AI refinement is recorded for this asset.';

  return {
    ...record,
    sourceName: confirmation.aiRefined
      ? 'Site-owner personal photo · AI-refined'
      : 'Site-owner personal photo',
    author: 'Site owner',
    license: confirmation.aiRefined
      ? 'Site-owner-owned personal photo; AI-refined from owner source'
      : 'Site-owner-owned personal photo',
    assetId: record.assetId ?? record.id,
    entityId,
    usage: record.usage ?? 'monetized-activity-page',
    availabilityStatus: 'present',
    rightsSourceType: 'user-owned',
    rightsVerificationStatus: 'verified',
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
    attribution: undefined,
    verificationStatus: 'verified',
    verifiedAt: VERIFIED_AT,
    verificationMethod: confirmation.aiRefined
      ? 'site-owner-personal-photo-confirmation-ai-refined'
      : 'site-owner-personal-photo-confirmation',
    depictionNote: record.depictionNote
      ? `${record.depictionNote} ${provenanceNote}`
      : provenanceNote,
  };
};

export const applyConfirmedOwnerActivityMedia = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || !entityId) return media;
  return media.map((record) => applyOwnerConfirmation(record, entityId));
};
