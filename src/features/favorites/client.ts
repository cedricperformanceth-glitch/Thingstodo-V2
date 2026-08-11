import { favoriteKey, favoritesStore, type FavoriteSnapshot } from './store';

const escapeHtml = (value = '') => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
const titleize = (value: string) => value.split('-').map((part) => part ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : '').join(' ');
const heart = (item: FavoriteSnapshot) => `<button class="favorite-heart" type="button" data-favorite data-entity-key="${favoriteKey(item)}" data-entity-name="${escapeHtml(item.name)}" data-entity='${escapeHtml(JSON.stringify(item))}' aria-label="Remove ${escapeHtml(item.name)} from My Favorites" aria-pressed="true"><span aria-hidden="true">♥</span></button>`;
const favoriteCard = (item: FavoriteSnapshot) => `<article class="favorite-card"><div class="favorite-card__media">${item.cardImage ? `<img src="${escapeHtml(item.cardImage.src)}" alt="${escapeHtml(item.cardImage.alt)}" loading="lazy" width="640" height="400">` : ''}${heart(item)}</div><h3>${escapeHtml(item.name)}</h3><p class="favorite-card__destination">${escapeHtml(titleize(item.city))}, ${escapeHtml(titleize(item.country))}</p><p>${escapeHtml(item.shortDescription)}</p>${item.address ? `<p class="address">${escapeHtml(item.address)}</p>` : ''}<div class="favorite-card__actions">${item.type === 'thing' && item.fieldCardPath ? `<a class="button" href="${escapeHtml(item.fieldCardPath)}">Open Field Card</a>` : ''}${item.googleMapsUrl ? `<a class="button button--quiet" href="${escapeHtml(item.googleMapsUrl)}" target="_blank" rel="noreferrer">Open Google Maps</a>` : ''}</div></article>`;

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

const render = () => {
  const saved = favoritesStore.all(); const keys = new Set(saved.map(favoriteKey));
  document.querySelectorAll<HTMLButtonElement>('[data-favorite]').forEach((heartControl) => {
    const active = keys.has(heartControl.dataset.entityKey ?? ''); heartControl.setAttribute('aria-pressed', String(active)); heartControl.setAttribute('aria-label', `${active ? 'Remove' : 'Add'} ${heartControl.dataset.entityName ?? 'item'} ${active ? 'from' : 'to'} My Favorites`);
    const icon = heartControl.querySelector('[aria-hidden="true"]'); if (icon) icon.textContent = active ? '♥' : '♡';
  });
  document.querySelectorAll<HTMLElement>('[data-favorites-panel]').forEach((panel) => renderPanel(panel, saved));
  document.querySelectorAll<HTMLElement>('[data-favorites-empty]').forEach((empty) => { empty.hidden = saved.length > 0; });
  document.querySelectorAll<HTMLElement>('[data-favorites-count]').forEach((count) => { count.textContent = `${saved.length} ${saved.length === 1 ? 'saved place' : 'saved places'}`; });
};

document.addEventListener('click', (event) => { const heartControl = (event.target as Element).closest<HTMLButtonElement>('[data-favorite]'); if (!heartControl) return; favoritesStore.toggle(JSON.parse(heartControl.dataset.entity ?? '{}')); render(); });
window.addEventListener('storage', (event) => { if (event.key === 'things-to-do-atlas:favorites') render(); });
document.addEventListener('astro:page-load', render);
render();
