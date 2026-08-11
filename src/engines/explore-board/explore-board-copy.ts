import type { City, ThingToDo } from '../../core/models/types';

export interface ExploreBoardCopyEntry {
  thing: Pick<ThingToDo, 'name' | 'shortDescription'>;
  kicker: string;
  route: string;
}

const lowerFirst = (value: string) => value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value;
const upperFirst = (value: string) => value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;

const naturalList = (items: string[]) => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
};

const themesFrom = (kicker: string) => kicker
  .split('·')
  .map((item) => item.trim().toLowerCase())
  .filter(Boolean);

const conciseAction = (entry: ExploreBoardCopyEntry) => {
  const clean = entry.thing.shortDescription.replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '');

  if (clean) {
    let clause = clean.split(/[;,]/, 1)[0].trim();
    const andIndex = clause.toLowerCase().indexOf(' and ');
    if (andIndex > 24) clause = clause.slice(0, andIndex).trim();

    const words = clause.split(/\s+/);
    if (words.length > 11) clause = words.slice(0, 11).join(' ');
    if (clause) return clause;
  }

  const route = entry.route.trim().replace(/[.!?]+$/, '');
  if (route) return upperFirst(route);

  const theme = themesFrom(entry.kicker)[0];
  return theme ? `Explore ${theme}` : `Explore ${entry.thing.name}`;
};

const compactName = (name: string) => {
  const beforeAmpersand = name.split(/\s+&\s+/, 1)[0].trim();
  let compact = beforeAmpersand || name.trim();

  const words = compact.split(/\s+/);
  const genericTail = /^(falls?|waterfalls?|bridge|cave|temple|viewpoint|park|market|beach|mountain|peak|lagoon)$/i;
  if (words.length > 1 && genericTail.test(words.at(-1) ?? '')) words.pop();
  if (words.length > 3) words.splice(3);

  return words.join(' ') || name;
};

export function getExploreBoardCopy(city: City, entries: ExploreBoardCopyEntry[]) {
  if (entries.length === 0) {
    return {
      intro: `The first landmarks for ${city.name} are still being selected.`,
      note: `The first routes around ${city.name} will appear here.`,
    };
  }

  const actions = entries.map((entry, index) => {
    const action = conciseAction(entry);
    return index === 0 ? upperFirst(action) : lowerFirst(action);
  });
  const intro = `${naturalList(actions)}.`;

  const names = entries.map((entry) => compactName(entry.thing.name));
  const lead = entries.length === 1 ? 'One route frames' : entries.length === 2 ? 'Two routes frame' : 'Three routes frame';
  const note = `${lead} ${city.name}: ${naturalList(names)}.`;

  return { intro, note };
}
