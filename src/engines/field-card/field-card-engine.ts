import type { City, Country, FieldCardHeroContent, FieldCardPrimaryStoryContent, FieldCardQuickReadContent, FieldCardSecondaryStoryContent, FieldCardSection, ThingToDo } from '../../core/models/types';
import { editorialAdSlots } from '../../core/ads/slots';
import heroEditorial from '../../content/field-card-hero-copy.json';
import primaryStoryEditorial from '../../content/field-card-primary-story-copy.json';
import quickReadEditorial from '../../content/field-card-quick-read-copy.json';
import secondaryStoryEditorial from '../../content/field-card-secondary-story-copy.json';

const editorialHeroes = heroEditorial as Record<string, FieldCardHeroContent>;
const editorialPrimaryStories = primaryStoryEditorial as Record<string, FieldCardPrimaryStoryContent>;
const editorialQuickReads = quickReadEditorial as Record<string, FieldCardQuickReadContent>;
const editorialSecondaryStories = secondaryStoryEditorial as Record<string, FieldCardSecondaryStoryContent>;

const fallbackAliases = (thing: ThingToDo, city: City, country: Country) => {
  const tags = thing.spaCard?.handwrittenTags?.filter(Boolean) ?? [];
  if (tags.length === 3) return tags;
  return [city.name, country.name, thing.isLandmark ? 'Landmark' : 'Experience'];
};

const fallbackSteps = (thing: ThingToDo) => {
  const primaryTitles = thing.fieldCard.primaryStory?.chapters?.map((chapter) => chapter.title).filter(Boolean) ?? [];
  const secondaryTitles = thing.fieldCard.secondaryStory?.title ? [thing.fieldCard.secondaryStory.title] : [];
  const sectionTitles = thing.fieldCard.sections?.map((section) => section.title).filter(Boolean) ?? [];
  const titles = [...primaryTitles, ...secondaryTitles, ...sectionTitles];
  if (titles.length >= 4) return titles.slice(0, 4);
  return ['Getting there', 'Time on site', 'Cost', 'Best time'];
};

const fallbackHero = (thing: ThingToDo, city: City, country: Country): FieldCardHeroContent => ({
  eyebrow: `${thing.isLandmark ? 'FIELD NOTE' : 'EXPERIENCE NOTE'} · ${city.name.toUpperCase()}`,
  aliases: fallbackAliases(thing, city, country),
  description: thing.longDescription || thing.shortDescription,
  steps: fallbackSteps(thing),
  rhythmNote: thing.fieldCard.notes || thing.shortDescription,
  photoNote: thing.spaCard?.gettingThere || `${city.name} · ${country.name}`,
});

const fallbackPrimaryStory = (thing: ThingToDo, hero: FieldCardHeroContent): FieldCardPrimaryStoryContent => {
  const legacy = thing.fieldCard.sections ?? [];
  const first = legacy[0] ?? {
    title: 'Start here',
    body: thing.longDescription || thing.shortDescription,
  };
  const second = legacy[1] ?? {
    title: 'Before you go',
    body: thing.fieldCard.practical || thing.fieldCard.access || thing.spaCard?.gettingThere || thing.shortDescription,
  };
  return {
    chapters: [first, second],
    note: {
      label: 'FIELD NOTE',
      text: hero.photoNote || thing.spaCard?.gettingThere || thing.shortDescription,
    },
  };
};

const fallbackSecondaryStory = (thing: ThingToDo, legacySection?: FieldCardSection): FieldCardSecondaryStoryContent => {
  const fallbackBody = thing.fieldCard.practical || thing.fieldCard.notes || thing.longDescription || thing.shortDescription;
  return {
    label: 'FIELD NOTE',
    title: legacySection?.title || 'One thing worth knowing',
    body: legacySection?.body || fallbackBody,
    note: {
      label: 'KEEP CLOSE',
      text: thing.spaCard?.bestTime
        ? `Best time · ${thing.spaCard.bestTime}`
        : thing.spaCard?.gettingThere || 'Reconfirm the practical details locally before you go.',
    },
  };
};

const routeParts = (thing: ThingToDo) => String(thing.spaCard?.gettingThere ?? '').split('·').map((part) => part.trim()).filter(Boolean);

const fallbackQuickRead = (thing: ThingToDo, city: City, country: Country): FieldCardQuickReadContent => {
  const tags = thing.spaCard?.handwrittenTags?.filter(Boolean) ?? [];
  const route = routeParts(thing);
  const costType = thing.spaCard?.costType;
  return {
    time: {
      primary: thing.spaCard?.duration || 'Plan ahead',
      secondary: thing.spaCard?.bestTime ? `Best time · ${thing.spaCard.bestTime}` : 'Keep enough time for the visit',
    },
    route: {
      primary: route.length > 1 ? route[0] : city.name,
      secondary: route.length > 1 ? route.slice(1).join(' · ') : (thing.spaCard?.gettingThere || `${city.name} · ${country.name}`),
    },
    budget: {
      primary: costType === 'free' ? 'Free' : costType === 'paid' ? 'Paid' : 'Check locally',
      secondary: costType === 'free' ? 'No admission cost' : costType === 'paid' ? 'Confirm current price' : 'Current cost may vary',
    },
    bestFor: {
      primary: tags[0] || (thing.isLandmark ? 'Landmark' : 'Experience'),
      secondary: tags.slice(1).join(' · ') || thing.spaCard?.bestTime || `${city.name} · ${country.name}`,
    },
  };
};

export const fieldCardView = (thing: ThingToDo, city: City, country: Country) => {
  const hero = editorialHeroes[thing.id] ?? thing.fieldCard.hero ?? fallbackHero(thing, city, country);
  const quickRead = editorialQuickReads[thing.id] ?? thing.fieldCard.quickRead ?? fallbackQuickRead(thing, city, country);
  const generatedPrimaryStory = thing.fieldCard.primaryStory;
  const primaryStory = editorialPrimaryStories[thing.id] ?? generatedPrimaryStory ?? fallbackPrimaryStory(thing, hero);
  const sections = thing.fieldCard.sections ?? [];
  const primaryLegacyOffset = generatedPrimaryStory ? 0 : 2;
  const generatedSecondaryStory = thing.fieldCard.secondaryStory;
  const secondaryStory = editorialSecondaryStories[thing.id]
    ?? generatedSecondaryStory
    ?? fallbackSecondaryStory(thing, sections[primaryLegacyOffset]);
  const remainingSections = generatedSecondaryStory ? sections : sections.slice(primaryLegacyOffset + 1);
  const gallery = thing.media.fieldCard?.gallery ?? [];
  const heroImage = gallery[0] ?? thing.media.card?.image;
  const storyImage = gallery[1];

  return {
    thing,
    hero,
    quickRead,
    primaryStory,
    secondaryStory,
    heroImage,
    storyImage,
    remainingSections,
    relatedLabel: thing.isLandmark ? 'Landmark' : 'Experience',
    template: thing.fieldCard.template,
    adSlots: editorialAdSlots.slice(0, thing.fieldCard.template === 'deep' ? 4 : 2),
  };
};
