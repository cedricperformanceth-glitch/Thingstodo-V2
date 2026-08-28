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

export type ActivityAdSlot = typeof activityAdSlots[keyof typeof activityAdSlots];
export type AdSlot = EditorialAdSlot | ActivityAdSlot;
