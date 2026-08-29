import type { MediaRecord } from '../core/models/types';

type DepictionPatch = Pick<MediaRecord, 'depictionType' | 'depictionSubject' | 'subjectMatch' | 'depictionNote'>;

const VERIFIED_AT = '2026-08-29';

const VANG_VIENG_ACTIVITY_IDS = new Set([
  'thing-nam-xay-viewpoint',
  'thing-tham-khan-cave',
  'thing-tham-phu-kham-and-blue-lagoon-1',
  'thing-tham-chang-cave',
  'thing-tham-nam-water-cave',
  'thing-tham-sang-elephant-cave',
  'thing-pha-ngern-viewpoint',
  'thing-blue-lagoon-3',
  'thing-blue-lagoon-4',
  'thing-nam-song-river-kayaking',
  'thing-nam-song-river-tubing',
  'thing-vang-vieng-karst-cycling-loop',
  'thing-wat-kang',
  'thing-vang-vieng-morning-market',
  'thing-pha-tang-mountain',
]);

const VANG_VIENG_ACTIVITY_SUBJECTS: Readonly<Record<string, string>> = {
  'thing-nam-xay-viewpoint': 'Nam Xay Viewpoint',
  'thing-tham-khan-cave': 'Tham Khan Cave',
  'thing-tham-phu-kham-and-blue-lagoon-1': 'Tham Phu Kham Cave and Blue Lagoon 1',
  'thing-tham-chang-cave': 'Tham Chang / Tham Jang Cave',
  'thing-tham-nam-water-cave': 'Tham Nam Water Cave',
  'thing-tham-sang-elephant-cave': 'Tham Sang / Elephant Cave',
  'thing-pha-ngern-viewpoint': 'Pha Ngern Viewpoint',
  'thing-blue-lagoon-3': 'Blue Lagoon 3',
  'thing-blue-lagoon-4': 'Blue Lagoon 4',
  'thing-nam-song-river-kayaking': 'Nam Song River kayaking',
  'thing-nam-song-river-tubing': 'Nam Song River tubing',
  'thing-vang-vieng-karst-cycling-loop': 'Vang Vieng karst cycling loop',
  'thing-wat-kang': 'Wat Kang in Vang Vieng',
  'thing-vang-vieng-morning-market': 'Vang Vieng Morning Market',
  'thing-pha-tang-mountain': 'Pha Tang Mountain area',
};

