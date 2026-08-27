import {
  MY_ATLAS_EVENT,
  MY_ATLAS_STORAGE_KEY,
  readTripStore,
  removeFromTrip,
  tripKey,
  type TripEntry,
  type TripCardImage,
} from '../trip/store';
import { favoriteKey, favoritesStore, type FavoriteSnapshot } from '../favorites/store';

const FAVORITES_STORAGE_KEY = 'things-to-do-atlas:favorites';
const ADVENTURE_ROUTES = [
  '/laos/atlas-routes/north-to-south',
  '/laos/atlas-routes/south-to-north',
] as const;
const ATLAS_MEDIA_URLS = [
  '/summary-media.json',
  '/api/summary-media.json',
] as const;

let atlasMediaIndex = new Map<string, TripCardImage>();

type SummaryTab = 'atlas' | 'favorites' | 'adventure';

const escapeHtml = (value = '') => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
})[character] ?? character);

const titleize = (value = '') => value
  .split('-')
  .filter(Boolean)
  .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
  .join(' ');

const fallbackEntryPath = (entry: TripEntry) => entry.kind === 'thing-to-do'
  ? `/${entry.country}/${entry.city}/things-to-do/${entry.slug}`
  : `/${entry.country}/${entry.city}/${entry.category}`;

const favoritePath = (item: FavoriteSnapshot) => item.fieldCardPath
  ?? (item.type === 'thing'
    ? `/${item.country}/${item.city}/things-to-do/${item.slug}`
    : `/${item.country}/${item.city}/${item.category}`);

const emptyState = (title: string, copy: string) => `
  <div class="summary-empty">
    <span class="summary-empty__mark" aria-hidden="true">✦</span>
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(copy)}</p>
  </div>`;

const cardMedia = (image?: TripCardImage | FavoriteSnapshot['cardImage']) => image
  ? `<div class="summary-card__media"><img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" width="640" height="400"></div>`
  : `<div class="summary-card__media summary-card__media--empty" aria-hidden="true"><span>Atlas</span></div>`;

const indexedAtlasImage = (entry: TripEntry) => atlasMediaIndex.get(tripKey(entry))
  ?? atlasMediaIndex.get(`id:${entry.id}`)
  ?? (entry.slug ? atlasMediaIndex.get(`slug:${entry.slug}`) : undefined);

const atlasCard = (entry: TripEntry, index: number, fallbackImage?: TripCardImage | FavoriteSnapshot['cardImage']) => `
  <article class="summary-card summary-card--atlas-photo">
    ${cardMedia(entry.cardImage ?? fallbackImage)}
    <div class="summary-card__favorite-body">
      <div class="summary-card__topline">
        <span class="summary-card__number">${String(index + 1).padStart(2, '0')}</span>
        <span class="summary-card__category">${escapeHtml(titleize(entry.category))}</span>
      </div>
      <h3>${escapeHtml(entry.name)}</h3>
      <p class="summary-card__place">${escapeHtml(titleize(entry.city))} · ${escapeHtml(titleize(entry.country))}</p>
      ${entry.shortDescription ? `<p class="summary-card__description">${escapeHtml(entry.shortDescription)}</p>` : ''}
      <div class="summary-card__actions">
        <a href="${escapeHtml(entry.sourcePath || fallbackEntryPath(entry))}">Open card <span aria-hidden="true">→</span></a>
        <button
          type="button"
          class="summary-card__remove"
          data-summary-atlas-remove
          data-id="${escapeHtml(entry.id)}"
          data-country="${escapeHtml(entry.country)}"
          data-city="${escapeHtml(entry.city)}"
        >Remove</button>
      </div>
    </div>
  </article>`;

const favoriteCard = (item: FavoriteSnapshot, index: number) => `
  <article class="summary-card summary-card--favorite">
    ${cardMedia(item.cardImage)}
    <div class="summary-card__favorite-body">
      <div class="summary-card__topline">
        <span class="summary-card__number">${String(index + 1).padStart(2, '0')}</span>
        <span class="summary-card__category">${escapeHtml(titleize(item.category))}</span>
        <span class="summary-card__heart" aria-hidden="true">♥</span>
      </div>
      <h3>${escapeHtml(item.name)}</h3>
      <p class="summary-card__place">${escapeHtml(titleize(item.city))} · ${escapeHtml(titleize(item.country))}</p>
      ${item.shortDescription ? `<p class="summary-card__description">${escapeHtml(item.shortDescription)}</p>` : ''}
      <div class="summary-card__actions">
        <a href="${escapeHtml(favoritePath(item))}">Open card <span aria-hidden="true">→</span></a>
        <button type="button" class="summary-card__remove" data-summary-favorite-remove data-key="${escapeHtml(favoriteKey(item))}">Remove</button>
      </div>
    </div>
  </article>`;

