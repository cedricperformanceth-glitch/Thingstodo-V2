const CITY = { latitude: 17.3946, longitude: 104.8065 };
const REVIEWED_AT = '2026-08-12';

const sourceProfiles = {
  restaurantGuru: {
    sourceName: 'Restaurant Guru current Thakhek index',
    sourceUrl: 'https://restaurantguru.com/Thakhek',
  },
  topRated: {
    sourceName: 'Top-Rated.Online current Thakhek-area index',
    sourceUrl: 'https://www.top-rated.online/countries/Laos/cities/Ban%2BPakdong/all/top-rated',
  },
  hostelworld: {
    sourceName: 'Hostelworld current Thakhek listings',
    sourceUrl: 'https://www.hostelworld.com/hotels/asia/laos/thakhek/',
  },
  official: {
    sourceName: 'Khammouane Tourism',
    sourceUrl: 'https://www.khammouanetourism.org/en',
  },
};

const slugify = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' and ').replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const maps = (name) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Thakhek Laos`)}`;

const categoryCopy = {
  restaurants: {
    description: (name) => `${name} is a current Thakhek food address retained after public-listing cross-checks, useful as one option for a meal before or after the Loop.`,
    tags: ['Town meal', 'Thakhek', 'Lunch dinner'],
  },
  cafes: {
    description: (name) => `${name} is a current Thakhek café or coffee stop retained after public-listing cross-checks for a daytime break in town.`,
    tags: ['Coffee stop', 'Thakhek', 'Daytime'],
  },
  accommodation: {
    description: (name) => `${name} is a current Thakhek stay retained as a practical base for the town and the start or finish of the Loop.`,
    tags: ['Loop base', 'Thakhek', 'Overnight'],
  },
  'scooter-rental': {
    description: (name) => `${name} is a current Thakhek motorbike-rental candidate for Loop preparation; inspect the bike and confirm the rental terms before leaving.`,
    tags: ['Loop rental', 'Bike check', 'Before ride'],
  },
  markets: {
    description: (name) => `${name} is a current Thakhek market address for everyday shopping, local food or a walk through the city’s commercial life.`,
    tags: ['Local market', 'Thakhek', 'Everyday stop'],
  },
  'practical-services': {
    description: (name) => `${name} is a practical Thakhek address worth saving for visitor information or essential local services during a stay in Khammouane.`,
    tags: ['Useful address', 'Thakhek', 'Save it'],
  },
};

function place(name, category, options = {}) {
  const profile = sourceProfiles[options.source ?? 'topRated'];
  const slug = slugify(name);
  const reputation = Number.isFinite(options.rating) && Number.isFinite(options.reviews)
    ? [{ sourceName: options.ratingSource ?? profile.sourceName, rating: options.rating, ratingScale: options.scale ?? 5, reviewCount: options.reviews, observedAt: REVIEWED_AT }]
    : [];
  const copy = categoryCopy[category];
  return {
    id: `place-${slug}`,
    slug,
    name,
    category,
    coordinates: CITY,
    address: options.address ?? 'Thakhek, Khammouane Province, Laos',
    googleMapsUrl: maps(options.mapQuery ?? name),
    shortDescription: options.description ?? copy.description(name),
    spaCard: { handwrittenTags: options.tags ?? copy.tags },
    verification: { decision: 'accept', reason: 'Current public listing cross-checked for the Thakhek research pool.' },
    sourceMetadata: { sourceName: 'Atlas V2 Thakhek verified research' },
    sources: [
      { sourceName: profile.sourceName, sourceUrl: profile.sourceUrl, purpose: 'candidate-discovery' },
      { sourceName: 'Google Maps', sourceUrl: 'https://www.google.com/maps', purpose: 'location' },
    ],
    rankingSignals: reputation.length ? { reputation } : {},
    manualLocks: {},
  };
}