const CONTEXTUAL_ACTIVITY_IDS = new Set([
  'thing-blue-lagoon-3',
  'thing-blue-lagoon-4',
  'thing-vang-vieng-karst-cycling-loop',
  'thing-vang-vieng-morning-market',
  'thing-pha-tang-mountain',
]);

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

  const normalized = license.trim().toUpperCase().replace(/_/g, '-');

  if (normalized.includes('BY-NC') || normalized.includes('NONCOMMERCIAL') || normalized.includes('NON-COMMERCIAL')) {
    return {
      commercialUseAllowed: false,
      attributionRequired: normalized.includes('BY'),
    };
  }

  if (normalized === 'PUBLIC DOMAIN' || normalized === 'PUBLIC-DOMAIN') {
    return {
      licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      commercialUseAllowed: true,
      modificationAllowed: true,
      attributionRequired: false,
    };
  }

  const exactCcMatch = normalized.match(/^CC[- ]BY(-SA)?[- ](\d+(?:\.\d+)?)$/);
  if (exactCcMatch) {
    const shareAlike = Boolean(exactCcMatch[1]);
    const version = exactCcMatch[2];
    return {
      licenseUrl: `https://creativecommons.org/licenses/${shareAlike ? 'by-sa' : 'by'}/${version}/`,
      commercialUseAllowed: true,
      modificationAllowed: true,
      attributionRequired: true,
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
  if (record.sourceType === 'manual' && /user-supplied|personal|site owner/i.test(`${record.sourceName ?? ''} ${record.license ?? ''}`)) {
    return 'user-supplied';
  }
  return 'unknown';
};

const depictionForActivity = (record: MediaRecord, entityId: string): DepictionPatch => {
  const depictionSubject = VANG_VIENG_ACTIVITY_SUBJECTS[entityId] ?? 'Vang Vieng activity context';

  if (CONTEXTUAL_ACTIVITY_IDS.has(entityId) || /context/i.test(record.id) || /contextual/i.test(record.alt ?? '')) {
    return {
      depictionType: 'local-context',
      depictionSubject,
      subjectMatch: 'contextual',
      depictionNote: 'Vang Vieng local context curated for this activity; the image is not claimed as an exact documentary view of the numbered site or complete route.',
    };
  }

  if (entityId === 'thing-nam-song-river-kayaking' && !/kayak/i.test(`${record.id} ${record.alt ?? ''}`)) {
    return {
      depictionType: 'local-context',
      depictionSubject,
      subjectMatch: 'contextual',
      depictionNote: 'Nam Song river context supporting the kayaking Field Card; the image does not necessarily show kayaking in progress.',
    };
  }

  if (entityId === 'thing-nam-song-river-tubing' && !/tubing|travellers tubing/i.test(`${record.id} ${record.alt ?? ''}`)) {
    return {
      depictionType: 'local-context',
      depictionSubject,
      subjectMatch: 'contextual',
      depictionNote: 'Nam Song river context supporting the tubing Field Card; the image does not necessarily show tubing in progress.',
    };
  }

  return {
    depictionType: 'exact-subject',
    depictionSubject,
    subjectMatch: 'exact',
    depictionNote: 'The image is curated to depict the named Vang Vieng activity subject, cave, viewpoint, temple or river activity itself.',
  };
};

const cityFieldNoteDepiction = (record: MediaRecord): DepictionPatch => {
  if (record.id === 'vang-vieng-field-note-blue-lagoon' || record.id === 'vang-vieng-field-note-nam-xay') {
    return {
      depictionType: 'local-context',
      depictionSubject: 'Vang Vieng karst countryside',
      subjectMatch: 'contextual',
      depictionNote: 'Vang Vieng countryside context curated for the City Field Note; it is outside the compact town centre but part of the destination landscape.',
    };
  }

  return {
    depictionType: 'exact-place',
    depictionSubject: 'Vang Vieng and the Nam Song riverfront',
    subjectMatch: 'exact',
    depictionNote: 'Exact-place Vang Vieng imagery curated for the monetizable City Field Note.',
  };
};

const enrichVangViengMediaRecord = (
  record: MediaRecord,
  entityId: string,
  usage: string,
  depiction: DepictionPatch,
): MediaRecord => {
  const rights = rightsFromLicense(record.license);
  const sourcePage = record.sourcePage ?? record.sourceUrl;
  const commercialUseAllowed = record.commercialUseAllowed ?? rights.commercialUseAllowed;
  const modificationAllowed = record.modificationAllowed ?? rights.modificationAllowed;
  const attributionRequired = record.attributionRequired ?? rights.attributionRequired;
  const licenseUrl = record.licenseUrl ?? rights.licenseUrl;
  const hasBasicRightsEvidence = Boolean(
    sourcePage
    && record.license
    && commercialUseAllowed !== undefined
    && (attributionRequired === false || record.author),
  );
  const hasExactLicenseEvidence = Boolean(hasBasicRightsEvidence && licenseUrl);
  const verificationStatus = record.verificationStatus
    ?? (commercialUseAllowed === false
      ? 'review-needed'
      : hasExactLicenseEvidence
        ? 'verified'
        : hasBasicRightsEvidence
          ? 'partial'
          : 'review-needed');

  return {
    ...record,
    assetId: record.assetId ?? record.id,
    entityId: record.entityId ?? entityId,
    usage: record.usage ?? usage,
    availabilityStatus: record.availabilityStatus ?? 'present',
    rightsSourceType: rightsSourceTypeFromRecord(record),
    rightsVerificationStatus: record.rightsVerificationStatus ?? verificationStatus,
    sourcePage,
    originalFile: record.originalFile ?? originalFileFromSource(record.sourceUrl),
    licenseUrl,
    attribution: record.attribution
      ?? (record.author && record.license ? `${record.author} — ${record.license}` : undefined),
    commercialUseAllowed,
    modificationAllowed,
    attributionRequired,
    verificationStatus,
    verifiedAt: record.verifiedAt ?? (verificationStatus === 'verified' ? VERIFIED_AT : undefined),
    verificationMethod: record.verificationMethod
      ?? (verificationStatus === 'verified'
        ? 'repository-metadata-rights-review'
        : hasBasicRightsEvidence
          ? 'repository-metadata-license-version-pending'
          : 'repository-metadata-rights-review-needed'),
    depictionType: record.depictionType ?? depiction.depictionType,
    depictionSubject: record.depictionSubject ?? depiction.depictionSubject,
    subjectMatch: record.subjectMatch ?? depiction.subjectMatch,
    depictionNote: record.depictionNote ?? depiction.depictionNote,
  };
};

export const applyVangViengActivityMediaCorrections = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || !entityId || !VANG_VIENG_ACTIVITY_IDS.has(entityId)) return media;
  return media.map((record) => enrichVangViengMediaRecord(
    record,
    entityId,
    'monetized-activity-page',
    depictionForActivity(record, entityId),
  ));
};

export const applyVangViengCityFieldNoteMediaCorrections = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || entityId !== 'city-laos-vang-vieng') return media;
  return media.map((record) => enrichVangViengMediaRecord(
    record,
    entityId,
    'monetized-city-field-note',
    cityFieldNoteDepiction(record),
  ));
};
