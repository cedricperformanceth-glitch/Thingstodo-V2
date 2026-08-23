import type { AtlasEntity } from '../../core/models/types';
import {
  MY_ATLAS_EVENT,
  MY_ATLAS_STORAGE_KEY,
  addToTrip,
  clearTrip,
  readTripStore,
  removeFromTrip,
  tripKey,
  type TripEntry,
} from './store';

const widget = document.querySelector<HTMLElement>('[data-my-atlas-widget]');
const toggle = document.querySelector<HTMLButtonElement>('[data-my-atlas-toggle]');
const drawer = document.querySelector<HTMLElement>('[data-my-atlas-drawer]');
const close = document.querySelector<HTMLButtonElement>('[data-my-atlas-close]');
const content = document.querySelector<HTMLElement>('[data-my-atlas-content]');
const count = document.querySelector<HTMLElement>('[data-my-atlas-count]');
const fabCount = document.querySelector<HTMLElement>('[data-my-atlas-fab-count]');
const clear = document.querySelector<HTMLButtonElement>('[data-my-atlas-clear]');
const explore = document.querySelector<HTMLAnchorElement>('[data-my-atlas-explore]');

const titleCase = (value: string) => value
  .split('-')
  .filter(Boolean)
  .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
  .join(' ');

const currentCountry = () => {
  const first = window.location.pathname.split('/').filter(Boolean)[0] ?? 'laos';
  if (first === 'summary') return 'laos';
  return first;
};

const configureExploreLink = () => {
  if (!explore) return;
  const country = currentCountry();
  explore.href = `/${country}`;
  explore.textContent = `Continue exploring ${titleCase(country)}`;
};

const fallbackEntryPath = (entry: TripEntry) => {
  if (entry.kind === 'thing-to-do') return `/${entry.country}/${entry.city}/things-to-do/${entry.slug}`;
  return `/${entry.country}/${entry.city}/${entry.category}`;
};

const parseEntity = (button: HTMLButtonElement): AtlasEntity | null => {
  try {
    const entity = JSON.parse(button.dataset.entity ?? 'null');
    if (!entity?.id || !entity?.name) return null;
    return entity as AtlasEntity;
  } catch {
    return null;
  }
};

const syncTripButtons = () => {
  const savedKeys = new Set(readTripStore().entries.map((entry) => tripKey(entry)));
  document.querySelectorAll<HTMLButtonElement>('[data-trip]').forEach((button) => {
    const entity = parseEntity(button);
    if (!entity) return;
    const saved = savedKeys.has(tripKey(entity));
    button.textContent = saved ? 'Added to My Atlas' : 'Add to My Atlas';
    button.disabled = saved;
    button.setAttribute('aria-pressed', String(saved));
  });
};

const createEmptyState = () => {
  const empty = document.createElement('p');
  empty.className = 'my-atlas-empty';
  const heading = document.createElement('strong');
  heading.textContent = 'Your atlas is still empty.';
  empty.append(
    heading,
    document.createTextNode('Add restaurants, stays, experiences and landmarks while you explore. They will stay here as you move through the site.'),
  );
  return empty;
};

