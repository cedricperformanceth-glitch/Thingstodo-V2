import { favoritesStore } from './store';
const render = () => document.querySelectorAll<HTMLElement>('[data-favorites-panel]').forEach((panel) => { const items = favoritesStore.all(); panel.innerHTML = items.length ? `<ul>${items.map((item) => `<li><strong>${item.name}</strong> · ${item.city}, ${item.country}<br>${item.shortDescription}</li>`).join('')}</ul>` : '<p>No saved places yet. Favorites remain available in every city.</p>'; });
document.addEventListener('click', (event) => { const button = (event.target as Element).closest<HTMLButtonElement>('[data-favorite]'); if (!button) return; favoritesStore.toggle(JSON.parse(button.dataset.entity ?? '{}')); button.setAttribute('aria-pressed', String(favoritesStore.has(button.dataset.entityId ?? ''))); render(); });
render();
