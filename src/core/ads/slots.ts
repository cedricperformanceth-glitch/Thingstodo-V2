export type EditorialAdSlot = 'editorial-inline-1' | 'editorial-inline-2' | 'editorial-inline-3' | 'editorial-inline-4';

export const editorialAdSlots: EditorialAdSlot[] = [
  'editorial-inline-1',
  'editorial-inline-2',
  'editorial-inline-3',
  'editorial-inline-4',
];

export const activityAdSlots = {
  underHero: 'activity-under-hero',
  afterChapterOne: 'activity-after-chapter-one',
  beforeFaq: 'activity-before-faq',
  afterBeforeYouLeave: 'activity-after-before-you-leave',
  afterFinalCta: 'activity-after-final-cta',
} as const;

export const cityFieldNoteAdSlots = {
  beforeChapterOne: 'city-field-note-before-chapter-one',
  afterChapterTwo: 'city-field-note-after-chapter-two',
  afterChapterFour: 'city-field-note-after-chapter-four',
  afterChapterSeven: 'city-field-note-after-chapter-seven',
} as const;

export type ActivityAdSlot = typeof activityAdSlots[keyof typeof activityAdSlots];
export type CityFieldNoteAdSlot = typeof cityFieldNoteAdSlots[keyof typeof cityFieldNoteAdSlots];
export type AdSlot = EditorialAdSlot | ActivityAdSlot | CityFieldNoteAdSlot;
