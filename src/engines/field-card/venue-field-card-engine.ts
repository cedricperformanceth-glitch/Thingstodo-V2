import type {
  FieldCardBeforeYouLeaveContent,
  FieldCardHeroContent,
  FieldCardPrimaryStoryContent,
  FieldCardSecondaryStoryContent,
  Place,
} from '../../core/models/types';
import type { VenueFieldCardContent } from '../../content/venue-field-card-editorial';
import { venueFieldCardLayouts } from '../../content/venue-field-card-layouts';
import { venueFieldCardLayoutProfiles } from '../../content/venue-field-card-registry';

const fallbackAliases = (place: Place, kindLabel: string) => {
  const source = place.spaCard?.handwrittenTags?.filter(Boolean) ?? [];
  return [...source, kindLabel, place.city.replaceAll('-', ' '), 'Personal note'].slice(0, 3);
};

const fallbackSteps = (content: VenueFieldCardContent) => {
  const titles = content.chapters.map((chapter) => chapter.title).filter(Boolean).slice(0, 4);
  while (titles.length < 4) titles.push('Read the practical notes');
  return titles;
};

const fallbackBeforeYouLeave = (place: Place): FieldCardBeforeYouLeaveContent => ({
  title: 'Keep the practical details flexible',
  body: 'This is a personal field note rather than a promise that every operational detail will stay unchanged. Use the experience here as context, then reconfirm anything time-sensitive directly with the venue when it matters to your stay.',
  note: {
    label: 'PERSONAL NOTE',
    text: `Open the current Google Maps listing before you book ${place.name}.`,
  },
});

export const venueFieldCardView = (place: Place, content: VenueFieldCardContent) => {
  const profile = venueFieldCardLayouts[place.id] ?? venueFieldCardLayoutProfiles[place.id];
  const gallery = place.media.fieldCard?.gallery ?? [];
  const aliases = profile?.hero.aliases ?? fallbackAliases(place, content.kindLabel);

  const hero: FieldCardHeroContent = {
    eyebrow: profile?.hero.eyebrow ?? `PERSONAL FIELD NOTE · ${place.city.toUpperCase()}`,
    aliases: aliases.length === 3 ? aliases : [...aliases, content.kindLabel, 'Personal note'].slice(0, 3),
    description: profile?.heroDescription ?? content.intro ?? place.shortDescription,
    steps: profile?.hero.steps ?? fallbackSteps(content),
    rhythmNote: profile?.hero.rhythmNote ?? place.shortDescription,
    photoNote: profile?.hero.photoNote ?? `Personal photos to add · ${place.address}`,
  };

  const primaryStory: FieldCardPrimaryStoryContent = {
    chapters: content.chapters.slice(0, 2).map((chapter, index) => ({
      label: profile?.chapterLabels[index] ?? 'FIELD NOTE',
      title: chapter.title,
      body: chapter.body,
    })),
    note: profile?.primaryNote ?? {
      label: 'MY TAKE',
      text: place.shortDescription,
    },
  };

  const secondaryChapters = content.chapters.slice(2, 4).map((chapter, offset) => ({
    label: profile?.chapterLabels[offset + 2] ?? 'FIELD NOTE',
    title: chapter.title,
    body: chapter.body,
  }));

  const fifthChapter = content.chapters[4];
  const derivedBeforeYouLeave: FieldCardBeforeYouLeaveContent | undefined = fifthChapter
    ? {
        title: fifthChapter.title,
        body: fifthChapter.body,
        note: profile?.beforeYouLeaveNote ?? {
          label: 'KEEP CLOSE',
          text: 'Use this as a personal field note and reconfirm anything time-sensitive locally.',
        },
      }
    : undefined;

  const secondaryStory: FieldCardSecondaryStoryContent | null = secondaryChapters.length
    ? {
        chapters: secondaryChapters,
        beforeYouLeave: derivedBeforeYouLeave ?? profile?.beforeYouLeave ?? fallbackBeforeYouLeave(place),
      }
    : null;

  return {
    template: content.chapters.length >= 4 ? 'deep' as const : 'compact' as const,
    hero,
    quickRead: profile?.quickRead ?? {
      time: { primary: '1+ NIGHTS', secondary: content.kindLabel },
      route: { primary: place.city.replaceAll('-', ' ').toUpperCase(), secondary: place.address },
      budget: { primary: 'CHECK CURRENT RATE', secondary: 'prices can change by date and room type' },
      bestFor: { primary: content.kindLabel.toUpperCase(), secondary: place.shortDescription },
    },
    primaryStory,
    secondaryStory,
    faq: content.faq,
    practicalNotes: profile?.practicalNotes ?? {
      items: [
        { label: 'Type', value: content.kindLabel },
        { label: 'Location', value: place.address },
        { label: 'Maps', value: 'Current listing available', detail: 'Use the Google Maps link on this field note.' },
        { label: 'Perspective', value: 'Personal field note', detail: 'The editorial story comes from the traveller’s own knowledge and experience.' },
      ],
    },
    gallery,
    heroImage: gallery[0] ?? place.media.card?.image,
    storyImage: gallery[1],
    secondaryImage: secondaryStory ? gallery[2] : undefined,
  };
};
