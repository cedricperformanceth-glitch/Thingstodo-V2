import type { City, Country, FieldCardHeroContent, ThingToDo } from '../../core/models/types';
import { editorialAdSlots } from '../../core/ads/slots';
import heroEditorial from '../../content/field-card-hero-copy.json';

const editorialHeroes = heroEditorial as Record<string, FieldCardHeroContent>;

const fallbackAliases = (thing: ThingToDo, city: City, country: Country) => {
  const tags = thing.spaCard?.handwrittenTags?.filter(Boolean) ?? [];
  if (tags.length === 3) return tags;
  return [city.name, country.name, thing.isLandmark ? 'Landmark' : 'Experience'];
};

const fallbackSteps = (thing: ThingToDo) => {
  const sectionTitles = thing.fieldCard.sections?.map((section) => section.title).filter(Boolean) ?? [];
  if (sectionTitles.length >= 4) return sectionTitles.slice(0, 4);
  return ['Getting there', 'Time on site', 'Cost', 'Best time'];
};

const fallbackHero = (thing: ThingToDo, city: City, country: Country): FieldCardHeroContent => ({
  eyebrow: `${thing.isLandmark ? 'FIELD NOTE' : 'EXPERIENCE NOTE'} · ${city.name.toUpperCase()}`,
  aliases: fallbackAliases(thing, city, country),
  description: thing.longDescription || thing.shortDescription,
  steps: fallbackSteps(thing),
  rhythmNote: thing.fieldCard.notes || thing.fieldCard.whyGo || thing.shortDescription,
  photoNote: thing.spaCard?.gettingThere || `${city.name} · ${country.name}`,
});

export const fieldCardView = (thing: ThingToDo, city: City, country: Country) => {
  const hero = editorialHeroes[thing.id] ?? thing.fieldCard.hero ?? fallbackHero(thing, city, country);
  const heroImage = thing.media.fieldCard?.gallery?.[0] ?? thing.media.card?.image;
  return {
    thing,
    hero,
    heroImage,
    relatedLabel: thing.isLandmark ? 'Landmark' : 'Experience',
    template: thing.fieldCard.template,
    adSlots: editorialAdSlots.slice(0, thing.fieldCard.template === 'deep' ? 4 : 2),
  };
};
