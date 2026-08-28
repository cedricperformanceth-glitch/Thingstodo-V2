import type { MediaRecord } from '../core/models/types';

type MediaRecordPatch = Partial<MediaRecord>;

const DON_DET_THING_IDS = new Set([
  'thing-old-french-railway-bridge',
  'thing-li-phi-somphamit-waterfalls',
  'thing-khone-phapheng-falls',
  'thing-don-som-island',
  'thing-khone-pa-soi-waterfall',
  'thing-xai-kong-nyai-beach',
  'thing-si-phan-don-by-boat',
  'thing-4000-islands-kayaking',
  'thing-cycle-don-det-don-khon',
  'thing-don-det-tubing',
  'thing-don-det-sunset',
]);

const DON_DET_MEDIA_ID_PREFIXES = [
  'don-det-',
  'don-som-',
  'li-phi-',
  'khone-phapheng-',
  'khone-pa-',
  'xai-kong-',
  'si-phan-don-',
  '4000-islands-',
  'cycle-don-det-',
  'tubing-don-det-',
];

/** Canonical Don Det media metadata corrections and provenance normalization. */
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
  'xai-kong-nyai-beach-riverboats': {
    provenance: 'original-illustration',
    treatment: 'none',
    rightsBasis: 'creator-owned',
    sourceName: 'Original Atlas illustration',
    license: 'Creator-owned',
  },
};

const isDonDetMediaSet = (media: MediaRecord[], thingId?: string) =>
  (thingId ? DON_DET_THING_IDS.has(thingId) : false)
  || media.some((record) => DON_DET_MEDIA_ID_PREFIXES.some((prefix) => record.id.startsWith(prefix)));

const wikimediaRightsBasis = (license?: string): MediaRecord['rightsBasis'] => {
  const normalized = String(license ?? '').trim().toLowerCase();
  return normalized.includes('cc0') || normalized.includes('public domain')
    ? 'public-domain'
    : 'open-license';
};

const classifyDonDetRecord = (record: MediaRecord): MediaRecord => {
  const patch = donDetMediaRecordOverrides[record.id];
  const corrected = patch ? { ...record, ...patch } : record;

  if (corrected.sourceType === 'wikimedia') {
    return {
      ...corrected,
      provenance: 'wikimedia',
      treatment: 'none',
      rightsBasis: wikimediaRightsBasis(corrected.license),
    };
  }

  return corrected;
};

const tubingSupplement: MediaRecord = {
  id: 'tubing-don-det-golden-hour-pirogue',
  src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pirogue_running_on_the_Mekong_at_golden_hour_between_Don_Det_and_Don_Khon_Laos.jpg?width=1600',
  alt: 'Golden-hour Mekong channel between Don Det and Don Khon, showing the exact river setting used for late-afternoon tubing',
  sourceType: 'wikimedia',
  provenance: 'wikimedia',
  treatment: 'none',
  rightsBasis: 'open-license',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pirogue_running_on_the_Mekong_at_golden_hour_between_Don_Det_and_Don_Khon_Laos.jpg',
  sourceName: 'Wikimedia Commons',
  author: 'Basile Morin',
  license: 'CC BY-SA 4.0',
  manual: true,
  locked: true,
};

export const applyDonDetMediaCorrections = (
  media?: MediaRecord[],
  thingId?: string,
): MediaRecord[] | undefined => {
  if (!media?.length || !isDonDetMediaSet(media, thingId)) return media;

  const corrected = media.map(classifyDonDetRecord);
  const isTubingSet = corrected.some((record) => record.id === 'tubing-don-det-mekong-view');
  const alreadyComplete = corrected.some((record) => record.id === tubingSupplement.id);
  const completed = isTubingSet && !alreadyComplete ? [...corrected, tubingSupplement] : corrected;

  return completed.map(classifyDonDetRecord);
};
