import {
  MY_ATLAS_EVENT,
  MY_ATLAS_STORAGE_KEY,
  readTripStore,
  type TripEntry,
} from '../trip/store';

const CATEGORY_LABELS: Record<string, string> = {
  activity: 'Activities',
  activities: 'Activities',
  'thing-to-do': 'Activities',
  'things-to-do': 'Activities',
  restaurant: 'Restaurants',
  restaurants: 'Restaurants',
  cafe: 'Cafés',
  cafes: 'Cafés',
  café: 'Cafés',
  cafés: 'Cafés',
  guesthouse: 'Guesthouses',
  guesthouses: 'Guesthouses',
  hotel: 'Hotels',
  hotels: 'Hotels',
  accommodation: 'Stay',
  rental: 'Rentals',
  rentals: 'Rentals',
  'motorbike-rental': 'Rentals',
  'motorbike-rentals': 'Rentals',
  gym: 'Gyms & Fitness',
  gyms: 'Gyms & Fitness',
  fitness: 'Gyms & Fitness',
  market: 'Markets',
  markets: 'Markets',
  essential: 'Essential Info',
  'essential-info': 'Essential Info',
};

const titleize = (value = '') => value
  .split('-')
  .filter(Boolean)
  .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
  .join(' ');

const categoryLabel = (value = '') => {
  const normalized = value.trim().toLowerCase();
  return CATEGORY_LABELS[normalized] ?? titleize(normalized || 'places');
};

const googleMapsUrl = (entry: TripEntry) => {
  const direct = entry.googleMapsUrl?.trim();
  if (direct && /(?:maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(direct)) return direct;

  if (entry.coordinates) {
    const { latitude, longitude } = entry.coordinates;
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  }

  if (direct) return direct;

  const query = [entry.name, titleize(entry.city), titleize(entry.country)]
    .filter(Boolean)
    .join(', ');
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
};

const groupEntries = (entries: TripEntry[]) => {
  const countries = new Map<string, Map<string, Map<string, TripEntry[]>>>();

  entries.forEach((entry) => {
    const country = entry.country || 'atlas';
    const city = entry.city || 'saved-places';
    const category = entry.category || 'places';

    const cities = countries.get(country) ?? new Map<string, Map<string, TripEntry[]>>();
    const categories = cities.get(city) ?? new Map<string, TripEntry[]>();
    const categoryEntries = categories.get(category) ?? [];

    categoryEntries.push(entry);
    categories.set(category, categoryEntries);
    cities.set(city, categories);
    countries.set(country, cities);
  });

  return countries;
};

const buildWhatsAppMessage = (
  entries: TripEntry[],
  personalNote = '',
  summaryUrl = '',
) => {
  const lines: string[] = [];
  const note = personalNote.trim();
  if (note) lines.push(note, '');

  const countries = groupEntries(entries);

  countries.forEach((cities, country) => {
    const countryEntries = [...cities.values()]
      .flatMap((categories) => [...categories.values()])
      .flat();

    if (lines.length) lines.push('');
    lines.push(
      `*MY ATLAS — ${titleize(country).toUpperCase()}*`,
      `Your journey so far — ${countryEntries.length} saved ${countryEntries.length === 1 ? 'place' : 'places'}.`,
    );

    cities.forEach((categories, city) => {
      lines.push('', `*${titleize(city)}*`);

      categories.forEach((categoryEntries, category) => {
        lines.push(`_${categoryLabel(category)}_`);
        categoryEntries.forEach((entry) => {
          lines.push(`• ${entry.name} → Google Map`);
          lines.push(`  ${googleMapsUrl(entry)}`);
        });
      });
    });
  });

  lines.push(
    '',
    '',
    'Thanks for letting Things To Do Atlas travel with you. Have a beautiful journey.',
    '',
    '*Things To Do Atlas — Your Atlas*',
  );
  if (summaryUrl) lines.push(summaryUrl);

  return lines.join('\n');
};

const normalizeWhatsAppNumber = (value: string): string | null => {
  const raw = value.trim();
  if (!raw) return '';

  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);

  if (digits.startsWith('0') || digits.length < 7 || digits.length > 15) return null;
  return digits;
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
  const phoneInput = root.querySelector<HTMLInputElement>('[data-summary-share-phone]');
  const noteInput = root.querySelector<HTMLTextAreaElement>('[data-summary-share-note]');
  const phoneError = root.querySelector<HTMLElement>('[data-summary-share-phone-error]');

  if (
    !openButton
    || !modal
    || !dialog
    || !closeButton
    || !sendLink
    || !count
    || !phoneInput
    || !noteInput
    || !phoneError
  ) return;

  let returnFocus: HTMLElement | null = null;

  const refreshShareUrl = () => {
    const entries = readTripStore().entries;
    const phone = normalizeWhatsAppNumber(phoneInput.value);
    const invalidPhone = phone === null;
    const hasEntries = entries.length > 0;

    phoneInput.setAttribute('aria-invalid', String(invalidPhone));
    phoneError.hidden = !invalidPhone;

    const summaryUrl = new URL('/summary', window.location.origin).toString();
    const message = buildWhatsAppMessage(entries, noteInput.value, summaryUrl);
    const destination = phone ? `https://wa.me/${phone}` : 'https://wa.me/';

    sendLink.href = hasEntries && !invalidPhone
      ? `${destination}?text=${encodeURIComponent(message)}`
      : '#';
    sendLink.setAttribute('aria-disabled', String(!hasEntries || invalidPhone));

    return { entries, invalidPhone };
  };

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
    refreshShareUrl();
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
    requestAnimationFrame(() => phoneInput.focus());
  };

  openButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);
  phoneInput.addEventListener('input', refreshShareUrl);
  noteInput.addEventListener('input', refreshShareUrl);

  sendLink.addEventListener('click', (event) => {
    const { entries, invalidPhone } = refreshShareUrl();
    if (!entries.length || invalidPhone) {
      event.preventDefault();
      if (invalidPhone) phoneInput.focus();
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

    const focusable = [...dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href]:not([aria-disabled="true"])',
    )].filter((element) => !element.hidden);
    if (!focusable.length) return;

    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];
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
