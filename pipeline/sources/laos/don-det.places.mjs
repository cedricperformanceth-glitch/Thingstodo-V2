const googleMaps = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const slugify = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' and ').replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const sourceProfiles = {
  tripadvisor: [
    { sourceName: 'Tripadvisor', sourceUrl: 'https://www.tripadvisor.com/Restaurants-g1082249-Don_Det_Champasak_Province.html', purpose: 'candidate-discovery', use: 'name-only', signalStrength: 'strong' },
    { sourceName: 'Google Maps', sourceUrl: 'https://www.google.com/maps', purpose: 'location', signalStrength: 'supporting' },
  ],
  booking: [
    { sourceName: 'Booking.com', sourceUrl: 'https://www.booking.com/city/la/ban-dondet.html', purpose: 'candidate-discovery', use: 'name-only', signalStrength: 'strong' },
    { sourceName: 'Google Maps', sourceUrl: 'https://www.google.com/maps', purpose: 'location', signalStrength: 'supporting' },
  ],
  atlas: [
    { sourceName: 'Atlas V1 verified seed', sourceUrl: 'https://github.com/cedricperformanceth-glitch/thingstodoatlas', purpose: 'facts', signalStrength: 'supporting' },
    { sourceName: 'Google Maps', sourceUrl: 'https://www.google.com/maps', purpose: 'location', signalStrength: 'strong' },
  ],
  coffeeCurrent: [
    { sourceName: 'Laos Insider', sourceUrl: 'https://laosinsider.com/digital-nomad-in-laos/', purpose: 'facts', signalStrength: 'supporting' },
    { sourceName: 'Recent Don Det travel notes', sourceUrl: 'https://note.com/chaki610/n/n1e4f8d1ff08f?hl=en', purpose: 'facts', signalStrength: 'supporting' },
    { sourceName: 'Google Maps', sourceUrl: 'https://www.google.com/maps', purpose: 'location', signalStrength: 'strong' },
  ],
  currentDirectory: [
    { sourceName: 'Current public listing', sourceUrl: 'https://www.top-rated.online/countries/Laos/cities/Khorn%2BNeua/all', purpose: 'facts', signalStrength: 'strong' },
    { sourceName: 'Google Maps', sourceUrl: 'https://www.google.com/maps', purpose: 'location', signalStrength: 'supporting' },
  ],
  recentGuide: [
    { sourceName: 'Recent Don Det guide', sourceUrl: 'https://www.reisjunk.nl/laos/don-det-4000-islands/', purpose: 'facts', signalStrength: 'supporting' },
    { sourceName: 'Google Maps', sourceUrl: 'https://www.google.com/maps', purpose: 'location', signalStrength: 'strong' },
  ],
  worldplaces: [
    { sourceName: 'WorldPlaces', sourceUrl: 'https://laos.worldplaces.me/review/139973704-smiling-cafe-2.html', purpose: 'facts', signalStrength: 'strong' },
    { sourceName: 'Google Maps', sourceUrl: 'https://www.google.com/maps', purpose: 'location', signalStrength: 'supporting' },
  ],
  health: [
    { sourceName: 'Don Det Laos health information', sourceUrl: 'https://don-det-laos.com/health', purpose: 'facts', signalStrength: 'strong' },
    { sourceName: 'OpenStreetMap via Mapcarta', sourceUrl: 'https://mapcarta.com/N7084204385', purpose: 'location', signalStrength: 'supporting' },
  ],
};

function record(name, category, shortDescription, handwrittenTags, profile = 'atlas', options = {}) {
  const slug = slugify(name);
  const sources = sourceProfiles[profile];
  return {
    id: `place-${slug}`,
    slug,
    name,
    category,
    address: options.address ?? 'Don Det, Khong District, Champasak Province, Laos',
    googleMapsUrl: googleMaps(options.mapQuery ?? `${name} Don Det Laos`),
    shortDescription,
    spaCard: { handwrittenTags },
    verificationKind: 'business',
    verificationSignals: sources.map((source, index) => ({
      sourceId: `${slug}:${index}:${slugify(source.sourceName)}`,
      sourceUrl: source.sourceUrl,
      status: 'exists',
      observedAt: '2026-08-12',
      current: true,
      strength: source.signalStrength,
    })),
    sourceMetadata: { sourceName: 'Atlas V2 verified research', reviewedAt: '2026-08-12' },
    manualLocks: {},
    sources: sources.map(({ signalStrength, ...source }) => source),
  };
}

