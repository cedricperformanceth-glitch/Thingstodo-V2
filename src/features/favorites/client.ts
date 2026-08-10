import { favoritesStore } from './store';

const render = () => {
  const saved = new Set(favoritesStore.all().map((item) => `${item.country}:${item.city}:${item.id}`));
  document.querySelectorAll<HTMLButtonElement>('[data-favorite]').forEach((heart) => {
    const active = saved.has(heart.dataset.entityKey ?? '');
    heart.setAttribute('aria-pressed', String(active));
    heart.setAttribute('aria-label', `${active ? 'Remove' : 'Add'} ${heart.dataset.entityName ?? 'item'} ${active ? 'from' : 'to'} My Favorites`);
    const icon = heart.querySelector('[aria-hidden="true"]'); if (icon) icon.textContent = active ? '♥' : '♡';
  });
  document.querySelectorAll<HTMLElement>('[data-favorite-item]').forEach((item) => { item.hidden = !saved.has(item.dataset.favoriteKey ?? ''); });
  document.querySelectorAll<HTMLElement>('[data-favorites-empty]').forEach((empty) => { empty.hidden = saved.size > 0; });
};
document.addEventListener('click', (event) => { const heart = (event.target as Element).closest<HTMLButtonElement>('[data-favorite]'); if (!heart) return; favoritesStore.toggle(JSON.parse(heart.dataset.entity ?? '{}')); render(); });
window.addEventListener('storage', (event) => { if (event.key === 'things-to-do-atlas:favorites') render(); });
render();