const initSummary = () => {
  const root = document.querySelector<HTMLElement>('[data-trip-summary]');
  if (!root || root.dataset.summaryReady === 'true') return;
  root.dataset.summaryReady = 'true';

  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-summary-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-summary-panel]')];
  const atlasGrid = root.querySelector<HTMLElement>('[data-summary-atlas-grid]');
  const favoritesGrid = root.querySelector<HTMLElement>('[data-summary-favorites-grid]');
  const atlasCount = root.querySelector<HTMLElement>('[data-summary-atlas-count]');
  const favoritesCount = root.querySelector<HTMLElement>('[data-summary-favorites-count]');
  const routeCount = root.querySelector<HTMLElement>('[data-summary-route-count]');
  const summaryStatus = root.querySelector<HTMLElement>('[data-summary-status]');
  const adventureRoutes = [...root.querySelectorAll<HTMLElement>('.adventure-route')];
  const adventureIntro = root.querySelector<HTMLElement>('.adventure-intro');

  const tabFromHash = (): SummaryTab => {
    const hash = window.location.hash.replace('#', '');
    return hash === 'favorites' || hash === 'adventure' ? hash : 'atlas';
  };

  const activateTab = (name: SummaryTab, updateHash = true) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.summaryTab === name;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.summaryPanel !== name;
    });
    if (updateHash) history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${name}`);
  };

  const updateSummaryStatus = () => {
    const entries = readTripStore().entries;
    const favorites = favoritesStore.all();
    const countries = [...new Set([...entries, ...favorites].map((item) => item.country).filter(Boolean))];
    const scope = countries.length === 1
      ? titleize(countries[0]).toUpperCase()
      : countries.length > 1
        ? `${countries.length} COUNTRIES`
        : 'YOUR ATLAS';

    if (summaryStatus) {
      summaryStatus.textContent = `${scope} · ${entries.length} ${entries.length === 1 ? 'place' : 'places'} collected · ${favorites.length} ${favorites.length === 1 ? 'favorite' : 'favorites'} · ${ADVENTURE_ROUTES.length} routes`;
    }
    if (routeCount) routeCount.textContent = `${ADVENTURE_ROUTES.length} ROUTES READY`;
  };

  const renderAtlas = () => {
    if (!atlasGrid || !atlasCount) return;
    const entries = readTripStore().entries;
    const favoriteImages = new Map(
      favoritesStore.all().map((favorite) => [favoriteKey(favorite), favorite.cardImage] as const),
    );
    atlasCount.textContent = `${entries.length} SAVED ${entries.length === 1 ? 'PLACE' : 'PLACES'}`;
    atlasGrid.innerHTML = entries.length
      ? entries.map((entry, index) => {
          const key = tripKey(entry);
          return atlasCard(entry, index, favoriteImages.get(key) ?? indexedAtlasImage(entry));
        }).join('')
      : emptyState('Your atlas is waiting for its first card.', 'Add places and experiences while exploring the site. Everything you save to My Atlas will appear here.');
  };

  const renderFavorites = () => {
    if (!favoritesGrid || !favoritesCount) return;
    const favorites = favoritesStore.all();
    favoritesCount.textContent = `${favorites.length} ${favorites.length === 1 ? 'FAVORITE' : 'FAVORITES'}`;
    favoritesGrid.innerHTML = favorites.length
      ? favorites.map(favoriteCard).join('')
      : emptyState('No favorites yet.', 'Use the heart on a card while exploring. Your favorite places will be gathered here.');
  };

  const renderAll = () => {
    renderAtlas();
    renderFavorites();
    updateSummaryStatus();
  };

  const loadAtlasMedia = async () => {
    for (const url of ATLAS_MEDIA_URLS) {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) continue;
        const payload = await response.json() as Record<string, TripCardImage>;
        const entries = Object.entries(payload).filter(([, image]) => Boolean(image?.src));
        if (!entries.length) continue;
        atlasMediaIndex = new Map(entries);
        renderAtlas();
        return;
      } catch {
        // Try the next static media endpoint.
      }
    }
  };

  adventureRoutes.forEach((route, index) => {
    const href = ADVENTURE_ROUTES[index];
    if (!href) return;
    route.tabIndex = 0;
    route.setAttribute('role', 'link');
    route.dataset.routeHref = href;
    const title = route.querySelector('h3')?.textContent?.trim() ?? 'Adventure route';
    route.setAttribute('aria-label', `Open ${title}`);
    const status = route.querySelector<HTMLElement>('.adventure-route__status');
    if (status) status.textContent = 'Open route →';
    route.addEventListener('click', () => window.location.assign(href));
    route.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      window.location.assign(href);
    });
  });

  if (adventureIntro) {
    adventureIntro.textContent = 'Choose a direction and turn the places you collected into a journey.';
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab((tab.dataset.summaryTab ?? 'atlas') as SummaryTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      const next = tabs[nextIndex];
      next?.focus();
      if (next) activateTab((next.dataset.summaryTab ?? 'atlas') as SummaryTab);
    });
  });

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const atlasRemove = target.closest<HTMLButtonElement>('[data-summary-atlas-remove]');
    if (atlasRemove?.dataset.id && atlasRemove.dataset.country && atlasRemove.dataset.city) {
      removeFromTrip({
        id: atlasRemove.dataset.id,
        country: atlasRemove.dataset.country,
        city: atlasRemove.dataset.city,
      });
      renderAll();
      return;
    }

    const favoriteRemove = target.closest<HTMLButtonElement>('[data-summary-favorite-remove]');
    if (favoriteRemove?.dataset.key) {
      const item = favoritesStore.all().find((favorite) => favoriteKey(favorite) === favoriteRemove.dataset.key);
      if (item) favoritesStore.toggle(item);
      renderAll();
    }
  });

  window.addEventListener(MY_ATLAS_EVENT, () => {
    renderAtlas();
    updateSummaryStatus();
  });
  window.addEventListener('storage', (event) => {
    if (event.key === MY_ATLAS_STORAGE_KEY || event.key === null) {
      renderAtlas();
      updateSummaryStatus();
    }
    if (event.key === FAVORITES_STORAGE_KEY || event.key === null) {
      renderFavorites();
      renderAtlas();
      updateSummaryStatus();
    }
  });
  window.addEventListener('hashchange', () => activateTab(tabFromHash(), false));

  renderAll();
  void loadAtlasMedia();
  activateTab(tabFromHash(), false);
};

initSummary();
document.addEventListener('astro:page-load', initSummary);
