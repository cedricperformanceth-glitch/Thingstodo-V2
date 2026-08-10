import { favoriteKey, favoritesStore, type FavoriteSnapshot } from './store';

const escapeHtml = (value = '') => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
const heart = (item: FavoriteSnapshot) => `<button class="favorite-heart" type="button" data-favorite data-entity-key="${favoriteKey(item)}" data-entity-name="${escapeHtml(item.name)}" data-entity='${escapeHtml(JSON.stringify(item))}' aria-label="Remove ${escapeHtml(item.name)} from My Favorites" aria-pressed="true"><span aria-hidden="true">♥</span></button>`;
const favoriteCard = (item: FavoriteSnapshot) => `<article class="favorite-card${item.isMySelection ? ' selection' : ''}"><div class="favorite-card__media">${item.cardImage ? `<img src="${escapeHtml(item.cardImage.src)}" alt="${escapeHtml(item.cardImage.alt)}" loading="lazy" width="640" height="400">` : ''}${heart(item)}</div>${item.isMySelection ? '<p class="eyebrow">My Selection</p>' : ''}<h3>${escapeHtml(item.name)}</h3><p class="favorite-card__destination">${escapeHtml(item.city)}, ${escapeHtml(item.country)}</p><p>${escapeHtml(item.shortDescription)}</p>${item.address ? `<p class="address">${escapeHtml(item.address)}</p>` : ''}<div class="favorite-card__actions">${item.type === 'thing' && item.fieldCardPath ? `<a class="button" href="${escapeHtml(item.fieldCardPath)}">Open Field Card</a>` : ''}${item.googleMapsUrl ? `<a class="button button--quiet" href="${escapeHtml(item.googleMapsUrl)}" target="_blank" rel="noreferrer">Open Google Maps</a>` : ''}</div></article>`;
const render = () => {
  const saved = favoritesStore.all(); const keys = new Set(saved.map(favoriteKey));
  document.querySelectorAll<HTMLButtonElement>('[data-favorite]').forEach((heartControl) => {
    const active = keys.has(heartControl.dataset.entityKey ?? ''); heartControl.setAttribute('aria-pressed', String(active)); heartControl.setAttribute('aria-label', `${active ? 'Remove' : 'Add'} ${heartControl.dataset.entityName ?? 'item'} ${active ? 'from' : 'to'} My Favorites`);
    const icon = heartControl.querySelector('[aria-hidden="true"]'); if (icon) icon.textContent = active ? '♥' : '♡';
  });
  document.querySelectorAll<HTMLElement>('[data-favorites-panel]').forEach((panel) => { panel.innerHTML = saved.map(favoriteCard).join(''); });
  document.querySelectorAll<HTMLElement>('[data-favorites-empty]').forEach((empty) => { empty.hidden = saved.length > 0; });
};
document.addEventListener('click', (event) => { const heartControl = (event.target as Element).closest<HTMLButtonElement>('[data-favorite]'); if (!heartControl) return; favoritesStore.toggle(JSON.parse(heartControl.dataset.entity ?? '{}')); render(); });
window.addEventListener('storage', (event) => { if (event.key === 'things-to-do-atlas:favorites') render(); });
render();
