import type { MediaRecord } from '../core/models/types';

type DepictionPatch = Pick<MediaRecord, 'depictionType' | 'depictionSubject' | 'subjectMatch' | 'depictionNote'>;

const TAD_LO_ACTIVITY_SUBJECTS: Readonly<Record<string, string>> = {
  'thing-tad-hang-waterfall': 'Tad Hang Waterfall',
  'thing-tad-lo-waterfall': 'Tad Lo Waterfall',
  'thing-tad-soung-waterfall': 'Tad Soung Waterfall',
  'thing-katu-weaving-workshop': 'Katu weaving workshop near Tad Lo',
  'thing-lao-cooking-class-with-nyay': 'Lao cooking class with Nyay',
  'thing-tad-lo-treasure-hunt': 'Tad Lo Treasure Hunt',
  'thing-fandee-adventure-park': 'Fandee Adventure Park',
  'thing-coffee-and-katu-culture-with-mr-hook': 'Coffee and Katu culture with Mr Hook',
  'thing-coffee-from-tree-to-cup-with-mr-vieng': 'Coffee from tree to cup with Mr Vieng',
  'thing-vat-paa-forest-buddha-and-mystery-cave': 'Vat Paa forest, Buddha and mystery cave',
  'thing-tad-lo-half-day-guided-trek': 'Tad Lo half-day guided trek',
  'thing-tad-lo-two-day-village-trek': 'Tad Lo two-day village trek',
  'thing-traditional-lao-massage-in-tad-lo': 'Traditional Lao massage experience in Tad Lo',
  'thing-tad-lo-riverside-village-walk': 'Tad Lo riverside village walk',
};

const TAD_LO_CONTEXTUAL_ACTIVITY_IDS = new Set([
  'thing-tad-lo-half-day-guided-trek',
  'thing-tad-lo-two-day-village-trek',
  'thing-tad-lo-riverside-village-walk',
]);

const applyDepictionPatch = (record: MediaRecord, patch: DepictionPatch): MediaRecord => ({
  ...record,
  ...patch,
});

const activityDepictionPatch = (record: MediaRecord, entityId: string): DepictionPatch | undefined => {
  if (entityId === 'thing-traditional-lao-massage-in-tad-lo') {
    return {
      depictionType: 'local-context',
      depictionSubject: TAD_LO_ACTIVITY_SUBJECTS[entityId],
      subjectMatch: 'contextual',
      depictionNote: 'Editorial massage context only. The photograph shows a spa setting in Luang Prabang and is intentionally used to represent Lao massage as an experience; it does not claim to depict the private Tad Lo massage location.',
    };
  }

  if (
    entityId === 'thing-katu-weaving-workshop'
    && (record.id === 'katu-weaving-ban-lao-ngam-leclercq-1' || record.id === 'katu-weaving-ban-lao-ngam-leclercq-4')
  ) {
    return {
      depictionType: 'local-context',
      depictionSubject: TAD_LO_ACTIVITY_SUBJECTS[entityId],
      subjectMatch: 'contextual',
      depictionNote: 'Regional Katu weaving context from Ban Lao Ngam. The image supports the activity theme but is not claimed as a documentary photograph of the specific Tad Lo workshop.',
    };
  }

  if (TAD_LO_CONTEXTUAL_ACTIVITY_IDS.has(entityId)) {
    return {
      depictionType: 'local-context',
      depictionSubject: TAD_LO_ACTIVITY_SUBJECTS[entityId],
      subjectMatch: 'contextual',
      depictionNote: 'Tad Lo and Bolaven Plateau context for an experience or route; the image does not claim to document every stage of the activity.',
    };
  }

  if (TAD_LO_ACTIVITY_SUBJECTS[entityId]) {
    return {
      depictionType: 'exact-subject',
      depictionSubject: TAD_LO_ACTIVITY_SUBJECTS[entityId],
      subjectMatch: 'exact',
      depictionNote: entityId === 'thing-tad-lo-waterfall'
        ? 'The image depicts Tad Lo Waterfall itself. Depiction classification is independent of whether the photograph is Wikimedia or site-owner media.'
        : 'The image is curated to depict the named Tad Lo attraction or hosted experience itself. Rights provenance is classified separately from subject matching.',
    };
  }

  if (entityId === 'thing-xai-kong-nyai-beach' && /artwork|drawing|illustration/i.test(`${record.sourceName ?? ''} ${record.alt ?? ''}`)) {
    return {
      depictionType: 'illustrative',
      depictionSubject: 'Xai Kong Nyai Beach',
      subjectMatch: 'illustrative',
      depictionNote: 'Editorial artwork representing Xai Kong Nyai Beach; it is not classified as documentary photography. Rights provenance remains separate and must not be inferred from the depiction type.',
    };
  }

  return undefined;
};

const cityFieldDepictionPatch = (record: MediaRecord, entityId: string): DepictionPatch | undefined => {
  if (entityId === 'city-laos-pakse') {
    if (record.id === 'pakse-field-note-tad-fane' || record.id === 'pakse-field-note-wat-phou') {
      return {
        depictionType: 'local-context',
        depictionSubject: 'Pakse destination and southern Laos day-trip landscape',
        subjectMatch: 'contextual',
        depictionNote: 'Important excursion context for a Pakse stay, but outside the compact city itself; the image is not claimed as an exact in-city view.',
      };
    }

    if (record.id === 'pakse-field-note-xe-don-panorama' || record.id === 'pakse-field-note-golden-buddha') {
      return {
        depictionType: 'exact-place',
        depictionSubject: 'Pakse city and immediate overlook',
        subjectMatch: 'exact',
        depictionNote: 'Exact-place Pakse imagery: either an in-city view or an immediate Pakse overlook that directly documents the city setting.',
      };
    }
  }

  return undefined;
};

export const applyCanonicalActivityDepictionPolicy = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || !entityId) return media;
  return media.map((record) => {
    const patch = activityDepictionPatch(record, entityId);
    return patch ? applyDepictionPatch(record, patch) : record;
  });
};

export const applyCanonicalCityFieldDepictionPolicy = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || !entityId) return media;
  return media.map((record) => {
    const patch = cityFieldDepictionPatch(record, entityId);
    return patch ? applyDepictionPatch(record, patch) : record;
  });
};
