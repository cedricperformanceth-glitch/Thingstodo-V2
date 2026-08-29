import type { MediaRecord, MediaRightsSourceType, MediaVerificationStatus } from '../core/models/types';

const VERIFIED_AT = '2026-08-29';

const CONFIRMED_RIGHTS_SOURCE_TYPES = new Set<MediaRightsSourceType>([
  'first-party-original',
  'user-owned',
  'user-permission',
  'generated-editorial',
]);

const normalizeLicense = (license?: string): string => String(license ?? '')
  .trim()
  .toUpperCase()
  .replace(/_/g, '-')
  .replace(/\s+/g, ' ');

export interface ParsedMediaRights {
  licenseUrl?: string;
  commercialUseAllowed?: boolean;
  modificationAllowed?: boolean;
  attributionRequired?: boolean;
  exactLicense: boolean;
  knownLicenseFamily: boolean;
  publicDomain: boolean;
  ownerPermission: boolean;
}

export const parseMediaRights = (license?: string): ParsedMediaRights => {
  const normalized = normalizeLicense(license);
  if (!normalized) {
    return {
      exactLicense: false,
      knownLicenseFamily: false,
      publicDomain: false,
      ownerPermission: false,
    };
  }

  const ownerPermission = normalized.includes('OWNER PERMISSION');
  if (ownerPermission) {
    return {
      commercialUseAllowed: true,
      attributionRequired: true,
      exactLicense: false,
      knownLicenseFamily: true,
      publicDomain: false,
      ownerPermission: true,
    };
  }

  if (normalized.includes('BY-NC') || normalized.includes('NONCOMMERCIAL') || normalized.includes('NON-COMMERCIAL')) {
    return {
      commercialUseAllowed: false,
      modificationAllowed: normalized.includes('ND') || normalized.includes('NODERIVATIVES') || normalized.includes('NO DERIVATIVES') ? false : undefined,
      attributionRequired: normalized.includes('BY') || normalized.includes('ATTRIBUTION'),
      exactLicense: false,
      knownLicenseFamily: true,
      publicDomain: false,
      ownerPermission: false,
    };
  }

  if (/^CC[- ]?0(?:[- ]1\.0)?$/.test(normalized)) {
    return {
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      commercialUseAllowed: true,
      modificationAllowed: true,
      attributionRequired: false,
      exactLicense: true,
      knownLicenseFamily: true,
      publicDomain: true,
      ownerPermission: false,
    };
  }

  if (normalized === 'PUBLIC DOMAIN' || normalized === 'PUBLIC-DOMAIN') {
    return {
      licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      commercialUseAllowed: true,
      modificationAllowed: true,
      attributionRequired: false,
      exactLicense: true,
      knownLicenseFamily: true,
      publicDomain: true,
      ownerPermission: false,
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
      exactLicense: true,
      knownLicenseFamily: true,
      publicDomain: false,
      ownerPermission: false,
    };
  }

  if (normalized === 'CC-BY-SA' || normalized === 'CC BY-SA' || normalized === 'CC-BY' || normalized === 'CC BY') {
    return {
      commercialUseAllowed: true,
      modificationAllowed: true,
      attributionRequired: true,
      exactLicense: false,
      knownLicenseFamily: true,
      publicDomain: false,
      ownerPermission: false,
    };
  }

  if (normalized.includes('NO DERIVATIVES') || normalized.includes('NODERIVATIVES')) {
    return {
      modificationAllowed: false,
      attributionRequired: normalized.includes('ATTRIBUTION'),
      exactLicense: false,
      knownLicenseFamily: false,
      publicDomain: false,
      ownerPermission: false,
    };
  }

  return {
    exactLicense: false,
    knownLicenseFamily: false,
    publicDomain: false,
    ownerPermission: false,
  };
};

