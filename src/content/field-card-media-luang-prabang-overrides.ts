import type { MediaRecord } from '../core/models/types';

type DepictionPatch = Pick<MediaRecord, 'depictionType' | 'depictionSubject' | 'subjectMatch' | 'depictionNote'>;

const VERIFIED_AT = '2026-08-29';

const LUANG_PRABANG_ACTIVITY_IDS = new Set([
  'thing-luang-prabang-heritage-walk',
  'thing-wat-xieng-thong',
  'thing-phou-si-mountain',
  'thing-royal-palace-museum',
  'thing-tak-bat-alms',
  'thing-kuang-si-waterfalls',
  'thing-pak-ou-caves',
  'thing-wat-visoun',
  'thing-uxo-lao-visitor-centre',
  'thing-traditional-arts-ethnology-centre',
  'thing-ock-pop-tok-living-crafts-centre',
  'thing-ban-xang-khong-weaving-village',
  'thing-mekong-slow-boat-huay-xai-luang-prabang',
]);

/**
 * Exact licence versions checked against the individual Wikimedia Commons source pages
 * on 2026-08-29. The two Commons records deliberately absent from this map
 * (`commons-takbat-2` and `commons-slowboat-luang-prabang-1`) retain their repository
 * CC BY-SA family metadata: commercial reuse is allowed by that licence family, but the
 * exact version was not established cleanly enough to mark the record fully verified.
 */
const VERIFIED_COMMONS_LICENSES: Readonly<Record<string, string>> = {
  'commons-lp-heritage-1': 'CC BY-SA 4.0',
  'commons-lp-heritage-2': 'CC BY-SA 4.0',
  'commons-lp-heritage-3': 'CC0 1.0',
  'commons-wxt-1': 'CC BY-SA 4.0',
  'commons-wxt-2': 'CC BY-SA 4.0',
  'commons-wxt-3': 'CC BY-SA 4.0',
  'commons-phousi-1': 'CC BY-SA 4.0',
  'commons-phousi-2': 'CC BY-SA 4.0',
  'commons-phousi-3': 'CC BY-SA 4.0',
  'commons-palace-1': 'CC BY-SA 4.0',
  'commons-palace-2': 'CC BY-SA 4.0',
  'commons-palace-3': 'CC BY-SA 4.0',
  'commons-takbat-1': 'CC BY-SA 3.0',
  'commons-takbat-3': 'CC BY-SA 4.0',
  'commons-kuangsi-1': 'CC BY-SA 4.0',
  'commons-kuangsi-2': 'CC BY-SA 4.0',
  'commons-kuangsi-3': 'CC BY-SA 4.0',
  'commons-pakou-1': 'CC BY-SA 3.0',
  'commons-pakou-2': 'CC BY-SA 3.0',
  'commons-pakou-3': 'CC BY-SA 3.0',
  'commons-visoun-1': 'CC BY-SA 4.0',
  'commons-visoun-2': 'CC BY-SA 4.0',
  'commons-visoun-3': 'CC BY-SA 4.0',
  'commons-uxo-luang-prabang-1': 'CC BY-SA 4.0',
  'commons-taec-1': 'CC BY-SA 4.0',
  'commons-taec-2': 'CC BY-SA 4.0',
  'commons-taec-3': 'CC BY-SA 4.0',
  'commons-ock-pop-tok-weaving-1': 'CC BY 2.0',
  'commons-ock-pop-tok-weaving-2': 'CC BY 2.0',
  'commons-ock-pop-tok-weaving-3': 'CC BY 2.0',
  'commons-ban-xang-khong-1': 'CC BY 2.0',
  'commons-slowboat-luang-prabang-2': 'CC BY-SA 4.0',
  'commons-slowboat-luang-prabang-3': 'CC BY-SA 4.0',
  'luang-prabang-field-note-mekong-phousi': 'CC BY-SA 4.0',
  'luang-prabang-field-note-wat-xieng-thong': 'CC BY-SA 3.0',
  'luang-prabang-field-note-mekong-evening': 'CC BY-SA 4.0',
  'luang-prabang-field-note-kuang-si': 'CC BY-SA 4.0',
};

