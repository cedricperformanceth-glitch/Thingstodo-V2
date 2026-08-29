import type { MediaRecord } from '../core/models/types';

type Replacement = {
  entityId: string;
  patch: Partial<MediaRecord>;
};

/**
 * Owner-approved replacements for three UNESCO-sourced Thakhek media records.
 * These substitutions intentionally trade exact-place certainty for stronger, explicit
 * Wikimedia Commons commercial reuse licences. They must remain contextual unless a source
 * explicitly establishes that the photographed frame is the exact activity location.
 */
const THAKHEK_APPROVED_COMMONS_REPLACEMENTS: Readonly<Record<string, Replacement>> = {
  'hin-nam-no-landscape-giz-profeb': {
    entityId: 'thing-hin-nam-no-national-park',
    patch: {
      id: 'hin-nam-no-khammouane-karst-felix-stahlberg',
      src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/2013-09-27-IMG_0083_(16113505469).jpg?width=1600',
      alt: 'Karst and river landscape in Khammouane Province, Laos, used as regional context for Hin Nam No National Park',
      sourceType: 'wikimedia',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:2013-09-27-IMG_0083_(16113505469).jpg',
      sourceName: 'Wikimedia Commons',
      author: 'Felix Stahlberg',
      license: 'CC BY 2.0',
      manual: true,
      locked: true,
      depictionType: 'local-context',
      depictionSubject: 'Hin Nam No National Park and the Khammouane karst landscape',
      subjectMatch: 'contextual',
      depictionNote: 'Regional Khammouane karst-and-river photograph used as local context for Hin Nam No. The Wikimedia source confirms Khammouane Province but does not establish that this frame was captured inside Hin Nam No National Park.',
    },
  },
  'hin-nam-no-karst-ryan-deboodt': {
    entityId: 'thing-hin-nam-no-national-park',
    patch: {
      id: 'hin-nam-no-khammouane-river-mountains-prince-roy',
      src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/River_and_Mountains_of_Khammouane.jpg?width=1600',
      alt: 'River and mountain landscape in Khammouane Province, Laos, used as regional context for Hin Nam No National Park',
      sourceType: 'wikimedia',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:River_and_Mountains_of_Khammouane.jpg',
      sourceName: 'Wikimedia Commons',
      author: 'Prince Roy',
      license: 'CC BY 2.0',
      manual: true,
      locked: true,
      depictionType: 'local-context',
      depictionSubject: 'Hin Nam No National Park and the Khammouane karst landscape',
      subjectMatch: 'contextual',
      depictionNote: 'Regional Khammouane river-and-mountain photograph used as local context for Hin Nam No. The Wikimedia source confirms Khammouane Province but does not establish that this frame was captured inside Hin Nam No National Park.',
    },
  },
  'xe-bang-fai-lower-entrance': {
    entityId: 'thing-xe-bang-fai-cave',
    patch: {
      id: 'xe-bang-fai-river-context-italian-walrus-63',
      src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/XeBanFai.jpg?width=1600',
      alt: 'Xe Bang Fai River downstream of Ban Chalou in Khammouane, used as local river context for Xe Bang Fai Cave',
      sourceType: 'wikimedia',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:XeBanFai.jpg',
      sourceName: 'Wikimedia Commons',
      author: 'Italian walrus-63',
      license: 'CC BY-SA 3.0',
      manual: true,
      locked: true,
      depictionType: 'local-context',
      depictionSubject: 'Xe Bang Fai Cave and river system in Khammouane',
      subjectMatch: 'contextual',
      depictionNote: 'Photograph of the Xe Bang Fai River downstream of Ban Chalou, used as local river context for the cave experience. It is not claimed to depict the cave entrance itself.',
    },
  },
};

export const applyThakhekApprovedCommonsReplacements = (
  media?: MediaRecord[],
  entityId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || !entityId) return media;

  const hasReplacement = media.some((record) => {
    const replacement = THAKHEK_APPROVED_COMMONS_REPLACEMENTS[record.id];
    return replacement?.entityId === entityId;
  });
  if (!hasReplacement) return media;

  return media.map((record) => {
    const replacement = THAKHEK_APPROVED_COMMONS_REPLACEMENTS[record.id];
    if (!replacement || replacement.entityId !== entityId) return record;
    return { ...record, ...replacement.patch };
  });
};
