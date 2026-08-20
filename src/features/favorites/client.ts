import { favoriteKey, favoritesStore, type FavoriteSnapshot } from './store';

const escapeHtml = (value = '') => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
const titleize = (value: string) => value.split('-').map((part) => part ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : '').join(' ');
const heart = (item: FavoriteSnapshot) => `<button class="favorite-heart" type="button" data-favorite data-entity-key="${favoriteKey(item)}" data-entity-name="${escapeHtml(item.name)}" data-entity='${escapeHtml(JSON.stringify(item))}' aria-label="Remove ${escapeHtml(item.name)} from My Favorites" aria-pressed="true"><span aria-hidden="true">♥</span></button>`;

const photoCredit = (item: FavoriteSnapshot) => {
  const image = item.cardImage;
  if (!image?.sourceUrl || !(image.author || image.sourceName || image.license)) return '';
  const label = [image.author ?? image.sourceName, image.license].filter(Boolean).join(' · ');
  return `<a class="card-photo-credit" href="${escapeHtml(image.sourceUrl)}" target="_blank" rel="noreferrer">Photo: ${escapeHtml(label)}</a>`;
};

const quickNotes = (item: FavoriteSnapshot) => item.handwrittenTags?.length
  ? `<div class="card-handwritten" aria-label="Quick notes">${item.handwrittenTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>`
  : '';

const activityMeta = (item: FavoriteSnapshot) => {
  if (item.type !== 'thing' || !(item.gettingThere || item.duration || item.costType || item.bestTime)) return '';
  const cost = item.costType === 'free' ? 'Free' : item.costType === 'paid' ? 'Paid' : '';
  return `<dl class="card-activity-meta"><div><dt>Getting there</dt><dd>${escapeHtml(item.gettingThere ?? '')}</dd></div><div><dt>Duration</dt><dd>${escapeHtml(item.duration ?? '')}</dd></div><div><dt>Cost</dt><dd>${escapeHtml(cost)}</dd></div><div><dt>Best time</dt><dd>${escapeHtml(item.bestTime ?? '')}</dd></div></dl>`;
};

const tripEntity = (item: FavoriteSnapshot) => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  country: item.country,
  city: item.city,
  category: item.category,
  shortDescription: item.shortDescription,
  ...(item.type === 'thing' ? { isLandmark: false } : {}),
});

const actions = (item: FavoriteSnapshot) => `<div class="card-actions" style="--card-field-color:${escapeHtml(item.countryAccent ?? '#b7473b')}">${item.googleMapsUrl ? `<a class="card-action card-action--map" href="${escapeHtml(item.googleMapsUrl)}" target="_blank" rel="noreferrer">Open Google Maps</a>` : ''}${item.type === 'thing' && item.fieldCardPath ? `<a class="card-action card-action--field" href="${escapeHtml(item.fieldCardPath)}">Open the Field Card</a>` : ''}<button type="button" data-trip data-entity='${escapeHtml(JSON.stringify(tripEntity(item)))}'>Add to My Atlas</button></div>`;

const favoriteCard = (item: FavoriteSnapshot) => {
  const media = item.cardImage
    ? `<img src="${escapeHtml(item.cardImage.src)}" alt="${escapeHtml(item.cardImage.alt)}" loading="lazy" width="640" height="400">`
    : '<span class="card-photo-placeholder" aria-label="Photo missing; manual photo needed">Photo to add</span>';
  const openingHours = item.openingHours ? `<p class="card-practical-line"><span>Hours</span>${escapeHtml(item.openingHours)}</p>` : '';
  return `<article class="card atlas-entry-card favorite-card"><div class="card-media${item.cardImage ? '' : ' empty'}">${media}${quickNotes(item)}${photoCredit(item)}${heart(item)}</div><div class="card-preview"><h3>${escapeHtml(item.name)}</h3><p class="destination">${escapeHtml(titleize(item.city))}, ${escapeHtml(titleize(item.country))}</p><p class="card-description">${escapeHtml(item.shortDescription)}</p>${activityMeta(item)}${openingHours}</div>${actions(item)}</article>`;
};

