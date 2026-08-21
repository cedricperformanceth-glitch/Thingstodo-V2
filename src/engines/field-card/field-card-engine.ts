import type { City, Country, FieldCardHeroContent, FieldCardPracticalContent, FieldCardPrimaryStoryContent, FieldCardQuickReadContent, FieldCardSecondaryStoryContent, FieldCardSection, MediaRecord, ThingToDo } from '../../core/models/types';
import { editorialAdSlots } from '../../core/ads/slots';
import depthEditorial from '../../content/field-card-depth-overrides.json';
import faqEditorial from '../../content/field-card-faq-copy.json';
import heroEditorial from '../../content/field-card-hero-copy.json';
import mediaEditorial from '../../content/field-card-media-copy.json';
import practicalEditorial from '../../content/field-card-practical-copy.json';
import primaryStoryEditorial from '../../content/field-card-primary-story-copy.json';
import quickReadEditorial from '../../content/field-card-quick-read-copy.json';
import secondaryStoryEditorial from '../../content/field-card-secondary-story-copy.json';

type FieldCardFaqItem = ThingToDo['fieldCard']['faq'][number];
type FieldCardDepthOverride = {
  secondaryStory?: boolean;
  practicalItemLabels?: string[];
};

const editorialDepthOverrides = depthEditorial as Record<string, FieldCardDepthOverride>;
const editorialFaq = faqEditorial as Record<string, FieldCardFaqItem[]>;
const editorialHeroes = heroEditorial as Record<string, FieldCardHeroContent>;
const editorialMedia = mediaEditorial as Record<string, MediaRecord[]>;
const editorialPracticalNotes = practicalEditorial as Record<string, FieldCardPracticalContent>;
const editorialPrimaryStories = primaryStoryEditorial as Record<string, FieldCardPrimaryStoryContent>;
const editorialQuickReads = quickReadEditorial as Record<string, FieldCardQuickReadContent>;
const editorialSecondaryStories = secondaryStoryEditorial as Record<string, FieldCardSecondaryStoryContent | null>;

const fallbackAliases = (thing: ThingToDo, city: City, country: Country) => {
  const tags = thing.spaCard?.handwrittenTags?.filter(Boolean) ?? [];
  if (tags.length === 3) return tags;
  return [city.name, country.name, thing.isLandmark ? 'Landmark' : 'Experience'];
};

