import type { MediaRecord } from '../core/models/types';

type MediaRecordPatch = Partial<MediaRecord>;

/**
 * Canonical Don Det media metadata corrections.
 * The Christophe95 records belong to the same Don Det / Don Khon Wikimedia Commons upload series
 * licensed CC BY-SA 4.0. The tubing supplement reuses a verified Don Det Mekong Commons image
 * rather than introducing an unsourced or commercial photograph.
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

const tubingSupplement: MediaRecord = {
  id: 'tubing-don-det-golden-hour-pirogue',
  src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pirogue_running_on_the_Mekong_at_golden_hour_between_Don_Det_and_Don_Khon_Laos.jpg?width=1600',
  alt: 'Golden-hour Mekong channel between Don Det and Don Khon, showing the exact river setting used for late-afternoon tubing',
  sourceType: 'wikimedia',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pirogue_running_on_the_Mekong_at_golden_hour_between_Don_Det_and_Don_Khon_Laos.jpg',
  sourceName: 'Wikimedia Commons',
  author: 'Basile Morin',
  license: 'CC BY-SA 4.0',
  manual: true,
  locked: true,
};

export const applyDonDetMediaCorrections = (media?: MediaRecord[]): MediaRecord[] | undefined => {
  if (!media?.length) return media;

  const corrected = media.some((record) => donDetMediaRecordOverrides[record.id])
    ? media.map((record) => {
        const patch = donDetMediaRecordOverrides[record.id];
        return patch ? { ...record, ...patch } : record;
      })
    : media;

  const isTubingSet = corrected.some((record) => record.id === 'tubing-don-det-mekong-view');
  const alreadyComplete = corrected.some((record) => record.id === tubingSupplement.id);
  return isTubingSet && !alreadyComplete ? [...corrected, tubingSupplement] : corrected;
};