const groupByCountry = (saved: FavoriteSnapshot[]) => {
  const groups = new Map<string, FavoriteSnapshot[]>();
  saved.forEach((item) => groups.set(item.country, [...(groups.get(item.country) ?? []), item]));
  return groups;
};

const fillCountry = (details: HTMLDetailsElement, items: FavoriteSnapshot[]) => {
  const cards = details.querySelector<HTMLElement>('[data-favorite-country-cards]');
  if (!cards || cards.dataset.rendered === 'true') return;
  cards.dataset.rendered = 'true';
  cards.innerHTML = items.map(favoriteCard).join('');
};

const renderPanel = (panel: HTMLElement, saved: FavoriteSnapshot[]) => {
  const groups = groupByCountry(saved);
  const currentOpen = panel.querySelector<HTMLDetailsElement>('.favorites-country[open]')?.dataset.favoriteCountry;
  const currentCountry = panel.dataset.favoritesCurrentCountry;
  const countries = [...groups.keys()];
  const initiallyOpen = currentOpen && groups.has(currentOpen) ? currentOpen : currentCountry && groups.has(currentCountry) ? currentCountry : countries[0];

  panel.innerHTML = countries.map((country) => {
    const items = groups.get(country) ?? [];
    return `<details class="favorites-country" data-favorite-country="${escapeHtml(country)}"${country === initiallyOpen ? ' open' : ''}><summary><strong>${escapeHtml(titleize(country))}</strong><small>${items.length} ${items.length === 1 ? 'saved place' : 'saved places'}</small></summary><div class="favorites-country__cards" data-favorite-country-cards></div></details>`;
  }).join('');

  panel.querySelectorAll<HTMLDetailsElement>('.favorites-country').forEach((details) => {
    const country = details.dataset.favoriteCountry ?? '';
    const items = groups.get(country) ?? [];
    if (details.open) fillCountry(details, items);
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      panel.querySelectorAll<HTMLDetailsElement>('.favorites-country').forEach((other) => { if (other !== details) other.open = false; });
      fillCountry(details, items);
    });
  });
};

const currentPageSnapshots = () => {
  const snapshots: FavoriteSnapshot[] = [];
  document.querySelectorAll<HTMLButtonElement>('[data-favorite][data-entity]').forEach((button) => {
    try {
      const item = JSON.parse(button.dataset.entity ?? 'null') as FavoriteSnapshot | null;
      if (item?.id && item.city && item.country && item.name) snapshots.push(item);
    } catch {
      // Ignore invalid legacy button data; the persisted favorite remains untouched.
    }
  });
  return snapshots;
};

const render = () => {
  const saved = favoritesStore.refresh(currentPageSnapshots());
  const keys = new Set(saved.map(favoriteKey));
  document.querySelectorAll<HTMLButtonElement>('[data-favorite]').forEach((heartControl) => {
    const active = keys.has(heartControl.dataset.entityKey ?? '');
    heartControl.setAttribute('aria-pressed', String(active));
    heartControl.setAttribute('aria-label', `${active ? 'Remove' : 'Add'} ${heartControl.dataset.entityName ?? 'item'} ${active ? 'from' : 'to'} My Favorites`);
    const icon = heartControl.querySelector('[aria-hidden="true"]');
    if (icon) icon.textContent = active ? '♥' : '♡';
  });
  document.querySelectorAll<HTMLElement>('[data-favorites-panel]').forEach((panel) => renderPanel(panel, saved));
  document.querySelectorAll<HTMLElement>('[data-favorites-empty]').forEach((empty) => { empty.hidden = saved.length > 0; });
  document.querySelectorAll<HTMLElement>('[data-favorites-count]').forEach((count) => { count.textContent = `${saved.length} ${saved.length === 1 ? 'saved place' : 'saved places'}`; });
};

document.addEventListener('click', (event) => {
  const heartControl = (event.target as Element).closest<HTMLButtonElement>('[data-favorite]');
  if (!heartControl) return;
  favoritesStore.toggle(JSON.parse(heartControl.dataset.entity ?? '{}'));
  render();
});
window.addEventListener('storage', (event) => { if (event.key === 'things-to-do-atlas:favorites') render(); });
document.addEventListener('astro:page-load', render);
render();