export const places = [
  // Restaurants — active researched candidates.
  place('Orlasone-BBQ', 'restaurants', { source: 'restaurantGuru', rating: 4.8, reviews: 46 }),
  place('Space Bar&Restaurant', 'restaurants', { source: 'restaurantGuru', rating: 4.8, reviews: 13 }),
  place('Phubeer Restaurant', 'restaurants', { source: 'restaurantGuru', rating: 4.8, reviews: 108 }),
  place('Thakhek View', 'restaurants', { source: 'restaurantGuru', rating: 4.7, reviews: 24 }),
  place('Miss Tang Restaurant', 'restaurants', { source: 'restaurantGuru', rating: 4.5, reviews: 30 }),
  place('Six Friends Restaurant', 'restaurants', { source: 'restaurantGuru', rating: 2.4, reviews: 248 }),
  place('Khammouane Seafood', 'restaurants', { source: 'restaurantGuru' }),
  place('Muay Seafood & Restaurant', 'restaurants', { source: 'restaurantGuru' }),
  place('Kampan Seafood Restaurant & Grill', 'restaurants', { source: 'restaurantGuru' }),
  place('Thakhek’s Secret Bar', 'restaurants', { rating: 4.9, reviews: 46 }),
  place('Chill-Chill Restaurant and Bar', 'restaurants', { source: 'restaurantGuru' }),
  place('Quán Cơm Việt', 'restaurants', { source: 'restaurantGuru' }),
  place('Bonjour Thakhek', 'restaurants', { rating: 4.6, reviews: 47 }),

  // Coffee — active researched candidates, no restaurant duplication.
  place('YO & KO café', 'cafes', { rating: 4.6, reviews: 67 }),
  place('Geelot cha', 'cafes', { source: 'restaurantGuru' }),
  place('Vie de France', 'cafes', { rating: 4.9, reviews: 152 }),
  place('DD Bistro & Cafe', 'cafes', { source: 'restaurantGuru', rating: 4.8, reviews: 131 }),
  place("Organic cafe'", 'cafes', { rating: 4.4, reviews: 52 }),
  place('Candy cafe', 'cafes', { source: 'restaurantGuru', rating: 4.8, reviews: 19 }),
  place('Room Cafe Thakhek', 'cafes', { rating: 4.2, reviews: 70 }),
  place('Vegetarian House Cafe', 'cafes', { rating: 4.8, reviews: 35 }),
  place('Kamkhong home cafe by noungning', 'cafes', { rating: 4.9, reviews: 82 }),
  place('ROK Coffee Thakhek', 'cafes', { rating: 4.5, reviews: 22 }),
  place('Soukjai Cafe', 'cafes', { rating: 4.3, reviews: 45, description: 'Soukjai Cafe remains a current public café listing in central Thakhek; its exact branding should be checked editorially if the business identity changes.' }),
  place('La Parisian Cafe', 'cafes', { rating: 4.6, reviews: 30 }),
  place('Bike & Bed Hostel Café', 'cafes', { rating: 4.6, reviews: 280, description: 'Bike & Bed combines a traveller base with a café-style stop in Thakhek and is kept in Coffee only, avoiding a duplicate accommodation card.' }),

  // Accommodation — active researched candidates.
  place('Naga Hostel & Café', 'accommodation', { source: 'hostelworld', rating: 9.5, scale: 10, reviews: 442 }),
  place('Bami Thakhek Hostel', 'accommodation', { rating: 4.8, reviews: 108 }),
  place('Lao Home Hostel', 'accommodation', { rating: 4.6, reviews: 97 }),
  place('Nana Bungalows', 'accommodation', { rating: 4.7, reviews: 85 }),
  place('STAY HOSTEL by M&M', 'accommodation', { source: 'hostelworld', rating: 9.3, scale: 10, reviews: 35 }),
  place('Bamboo Hostel Thakhek', 'accommodation', { rating: 4.4, reviews: 118 }),
  place('Villa Thakhek', 'accommodation', { rating: 4.5, reviews: 120 }),
  place('Song Lao Guesthouse', 'accommodation', { rating: 4.2, reviews: 139 }),
  place('Xoksaysub Hotel', 'accommodation', { rating: 4.2, reviews: 137 }),
  place('Catty tourist house & restaurant', 'accommodation', { rating: 4.9, reviews: 31 }),
  place('Thakhek Travel Lodge', 'accommodation', { rating: 3.6, reviews: 242 }),
  place('Orlardee Hostel', 'accommodation', { source: 'hostelworld', rating: 9.1, scale: 10, reviews: 1 }),
  place('Nam Phou Hostel', 'accommodation', { source: 'hostelworld', rating: 10, scale: 10, reviews: 4 }),

  // Rental Scooter — exact generated target is five.

  // Markets are un-targeted: keep the distinct current addresses found.
  place('Center Point Thakhek', 'markets', { rating: 4.1, reviews: 343 }),
  place('Talad Lak3 Thakek', 'markets', { rating: 4.2, reviews: 82 }),
  place('Petmany Thakhek Market', 'markets', { rating: 4.1, reviews: 64 }),

  // Essential information is also un-targeted and kept intentionally small.
  place('Thakhek Tourism Information Center', 'practical-services', { source: 'official' }),
  place('Khamouane Province Hospital', 'practical-services', { source: 'official' }),
];
