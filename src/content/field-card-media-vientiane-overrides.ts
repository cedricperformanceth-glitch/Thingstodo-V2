import type { MediaRecord } from '../core/models/types';

type DepictionPatch = Pick<MediaRecord, 'depictionType' | 'depictionSubject' | 'subjectMatch' | 'depictionNote'>;

const VERIFIED_AT = '2026-08-29';

const VIENTIANE_ACTIVITY_IDS = new Set([
  'thing-pha-that-luang',
  'thing-patuxai-monument',
  'thing-wat-si-saket',
  'thing-haw-phra-kaew',
  'thing-cope-visitor-centre',
  'thing-buddha-park',
  'thing-wat-si-muang',
  'thing-talat-sao-morning-market',
  'thing-chao-anouvong-park',
  'thing-mekong-riverside-walk',
]);

const VIENTIANE_ACTIVITY_SUBJECTS: Readonly<Record<string, string>> = {
  'thing-pha-that-luang': 'Pha That Luang',
  'thing-patuxai-monument': 'Patuxai Monument',
  'thing-wat-si-saket': 'Wat Si Saket',
  'thing-haw-phra-kaew': 'Haw Phra Kaew',
  'thing-cope-visitor-centre': 'COPE Visitor Centre',
  'thing-buddha-park': 'Buddha Park / Xieng Khuan',
  'thing-wat-si-muang': 'Wat Si Muang',
  'thing-talat-sao-morning-market': 'Talat Sao Morning Market',
  'thing-chao-anouvong-park': 'Chao Anouvong Park',
  'thing-mekong-riverside-walk': 'Vientiane Mekong riverside walk',
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

  const normalized = license.trim().toUpperCase().replace(/_/g, '-');

  if (normalized.includes('BY-NC') || normalized.includes('NONCOMMERCIAL') || normalized.includes('NON-COMMERCIAL')) {
    return {
      commercialUseAllowed: false,
      attributionRequired: normalized.includes('BY'),
    };
  }

  if (normalized === 'CC0' || normalized === 'CC-0') {
    return {
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      commercialUseAllowed: true,
      modificationAllowed: true,
      attributionRequired: false,
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
  const normalizedLicense = record.license?.trim().toUpperCase().replace(/_/g, '-');
  if (normalizedLicense === 'CC0' || normalizedLicense === 'CC-0' || record.sourceType === 'public-domain') return 'public-domain';
  if (record.sourceType === 'wikimedia') return 'wikimedia-open-license';
  if (record.sourceType === 'first-party-official') return 'first-party-official';
  if (record.sourceType === 'manual' && /user-supplied|personal|site owner/i.test(`${record.sourceName ?? ''} ${record.license ?? ''}`)) {
    return 'user-supplied';
  }
  return 'unknown';
};

const depictionForActivity = (record: MediaRecord, entityId: string): DepictionPatch => {
  const depictionSubject = VIENTIANE_ACTIVITY_SUBJECTS[entityId] ?? 'Vientiane activity context';

  if (entityId === 'thing-mekong-riverside-walk') {
    return {
      depictionType: 'exact-place',
      depictionSubject,
      subjectMatch: 'exact',
      depictionNote: 'Exact-place Vientiane riverfront imagery curated for the walking activity; the gallery documents the route setting rather than a staged walking action.',
    };
  }

  if (/context/i.test(record.id) || /contextual/i.test(record.alt ?? '')) {
    return {
      depictionType: 'local-context',
      depictionSubject,
      subjectMatch: 'contextual',
      depictionNote: 'Vientiane local context curated for this activity; the image is not claimed as an exact documentary view of the full activity.',
    };
  }

  return {
    depictionType: 'exact-subject',
    depictionSubject,
    subjectMatch: 'exact',
    depictionNote: 'The image is curated to depict the named Vientiane attraction, monument, temple, museum or market itself.',
  };
};

const cityFieldNoteDepiction = (): DepictionPatch => ({
  depictionType: 'exact-place',
  depictionSubject: 'Vientiane city and Mekong riverfront',
  subjectMatch: 'exact',
  depictionNote: 'Exact-place Vientiane imagery curated for the monetizable City Field Note.',
});

const enrichVientianeMediaRecord = (
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

export const applyVientianeActivityMediaCorrections = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || !entityId || !VIENTIANE_ACTIVITY_IDS.has(entityId)) return media;
  return media.map((record) => enrichVientianeMediaRecord(
    record,
    entityId,
    'monetized-activity-page',
    depictionForActivity(record, entityId),
  ));
};

export const applyVientianeCityFieldNoteMediaCorrections = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || entityId !== 'city-laos-vientiane') return media;
  const depiction = cityFieldNoteDepiction();
  return media.map((record) => enrichVientianeMediaRecord(
    record,
    entityId,
    'monetized-city-field-note',
    depiction,
  ));
};
