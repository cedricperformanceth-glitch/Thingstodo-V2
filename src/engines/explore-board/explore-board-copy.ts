import type { City, ThingToDo } from '../../core/models/types';

export interface ExploreBoardCopyEntry {
  thing: Pick<ThingToDo, 'name'>;
  kicker: string;
  route: string;
}

const lowerFirst = (value: string) => value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value;

const naturalList = (items: string[]) => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
};

const themesFrom = (kicker: string) => {
  const themes = kicker
    .split('·')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 3);
  return naturalList(themes) || 'a different side of the destination';
};

const routeFrom = (entry: ExploreBoardCopyEntry) => {
  const route = entry.route.trim();
  return route ? lowerFirst(route) : `explore ${themesFrom(entry.kicker)}`;
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

  const themes = entries.map((entry) => `${entry.thing.name} for ${themesFrom(entry.kicker)}`);
  const countLead = entries.length === 1 ? 'One way' : entries.length === 2 ? 'Two ways' : 'Three ways';
  const note = `${countLead} to read ${city.name}: ${naturalList(themes)}.`;

  return { intro, note };
}
