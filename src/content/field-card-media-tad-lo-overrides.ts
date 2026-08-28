import type { MediaRecord, ResearchSource } from '../core/models/types';

type DepictionPatch = Pick<MediaRecord, 'depictionType' | 'depictionSubject' | 'subjectMatch' | 'depictionNote'>;

const VERIFIED_AT = '2026-08-28';
const VISIT_TAD_LO_HOST = 'visit-tadlo.com';

const humanizeEntityId = (entityId: string): string => entityId
  .replace(/^thing-/, '')
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ');

const isVisitTadLoUrl = (value?: string): boolean => Boolean(value?.toLowerCase().includes(VISIT_TAD_LO_HOST));

const isVisitTadLoPartnerMedia = (record: MediaRecord): boolean => (
  isVisitTadLoUrl(record.sourceUrl)
  || isVisitTadLoUrl(record.sourcePage)
  || record.sourceName?.trim().toLowerCase() === 'visit tad lo'
  || /visit tad lo partner media/i.test(record.author ?? '')
  || /owner permission/i.test(record.license ?? '')
);

const isTadLoEditorialEntry = (
  media?: MediaRecord[],
  sources?: ResearchSource[],
): boolean => Boolean(
  media?.some((record) => isVisitTadLoPartnerMedia(record))
  || sources?.some((source) => (
    isVisitTadLoUrl(source.sourceUrl)
    || /visit tad lo/i.test(source.sourceName)
  )),
);

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
  if (normalized.includes('OWNER PERMISSION')) {
    return {
      commercialUseAllowed: true,
      attributionRequired: true,
    };
  }
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

  return {};
};

const rightsSourceTypeFromRecord = (record: MediaRecord): MediaRecord['rightsSourceType'] => {
  if (record.rightsSourceType) return record.rightsSourceType;
  if (isVisitTadLoPartnerMedia(record)) return 'user-permission';
  if (record.sourceType === 'wikimedia') return 'wikimedia-open-license';
  if (record.sourceType === 'public-domain') return 'public-domain';
  if (record.sourceType === 'first-party-official') return 'first-party-official';
  if (record.sourceType === 'manual' && /personal|site owner|user-supplied|provided/i.test(`${record.sourceName ?? ''} ${record.license ?? ''}`)) {
    return 'user-supplied';
  }
  return 'unknown';
};

const depictionForRecord = (record: MediaRecord, entityId: string): DepictionPatch => {
  const depictionSubject = humanizeEntityId(entityId);
  const isContextualExperience = /trek|village-walk|riverside|loop|route/i.test(entityId);

  if (isContextualExperience) {
    return {
      depictionType: 'local-context',
      depictionSubject,
      subjectMatch: 'contextual',
      depictionNote: 'Tad Lo local context curated for this activity; the image does not necessarily show the full activity being performed.',
    };
  }

  if (record.sourceType === 'wikimedia' || isVisitTadLoPartnerMedia(record)) {
    return {
      depictionType: 'exact-subject',
      depictionSubject,
      subjectMatch: 'exact',
      depictionNote: 'The image is curated to depict the named Tad Lo activity subject, attraction or hosted experience.',
    };
  }

  return {
    depictionType: 'exact-place',
    depictionSubject,
    subjectMatch: 'exact',
    depictionNote: 'The image is curated as an exact-place view for this Tad Lo activity.',
  };
};

const enrichTadLoActivityMedia = (record: MediaRecord, entityId: string): MediaRecord => {
  const partnerAuthorization = isVisitTadLoPartnerMedia(record);
  const rights = rightsFromLicense(record.license);
  const sourcePage = record.sourcePage ?? record.sourceUrl;
  const commercialUseAllowed = record.commercialUseAllowed
    ?? (partnerAuthorization ? true : rights.commercialUseAllowed);
  const licenseUrl = record.licenseUrl ?? rights.licenseUrl;
  const modificationAllowed = record.modificationAllowed ?? rights.modificationAllowed;
  const attributionRequired = record.attributionRequired
    ?? (partnerAuthorization ? true : rights.attributionRequired);
  const hasOpenLicenseEvidence = Boolean(sourcePage && record.license && commercialUseAllowed !== undefined);
  const hasPartnerAuthorization = Boolean(partnerAuthorization && sourcePage && commercialUseAllowed === true);
  const hasRightsEvidence = hasPartnerAuthorization || hasOpenLicenseEvidence;
  const verificationStatus = record.verificationStatus
    ?? (commercialUseAllowed === false ? 'review-needed' : hasRightsEvidence ? 'verified' : 'partial');
  const depiction = depictionForRecord(record, entityId);

  return {
    ...record,
    assetId: record.assetId ?? record.id,
    entityId: record.entityId ?? entityId,
    usage: record.usage ?? 'monetized-activity-page',
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
    verifiedAt: record.verifiedAt ?? (hasRightsEvidence ? VERIFIED_AT : undefined),
    verificationMethod: record.verificationMethod
      ?? (hasPartnerAuthorization
        ? 'visit-tad-lo-partner-owner-authorization'
        : hasOpenLicenseEvidence
          ? 'repository-metadata-rights-review'
          : undefined),
    depictionType: record.depictionType ?? depiction.depictionType,
    depictionSubject: record.depictionSubject ?? depiction.depictionSubject,
    subjectMatch: record.subjectMatch ?? depiction.subjectMatch,
    depictionNote: record.depictionNote ?? depiction.depictionNote,
  };
};

export const applyTadLoActivityMediaCorrections = (
  media?: MediaRecord[],
  entityId?: string,
  sources?: ResearchSource[],
): MediaRecord[] | undefined => {
  if (!media?.length || !entityId || !isTadLoEditorialEntry(media, sources)) return media;
  return media.map((record) => enrichTadLoActivityMedia(record, entityId));
};