const createEntry = (entry: TripEntry, index: number) => {
  const details = document.createElement('details');
  details.className = 'my-atlas-note';
  details.dataset.myAtlasEntry = tripKey(entry);

  const summary = document.createElement('summary');
  const number = document.createElement('span');
  number.className = 'my-atlas-note__number';
  number.textContent = String(index + 1).padStart(2, '0');

  const title = document.createElement('span');
  title.className = 'my-atlas-note__title';
  const stamp = document.createElement('span');
  stamp.className = 'my-atlas-note__stamp';
  stamp.textContent = entry.category.replace(/-/g, ' ');
  const name = document.createElement('strong');
  name.textContent = entry.name;
  title.append(stamp, name);

  const chevron = document.createElement('span');
  chevron.className = 'my-atlas-note__chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.textContent = '⌄';
  summary.append(number, title, chevron);

  const body = document.createElement('div');
  body.className = 'my-atlas-note__details';
  const meta = document.createElement('p');
  meta.className = 'my-atlas-note__meta';
  meta.textContent = `${titleCase(entry.city)} · ${titleCase(entry.country)}`;
  body.append(meta);

  if (entry.shortDescription) {
    const description = document.createElement('p');
    description.className = 'my-atlas-note__description';
    description.textContent = entry.shortDescription;
    body.append(description);
  }

  const actions = document.createElement('div');
  actions.className = 'my-atlas-note__actions';
  const open = document.createElement('a');
  open.href = entry.sourcePath || fallbackEntryPath(entry);
  open.textContent = 'Open card →';
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.dataset.myAtlasRemove = tripKey(entry);
  remove.dataset.myAtlasId = entry.id;
  remove.dataset.myAtlasCountry = entry.country;
  remove.dataset.myAtlasCity = entry.city;
  remove.textContent = 'Remove';
  actions.append(open, remove);
  body.append(actions);

  details.append(summary, body);
  return details;
};

const render = () => {
  if (!content || !count) return;
  const store = readTripStore();
  content.replaceChildren();

  const total = store.entries.length;
  count.textContent = `${total} saved ${total === 1 ? 'card' : 'cards'}`;
  if (fabCount) fabCount.textContent = String(total).padStart(2, '0');
  if (toggle) toggle.setAttribute('aria-label', `Open Make Your Own Atlas with ${total} saved ${total === 1 ? 'card' : 'cards'}`);
  if (clear) clear.disabled = total === 0;

  if (!total) {
    content.append(createEmptyState());
  } else {
    const list = document.createElement('section');
    list.className = 'my-atlas-list';
    list.setAttribute('aria-label', 'Saved cards in Make Your Own Atlas');
    store.entries.forEach((entry, index) => list.append(createEntry(entry, index)));
    content.append(list);
  }

  syncTripButtons();
  configureExploreLink();
};

const openDrawer = () => {
  if (!widget || !toggle || !drawer) return;
  drawer.hidden = false;
  widget.classList.add('is-open');
  toggle.setAttribute('aria-expanded', 'true');
  render();
  close?.focus();
};

const closeDrawer = () => {
  if (!widget || !toggle || !drawer) return;
  drawer.hidden = true;
  widget.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
};

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const addButton = target.closest<HTMLButtonElement>('[data-trip]');
  if (addButton) {
    const entity = parseEntity(addButton);
    if (!entity) return;
    const sourcePath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    addToTrip(entity, sourcePath);
    return;
  }

  if (target.closest('[data-my-atlas-toggle]')) {
    event.preventDefault();
    openDrawer();
    return;
  }

  if (target.closest('[data-my-atlas-close]')) {
    event.preventDefault();
    closeDrawer();
    toggle?.focus();
    return;
  }

  const removeButton = target.closest<HTMLButtonElement>('[data-my-atlas-remove]');
  if (removeButton?.dataset.myAtlasId && removeButton.dataset.myAtlasCountry && removeButton.dataset.myAtlasCity) {
    event.preventDefault();
    removeFromTrip({
      id: removeButton.dataset.myAtlasId,
      country: removeButton.dataset.myAtlasCountry,
      city: removeButton.dataset.myAtlasCity,
    });
    return;
  }

  if (target.closest('[data-my-atlas-clear]')) {
    event.preventDefault();
    if (readTripStore().entries.length === 0) return;
    if (!window.confirm('Clear every saved card from Make Your Own Atlas?')) return;
    clearTrip();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && drawer && !drawer.hidden) {
    closeDrawer();
    toggle?.focus();
  }
});

window.addEventListener(MY_ATLAS_EVENT, render);
window.addEventListener('storage', (event) => {
  if (event.key === MY_ATLAS_STORAGE_KEY || event.key === null) render();
});

render();
