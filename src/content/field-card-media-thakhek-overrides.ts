import type { MediaRecord } from '../core/models/types';

type MediaRecordPatch = Partial<MediaRecord> & { remove?: boolean };

/**
 * Canonical corrections for Thakhek third-party media metadata.
 * Keep this layer small: it only fixes records whose upstream licence/author metadata was
 * incomplete or whose src is not a directly renderable image.
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

export const applyThakhekMediaCorrections = (media?: MediaRecord[]): MediaRecord[] | undefined => {
  if (!media?.length) return media;
  if (!media.some((record) => thakhekMediaRecordOverrides[record.id])) return media;

  return media.flatMap((record) => {
    const patch = thakhekMediaRecordOverrides[record.id];
    if (!patch) return [record];
    if (patch.remove) return [];
    const { remove: _remove, ...fields } = patch;
    return [{ ...record, ...fields }];
  });
};