const fallbackSteps = (thing: ThingToDo) => {
  const primaryTitles = thing.fieldCard.primaryStory?.chapters?.map((chapter) => chapter.title).filter(Boolean) ?? [];
  const secondaryTitles = thing.fieldCard.secondaryStory?.chapters?.map((chapter) => chapter.title).filter(Boolean) ?? [];
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

const fallbackSecondaryStory = (thing: ThingToDo, legacySections: FieldCardSection[]): FieldCardSecondaryStoryContent => {
  const fallbackBody = thing.fieldCard.practical || thing.fieldCard.notes || thing.longDescription || thing.shortDescription;
  const first = legacySections[0] ?? {
    title: 'One thing worth knowing',
    body: fallbackBody,
  };
  const second = legacySections[1] ?? {
    title: 'Read the conditions on the ground',
    body: thing.fieldCard.notes || thing.fieldCard.access || fallbackBody,
  };
  return {
    chapters: [
      { label: 'FIELD NOTE', title: first.title, body: first.body },
      { label: 'ON THE GROUND', title: second.title, body: second.body },
    ],
    beforeYouLeave: {
      title: 'Keep this in mind',
      body: thing.fieldCard.notes || thing.fieldCard.practical || thing.longDescription || thing.shortDescription,
      note: {
        label: 'KEEP CLOSE',
        text: thing.spaCard?.bestTime
          ? `Best time · ${thing.spaCard.bestTime}`
          : thing.spaCard?.gettingThere || 'Reconfirm the practical details locally before you go.',
      },
    },
  };
};

const practicalSummary = (value?: string) => {
  const text = String(value ?? '').trim();
  if (!text) return '';
  const sentence = text.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim();
  return sentence || text;
};

const fallbackPracticalNotes = (thing: ThingToDo): FieldCardPracticalContent => {
  const items: FieldCardPracticalContent['items'] = [];
  const seen = new Set<string>();
  const add = (label: string, value?: string, detail?: string) => {
    const cleanValue = String(value ?? '').trim();
    const key = label.trim().toLowerCase();
    if (!cleanValue || seen.has(key) || items.length >= 6) return;
    seen.add(key);
    items.push({ label, value: cleanValue, ...(detail?.trim() ? { detail: detail.trim() } : {}) });
  };

  add('Getting there', practicalSummary(thing.spaCard?.gettingThere || thing.fieldCard.access));
  add('Best time', thing.spaCard?.bestTime);
  add('Time needed', thing.spaCard?.duration);
  add('Plan ahead', practicalSummary(thing.fieldCard.practical));

  if (thing.spaCard?.costType === 'paid') {
    add('Cost', 'Paid activity', 'Confirm the current fee or pricing structure before you go.');
  }

  add('Keep in mind', practicalSummary(thing.fieldCard.notes));
  if (items.length < 4 && thing.fieldCard.access && thing.fieldCard.access !== thing.spaCard?.gettingThere) {
    add('Access details', practicalSummary(thing.fieldCard.access));
  }

  return { items };
};

const applyPracticalDepth = (content: FieldCardPracticalContent, labels?: string[]): FieldCardPracticalContent => {
  if (!labels?.length) return content;
  const items = labels.flatMap((label) => {
    const match = content.items.find((item) => item.label === label);
    return match ? [match] : [];
  });
  return items.length ? { ...content, items } : content;
};

const firstUsefulText = (...values: Array<string | undefined>) =>
  values.map((value) => String(value ?? '').trim()).find(Boolean) ?? '';

const fallbackFaq = (thing: ThingToDo): FieldCardFaqItem[] => [
  {
    question: 'How should I plan the visit?',
    answer: firstUsefulText(thing.fieldCard.practical, thing.longDescription, thing.shortDescription),
  },
  {
    question: 'How much time should I allow?',
    answer: firstUsefulText(thing.spaCard?.duration, thing.fieldCard.practical, thing.longDescription, thing.shortDescription),
  },
  {
    question: 'When is the best time to go?',
    answer: firstUsefulText(thing.spaCard?.bestTime, thing.fieldCard.notes, thing.longDescription, thing.shortDescription),
  },
  {
    question: 'What should I know about getting there?',
    answer: firstUsefulText(thing.spaCard?.gettingThere, thing.fieldCard.access, thing.longDescription, thing.shortDescription),
  },
  {
    question: 'What should I keep in mind before going?',
    answer: firstUsefulText(thing.fieldCard.notes, thing.fieldCard.access, thing.fieldCard.practical, thing.longDescription, thing.shortDescription),
  },
];

const completeFaq = (items?: FieldCardFaqItem[]) => {
  const valid = items?.filter((item) => item.question.trim() && item.answer.trim()) ?? [];
  return valid.length === 5 ? valid.slice(0, 5) : undefined;
};

const resolveFaq = (thing: ThingToDo): FieldCardFaqItem[] =>
  completeFaq(editorialFaq[thing.id])
  ?? completeFaq(thing.fieldCard.faq)
  ?? fallbackFaq(thing);

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
  const depth = editorialDepthOverrides[thing.id];
  const hero = editorialHeroes[thing.id] ?? thing.fieldCard.hero ?? fallbackHero(thing, city, country);
  const quickRead = editorialQuickReads[thing.id] ?? thing.fieldCard.quickRead ?? fallbackQuickRead(thing, city, country);
  const generatedPrimaryStory = thing.fieldCard.primaryStory;
  const primaryStory = editorialPrimaryStories[thing.id] ?? generatedPrimaryStory ?? fallbackPrimaryStory(thing, hero);
  const sections = thing.fieldCard.sections ?? [];
  const primaryLegacyOffset = generatedPrimaryStory ? 0 : 2;
  const generatedSecondaryStory = thing.fieldCard.secondaryStory;
  const hasEditorialSecondaryStory = Object.prototype.hasOwnProperty.call(editorialSecondaryStories, thing.id);
  const resolvedSecondaryStory = hasEditorialSecondaryStory
    ? editorialSecondaryStories[thing.id]
    : generatedSecondaryStory ?? fallbackSecondaryStory(thing, sections.slice(primaryLegacyOffset, primaryLegacyOffset + 2));
  const secondaryStory = depth?.secondaryStory === false ? null : resolvedSecondaryStory;
  const remainingSections = generatedSecondaryStory ? sections : sections.slice(primaryLegacyOffset + 2);
  const resolvedPracticalNotes = editorialPracticalNotes[thing.id] ?? thing.fieldCard.practicalNotes ?? fallbackPracticalNotes(thing);
  const practicalNotes = applyPracticalDepth(resolvedPracticalNotes, depth?.practicalItemLabels);
  const faq = resolveFaq(thing);
  const gallery = editorialMedia[thing.id] ?? thing.media.fieldCard?.gallery ?? [];
  const heroImage = gallery[0] ?? thing.media.card?.image;
  const storyImage = gallery[1];
  const secondaryImage = gallery[2];

  return {
    thing,
    hero,
    quickRead,
    primaryStory,
    secondaryStory,
    practicalNotes,
    faq,
    heroImage,
    storyImage,
    secondaryImage,
    remainingSections,
    relatedLabel: thing.isLandmark ? 'Landmark' : 'Experience',
    template: thing.fieldCard.template,
    adSlots: editorialAdSlots.slice(0, thing.fieldCard.template === 'deep' ? 4 : 2),
  };
};
