import type { MediaRecord } from '../core/models/types';

type MediaRecordPatch = Partial<MediaRecord> & { remove?: boolean };
type DepictionPatch = Pick<MediaRecord, 'depictionType' | 'depictionSubject' | 'subjectMatch' | 'depictionNote'>;

const VERIFIED_AT = '2026-08-29';

const THAKHEK_ACTIVITY_IDS = new Set([
  'thing-thakhek-loop',
  'thing-kong-lor-cave',
  'thing-xe-bang-fai-cave',
  'thing-tham-xiang-liap-cave',
  'thing-tham-chang-elephant-cave',
  'thing-tham-pha-buddha-cave',
  'thing-tha-falang',
  'thing-khoun-kong-leng',
  'thing-thalang-nam-theun-reservoir',
  'thing-pha-inh-cave',
  'thing-cool-springs-loop',
  'thing-dragon-cave',
  'thing-sandstone-buddhas',
  'thing-phou-pha-marn-viewpoint',
  'thing-old-thakhek-mekong',
  'thing-sikhottabong-stupa',
  'thing-hin-nam-no-national-park',
]);

const THAKHEK_EXACT_PLACE_ACTIVITY_IDS = new Set([
  'thing-tha-falang',
  'thing-khoun-kong-leng',
  'thing-thalang-nam-theun-reservoir',
  'thing-cool-springs-loop',
  'thing-phou-pha-marn-viewpoint',
  'thing-old-thakhek-mekong',
  'thing-hin-nam-no-national-park',
]);

const THAKHEK_ACTIVITY_SUBJECTS: Readonly<Record<string, string>> = {
  'thing-thakhek-loop': 'Thakhek Loop road journey through Khammouane',
  'thing-kong-lor-cave': 'Kong Lor Cave',
  'thing-xe-bang-fai-cave': 'Xe Bang Fai Cave',
  'thing-tham-xiang-liap-cave': 'Tham Xiang Liap Cave',
  'thing-tham-chang-elephant-cave': 'Tham Chang / Elephant Cave',
  'thing-tham-pha-buddha-cave': 'Tham Pha / Buddha Cave',
  'thing-tha-falang': 'Tha Falang riverside site',
  'thing-khoun-kong-leng': 'Khoun Kong Leng spring and lake',
  'thing-thalang-nam-theun-reservoir': 'Thalang and Nam Theun 2 reservoir',
  'thing-pha-inh-cave': 'Pha Inh / Phan Ya In Cave',
  'thing-cool-springs-loop': 'Cool Springs on the Thakhek Loop',
  'thing-dragon-cave': 'Dragon Cave',
  'thing-sandstone-buddhas': 'Sandstone Buddhas beside Route 1E',
  'thing-phou-pha-marn-viewpoint': 'Phou Pha Marn / The Rock ViewPoint',
  'thing-old-thakhek-mekong': 'Old Thakhek and Mekong riverfront',
  'thing-sikhottabong-stupa': 'Sikhottabong Stupa',
  'thing-hin-nam-no-national-park': 'Hin Nam No National Park',
};

/**
 * Canonical corrections for Thakhek third-party media metadata.
 * These are deliberately asset-specific: they only fix records whose upstream metadata was
 * incomplete, or remove a record whose src is not directly renderable as an image.
 */
