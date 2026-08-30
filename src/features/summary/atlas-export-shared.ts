import type { TripEntry } from '../trip/store';

export const PDF_MIME = 'application/pdf';
export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export type ExportKind = 'pdf' | 'xlsx';

export interface GeneratedExport {
  kind: ExportKind;
  blob: Blob;
  fileName: string;
  mimeType: string;
}

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

export const titleize = (value = '') => value
  .split('-')
  .filter(Boolean)
  .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
  .join(' ');

export const categoryLabel = (value = '') => {
  const normalized = value.trim().toLowerCase();
  return CATEGORY_LABELS[normalized] ?? titleize(normalized || 'places');
};

export const sortedEntries = (entries: TripEntry[]) => [...entries].sort((a, b) => {
  const aKey = `${a.country}\u0000${a.city}\u0000${categoryLabel(a.category)}\u0000${a.name}`;
  const bKey = `${b.country}\u0000${b.city}\u0000${categoryLabel(b.category)}\u0000${b.name}`;
  return aKey.localeCompare(bKey, undefined, { sensitivity: 'base' });
});

export const googleMapsUrl = (entry: TripEntry) => {
  const direct = entry.googleMapsUrl?.trim();
  if (direct) return direct;
  if (entry.coordinates) {
    const { latitude, longitude } = entry.coordinates;
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  }
  const query = [entry.name, titleize(entry.city), titleize(entry.country)].filter(Boolean).join(', ');
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
};

export const atlasPageUrl = (entry: TripEntry) => {
  if (!entry.sourcePath?.trim()) return new URL('/summary', window.location.origin).toString();
  try {
    return new URL(entry.sourcePath, window.location.origin).toString();
  } catch {
    return new URL('/summary', window.location.origin).toString();
  }
};

export const groupedEntries = (entries: TripEntry[]) => {
  const countries = new Map<string, Map<string, Map<string, TripEntry[]>>>();
  sortedEntries(entries).forEach((entry) => {
    const country = entry.country || 'atlas';
    const city = entry.city || 'saved-places';
    const category = entry.category || 'places';
    const cities = countries.get(country) ?? new Map<string, Map<string, TripEntry[]>>();
    const categories = cities.get(city) ?? new Map<string, TripEntry[]>();
    const items = categories.get(category) ?? [];
    items.push(entry);
    categories.set(category, items);
    cities.set(city, categories);
    countries.set(country, cities);
  });
  return countries;
};

export const atlasBaseName = (entries: TripEntry[]) => {
  const countries = [...new Set(entries.map((entry) => entry.country).filter(Boolean))];
  const label = countries.length === 1 ? titleize(countries[0]) : 'Travel';
  return `My-Atlas-${label.replace(/[^A-Za-z0-9-]+/g, '-')}`;
};

export const fileRows = (entries: TripEntry[]) => {
  const rows: string[][] = [[
    'Country', 'City', 'Category', 'Place', 'Google Maps', 'Atlas Page', 'Notes',
  ]];
  sortedEntries(entries).forEach((entry) => {
    rows.push([
      titleize(entry.country), titleize(entry.city), categoryLabel(entry.category), entry.name,
      googleMapsUrl(entry), atlasPageUrl(entry), '',
    ]);
  });
  return rows;
};