const LUANG_PRABANG_ACTIVITY_SUBJECTS: Readonly<Record<string, string>> = {
  'thing-luang-prabang-heritage-walk': 'Luang Prabang heritage walk',
  'thing-wat-xieng-thong': 'Wat Xieng Thong',
  'thing-phou-si-mountain': 'Mount Phou Si',
  'thing-royal-palace-museum': 'Royal Palace Museum / Haw Kham',
  'thing-tak-bat-alms': 'Luang Prabang morning alms ceremony',
  'thing-kuang-si-waterfalls': 'Kuang Si Waterfalls',
  'thing-pak-ou-caves': 'Pak Ou Caves',
  'thing-wat-visoun': 'Wat Visoun / Wat Wisunarat',
  'thing-uxo-lao-visitor-centre': 'UXO Lao Visitor Centre in Luang Prabang',
  'thing-traditional-arts-ethnology-centre': 'Traditional Arts and Ethnology Centre',
  'thing-ock-pop-tok-living-crafts-centre': 'Ock Pop Tok Living Crafts Centre',
  'thing-ban-xang-khong-weaving-village': 'Ban Xang Khong weaving village',
  'thing-mekong-slow-boat-huay-xai-luang-prabang': 'Mekong slow boat route from Huay Xai to Luang Prabang via Pak Beng',
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

  if (normalized === 'CC0 1.0' || normalized === 'CC0-1.0') {
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

const rightsSourceTypeFromRecord = (
  record: MediaRecord,
  correctedLicense?: string,
): MediaRecord['rightsSourceType'] => {
  if (record.rightsSourceType) return record.rightsSourceType;
  const normalizedLicense = correctedLicense?.trim().toUpperCase() ?? '';
  if (normalizedLicense.startsWith('CC0') || normalizedLicense === 'PUBLIC DOMAIN') return 'public-domain';
  if (record.sourceType === 'public-domain') return 'public-domain';
  if (record.sourceType === 'wikimedia') return 'wikimedia-open-license';
  if (record.sourceType === 'manual' && /user-supplied|personal|site owner/i.test(`${record.sourceName ?? ''} ${record.license ?? ''}`)) {
    return 'user-supplied';
  }
  return 'unknown';
};

const depictionForActivity = (record: MediaRecord, entityId: string): DepictionPatch => {
  const depictionSubject = LUANG_PRABANG_ACTIVITY_SUBJECTS[entityId] ?? 'Luang Prabang activity context';

  if (entityId === 'thing-luang-prabang-heritage-walk') {
    return {
      depictionType: 'local-context',
      depictionSubject,
      subjectMatch: 'contextual',
      depictionNote: 'Exact Luang Prabang heritage-street imagery used as context for a walking route; the gallery does not claim to document every stop of the walk.',
    };
  }

  if (entityId === 'thing-ock-pop-tok-living-crafts-centre') {
    return {
      depictionType: 'local-context',
      depictionSubject,
      subjectMatch: 'contextual',
      depictionNote: 'The Commons source pages document traditional weaving in Luang Prabang, but do not establish that these photographs were taken at Ock Pop Tok itself.',
    };
  }

  if (entityId === 'thing-mekong-slow-boat-huay-xai-luang-prabang' && record.id === 'commons-slowboat-luang-prabang-2') {
    return {
      depictionType: 'local-context',
      depictionSubject,
      subjectMatch: 'contextual',
      depictionNote: 'Mekong scenery on the slow-boat corridor in Luang Prabang Province; the image supports the route context rather than showing the boat activity itself.',
    };
  }

  return {
    depictionType: 'exact-subject',
    depictionSubject,
    subjectMatch: 'exact',
    depictionNote: 'The Commons source identifies the named Luang Prabang activity subject, attraction, ceremony, village or slow-boat route element itself.',
  };
};

const cityFieldNoteDepiction = (record: MediaRecord): DepictionPatch => {
  if (record.id === 'luang-prabang-field-note-kuang-si') {
    return {
      depictionType: 'local-context',
      depictionSubject: 'Luang Prabang destination landscape',
      subjectMatch: 'contextual',
      depictionNote: 'Kuang Si is outside the compact historic city but is part of the Luang Prabang destination landscape; it is not claimed as an exact city-centre view.',
    };
  }

  return {
    depictionType: 'exact-place',
    depictionSubject: 'Luang Prabang historic city and Mekong peninsula',
    subjectMatch: 'exact',
    depictionNote: 'Exact-place Luang Prabang city imagery curated for the monetizable City Field Note.',
  };
};

const enrichLuangPrabangMediaRecord = (
  record: MediaRecord,
  entityId: string,
  usage: string,
  depiction: DepictionPatch,
): MediaRecord => {
  const verifiedLicense = VERIFIED_COMMONS_LICENSES[record.id];
  const correctedRecord = verifiedLicense ? { ...record, license: verifiedLicense } : record;
  const rights = rightsFromLicense(correctedRecord.license);
  const sourcePage = correctedRecord.sourcePage ?? correctedRecord.sourceUrl;
  const commercialUseAllowed = correctedRecord.commercialUseAllowed ?? rights.commercialUseAllowed;
  const modificationAllowed = correctedRecord.modificationAllowed ?? rights.modificationAllowed;
  const attributionRequired = correctedRecord.attributionRequired ?? rights.attributionRequired;
  const licenseUrl = correctedRecord.licenseUrl ?? rights.licenseUrl;
  const hasBasicRightsEvidence = Boolean(
    sourcePage
    && correctedRecord.license
    && commercialUseAllowed !== undefined
    && (attributionRequired === false || correctedRecord.author),
  );
  const hasExactLicenseEvidence = Boolean(hasBasicRightsEvidence && licenseUrl);
  const verificationStatus = correctedRecord.verificationStatus
    ?? (commercialUseAllowed === false
      ? 'review-needed'
      : hasExactLicenseEvidence
        ? 'verified'
        : hasBasicRightsEvidence
          ? 'partial'
          : 'review-needed');

  return {
    ...correctedRecord,
    assetId: correctedRecord.assetId ?? correctedRecord.id,
    entityId: correctedRecord.entityId ?? entityId,
    usage: correctedRecord.usage ?? usage,
    availabilityStatus: correctedRecord.availabilityStatus ?? 'present',
    rightsSourceType: rightsSourceTypeFromRecord(correctedRecord, correctedRecord.license),
    rightsVerificationStatus: correctedRecord.rightsVerificationStatus ?? verificationStatus,
    sourcePage,
    originalFile: correctedRecord.originalFile ?? originalFileFromSource(correctedRecord.sourceUrl),
    licenseUrl,
    attribution: correctedRecord.attribution
      ?? (correctedRecord.author && correctedRecord.license
        ? `${correctedRecord.author} — ${correctedRecord.license}`
        : undefined),
    commercialUseAllowed,
    modificationAllowed,
    attributionRequired,
    verificationStatus,
    verifiedAt: correctedRecord.verifiedAt ?? (verificationStatus === 'verified' ? VERIFIED_AT : undefined),
    verificationMethod: correctedRecord.verificationMethod
      ?? (verificationStatus === 'verified'
        ? 'commons-source-page-rights-review'
        : hasBasicRightsEvidence
          ? 'commons-license-family-commercial-rights-confirmed-version-pending'
          : 'commons-source-rights-review-needed'),
    depictionType: correctedRecord.depictionType ?? depiction.depictionType,
    depictionSubject: correctedRecord.depictionSubject ?? depiction.depictionSubject,
    subjectMatch: correctedRecord.subjectMatch ?? depiction.subjectMatch,
    depictionNote: correctedRecord.depictionNote ?? depiction.depictionNote,
  };
};

export const applyLuangPrabangActivityMediaCorrections = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || !entityId || !LUANG_PRABANG_ACTIVITY_IDS.has(entityId)) return media;
  return media.map((record) => enrichLuangPrabangMediaRecord(
    record,
    entityId,
    'monetized-activity-page',
    depictionForActivity(record, entityId),
  ));
};

export const applyLuangPrabangCityFieldNoteMediaCorrections = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || entityId !== 'city-laos-luang-prabang') return media;
  return media.map((record) => enrichLuangPrabangMediaRecord(
    record,
    entityId,
    'monetized-city-field-note',
    cityFieldNoteDepiction(record),
  ));
};