export const places = [
  // Restaurants — 15 distinct primary restaurant entities.
  record('Mama Leuah Restaurant', 'restaurants', 'A long-running Don Det restaurant for an unhurried island meal, with Lao and European dishes served on the quieter sunrise side.', ['Sunrise side', 'Island classic', 'Slow meal'], 'tripadvisor'),
  record('The 4000 Island Bar', 'restaurants', 'A lively riverside restaurant and bar near the ferry landing, useful for food, drinks and an easy first or last evening.', ['Near ferry', 'Food drinks', 'Late evening'], 'tripadvisor'),
  record("Kea's Backpackers Paradise Restaurant & Bar", 'restaurants', 'A social Don Det restaurant and bar with breakfast, casual meals and drinks, suited to travellers who enjoy a busier backpacker atmosphere.', ['Social stop', 'Breakfast', 'Evening drinks'], 'tripadvisor'),
  record('The Boathouse', 'restaurants', 'A riverside restaurant where the Mekong setting is part of the meal, better for a slower lunch or dinner than a quick stop.', ['Riverside', 'Slow lunch', 'Mekong view'], 'tripadvisor'),
  record('Datta Bananaleaf Restaurant', 'restaurants', 'An Indian and Asian restaurant on the sunset side, giving Don Det a useful change from the island’s usual Lao-Western menus.', ['Indian food', 'Sunset side', 'Dinner'], 'tripadvisor'),
  record('Hathim Indian Restaurant', 'restaurants', 'A straightforward Indian restaurant on Don Det’s sunset side, useful when curry, dosa or a vegetarian-friendly meal is the priority.', ['Indian food', 'Curry stop', 'Vegetarian'], 'tripadvisor'),
  record("Oi's Place", 'restaurants', 'A relaxed western-side restaurant and bar where casual food and river views make an easy stop before the Don Det sunset.', ['Sunset side', 'River view', 'Relaxed meal'], 'tripadvisor'),
  record('Banana Restaurant & Bar', 'restaurants', 'A laid-back restaurant and bar for simple island food and drinks, suited to an uncomplicated meal with friends on Don Det.', ['Casual dinner', 'Drinks', 'Easy stop'], 'tripadvisor'),
  record('Wrap and Roll', 'restaurants', 'A casual Don Det food stop for wraps and Lao dishes, useful when you want a quicker meal between island activities.', ['Quick meal', 'Lao food', 'Easy lunch'], 'tripadvisor'),
  record('Mama Piang Guesthouse & Restaurant', 'restaurants', 'A sunrise-side guesthouse restaurant for a calmer home-style meal, away from the louder bar-focused addresses around northern Don Det.', ['Guesthouse kitchen', 'Sunrise side', 'Quiet meal'], 'tripadvisor'),
  record('Restaurant Naly', 'restaurants', 'A simple local restaurant toward Don Khon, serving breakfast and everyday meals for travellers exploring the southern end of the islands.', ['Local table', 'South route', 'All day'], 'atlas'),
  record('Sahai Bar', 'restaurants', 'A casual Don Det restaurant-bar with coffee, cocktails and meals, flexible enough for breakfast, dinner or an evening drink.', ['Coffee drinks', 'All day', 'Casual bar'], 'atlas'),
  record('One More Bar and Restaurant', 'restaurants', 'A sunset-side bar and restaurant with food, drinks and live atmosphere, best kept for a social evening rather than a quiet dinner.', ['Sunset side', 'Live vibe', 'Evening'], 'atlas'),
  record('Dalom Guesthouse & Restaurants', 'restaurants', 'A central guesthouse restaurant address for straightforward Asian food, useful when staying near the main village and ferry area.', ['Central', 'Guesthouse food', 'Easy meal'], 'atlas'),
  record("Mr Tho's Restaurant", 'restaurants', 'A small Asian restaurant on Don Det for uncomplicated lunch or dinner, useful as a local alternative to the larger traveller bars.', ['Asian food', 'Local stop', 'Lunch dinner'], 'atlas'),

  // Coffee — 15 distinct entities, no duplication with Restaurants.
  record('Crazy Gecko', 'cafes', 'A riverfront café-restaurant on the sunrise side with coffee, breakfast and healthy dishes for a longer daytime pause beside the Mekong.', ['Riverfront', 'Breakfast', 'Healthy food'], 'tripadvisor'),
  record('Street View Restaurant', 'cafes', 'A practical sunrise-side stop for breakfast, coffee and generous casual meals, about a short walk from Don Det’s ferry area.', ['Sunrise side', 'Breakfast', 'Big portions'], 'tripadvisor'),
  record('Mama Tanon Guest House & Restaurant', 'cafes', 'A small guesthouse restaurant that works well for breakfast, coffee or an easy daytime meal without leaving the quieter island rhythm.', ['Small table', 'Breakfast', 'Coffee break'], 'tripadvisor'),
  record('Bamboo Cafe & Korean Restaurant', 'cafes', 'A dedicated café on sunset street combining proper coffee and fresh drinks with brunch and Korean food, unusual by Don Det standards.', ['Proper coffee', 'Korean food', 'Sunset street'], 'tripadvisor'),
  record('Ms Ning Restaurant and Guesthouse', 'cafes', 'A central guesthouse restaurant serving breakfast and brunch, convenient for coffee and a simple meal close to Don Det’s main village.', ['Central', 'Breakfast', 'Easy coffee'], 'tripadvisor'),
  record('AllNew coffee & restaurant', 'cafes', 'A current Don Det coffee-and-restaurant stop with a clear coffee focus, suitable for a daytime drink or an uncomplicated meal.', ['Great coffee', 'Daytime', 'Casual meal'], 'atlas'),
  record('Kamphong Riverside Restaurant', 'cafes', 'A riverside all-day restaurant known for coffee and breakfast as well as meals, useful for an early start near the water.', ['Great coffee', 'Breakfast', 'Riverside'], 'atlas'),
  record('Jimmee restaurant', 'cafes', 'An early-opening Don Det restaurant offering coffee, breakfast and brunch, useful when you want food before starting a full island day.', ['Early opening', 'Coffee', 'Breakfast'], 'currentDirectory'),
  record('Noupad Restaurant', 'cafes', 'A small all-day stop toward Don Khon with coffee and brunch, handy before or after cycling the southern island routes.', ['Coffee', 'Brunch', 'South route'], 'currentDirectory'),
  record('Dondet Coffee House & Gift-shop', 'cafes', 'A genuine coffee shop and small gift stop with Wi-Fi and power outlets, especially useful for a work break on Don Det.', ['Coffee shop', 'WiFi', 'Work stop'], 'coffeeCurrent'),
  record('Paradise Restaurant Cafe & Bar', 'cafes', 'An all-day café-bar near northern Don Det with coffee, breakfast and meals, convenient when you want one flexible stop.', ['Great coffee', 'Breakfast', 'Cafe bar'], 'atlas'),
  record('Cloud 9 Restaurant and Bar', 'cafes', 'A café-restaurant known for cakes and Turkish coffee at breakfast, then Mediterranean and Middle Eastern food later in the day.', ['Turkish coffee', 'Homemade cakes', 'Breakfast'], 'atlas'),
  record("Mouy's", 'cafes', 'A recent Don Det riverside food recommendation that also works as a relaxed daytime stop when you want a local meal by the water.', ['Riverside', 'Local food', 'Daytime'], 'recentGuide'),
  record('Little Eden Restaurant', 'cafes', 'A hotel restaurant overlooking the river, useful for breakfast or coffee when you want a more settled table near northern Don Det.', ['Hotel cafe', 'River view', 'Breakfast'], 'tripadvisor'),
  record('Smiling Cafe 2', 'cafes', 'A small café-style stop in the Don Det village area, kept as a simple coffee break rather than a destination meal.', ['Cafe stop', 'Village', 'Coffee break'], 'worldplaces'),

  // Guest Houses — 15 distinct accommodation entities.
  record('DODAND Studio & Sunset Riverside Guesthouse', 'accommodation', 'Sunset-side riverside studios with private outdoor space, suited to travellers wanting a quieter stay directly beside the Mekong.', ['Sunset side', 'Riverfront', 'Quiet stay'], 'booking'),
  record('DONDET Vixay Sunset And River View', 'accommodation', 'Riverside rooms and bungalows with broad sunset views, offering an easy island base with food and drinks available on site.', ['Sunset view', 'Riverside', 'Island base'], 'booking'),
  record('Thiptavanh guesthouse', 'accommodation', 'A small sunrise-side guesthouse with river-facing balconies and simple rooms, positioned away from the busiest northern part of Don Det.', ['Sunrise side', 'River balcony', 'Quiet rooms'], 'booking', { address: '20 Sunrise blv, Don Det, Laos' }),
  record('Moon By Night', 'accommodation', 'A sunset-side bungalow stay with garden space, close enough to restaurants and bars while still offering a quieter place to sleep.', ['Garden stay', 'Sunset side', 'Quiet sleep'], 'booking'),
  record('Don Det Hotel', 'accommodation', 'A more polished hotel option near the northern arrival area, useful for travellers wanting a conventional room and easy village access.', ['Near arrival', 'Hotel comfort', 'Central'], 'booking'),
  record('BABA Guesthouse', 'accommodation', 'A well-kept guesthouse near the village centre with private rooms and balconies, convenient for the ferry, restaurants and island paths.', ['Central', 'Private rooms', 'Easy arrival'], 'booking', { address: 'Ban Dondet, 4,000 thousand Islands, Don Det, Laos' }),
  record('BOONMY - Bungalows and Restaurant - DON DET - 4000 ISLANDS', 'accommodation', 'Sunrise-side bungalows with a garden and restaurant, suited to travellers cycling between Don Det, the bridge and Don Khon.', ['Bungalows', 'Garden', 'South route'], 'booking'),
  record('Namknong View', 'accommodation', 'A sunset-side guesthouse with river-facing verandas, useful for a quieter stay slightly removed from the busiest part of the village.', ['Sunset side', 'River veranda', 'Quiet stay'], 'booking'),
  record('DONDET Garden Guest House', 'accommodation', 'Simple garden rooms close to the main village, practical for travellers who want privacy while staying within walking distance of services.', ['Garden rooms', 'Near village', 'Practical'], 'booking'),
  record('Rivergarden Guesthouse', 'accommodation', 'A small guesthouse on the southern island route, useful as a quieter base closer to the bridge and Don Khon.', ['South route', 'Quiet base', 'Guesthouse'], 'booking'),
  record('Don Det Mr.B Riverside Budget Guesthouse', 'accommodation', 'A budget riverside guesthouse for travellers prioritising a simple private stay and easy access to the Don Det island paths.', ['Budget stay', 'Riverside', 'Simple rooms'], 'booking'),
  record('Green Guesthouse', 'accommodation', 'A straightforward sunset-side guesthouse, useful for budget travellers who want simple lodging near the main Don Det village area.', ['Budget', 'Sunset side', 'Simple stay'], 'booking'),
  record('Yommalay Guesthouse', 'accommodation', 'A budget-friendly guesthouse near northern Don Det, convenient for the ferry, restaurants and the first section of the island paths.', ['Budget', 'Near ferry', 'Central'], 'booking'),
  record('Tawan Daeng Guesthouse', 'accommodation', 'A guesthouse farther down the sunrise path toward the old bridge, suited to travellers who prefer the quieter southern side.', ['Sunrise path', 'South side', 'Quiet base'], 'booking'),
  record('Noupad sunset Guesthouse', 'accommodation', 'A small sunset-side homestay-style guesthouse, useful for travellers seeking simple lodging away from the main arrival strip.', ['Sunset side', 'Small stay', 'Quiet'], 'booking'),

  // Essential Information — useful verified addresses only; no invented tourism or immigration office.
  record('Don Det Ferry', 'practical-services', 'The main Don Det boat connection for Nakasang, useful to save before arrival, departure and onward bus or minivan connections.', ['Main pier', 'Nakasang', 'Boat link'], 'atlas', { address: 'Northern Don Det, Khong District, Champasak Province, Laos', mapQuery: 'Don Det Ferry Boat Pier Laos' }),
  record('Khon Health Center (Khonnua)', 'practical-services', 'A public local health centre on Don Khon for basic primary care and first assessment, not a substitute for a fully equipped hospital.', ['Health center', 'Basic care', 'Don Khon'], 'health', { address: 'Khon Nua, Don Khon, Khong District, Champasak Province, Laos', mapQuery: 'Khon Health Center Khonnua Don Khon Laos' }),
];
