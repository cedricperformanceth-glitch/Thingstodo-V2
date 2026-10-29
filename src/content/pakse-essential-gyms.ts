import type { Place, ResearchSource } from '../core/models/types';

type SourcedPlace = Place & { researchSources?: ResearchSource[] };

const mapUrl = (query: string, placeId: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}&query_place_id=${placeId}`;

export const pakseEssentialAndGymPlaces: readonly SourcedPlace[] = [
  {
    id: 'place-pakse-immigration-visa-extension-office',
    slug: 'pakse-immigration-visa-extension-office',
    name: 'Pakse Immigration & Visa Extension Office',
    country: 'laos',
    city: 'pakse',
    category: 'practical-services',
    coordinates: { latitude: 15.12079, longitude: 105.79964 },
    locationScope: 'point',
    shortDescription: 'The local immigration office used for visa extensions and immigration paperwork in Pakse. Go on a weekday and allow for the midday closure.',
    media: {
      card: {},
      fieldCard: { gallery: [] },
    },
    spaCard: {
      handwrittenTags: ['Visa extension', 'Immigration', 'Weekdays'],
      openingHours: 'Mon to Fri · 08:00 to 11:00 · 13:30 to 16:00',
      photoStatus: 'missing',
      photoRequiresManualFill: true,
    },
    verification: {
      decision: 'accept',
      reason: 'Current Pakse visa and passport office listing cross checked with current Laos visa extension guidance.',
    },
    sourceMetadata: {
      sourceName: 'Google Maps',
      sourceUrl: mapUrl('Pakse Immigration & Visa Extension Office, Pakse, Laos', 'ChIJT2lo2jP5FDERK4BGiqh6ZL8'),
    },
    manualLocks: {},
    address: '4QCX+8V6, Pakse, Laos',
    googleMapsUrl: mapUrl('Pakse Immigration & Visa Extension Office, Pakse, Laos', 'ChIJT2lo2jP5FDERK4BGiqh6ZL8'),
    researchSources: [
      {
        sourceName: 'Google Maps',
        sourceUrl: mapUrl('Pakse Immigration & Visa Extension Office, Pakse, Laos', 'ChIJT2lo2jP5FDERK4BGiqh6ZL8'),
        purpose: 'location',
        sourceType: 'map-platform',
      },
      {
        sourceName: 'UK Foreign Travel Advice',
        sourceUrl: 'https://www.gov.uk/foreign-travel-advice/laos/entry-requirements',
        purpose: 'facts',
      },
    ],
  },
  {
    id: 'place-champasak-information-culture-tourism-department',
    slug: 'champasak-information-culture-tourism-department',
    name: 'Champasak Information, Culture and Tourism Department',
    country: 'laos',
    city: 'pakse',
    category: 'practical-services',
    coordinates: { latitude: 15.11606, longitude: 105.82458 },
    locationScope: 'point',
    shortDescription: 'The provincial tourism office in Pakse for official local information, current visitor guidance and questions about travelling around Champasak.',
    media: {
      card: {},
      fieldCard: { gallery: [] },
    },
    spaCard: {
      handwrittenTags: ['Tourism office', 'Official information', 'Champasak'],
      openingHours: 'Mon to Fri · 08:30 to 16:30',
      photoStatus: 'missing',
      photoRequiresManualFill: true,
    },
    verification: {
      decision: 'accept',
      reason: 'Current public tourism department listing in Pakse cross checked against recent Champasak tourism authority reporting.',
    },
    sourceMetadata: {
      sourceName: 'Google Maps',
      sourceUrl: mapUrl('Champasak Information Culture and Tourism Department, Pakse, Laos', 'ChIJyb2218f5FDER4VkBfyP-LS8'),
    },
    manualLocks: {},
    address: '4R8F+CRG, Road 13, Pakse, Laos',
    googleMapsUrl: mapUrl('Champasak Information Culture and Tourism Department, Pakse, Laos', 'ChIJyb2218f5FDER4VkBfyP-LS8'),
    researchSources: [
      {
        sourceName: 'Google Maps',
        sourceUrl: mapUrl('Champasak Information Culture and Tourism Department, Pakse, Laos', 'ChIJyb2218f5FDER4VkBfyP-LS8'),
        purpose: 'location',
        sourceType: 'map-platform',
      },
      {
        sourceName: 'Lao News Agency',
        sourceUrl: 'https://kpl.gov.la/En/detail.aspx/detail.aspx?id=91422',
        purpose: 'facts',
      },
    ],
  },
  {
    id: 'place-champasak-provincial-hospital',
    slug: 'champasak-provincial-hospital',
    name: 'Champasak Provincial Hospital',
    country: 'laos',
    city: 'pakse',
    category: 'practical-services',
    coordinates: { latitude: 15.11684, longitude: 105.80017 },
    locationScope: 'point',
    shortDescription: 'The main public provincial hospital in Pakse. Routine services run during weekday daytime hours, while the hospital reports a 24 hour emergency response and ambulance service.',
    media: {
      card: {},
      fieldCard: { gallery: [] },
    },
    spaCard: {
      handwrittenTags: ['Public hospital', '24h emergency', 'Medical care'],
      openingHours: 'Emergency 24h · routine services Mon to Fri daytime',
      photoStatus: 'missing',
      photoRequiresManualFill: true,
    },
    verification: {
      decision: 'accept',
      reason: 'Hospital identity and location cross checked against current public mapping and the current UK government Laos medical facilities list.',
    },
    sourceMetadata: {
      sourceName: 'UK Foreign Travel Advice',
      sourceUrl: 'https://www.gov.uk/government/publications/laos-list-of-medical-facilities/list-of-medical-facilities-practitioners-in-laos',
    },
    manualLocks: {},
    address: 'Route 1, Ban Lakmeuang, Pakse District, Champasak Province, Laos',
    googleMapsUrl: mapUrl('Champasak Provincial Hospital, Pakse, Laos', 'ChIJE_qZ-bP4FDER85kh2sBXLA4'),
    researchSources: [
      {
        sourceName: 'Google Maps',
        sourceUrl: mapUrl('Champasak Provincial Hospital, Pakse, Laos', 'ChIJE_qZ-bP4FDER85kh2sBXLA4'),
        purpose: 'location',
        sourceType: 'map-platform',
      },
      {
        sourceName: 'UK government medical facilities list',
        sourceUrl: 'https://www.gov.uk/government/publications/laos-list-of-medical-facilities/list-of-medical-facilities-practitioners-in-laos',
        purpose: 'facts',
      },
    ],
  },
  {
    id: 'place-tourist-police-champasak-pakse',
    slug: 'tourist-police-champasak-pakse',
    name: 'Tourist Police Champasak',
    country: 'laos',
    city: 'pakse',
    category: 'practical-services',
    coordinates: { latitude: 15.11939, longitude: 105.79692 },
    locationScope: 'point',
    shortDescription: 'A mapped tourist police contact in central Pakse, but the current public listing is poorly documented and should be verified locally before relying on the pin. For urgent police assistance in Laos, call 1191.',
    media: {
      card: {},
      fieldCard: { gallery: [] },
    },
    spaCard: {
      handwrittenTags: ['Tourist police', 'Verify locally', 'Police 1191'],
      photoStatus: 'missing',
      photoRequiresManualFill: true,
    },
    verification: {
      decision: 'manual-review',
      reason: 'A current Pakse map listing exists, but recent public feedback questions whether the pin still functions as a dedicated tourist police office. The national police emergency number 1191 is independently current.',
    },
    sourceMetadata: {
      sourceName: 'Google Maps',
      sourceUrl: mapUrl('Tourist Police Champasak, Pakse, Laos', 'ChIJxT-HtLP4FDERWBwdYAO4ZQg'),
    },
    manualLocks: {},
    address: '4Q9W+QQ3, Pakse, Laos',
    googleMapsUrl: mapUrl('Tourist Police Champasak, Pakse, Laos', 'ChIJxT-HtLP4FDERWBwdYAO4ZQg'),
    researchSources: [
      {
        sourceName: 'Google Maps',
        sourceUrl: mapUrl('Tourist Police Champasak, Pakse, Laos', 'ChIJxT-HtLP4FDERWBwdYAO4ZQg'),
        purpose: 'location',
        sourceType: 'map-platform',
      },
      {
        sourceName: 'UK Foreign Travel Advice',
        sourceUrl: 'https://www.gov.uk/foreign-travel-advice/laos/getting-help',
        purpose: 'facts',
      },
    ],
  },
  {
    id: 'place-pakse-police-department',
    slug: 'pakse-police-department',
    name: 'Pakse Police Department',
    country: 'laos',
    city: 'pakse',
    category: 'practical-services',
    coordinates: { latitude: 15.11959, longitude: 105.80552 },
    locationScope: 'point',
    shortDescription: 'The regular city police department in Pakse and a more dependable backup address if the tourist police listing is unclear. The national police emergency number is 1191.',
    media: {
      card: {},
      fieldCard: { gallery: [] },
    },
    spaCard: {
      handwrittenTags: ['Police station', 'Emergency 1191', 'Pakse'],
      photoStatus: 'missing',
      photoRequiresManualFill: true,
    },
    verification: {
      decision: 'accept',
      reason: 'Current city police department map listing cross checked with current official travel advice for the Laos police emergency number.',
    },
    sourceMetadata: {
      sourceName: 'Google Maps',
      sourceUrl: mapUrl('Pakse Police Department, Pakse, Laos', 'ChIJAaCjgLX4FDERa1NADUvGYfU'),
    },
    manualLocks: {},
    address: '4R94+R6J, Pakse, Laos',
    googleMapsUrl: mapUrl('Pakse Police Department, Pakse, Laos', 'ChIJAaCjgLX4FDERa1NADUvGYfU'),
    researchSources: [
      {
        sourceName: 'Google Maps',
        sourceUrl: mapUrl('Pakse Police Department, Pakse, Laos', 'ChIJAaCjgLX4FDERa1NADUvGYfU'),
        purpose: 'location',
        sourceType: 'map-platform',
      },
      {
        sourceName: 'UK Foreign Travel Advice',
        sourceUrl: 'https://www.gov.uk/foreign-travel-advice/laos/getting-help',
        purpose: 'facts',
      },
    ],
  },
  {
    id: 'place-naga-muay-lao-boxing-gym',
    slug: 'naga-muay-lao-boxing-gym',
    name: 'Naga Muay Lao Boxing Gym',
    country: 'laos',
    city: 'pakse',
    category: 'gyms',
    coordinates: { latitude: 15.1091, longitude: 105.82682 },
    locationScope: 'area',
    shortDescription: 'A fighter focused Muay Lao and Muay Thai gym in Ban Sangnamman, better suited to padwork and striking training than to a conventional air conditioned fitness session.',
    media: {
      card: {},
      fieldCard: { gallery: [] },
    },
    spaCard: {
      handwrittenTags: ['Muay Lao', 'Muay Thai', 'Fighter gym'],
      openingHours: 'Mon to Sat · 08:00 to 20:00',
      photoStatus: 'missing',
      photoRequiresManualFill: true,
    },
    verification: {
      decision: 'accept',
      reason: 'Current gym identity, Ban Sangnamman address, phone and opening pattern cross checked across current map and travel listings. The exact Google place ID is used for navigation while the stored coordinate is village level because public search sources do not expose the precise pin coordinates.',
    },
    sourceMetadata: {
      sourceName: 'Google Maps',
      sourceUrl: mapUrl('Naga Muay Lao Boxing Gym, Pakse, Laos', 'ChIJ8S2d__z5FDERGXVehrI1_vY'),
    },
    manualLocks: {},
    address: 'Ban Sangnamman, Pakse, Laos',
    googleMapsUrl: mapUrl('Naga Muay Lao Boxing Gym, Pakse, Laos', 'ChIJ8S2d__z5FDERGXVehrI1_vY'),
    researchSources: [
      {
        sourceName: 'Google Maps',
        sourceUrl: mapUrl('Naga Muay Lao Boxing Gym, Pakse, Laos', 'ChIJ8S2d__z5FDERGXVehrI1_vY'),
        purpose: 'location',
        sourceType: 'map-platform',
      },
      {
        sourceName: 'Trip.com current listing',
        sourceUrl: 'https://my.trip.com/travel-guide/attraction/pakse/city-148989939/',
        purpose: 'facts',
      },
    ],
  },
  {
    id: 'place-dp-fitness-center',
    slug: 'dp-fitness-center',
    name: 'DP Fitness Center',
    country: 'laos',
    city: 'pakse',
    category: 'gyms',
    coordinates: { latitude: 15.11896, longitude: 105.79811 },
    locationScope: 'point',
    shortDescription: 'A central air conditioned fitness gym inside Duangdee Plaza, in the same downtown shopping area as OTOP and Bai Don Market.',
    media: {
      card: {},
      fieldCard: { gallery: [] },
    },
    spaCard: {
      handwrittenTags: ['Weights', 'Cardio', 'Air conditioned'],
      openingHours: 'Daily · 06:00 to 10:00 · 14:30 to 20:30',
      photoStatus: 'missing',
      photoRequiresManualFill: true,
    },
    verification: {
      decision: 'accept',
      reason: 'Current gym listing confirms DP Fitness Center inside Duangdee Plaza. It is retained under its verified business name rather than being renamed after the nearby OTOP shopping area.',
    },
    sourceMetadata: {
      sourceName: 'Google Maps',
      sourceUrl: mapUrl('DP Fitness Center, Pakse, Laos', 'ChIJQXOk88v5FDER2ONVfo2O7xo'),
    },
    manualLocks: {},
    address: 'Duangdee Plaza Building, Pakse, Laos',
    googleMapsUrl: mapUrl('DP Fitness Center, Pakse, Laos', 'ChIJQXOk88v5FDER2ONVfo2O7xo'),
    researchSources: [
      {
        sourceName: 'Google Maps',
        sourceUrl: mapUrl('DP Fitness Center, Pakse, Laos', 'ChIJQXOk88v5FDER2ONVfo2O7xo'),
        purpose: 'location',
        sourceType: 'map-platform',
      },
    ],
  },
  {
    id: 'place-v-fitness-center-friendship-mall',
    slug: 'v-fitness-center-friendship-mall',
    name: 'V Fitness Center',
    country: 'laos',
    city: 'pakse',
    category: 'gyms',
    coordinates: { latitude: 15.11769, longitude: 105.82008 },
    locationScope: 'point',
    shortDescription: 'The modern fitness option on the third floor of Friendship Mall, the same mall as Major Cineplex, with weights, cardio equipment and a more polished commercial gym setup.',
    media: {
      card: {},
      fieldCard: { gallery: [] },
    },
    spaCard: {
      handwrittenTags: ['Friendship Mall', 'Weights and cardio', '3rd floor'],
      openingHours: 'Mon to Sat · 06:00 to 21:00 · Sun 08:00 to 21:00',
      photoStatus: 'missing',
      photoRequiresManualFill: true,
    },
    verification: {
      decision: 'accept',
      reason: 'Current gym listing confirms the Friendship Mall third floor location and current weekly opening pattern.',
    },
    sourceMetadata: {
      sourceName: 'Google Maps',
      sourceUrl: mapUrl('V Fitness Center Friendship Mall, Pakse, Laos', 'ChIJl9PCzcz5FDERREretwmXdqU'),
    },
    manualLocks: {},
    address: 'Friendship Mall, 3rd floor, Route 13, Pakse, Laos',
    googleMapsUrl: mapUrl('V Fitness Center Friendship Mall, Pakse, Laos', 'ChIJl9PCzcz5FDERREretwmXdqU'),
    researchSources: [
      {
        sourceName: 'Google Maps',
        sourceUrl: mapUrl('V Fitness Center Friendship Mall, Pakse, Laos', 'ChIJl9PCzcz5FDERREretwmXdqU'),
        purpose: 'location',
        sourceType: 'map-platform',
      },
    ],
  },
];
