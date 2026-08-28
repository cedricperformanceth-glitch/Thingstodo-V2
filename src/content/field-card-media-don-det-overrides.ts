import type { MediaRecord } from '../core/models/types';

type MediaRecordPatch = Partial<MediaRecord>;
type DepictionPatch = Pick<MediaRecord, 'depictionType' | 'depictionSubject' | 'subjectMatch' | 'depictionNote'>;

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

const DON_DET_LOCAL_CONTEXT_ACTIVITY_IDS = new Set([
  'thing-si-phan-don-by-boat',
  'thing-4000-islands-kayaking',
  'thing-cycle-don-det-don-khon',
  'thing-don-det-tubing',
]);

const DON_DET_EXACT_SUBJECT_ACTIVITY_IDS = new Set([
  'thing-old-french-railway-bridge',
  'thing-li-phi-somphamit-waterfalls',
  'thing-khone-phapheng-falls',
  'thing-khone-pa-soi-waterfall',
  'thing-xai-kong-nyai-beach',
  'thing-don-det-sunset',
]);

const DON_DET_ACTIVITY_SUBJECTS: Readonly<Record<string, string>> = {
  'thing-old-french-railway-bridge': 'Don Det–Don Khon old railway bridge',
  'thing-li-phi-somphamit-waterfalls': 'Li Phi / Somphamit Waterfalls',
  'thing-khone-phapheng-falls': 'Khone Phapheng Falls',
  'thing-don-som-island': 'Don Som Island',
  'thing-khone-pa-soi-waterfall': 'Khone Pa Soi Waterfall',
  'thing-xai-kong-nyai-beach': 'Xai Kong Nyai Beach',
  'thing-si-phan-don-by-boat': 'Si Phan Don boat experience',
  'thing-4000-islands-kayaking': '4,000 Islands kayaking',
  'thing-cycle-don-det-don-khon': 'Cycling Don Det and Don Khon',
  'thing-don-det-sunset': 'Sunset on Don Det',
  'thing-don-det-tubing': 'Tubing on Don Det',
};

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
  alt: 'Golden-hour Mekong channel between Don Det and Don Khon with a pirogue on the river',
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

const rightsSourceTypeFromRecord = (record: MediaRecord): MediaRecord['rightsSourceType'] => {
  if (record.rightsSourceType) return record.rightsSourceType;
  if (record.sourceType === 'wikimedia') return 'wikimedia-open-license';
  if (record.sourceType === 'public-domain') return 'public-domain';
  if (record.sourceType === 'first-party-official') return 'first-party-official';
  if (record.sourceType === 'manual' && /user-supplied/i.test(record.sourceName ?? '')) return 'user-supplied';
  return 'unknown';
};

const depictionForActivity = (entityId: string): DepictionPatch => {
  const depictionSubject = DON_DET_ACTIVITY_SUBJECTS[entityId] ?? 'Don Det activity context';
  if (DON_DET_LOCAL_CONTEXT_ACTIVITY_IDS.has(entityId)) {
    return {
      depictionType: 'local-context',
      depictionSubject,
      subjectMatch: 'contextual',
      depictionNote: 'Exact Don Det / Si Phan Don local context; the image does not necessarily depict the activity being performed.',
    };
  }
  if (DON_DET_EXACT_SUBJECT_ACTIVITY_IDS.has(entityId)) {
    return {
      depictionType: 'exact-subject',
      depictionSubject,
      subjectMatch: 'exact',
      depictionNote: 'The image is curated to depict the named activity subject or landmark itself.',
    };
  }
  return {
    depictionType: 'exact-place',
    depictionSubject,
    subjectMatch: 'exact',
    depictionNote: 'The image is curated as an exact-place view for this Don Det activity.',
  };
};

const cityFieldNoteDepiction = (): DepictionPatch => ({
  depictionType: 'exact-place',
  depictionSubject: 'Don Det and Si Phan Don destination context',
  subjectMatch: 'exact',
  depictionNote: 'Exact-place destination imagery curated for the Don Det City Field Note.',
});

const enrichDonDetMediaRecord = (
  record: MediaRecord,
  entityId: string,
  usage: string,
  depiction: DepictionPatch,
): MediaRecord => {
  const rights = rightsFromLicense(record.license);
  const sourcePage = record.sourcePage ?? record.sourceUrl;
  const commercialUseAllowed = record.commercialUseAllowed ?? rights.commercialUseAllowed;
  const licenseUrl = record.licenseUrl ?? rights.licenseUrl;
  const modificationAllowed = record.modificationAllowed ?? rights.modificationAllowed;
  const attributionRequired = record.attributionRequired ?? rights.attributionRequired;
  const hasRightsEvidence = Boolean(sourcePage && record.license && commercialUseAllowed !== undefined);
  const verificationStatus = record.verificationStatus
    ?? (commercialUseAllowed === false ? 'review-needed' : hasRightsEvidence ? 'verified' : 'partial');
  const rightsVerificationStatus = record.rightsVerificationStatus ?? verificationStatus;

  return {
    ...record,
    assetId: record.assetId ?? record.id,
    entityId: record.entityId ?? entityId,
    usage: record.usage ?? usage,
    availabilityStatus: record.availabilityStatus ?? 'present',
    rightsSourceType: rightsSourceTypeFromRecord(record),
    rightsVerificationStatus,
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
    depictionType: record.depictionType ?? depiction.depictionType,
    depictionSubject: record.depictionSubject ?? depiction.depictionSubject,
    subjectMatch: record.subjectMatch ?? depiction.subjectMatch,
    depictionNote: record.depictionNote ?? depiction.depictionNote,
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
  const depiction = depictionForActivity(entityId);
  return supplemented.map((record) => enrichDonDetMediaRecord(record, entityId, 'monetized-activity-page', depiction));
};

export const applyDonDetCityFieldNoteMediaCorrections = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || entityId !== 'city-don-det') return media;
  const depiction = cityFieldNoteDepiction();
  return media.map((record) => enrichDonDetMediaRecord(record, entityId, 'monetized-city-field-note', depiction));
};
