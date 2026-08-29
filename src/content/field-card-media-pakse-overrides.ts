import type { MediaRecord } from '../core/models/types';

type DepictionPatch = Pick<MediaRecord, 'depictionType' | 'depictionSubject' | 'subjectMatch' | 'depictionNote'>;

const VERIFIED_AT = '2026-08-29';

const PAKSE_ACTIVITY_IDS = new Set([
  'thing-vat-phou',
  'thing-tad-fane',
  'thing-tad-yuang',
  'thing-bolaven-coffee-route',
  'thing-wat-phou-salao',
  'thing-wat-luang',
  'thing-dao-heuang-market',
  'thing-tad-champee',
  'thing-champasak-riverside',
]);

/**
 * Exact licence versions checked against the individual Wikimedia Commons source pages.
 * Media absent from this map keep their repository licence string and remain partial when
 * that string omits the licence version (for example `cc-by` or `cc-by-sa`).
 */
const VERIFIED_COMMONS_LICENSES: Readonly<Record<string, string>> = {
  'commons-93676440': 'CC BY-SA 4.0',
  'commons-162280669': 'CC BY 4.0',
  'commons-79748148': 'CC BY-SA 4.0',
  'commons-79745911': 'CC BY-SA 4.0',
  'commons-145368536': 'CC BY 2.0',
  'commons-79746059': 'CC BY-SA 4.0',
  'commons-79768508': 'CC BY-SA 4.0',
  'commons-79768509': 'CC BY-SA 4.0',
  'commons-79768510': 'CC BY-SA 4.0',
  'commons-181112488': 'CC BY 4.0',
  'commons-113474055': 'CC BY-SA 4.0',
  'commons-92730673': 'CC BY-SA 4.0',
  'commons-181194619': 'CC BY 4.0',
  'commons-181194698': 'CC BY 4.0',
  'commons-29462651': 'CC BY-SA 3.0',
  'commons-79746186': 'CC BY-SA 4.0',
  'commons-79769584': 'CC BY-SA 4.0',
  'commons-94200344': 'CC BY-SA 4.0',
};

const PAKSE_ACTIVITY_SUBJECTS: Readonly<Record<string, string>> = {
  'thing-vat-phou': 'Vat Phou archaeological and cultural landscape',
  'thing-tad-fane': 'Tad Fane Waterfall',
  'thing-tad-yuang': 'Tad Yuang Waterfall',
  'thing-bolaven-coffee-route': 'Bolaven Plateau coffee route',
  'thing-wat-phou-salao': 'Wat Phou Salao and Golden Buddha',
  'thing-wat-luang': 'Wat Luang in Pakse',
  'thing-dao-heuang-market': 'Dao Heuang Market',
  'thing-tad-champee': 'Tad Champee Waterfall',
  'thing-champasak-riverside': 'Champasak riverside town',
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
  if (normalized === 'CC BY 2.0') {
    return {
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
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

const depictionForActivity = (entityId: string): DepictionPatch => {
  const depictionSubject = PAKSE_ACTIVITY_SUBJECTS[entityId] ?? 'Pakse activity context';

  if (entityId === 'thing-bolaven-coffee-route') {
    return {
      depictionType: 'local-context',
      depictionSubject,
      subjectMatch: 'contextual',
      depictionNote: 'Bolaven Plateau coffee-growing context; the gallery does not claim to document every stop of the route.',
    };
  }

  if (entityId === 'thing-champasak-riverside') {
    return {
      depictionType: 'exact-place',
      depictionSubject,
      subjectMatch: 'exact',
      depictionNote: 'Exact-place imagery from Champasak town and its riverside setting, curated for the Pakse day-trip Field Card.',
    };
  }

  return {
    depictionType: 'exact-subject',
    depictionSubject,
    subjectMatch: 'exact',
    depictionNote: 'The gallery is curated to depict the named Pakse activity subject, attraction or landmark itself.',
  };
};

const cityFieldNoteDepiction = (): DepictionPatch => ({
  depictionType: 'exact-place',
  depictionSubject: 'Pakse and its southern Laos day-trip landscape',
  subjectMatch: 'exact',
  depictionNote: 'Pakse and surrounding destination imagery curated for the monetizable City Field Note.',
});

const enrichPakseMediaRecord = (
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
  const hasBasicRightsEvidence = Boolean(sourcePage && correctedRecord.author && correctedRecord.license && commercialUseAllowed !== undefined);
  const hasExactLicenceEvidence = Boolean(hasBasicRightsEvidence && licenseUrl);
  const verificationStatus = correctedRecord.verificationStatus
    ?? (commercialUseAllowed === false ? 'review-needed' : hasExactLicenceEvidence ? 'verified' : 'partial');

  return {
    ...correctedRecord,
    assetId: correctedRecord.assetId ?? correctedRecord.id,
    entityId: correctedRecord.entityId ?? entityId,
    usage: correctedRecord.usage ?? usage,
    availabilityStatus: correctedRecord.availabilityStatus ?? 'present',
    rightsSourceType: correctedRecord.rightsSourceType
      ?? (correctedRecord.sourceType === 'wikimedia'
        ? 'wikimedia-open-license'
        : correctedRecord.sourceType === 'public-domain'
          ? 'public-domain'
          : correctedRecord.sourceType === 'first-party-official'
            ? 'first-party-official'
            : 'unknown'),
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
        ? verifiedLicense
          ? 'commons-source-page-rights-review'
          : 'repository-metadata-rights-review'
        : hasBasicRightsEvidence
          ? 'repository-metadata-license-version-pending'
          : undefined),
    depictionType: correctedRecord.depictionType ?? depiction.depictionType,
    depictionSubject: correctedRecord.depictionSubject ?? depiction.depictionSubject,
    subjectMatch: correctedRecord.subjectMatch ?? depiction.subjectMatch,
    depictionNote: correctedRecord.depictionNote ?? depiction.depictionNote,
  };
};

export const applyPakseActivityMediaCorrections = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || !entityId || !PAKSE_ACTIVITY_IDS.has(entityId)) return media;
  const depiction = depictionForActivity(entityId);
  return media.map((record) => enrichPakseMediaRecord(record, entityId, 'monetized-activity-page', depiction));
};

export const applyPakseCityFieldNoteMediaCorrections = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || entityId !== 'city-laos-pakse') return media;
  const depiction = cityFieldNoteDepiction();
  return media.map((record) => enrichPakseMediaRecord(record, entityId, 'monetized-city-field-note', depiction));
};
