import type { MediaRecord } from '../core/models/types';

type MediaRecordPatch = Partial<MediaRecord>;

const DON_DET_ACTIVITY_IDS = new Set([
  'thing-old-french-railway-bridge',
  'thing-li-phi-somphamit-waterfalls',
  'thing-khone-phapheng-falls',
  'thing-don-som-island',
  'thing-khone-pa-soi-waterfall',
  'thing-xai-kong-nyai-beach',
  'thing-si-phan-don-by-boat',
  'thing-4000-islands-kayaking',
  'thing-cycle-don-det-don-khon',
  'thing-don-det-sunset',
  'thing-don-det-tubing',
]);

const VERIFIED_AT = '2026-08-28';

/**
 * Canonical Don Det media metadata corrections.
 * The Christophe95 records belong to the same Don Det / Don Khon Wikimedia Commons upload series
 * licensed CC BY-SA 4.0. The tubing supplement reuses a verified Don Det Mekong Commons image
 * rather than introducing an unsourced or commercial photograph.
 */
export const donDetMediaRecordOverrides: Readonly<Record<string, MediaRecordPatch>> = {
  'khone-pa-soi-falls-christophe95': {
    author: 'Christophe95',
    license: 'CC BY-SA 4.0',
  },
  'khone-pa-soi-fishing-net-christophe95': {
    author: 'Christophe95',
    license: 'CC BY-SA 4.0',
  },
  'khone-pa-soy-bridge-christophe95': {
    author: 'Christophe95',
    license: 'CC BY-SA 4.0',
  },
};

const tubingSupplement: MediaRecord = {
  id: 'tubing-don-det-golden-hour-pirogue',
  src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pirogue_running_on_the_Mekong_at_golden_hour_between_Don_Det_and_Don_Khon_Laos.jpg?width=1600',
  alt: 'Golden-hour Mekong channel between Don Det and Don Khon, showing the exact river setting used for late-afternoon tubing',
  sourceType: 'wikimedia',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pirogue_running_on_the_Mekong_at_golden_hour_between_Don_Det_and_Don_Khon_Laos.jpg',
  sourceName: 'Wikimedia Commons',
  author: 'Basile Morin',
  license: 'CC BY-SA 4.0',
  manual: true,
  locked: true,
};

const originalFileFromSource = (sourceUrl?: string): string | undefined => {
  if (!sourceUrl) return undefined;
  const marker = '/wiki/File:';
  const markerIndex = sourceUrl.indexOf(marker);
  if (markerIndex === -1) return undefined;

  try {
    return decodeURIComponent(sourceUrl.slice(markerIndex + marker.length));
  } catch {
    return sourceUrl.slice(markerIndex + marker.length);
  }
};

const rightsFromLicense = (license?: string): Pick<
  MediaRecord,
  'licenseUrl' | 'commercialUseAllowed' | 'modificationAllowed' | 'attributionRequired'
> => {
  if (!license) return {};

  const normalized = license.trim().toUpperCase();
  if (normalized.includes('BY-NC') || normalized.includes('NONCOMMERCIAL') || normalized.includes('NON-COMMERCIAL')) {
    return {
      commercialUseAllowed: false,
      attributionRequired: normalized.includes('BY'),
    };
  }

  if (normalized === 'CC BY-SA 4.0') {
    return {
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      commercialUseAllowed: true,
      modificationAllowed: true,
      attributionRequired: true,
    };
  }
  if (normalized === 'CC BY 4.0') {
    return {
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      commercialUseAllowed: true,
      modificationAllowed: true,
      attributionRequired: true,
    };
  }
  if (normalized === 'CC BY-SA 3.0') {
    return {
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      commercialUseAllowed: true,
      modificationAllowed: true,
      attributionRequired: true,
    };
  }
  if (normalized === 'CC BY 3.0') {
    return {
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
      commercialUseAllowed: true,
      modificationAllowed: true,
      attributionRequired: true,
    };
  }
  if (normalized === 'PUBLIC DOMAIN') {
    return {
      licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      commercialUseAllowed: true,
      modificationAllowed: true,
      attributionRequired: false,
    };
  }
  if (normalized === 'CC-BY-SA' || normalized === 'CC BY-SA' || normalized === 'CC-BY' || normalized === 'CC BY') {
    return {
      commercialUseAllowed: true,
      modificationAllowed: true,
      attributionRequired: true,
    };
  }

  return {};
};

const enrichDonDetActivityMedia = (record: MediaRecord, entityId: string): MediaRecord => {
  const rights = rightsFromLicense(record.license);
  const sourcePage = record.sourcePage ?? record.sourceUrl;
  const commercialUseAllowed = record.commercialUseAllowed ?? rights.commercialUseAllowed;
  const licenseUrl = record.licenseUrl ?? rights.licenseUrl;
  const modificationAllowed = record.modificationAllowed ?? rights.modificationAllowed;
  const attributionRequired = record.attributionRequired ?? rights.attributionRequired;
  const hasRightsEvidence = Boolean(sourcePage && record.license && commercialUseAllowed !== undefined);
  const verificationStatus = record.verificationStatus
    ?? (commercialUseAllowed === false ? 'review-needed' : hasRightsEvidence ? 'verified' : 'partial');

  return {
    ...record,
    assetId: record.assetId ?? record.id,
    entityId: record.entityId ?? entityId,
    usage: record.usage ?? 'monetized-activity-page',
    sourcePage,
    originalFile: record.originalFile ?? originalFileFromSource(record.sourceUrl),
    licenseUrl,
    attribution: record.attribution
      ?? (record.author && record.license ? `${record.author} — ${record.license}` : undefined),
    commercialUseAllowed,
    modificationAllowed,
    attributionRequired,
    verificationStatus,
    verifiedAt: record.verifiedAt ?? (hasRightsEvidence ? VERIFIED_AT : undefined),
    verificationMethod: record.verificationMethod
      ?? (hasRightsEvidence ? 'repository-metadata-rights-review' : undefined),
  };
};

export const applyDonDetMediaCorrections = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length) return media;

  const corrected = media.some((record) => donDetMediaRecordOverrides[record.id])
    ? media.map((record) => {
        const patch = donDetMediaRecordOverrides[record.id];
        return patch ? { ...record, ...patch } : record;
      })
    : media;

  const isTubingSet = corrected.some((record) => record.id === 'tubing-don-det-mekong-view');
  const alreadyComplete = corrected.some((record) => record.id === tubingSupplement.id);
  const supplemented = isTubingSet && !alreadyComplete ? [...corrected, tubingSupplement] : corrected;

  if (!entityId || !DON_DET_ACTIVITY_IDS.has(entityId)) return supplemented;
  return supplemented.map((record) => enrichDonDetActivityMedia(record, entityId));
};
