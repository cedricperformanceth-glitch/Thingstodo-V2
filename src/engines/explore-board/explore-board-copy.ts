import type { City, ThingToDo } from '../../core/models/types';

export interface ExploreBoardCopyEntry {
  thing: Pick<ThingToDo, 'name' | 'shortDescription'>;
  kicker: string;
  route: string;
}

const lowerFirst = (value: string) => value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value;

const themesFrom = (kicker: string) => {
  const themes = kicker
    .split('·')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 3);
  if (themes.length === 0) return 'a different side of the destination';
  if (themes.length === 1) return themes[0];
  if (themes.length === 2) return `${themes[0]} and ${themes[1]}`;
  return `${themes[0]}, ${themes[1]}, and ${themes[2]}`;
};

const routeFrom = (entry: ExploreBoardCopyEntry) => {
  const route = entry.route.trim();
  return route ? lowerFirst(route) : `explore ${themesFrom(entry.kicker)}`;
};

const descriptionFragment = (entry: ExploreBoardCopyEntry) => {
  const clean = entry.thing.shortDescription.replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '');
  if (!clean) return themesFrom(entry.kicker);
  const firstClause = clean.split(/[;,]/, 1)[0].trim();
  const words = firstClause.split(/\s+/);
  const concise = words.length > 14 ? `${words.slice(0, 14).join(' ')}…` : firstClause;
  return lowerFirst(concise);
};

const joinClauses = (items: string[]) => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]}; and ${items[1]}`;
  return `${items.slice(0, -1).join('; ')}; and ${items.at(-1)}`;
};

export function getExploreBoardCopy(city: City, entries: ExploreBoardCopyEntry[]) {
  if (entries.length === 0) {
    return {
      intro: `The first landmarks for ${city.name} are still being selected.`,
      note: `This board will follow the landmarks chosen to introduce ${city.name}.`,
    };
  }

  const [first, second, third] = entries;
  let intro: string;

  if (entries.length === 1) {
    intro = `Begin with ${first.thing.name} — ${routeFrom(first)}.`;
  } else if (entries.length === 2) {
    intro = `Begin with ${first.thing.name} — ${routeFrom(first)}; then continue to ${second.thing.name} — ${routeFrom(second)}.`;
  } else {
    intro = `Begin with ${first.thing.name} — ${routeFrom(first)}; continue to ${second.thing.name} — ${routeFrom(second)}; then finish with ${third.thing.name} — ${routeFrom(third)}.`;
  }

  const fragments = entries.map((entry) => `${entry.thing.name} — ${descriptionFragment(entry)}`);
  const note = `A first route through ${city.name}: ${joinClauses(fragments)}.`;

  return { intro, note };
}