export const originalFileFromSource = (sourceUrl?: string): string | undefined => {
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

const isUserSupplied = (record: MediaRecord): boolean => (
  /user-supplied|provided media/i.test(`${record.sourceName ?? ''} ${record.license ?? ''}`)
);

const isOfficialInstitutional = (record: MediaRecord): boolean => (
  /UNESCO World Heritage Centre|UNESCO/i.test(record.sourceName ?? '')
  || /NO DERIVATIVES|NODERIVATIVES/i.test(record.license ?? '')
);

const inferRightsSourceType = (
  record: MediaRecord,
  parsed: ParsedMediaRights,
): MediaRightsSourceType => {
  if (record.rightsSourceType && CONFIRMED_RIGHTS_SOURCE_TYPES.has(record.rightsSourceType)) {
    return record.rightsSourceType;
  }
  if (parsed.publicDomain || record.sourceType === 'public-domain') return 'public-domain';
  if (parsed.ownerPermission || record.rightsSourceType === 'user-permission') return 'user-permission';
  if (isOfficialInstitutional(record)) return 'official-institutional';
  if (record.sourceType === 'wikimedia') return 'wikimedia-open-license';
  if (isUserSupplied(record)) return 'user-supplied';
  if (record.sourceType === 'first-party-official') return 'first-party-official';
  return record.rightsSourceType ?? 'unknown';
};

const verificationForRecord = (
  record: MediaRecord,
  rightsSourceType: MediaRightsSourceType,
  parsed: ParsedMediaRights,
  commercialUseAllowed?: boolean,
  attributionRequired?: boolean,
  sourcePage?: string,
  licenseUrl?: string,
): MediaVerificationStatus => {
  if (rightsSourceType === 'user-owned' || rightsSourceType === 'generated-editorial' || rightsSourceType === 'first-party-original') {
    return record.rightsVerificationStatus ?? record.verificationStatus ?? 'verified';
  }

  if (rightsSourceType === 'user-permission') {
    return sourcePage && commercialUseAllowed === true ? 'verified' : 'partial';
  }

  if (commercialUseAllowed === false) return 'review-needed';
  if (rightsSourceType === 'official-institutional' && commercialUseAllowed === undefined) return 'review-needed';
  if (rightsSourceType === 'user-supplied') return 'partial';

  const hasBasicEvidence = Boolean(
    sourcePage
    && record.license
    && commercialUseAllowed !== undefined
    && (attributionRequired === false || record.author),
  );
  const hasExactEvidence = Boolean(hasBasicEvidence && parsed.exactLicense && licenseUrl);

  if (hasExactEvidence) return 'verified';
  if (hasBasicEvidence || parsed.knownLicenseFamily) return 'partial';
  if (rightsSourceType === 'unknown') return 'partial';
  return 'review-needed';
};

export const normalizeMediaRightsRecord = (
  record: MediaRecord,
  entityId: string,
  usage: string,
): MediaRecord => {
  const parsed = parseMediaRights(record.license);
  const sourcePage = record.sourcePage ?? record.sourceUrl;
  const rightsSourceType = inferRightsSourceType(record, parsed);

  const preserveConfirmed = CONFIRMED_RIGHTS_SOURCE_TYPES.has(rightsSourceType);
  const commercialUseAllowed = preserveConfirmed
    ? record.commercialUseAllowed ?? parsed.commercialUseAllowed
    : parsed.commercialUseAllowed ?? record.commercialUseAllowed;
  const modificationAllowed = preserveConfirmed
    ? record.modificationAllowed ?? parsed.modificationAllowed
    : parsed.modificationAllowed ?? record.modificationAllowed;
  const attributionRequired = preserveConfirmed
    ? record.attributionRequired ?? parsed.attributionRequired
    : parsed.attributionRequired ?? record.attributionRequired;
  const licenseUrl = parsed.licenseUrl ?? record.licenseUrl;
  const verificationStatus = verificationForRecord(
    record,
    rightsSourceType,
    parsed,
    commercialUseAllowed,
    attributionRequired,
    sourcePage,
    licenseUrl,
  );

  const verificationMethod = (() => {
    if (rightsSourceType === 'user-owned' || rightsSourceType === 'generated-editorial' || rightsSourceType === 'first-party-original') {
      return record.verificationMethod;
    }
    if (rightsSourceType === 'user-permission') return 'partner-owner-authorization';
    if (rightsSourceType === 'official-institutional' && verificationStatus === 'review-needed') {
      return 'official-source-commercial-rights-review-needed';
    }
    if (rightsSourceType === 'user-supplied') return 'user-supplied-rights-evidence-pending';
    if (verificationStatus === 'verified') return 'canonical-source-license-rights-review';
    if (parsed.knownLicenseFamily) return 'canonical-license-family-rights-confirmed-version-pending';
    return record.verificationMethod ?? 'canonical-rights-review-needed';
  })();

  return {
    ...record,
    assetId: record.assetId ?? record.id,
    entityId: record.entityId ?? entityId,
    usage: record.usage ?? usage,
    availabilityStatus: record.availabilityStatus ?? 'present',
    rightsSourceType,
    rightsVerificationStatus: verificationStatus,
    sourcePage,
    originalFile: record.originalFile ?? originalFileFromSource(record.sourceUrl),
    licenseUrl,
    attribution: record.attribution
      ?? (record.author && record.license ? `${record.author} — ${record.license}` : undefined),
    commercialUseAllowed,
    modificationAllowed,
    attributionRequired,
    verificationStatus,
    verifiedAt: verificationStatus === 'verified' ? (record.verifiedAt ?? VERIFIED_AT) : undefined,
    verificationMethod,
  };
};
