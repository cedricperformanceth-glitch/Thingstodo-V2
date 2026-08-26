import type { MediaRecord } from '../core/models/types';

type MediaRecordPatch = Partial<MediaRecord>;

/**
 * Canonical Don Det media metadata corrections.
 * These records are Christophe95 Wikimedia Commons photographs from the same Don Det / Don Khon
 * upload series; Commons identifies that series under CC BY-SA 4.0.
 */
export const donDetMediaRecordOverrides: Readonly<Record<string, MediaRecordPatch>> = {
  'khone-pa-soi-falls-christophe95': {
    author: 'Christophe95',
    license: 'CC BY-SA 4.0',
  },
  'khone-pa-soi-fishing-net-christophe95': {
    author: 'Christophe95',
    license: 'CC BY-SA 4.0',
  },
  'khone-pa-soy-bridge-christophe95': {
    author: 'Christophe95',
    license: 'CC BY-SA 4.0',
  },
};

export const applyDonDetMediaCorrections = (media?: MediaRecord[]): MediaRecord[] | undefined => {
  if (!media?.length) return media;
  if (!media.some((record) => donDetMediaRecordOverrides[record.id])) return media;

  return media.map((record) => {
    const patch = donDetMediaRecordOverrides[record.id];
    return patch ? { ...record, ...patch } : record;
  });
};
