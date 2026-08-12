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
  atlasV1: {
    sourceName: 'Atlas V1 Thakhek research seed',
    sourceUrl: 'https://github.com/cedricperformanceth-glitch/thingstodoatlas',
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
    verification: { decision: 'accept', reason: 'Current public listing cross-checked for the Thakhek research pool.', checkedAt: '2026-08-12T00:00:00.000Z' },
    sourceMetadata: { sourceName: 'Atlas V2 Thakhek verified research', reviewedAt: REVIEWED_AT },
    sources: [
      { sourceName: profile.sourceName, sourceUrl: profile.sourceUrl, purpose: 'candidate-discovery' },
      { sourceName: 'Google Maps', sourceUrl: 'https://www.google.com/maps', purpose: 'location' },
    ],
    rankingSignals: reputation.length ? { reputation } : {},
    manualLocks: {},
  };
}

export const places = [
  // Restaurants — deliberately larger than the 24-card target so ranking has real choice.
  place('Inthira Thakhek Restaurant', 'restaurants', { source: 'atlasV1' }),
  place('Sunset Restaurant', 'restaurants', { rating: 4.0, reviews: 298 }),
  place('Bánh Mỳ Ngon', 'restaurants', { source: 'restaurantGuru', rating: 4.8, reviews: 44 }),
  place('ThaKhek Mai Guesthouse and Restaurant', 'restaurants', { source: 'restaurantGuru', rating: 4.8, reviews: 140 }),
  place('Orlasone-BBQ', 'restaurants', { source: 'restaurantGuru', rating: 4.8, reviews: 46 }),
  place('Space Bar&Restaurant', 'restaurants', { source: 'restaurantGuru', rating: 4.8, reviews: 13 }),
  place('Phubeer Restaurant', 'restaurants', { source: 'restaurantGuru', rating: 4.8, reviews: 108 }),
  place('Sai Tek Bánh Cuốn', 'restaurants', { source: 'restaurantGuru', rating: 4.8, reviews: 16 }),
  place('Thakhek View', 'restaurants', { source: 'restaurantGuru', rating: 4.7, reviews: 24 }),
  place('Gun Eng Restaurant', 'restaurants', { source: 'restaurantGuru', rating: 4.6, reviews: 46 }),
  place('Miss Tang Restaurant', 'restaurants', { source: 'restaurantGuru', rating: 4.5, reviews: 30 }),
  place('Nongpa Lak Xee Restaurant', 'restaurants', { source: 'restaurantGuru', rating: 4.4, reviews: 35 }),
  place('Kyoto Japanese Restaurant', 'restaurants', { rating: 4.5, reviews: 57 }),
  place('Shong Fang Khong Restaurant', 'restaurants', { source: 'restaurantGuru', rating: 2.8, reviews: 343 }),
  place('Six Friends Restaurant', 'restaurants', { source: 'restaurantGuru', rating: 2.4, reviews: 248 }),
  place('Smile Restaurant', 'restaurants', { rating: 3.4, reviews: 77 }),
  place('JinLong Hotpot Buffet', 'restaurants', { source: 'restaurantGuru' }),
  place('Restaurant Lee Lee', 'restaurants', { source: 'restaurantGuru' }),
  place('Patalai', 'restaurants', { source: 'atlasV1' }),
  place('Sabaidee Thakhek Restaurant', 'restaurants', { source: 'atlasV1' }),
  place('Mama Lao', 'restaurants', { source: 'atlasV1' }),
  place('Savanna', 'restaurants', { source: 'atlasV1' }),
  place('Zor Champa Restaurant', 'restaurants', { source: 'atlasV1' }),
  place('Khammouane Seafood', 'restaurants', { source: 'restaurantGuru' }),
  place('Muay Seafood & Restaurant', 'restaurants', { source: 'restaurantGuru' }),
  place('Kampan Seafood Restaurant & Grill', 'restaurants', { source: 'restaurantGuru' }),
  place('Thakhek’s Secret Bar', 'restaurants', { rating: 4.9, reviews: 46 }),
  place('Chill-Chill Restaurant and Bar', 'restaurants', { source: 'restaurantGuru' }),
  place('Quán Cơm Việt', 'restaurants', { source: 'restaurantGuru' }),
  place('Bonjour Thakhek', 'restaurants', { rating: 4.6, reviews: 47 }),
  place('Jiddaporn Restaurant', 'restaurants', { rating: 4.6, reviews: 43 }),

  // Coffee — 25 genuinely identifiable current café/coffee candidates, no restaurant duplication.
  place('YO & KO café', 'cafes', { rating: 4.6, reviews: 67 }),
  place('Café Amazon.aPKa', 'cafes', { rating: 4.2, reviews: 149 }),
  place('Q kafé', 'cafes', { source: 'restaurantGuru' }),
  place('Geelot cha', 'cafes', { source: 'restaurantGuru' }),
  place('Vie de France', 'cafes', { rating: 4.9, reviews: 152 }),
  place('DD Bistro & Cafe', 'cafes', { source: 'restaurantGuru', rating: 4.8, reviews: 131 }),
  place("Organic cafe'", 'cafes', { rating: 4.4, reviews: 52 }),
  place('Candy cafe', 'cafes', { source: 'restaurantGuru', rating: 4.8, reviews: 19 }),
  place('Room Cafe Thakhek', 'cafes', { rating: 4.2, reviews: 70 }),
  place('Sunset coconut farm & cafe', 'cafes', { source: 'restaurantGuru', rating: 4.7, reviews: 10 }),
  place('Vegetarian House Cafe', 'cafes', { rating: 4.8, reviews: 35 }),
  place('Le Bleu Café', 'cafes', { source: 'atlasV1' }),
  place('Vimala Cafe', 'cafes', { source: 'atlasV1' }),
  place('Login Cafe Thakhaek', 'cafes', { source: 'atlasV1' }),
  place('B96 Coffee and Tea', 'cafes', { source: 'atlasV1' }),
  place('Kamkhong home cafe by noungning', 'cafes', { rating: 4.9, reviews: 82 }),
  place('ROK Coffee Thakhek', 'cafes', { rating: 4.5, reviews: 22 }),
  place('Mixue Ice Cream & Tea Thakhek', 'cafes', { source: 'atlasV1' }),
  place('Riveria Hotel Coffee Shop', 'cafes', { source: 'atlasV1' }),
  place('A’plus coffee slow bar', 'cafes', { source: 'restaurantGuru' }),
  place('Thakhek kammouan sunset restaurant and coffee', 'cafes', { source: 'restaurantGuru' }),
  place('Sinouk Coffee', 'cafes', { rating: 3.2, reviews: 36 }),
  place('Soukjai Cafe', 'cafes', { rating: 4.3, reviews: 45, description: 'Soukjai Cafe remains a current public café listing in central Thakhek; its exact branding should be checked editorially if the business identity changes.' }),
  place('La Parisian Cafe', 'cafes', { rating: 4.6, reviews: 30 }),
  place('Bike & Bed Hostel Café', 'cafes', { rating: 4.6, reviews: 280, description: 'Bike & Bed combines a traveller base with a café-style stop in Thakhek and is kept in Coffee only, avoiding a duplicate accommodation card.' }),

  // Accommodation — 24 candidates for a 21-card target.
  place('Naga Hostel & Café', 'accommodation', { source: 'hostelworld', rating: 9.5, scale: 10, reviews: 442 }),
  place('Bami Thakhek Hostel', 'accommodation', { rating: 4.8, reviews: 108 }),
  place('Lao Home Hostel', 'accommodation', { rating: 4.6, reviews: 97 }),
  place('Nana Bungalows', 'accommodation', { rating: 4.7, reviews: 85 }),
  place('STAY HOSTEL by M&M', 'accommodation', { source: 'hostelworld', rating: 9.3, scale: 10, reviews: 35 }),
  place('Bamboo Hostel Thakhek', 'accommodation', { rating: 4.4, reviews: 118 }),
  place('Villa Thakhek', 'accommodation', { rating: 4.5, reviews: 120 }),
  place('Song Lao Guesthouse', 'accommodation', { rating: 4.2, reviews: 139 }),
  place('Xoksaysub Hotel', 'accommodation', { rating: 4.2, reviews: 137 }),
  place('Dongsay Hotel', 'accommodation', { rating: 4.0, reviews: 185 }),
  place("Le Bouton D'or Boutique Hotel", 'accommodation', { source: 'atlasV1' }),
  place('Lao Style Guesthouse', 'accommodation', { source: 'atlasV1' }),
  place('Phonethep Hotel', 'accommodation', { source: 'atlasV1' }),
  place('Southida', 'accommodation', { source: 'atlasV1' }),
  place('Vannida Hotel and Resort', 'accommodation', { rating: 3.7, reviews: 139 }),
  place('Catty tourist house & restaurant', 'accommodation', { rating: 4.9, reviews: 31 }),
  place('Domea Thakhek - Urban Glamping', 'accommodation', { source: 'atlasV1' }),
  place('Thakhek Travel Lodge', 'accommodation', { rating: 3.6, reviews: 242 }),
  place('Chandala Hotel', 'accommodation', { source: 'atlasV1' }),
  place('Le Khammouane Villa', 'accommodation', { source: 'atlasV1' }),
  place('Orlardee Hostel', 'accommodation', { source: 'hostelworld', rating: 9.1, scale: 10, reviews: 1 }),
  place('Nam Phou Hostel', 'accommodation', { source: 'hostelworld', rating: 10, scale: 10, reviews: 4 }),
  place("Fip's Inn", 'accommodation', { source: 'hostelworld', rating: 9.8, scale: 10, reviews: 4 }),
  place('Riveria Hotel', 'accommodation', { rating: 4.1, reviews: 233 }),

  // Rental Scooter — exact generated target is five.
  place('Mixay Thakhek Motor Rental', 'scooter-rental', { source: 'atlasV1' }),
  place('PokemonGo Motorbike Rental', 'scooter-rental', { source: 'atlasV1' }),
  place('Wang Wang Motor Rental', 'scooter-rental', { source: 'atlasV1' }),
  place('Mad Monkey Motorcycle', 'scooter-rental', { source: 'atlasV1' }),
  place("KU'S Motorbike Rental", 'scooter-rental', { source: 'atlasV1' }),

  // Markets are un-targeted: keep the distinct current addresses found.
  place('Center Point Thakhek', 'markets', { rating: 4.1, reviews: 343 }),
  place('Talad Lak3 Thakek', 'markets', { rating: 4.2, reviews: 82 }),
  place('Petmany Thakhek Market', 'markets', { rating: 4.1, reviews: 64 }),

  // Essential information is also un-targeted and kept intentionally small.
  place('Thakhek Tourism Information Center', 'practical-services', { source: 'official' }),
  place('Khamouane Province Hospital', 'practical-services', { source: 'official' }),
];