export const thakhekMediaRecordOverrides: Readonly<Record<string, MediaRecordPatch>> = {
  'pha-inh-cave-adriaan-castermans': {
    author: 'Adriaan Castermans',
    license: 'CC BY-SA 3.0',
  },
  'pha-inh-cave-surroundings-adriaan-castermans': {
    author: 'Adriaan Castermans',
    license: 'CC BY-SA 3.0',
  },
  'tha-falang-second-view': {
    author: 'Aleksey Gnilenkov',
    license: 'CC BY 2.0',
  },
  'nam-theun-2-panoramio-1': {
    author: 'chalongrat hantragul',
    license: 'CC BY 3.0',
  },
  'nam-theun-2-panoramio-2': {
    author: 'chalongrat hantragul',
    license: 'CC BY 3.0',
  },
  'xe-bang-fai-river-passage': {
    remove: true,
  },
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
      attributionRequired: normalized.includes('BY') || normalized.includes('ATTRIBUTION'),
    };
  }

  const ccMatch = normalized.match(/^CC BY(-SA)? (\d+(?:\.\d+)?)$/);
  if (ccMatch) {
    const shareAlike = Boolean(ccMatch[1]);
    const version = ccMatch[2];
    return {
      licenseUrl: `https://creativecommons.org/licenses/${shareAlike ? 'by-sa' : 'by'}/${version}/`,
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

  if (normalized.includes('NO DERIVATIVES') || normalized.includes('NODERIVATIVES')) {
    return {
      modificationAllowed: false,
      attributionRequired: normalized.includes('ATTRIBUTION'),
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

const isUserSupplied = (record: MediaRecord): boolean => (
  /user-supplied/i.test(`${record.sourceName ?? ''} ${record.license ?? ''}`)
);

const isIllustrativeRecord = (record: MediaRecord): boolean => (
  /drawing|illustration/i.test(`${record.sourceName ?? ''} ${record.alt ?? ''}`)
);

const isOfficialInstitutionalMedia = (record: MediaRecord): boolean => (
  record.sourceType === 'first-party-official'
  || /UNESCO World Heritage Centre/i.test(record.sourceName ?? '')
);

const rightsSourceTypeFromRecord = (record: MediaRecord): MediaRecord['rightsSourceType'] => {
  if (record.rightsSourceType) return record.rightsSourceType;
  if (record.sourceType === 'wikimedia') return 'wikimedia-open-license';
  if (record.sourceType === 'public-domain') return 'public-domain';
  if (isOfficialInstitutionalMedia(record)) return 'first-party-official';
  if (isUserSupplied(record)) return 'user-supplied';
  return 'unknown';
};

const depictionForActivity = (record: MediaRecord, entityId: string): DepictionPatch => {
  const depictionSubject = THAKHEK_ACTIVITY_SUBJECTS[entityId] ?? 'Thakhek activity context';

  if (isIllustrativeRecord(record)) {
    return {
      depictionType: 'illustrative',
      depictionSubject,
      subjectMatch: 'illustrative',
      depictionNote: 'Editorial illustration supplied for this Thakhek activity; it is not classified as documentary photography.',
    };
  }

  if (entityId === 'thing-thakhek-loop' || /context/i.test(record.id)) {
    return {
      depictionType: 'local-context',
      depictionSubject,
      subjectMatch: 'contextual',
      depictionNote: 'Khammouane local context curated for this activity; the image does not necessarily depict the complete activity or route.',
    };
  }

  if (THAKHEK_EXACT_PLACE_ACTIVITY_IDS.has(entityId)) {
    return {
      depictionType: 'exact-place',
      depictionSubject,
      subjectMatch: 'exact',
      depictionNote: 'The image is curated as an exact-place view for this Thakhek activity or destination area.',
    };
  }

  return {
    depictionType: 'exact-subject',
    depictionSubject,
    subjectMatch: 'exact',
    depictionNote: 'The image is curated to depict the named Thakhek activity subject, cave, monument or attraction itself.',
  };
};

const cityFieldNoteDepiction = (record: MediaRecord): DepictionPatch => {
  if (record.id === 'thakhek-field-note-road-to-caves') {
    return {
      depictionType: 'local-context',
      depictionSubject: 'Khammouane cave-road landscape east of Thakhek',
      subjectMatch: 'contextual',
      depictionNote: 'Regional road and karst context supporting the Thakhek City Field Note; it is not an in-city view.',
    };
  }

  return {
    depictionType: 'exact-place',
    depictionSubject: 'Thakhek city and Mekong riverfront',
    subjectMatch: 'exact',
    depictionNote: 'Exact-place Thakhek imagery curated for the monetizable City Field Note.',
  };
};

const enrichThakhekMediaRecord = (
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
  const officialCommercialRightsUnclear = isOfficialInstitutionalMedia(record)
    && commercialUseAllowed === undefined;
  const userSuppliedRightsUnclear = isUserSupplied(record)
    && commercialUseAllowed === undefined;
  const hasExactRightsEvidence = Boolean(
    sourcePage
    && record.license
    && commercialUseAllowed !== undefined
    && (attributionRequired === false || record.author)
    && (licenseUrl || record.sourceType === 'public-domain'),
  );
  const hasPartialRightsEvidence = Boolean(sourcePage && record.license);
  const verificationStatus = record.verificationStatus
    ?? (commercialUseAllowed === false || officialCommercialRightsUnclear
      ? 'review-needed'
      : hasExactRightsEvidence
        ? 'verified'
        : 'partial');

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
        : officialCommercialRightsUnclear
          ? 'official-source-commercial-rights-review-needed'
          : userSuppliedRightsUnclear
            ? 'user-supplied-rights-evidence-pending'
            : hasPartialRightsEvidence
              ? 'repository-metadata-rights-review-pending'
              : undefined),
    depictionType: record.depictionType ?? depiction.depictionType,
    depictionSubject: record.depictionSubject ?? depiction.depictionSubject,
    subjectMatch: record.subjectMatch ?? depiction.subjectMatch,
    depictionNote: record.depictionNote ?? depiction.depictionNote,
  };
};

const applyCanonicalRecordCorrections = (media: MediaRecord[]): MediaRecord[] => (
  media.flatMap((record) => {
    const patch = thakhekMediaRecordOverrides[record.id];
    if (!patch) return [record];
    if (patch.remove) return [];
    const { remove: _remove, ...fields } = patch;
    return [{ ...record, ...fields }];
  })
);

export const applyThakhekMediaCorrections = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length) return media;

  const corrected = media.some((record) => thakhekMediaRecordOverrides[record.id])
    ? applyCanonicalRecordCorrections(media)
    : media;

  if (!entityId || !THAKHEK_ACTIVITY_IDS.has(entityId)) return corrected;
  return corrected.map((record) => enrichThakhekMediaRecord(
    record,
    entityId,
    'monetized-activity-page',
    depictionForActivity(record, entityId),
  ));
};

export const applyThakhekCityFieldNoteMediaCorrections = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || entityId !== 'city-laos-thakhek') return media;
  return media.map((record) => enrichThakhekMediaRecord(
    record,
    entityId,
    'monetized-city-field-note',
    cityFieldNoteDepiction(record),
  ));
};
