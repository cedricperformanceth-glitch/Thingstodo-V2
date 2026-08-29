import {
  MY_ATLAS_EVENT,
  MY_ATLAS_STORAGE_KEY,
  readTripStore,
  type TripEntry,
} from '../trip/store';

const titleize = (value = '') => value
  .split('-')
  .filter(Boolean)
  .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
  .join(' ');

const googleMapsUrl = (entry: TripEntry) => {
  if (entry.googleMapsUrl?.trim()) return entry.googleMapsUrl.trim();

  if (entry.coordinates) {
    const { latitude, longitude } = entry.coordinates;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${latitude},${longitude}`)}`;
  }

  const query = [entry.name, titleize(entry.city), titleize(entry.country)]
    .filter(Boolean)
    .join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const buildWhatsAppMessage = (entries: TripEntry[]) => {
  const grouped = new Map<string, TripEntry[]>();
  entries.forEach((entry) => {
    const country = entry.country || 'atlas';
    const group = grouped.get(country) ?? [];
    group.push(entry);
    grouped.set(country, group);
  });

  const countries = [...grouped.keys()];
  const singleCountry = countries[0];
  const heading = countries.length === 1 && singleCountry
    ? `MY ATLAS — ${titleize(singleCountry).toUpperCase()}`
    : 'MY ATLAS';
  const lines = [
    heading,
    '',
    `Your journey so far — ${entries.length} saved ${entries.length === 1 ? 'place' : 'places'}.`,
  ];

  grouped.forEach((countryEntries, country) => {
    lines.push('');
    if (countries.length > 1) lines.push(titleize(country).toUpperCase());
    countryEntries.forEach((entry) => {
      lines.push(`• ${entry.name} → ${googleMapsUrl(entry)}`);
    });
  });

  lines.push('', 'Things To Do Atlas');
  return lines.join('\n');
};

const initWhatsAppShare = () => {
  const root = document.querySelector<HTMLElement>('[data-trip-summary]');
  if (!root || root.dataset.whatsappShareReady === 'true') return;
  root.dataset.whatsappShareReady = 'true';

  const openButton = root.querySelector<HTMLButtonElement>('[data-summary-share-open]');
  const modal = root.querySelector<HTMLElement>('[data-summary-share-modal]');
  const dialog = root.querySelector<HTMLElement>('[data-summary-share-dialog]');
  const closeButton = root.querySelector<HTMLButtonElement>('[data-summary-share-close]');
  const sendLink = root.querySelector<HTMLAnchorElement>('[data-summary-share-whatsapp]');
  const count = root.querySelector<HTMLElement>('[data-summary-share-count]');

  if (!openButton || !modal || !dialog || !closeButton || !sendLink || !count) return;

  let returnFocus: HTMLElement | null = null;

  const refresh = () => {
    const entries = readTripStore().entries;
    const hasEntries = entries.length > 0;
    openButton.disabled = !hasEntries;
    openButton.setAttribute(
      'aria-label',
      hasEntries
        ? `Take my Atlas with me. Share ${entries.length} saved ${entries.length === 1 ? 'place' : 'places'} on WhatsApp.`
        : 'Take my Atlas with me. Save a place first.',
    );
    count.textContent = hasEntries
      ? `${entries.length} saved ${entries.length === 1 ? 'place' : 'places'}, ready to share.`
      : 'Save a place to prepare your Atlas.';
    sendLink.href = hasEntries
      ? `https://wa.me/?text=${encodeURIComponent(buildWhatsAppMessage(entries))}`
      : '#';
    sendLink.setAttribute('aria-disabled', String(!hasEntries));
    return entries;
  };

  const closeModal = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('summary-share-is-open');
    returnFocus?.focus();
  };

  const openModal = () => {
    const entries = refresh();
    if (!entries.length) return;
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : openButton;
    modal.hidden = false;
    document.body.classList.add('summary-share-is-open');
    requestAnimationFrame(() => dialog.focus());
  };

  openButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);
  sendLink.addEventListener('click', (event) => {
    if (!readTripStore().entries.length) {
      event.preventDefault();
      refresh();
      return;
    }
    closeModal();
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== 'Tab') return;

    const firstFocusable = closeButton;
    const lastFocusable = sendLink;
    if (event.shiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  });

  window.addEventListener(MY_ATLAS_EVENT, refresh);
  window.addEventListener('storage', (event) => {
    if (event.key === MY_ATLAS_STORAGE_KEY || event.key === null) refresh();
  });

  refresh();
};

initWhatsAppShare();
document.addEventListener('astro:page-load', initWhatsAppShare);
