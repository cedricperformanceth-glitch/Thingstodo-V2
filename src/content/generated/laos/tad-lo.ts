import type { City, Place, ThingToDo, MediaRecord } from '../../../core/models/types';

const source = 'https://visit-tadlo.com/en';
const checkedAt = '2026-08-19T00:00:00.000Z';
const coords = { latitude: 15.53441, longitude: 106.27473 };
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const maps = (name: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Tad Lo Laos`)}`;
const sources = [{ sourceName: 'Visit Tad Lo', sourceUrl: source, purpose: 'first-party' as const, sourceType: 'first-party-official' as const }];

const visitTadLoPermission = 'Used with owner permission; attribution and link to Visit Tad Lo required';

const activityCardMedia: Record<string, MediaRecord> = {
  'tad-hang-waterfall': {
    id: 'media-tad-hang-waterfall-basile-morin',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tad_Hang_waterfalls%2C_Tad_Lo_village%2C_Bolaven_Plateau%2C_Laos.jpg',
    alt: 'Tad Hang waterfalls in Tad Lo village, Bolaven Plateau, Laos',
    sourceType: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tad_Hang_waterfalls,_Tad_Lo_village,_Bolaven_Plateau,_Laos.jpg',
    sourceName: 'Wikimedia Commons',
    author: 'Basile Morin',
    license: 'CC BY-SA 4.0',
    manual: false,
    locked: true,
  },
  'tad-lo-waterfall': {
    id: 'media-tad-lo-waterfall-tango7174',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Salavan_TadLo3_tango7174.jpg',
    alt: 'Tad Lo Waterfalls in Salavan Province, Laos',
    sourceType: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Salavan_TadLo3_tango7174.jpg',
    sourceName: 'Wikimedia Commons',
    author: 'Tango7174',
    license: 'CC BY-SA 4.0',
    manual: false,
    locked: true,
  },
  'tad-soung-waterfall': {
    id: 'media-tad-soung-waterfall-visit-tad-lo',
    src: 'https://ddylijzqbzdbskxoujlv.supabase.co/storage/v1/object/public/site-media/general/d2dd7a55-61e0-4a59-a544-1699a803fe6c-Tad-Soung-from-downjpg.jpg',
    alt: 'Tad Soung Waterfall seen from the lower access near Tad Lo, Laos',
    sourceType: 'first-party-official',
    sourceUrl: 'https://visit-tadlo.com/en/things-to-do/tad-soung-waterfall',
    sourceName: 'Visit Tad Lo',
    author: 'Visit Tad Lo partner media',
    license: visitTadLoPermission,
    manual: true,
    locked: true,
  },
  'katu-weaving-workshop': {
    id: 'media-katu-weaving-workshop-visit-tad-lo',
    src: 'https://visit-tadlo.com/site-media/cloudflare/activities/91bb4b97-122a-46df-8622-c0f8560243d4-Weaving-960.webp',
    alt: 'Katu weaving workshop near Tad Lo, Laos',
    sourceType: 'first-party-official',
    sourceUrl: 'https://visit-tadlo.com/en/things-to-do/katu-weaving-workshop',
    sourceName: 'Visit Tad Lo',
    author: 'Visit Tad Lo partner media',
    license: visitTadLoPermission,
    manual: true,
    locked: true,
  },
  'lao-cooking-class-with-nyay': {
    id: 'media-lao-cooking-class-nyay-visit-tad-lo',
    src: 'https://visit-tadlo.com/site-media/cloudflare/activities/dad1856b-86a9-470f-8eaa-3aab5e7461bf-Niay-Cooking-Class-960.webp',
    alt: 'Lao cooking class with Nyay in Tad Lo, Laos',
    sourceType: 'first-party-official',
    sourceUrl: 'https://visit-tadlo.com/en/things-to-do/cooking-class-nyay',
    sourceName: 'Visit Tad Lo',
    author: 'Visit Tad Lo partner media',
    license: visitTadLoPermission,
    manual: true,
    locked: true,
  },
  'tad-lo-treasure-hunt': {
    id: 'media-tad-lo-treasure-hunt-visit-tad-lo',
    src: 'https://visit-tadlo.com/site-media/cloudflare/general/4dbbdaa8-cc91-49cf-bfb9-8627db6912da-Treasure-Hunt-960.webp',
    alt: 'Tad Lo Treasure Hunt self-guided village activity',
    sourceType: 'first-party-official',
    sourceUrl: 'https://visit-tadlo.com/en/things-to-do/tad-lo-treasure-hunt',
    sourceName: 'Visit Tad Lo',
    author: 'Visit Tad Lo partner media',
    license: visitTadLoPermission,
    manual: true,
    locked: true,
  },
  'fandee-adventure-park': {
    id: 'media-fandee-adventure-park-visit-tad-lo',
    src: 'https://ddylijzqbzdbskxoujlv.supabase.co/storage/v1/object/public/site-media/activities/468ab176-594a-4db2-8c50-ae3972904b16-Zipline.jpg',
    alt: 'Zipline at Fandee Adventure Park near Tad Lo, Laos',
    sourceType: 'first-party-official',
    sourceUrl: 'https://visit-tadlo.com/en/things-to-do/fandee-adventure-park',
    sourceName: 'Visit Tad Lo',
    author: 'Visit Tad Lo partner media',
    license: visitTadLoPermission,
    manual: true,
    locked: true,
  },
  'coffee-and-katu-culture-with-mr-hook': {
    id: 'media-mr-hook-coffee-katu-visit-tad-lo',
    src: 'https://ddylijzqbzdbskxoujlv.supabase.co/storage/v1/object/public/site-media/accommodation/070e07c0-0d12-4fad-817b-e46165c61887-Mr-Hook.jpg',
    alt: 'Coffee and Katu culture experience with Mr Hook near Tad Lo, Laos',
    sourceType: 'first-party-official',
    sourceUrl: 'https://visit-tadlo.com/en/things-to-do/mr-hook-coffee-culture',
    sourceName: 'Visit Tad Lo',
    author: 'Visit Tad Lo partner media',
    license: visitTadLoPermission,
    manual: true,
    locked: true,
  },
  'coffee-from-tree-to-cup-with-mr-vieng': {
    id: 'media-mr-vieng-coffee-visit-tad-lo',
    src: 'https://ddylijzqbzdbskxoujlv.supabase.co/storage/v1/object/public/site-media/accommodation/c0632601-bb76-41a3-947e-2e47a3a7c88f-Mr-Vieng.jpg',
    alt: 'Coffee from tree to cup experience with Mr Vieng near Laongam, Laos',
    sourceType: 'first-party-official',
    sourceUrl: 'https://visit-tadlo.com/en/things-to-do/mr-vieng-coffee-experience',
    sourceName: 'Visit Tad Lo',
    author: 'Visit Tad Lo partner media',
    license: visitTadLoPermission,
    manual: true,
    locked: true,
  },
  'vat-paa-forest-buddha-and-mystery-cave': {
    id: 'media-vat-paa-forest-visit-tad-lo',
    src: 'https://ddylijzqbzdbskxoujlv.supabase.co/storage/v1/object/public/site-media/accommodation/a42fc69b-975d-4df1-9d73-ffbb805c06a7-Vat-Paa.jpg',
    alt: 'Vat Paa forest, Buddha and cave area near Tad Lo, Laos',
    sourceType: 'first-party-official',
    sourceUrl: 'https://visit-tadlo.com/en/things-to-do/vat-paa-ancient-forest',
    sourceName: 'Visit Tad Lo',
    author: 'Visit Tad Lo partner media',
    license: visitTadLoPermission,
    manual: true,
    locked: true,
  },
};

const media = (slug?: string) => {
  const image = slug ? activityCardMedia[slug] : undefined;
  return { card: image ? { image } : {}, fieldCard: { gallery: image ? [image] : [] } };
};

const city = {
  id: 'city-tad-lo', slug: 'tad-lo', name: 'Tad Lo', country: 'laos', profile: 'compact', settlementType: 'village', coordinates: coords,
  description: 'A waterfall village in Salavan Province and a slow-travel base for the Bolaven Plateau, with village walks, coffee, Katu culture and guided nature experiences.',
  categories: ['things-to-do', 'restaurants', 'cafes', 'accommodation', 'practical-services'],
  categoryTargets: { 'things-to-do': 18, restaurants: 12, cafes: 8, accommodation: 8 },
  hero: { eyebrow: 'Salavan · Southern Laos', title: 'Tad Lo travel guide', subtitle: 'Waterfalls, village life, coffee country and a slower way into the Bolaven Plateau.', facts: [{label:'Updated',value:'August 2026'},{label:'Type',value:'Waterfall village'},{label:'Region',value:'Salavan Province'},{label:'Pace',value:'Slow travel base'}] },
  exploreBoard: { featuredThingIds: ['thing-tad-lo-waterfall','thing-vat-paa-forest-buddha-and-mystery-cave','thing-coffee-and-katu-culture-with-mr-hook'] },
  manualLocks: {
    'categoryTargets.things-to-do': { value: 18, source: 'manual', locked: true },
    'categoryTargets.accommodation': { value: 8, source: 'manual', locked: true },
    'categoryTargets.restaurants': { value: 12, source: 'manual', locked: true },
    'categoryTargets.cafes': { value: 8, source: 'manual', locked: true },
  },
  seo: { title: 'Tad Lo travel guide | Things To Do Atlas', description: 'Independent Tad Lo guide for waterfalls, village life, coffee, stays and practical travel in Salavan Province.', canonicalPath: '/laos/tad-lo', indexable: false },
};

const place = (name: string, category: 'accommodation'|'restaurants'|'cafes'|'practical-services', shortDescription: string, decision: 'accept'|'manual-review'='accept') => ({
  id:`place-${slugify(name)}`, slug:slugify(name), name, country:'laos', city:'tad-lo', category, coordinates:coords, shortDescription, media:media(),
  spaCard:{ handwrittenTags:[category==='accommodation'?'Stay':category==='restaurants'?'Local food':category==='cafes'?'Coffee stop':'Useful','Tad Lo','Local'], photoStatus:'missing' as const, photoRequiresManualFill:true },
  verification:{decision,reason:'Retained from Tad Lo partner/local research; live details should be reconfirmed where marked.',checkedAt},
  sourceMetadata:{sourceName:'Visit Tad Lo partner research',sourceUrl:source,reviewedAt:'2026-08-19'}, researchSources:sources, manualLocks:{},
  address:'Tad Lo, Salavan Province, Laos', googleMapsUrl:maps(name),
});

const places = [
  place('Bolaven Garden','accommodation','Leafy riverside bungalows and tents with an on-site restaurant and garden setting.'),
  place('Fandee Island','accommodation','Treehouses, lake houses and unusual stays beside a lake within walking distance of Tad Lo.'),
  place('Mama Pap','accommodation','Very simple family homestay in the village centre and a classic budget Tad Lo base.'),
  place('Samaki Guest House','accommodation','Sociable local guesthouse and homestay with bungalows, dorm beds and food on site.'),
  place('Tad Lo Lodge','accommodation','Established riverside lodge in the waterfall area with private rooms and dining.'),
  place('Tina Restaurant & Homestay','accommodation','Small local homestay combined with a village restaurant.'),
  place('Sompy Guesthouse','accommodation','Simple Tad Lo guesthouse retained from current accommodation directories.'),
  place('Sipasert Guesthouse & Restaurant','accommodation','Guesthouse and restaurant with a riverside outlook, retained from current Tad Lo directories.'),
  place('Bolaven Garden Restaurant','restaurants','Local, Thai and Asian food in a riverside garden setting.'),
  place('Fandee Island Restaurant','restaurants','Lakeside restaurant serving Lao, Asian and Western dishes.'),
  place('Mama Pap Restaurant','restaurants','Simple family cooking attached to Mama Pap homestay.'),
  place('Samaki Guest House Restaurant','restaurants','Guesthouse restaurant serving travellers and overnight guests.'),
  place('Tad Hang Restaurant','restaurants','Riverside meal stop facing the Tad Hang waterfall area.'),
  place('Tad Lo Lodge Restaurant','restaurants','Restaurant attached to Tad Lo Lodge near the waterfall.'),
  place('Tim Restaurant & Massage','restaurants','Village restaurant where traditional Lao massage can also be arranged.'),
  place('Tina Restaurant','restaurants','Small local restaurant in Tad Lo centre.'),
  place('Sipasert Restaurant','restaurants','Restaurant attached to Sipasert Guesthouse with a river outlook.'),
  place('Palamei Family Restaurant','restaurants','Family-style meals associated with the long-running Palamei guesthouse.','manual-review'),
  place('Fandee Waterpark Restaurant','restaurants','Food stop attached to the Fandee Waterpark and adventure area.'),
  place('Pakeo Local Restaurant','restaurants','Small local food option retained for manual verification during the Tad Lo editorial pass.','manual-review'),
  place('Fandee Island Coffee','cafes','Coffee and breakfast stop at Fandee Island beside the lake.'),
  place('Bolaven Garden Coffee','cafes','Coffee stop inside Bolaven Garden’s restaurant and garden setting.'),
  place('Mama Pap Coffee','cafes','Simple village coffee stop at Mama Pap.','manual-review'),
  place('Samaki Coffee','cafes','Coffee available at Samaki Guest House’s shared food area.','manual-review'),
  place('Tad Lo Lodge Coffee','cafes','Coffee stop at Tad Lo Lodge in the waterfall area.','manual-review'),
  place('Mr Hook Coffee Experience','cafes','Coffee tasting and cultural stop around Mr Hook’s Katu experience.'),
  place('Mr Vieng Coffee','cafes','Tree-to-cup coffee stop near Laongam, useful as a Tad Lo excursion.'),
  place('Mr M Traditional Coffee','cafes','Seasonal traditional coffee roasting stop; availability requires confirmation.','manual-review'),
  place('Tad Lo Tourism Office','practical-services','Local reference point for official guided treks, guides and current destination information.'),
  place('Tad Lo Market & Bus Junction','practical-services','Useful arrival point for local transport, basic shopping and the final connection into the village.'),
  place('Tad Lo Local Clinic','practical-services','Local care reference; confirm opening and capability before relying on it.','manual-review'),
  place('Tad Lo 24-hour Dispensary','practical-services','Medicine and basic health reference reported in the locally checked practical guide.','manual-review'),
];

const thing = (name:string, shortDescription:string, duration:string, costType:'free'|'paid', bestTime:string, decision:'accept'|'manual-review'='accept', exploreBoard?: { kicker:string; duration:string; route:string }) => {
  const slug = slugify(name);
  const thingMedia = media(slug);
  const hasVerifiedPhoto = Boolean(thingMedia.card.image);
  return {
    id:`thing-${slug}`,slug,name,country:'laos',city:'tad-lo',category:'things-to-do' as const,coordinates:coords,shortDescription,media:thingMedia,
    spaCard:{handwrittenTags:['Tad Lo','Local experience','Field note'],photoStatus:(hasVerifiedPhoto?'verified':'missing') as 'verified'|'missing',photoRequiresManualFill:!hasVerifiedPhoto,gettingThere:'Start from Tad Lo and confirm the current route locally before leaving.',duration,costType,bestTime},
    verification:{decision,reason:'Retained from Tad Lo partner/local research; conditions and availability can change.',checkedAt},
    sourceMetadata:{sourceName:'Visit Tad Lo partner research',sourceUrl:source,reviewedAt:'2026-08-19'},researchSources:sources,manualLocks:{},googleMapsUrl:maps(name),isLandmark:Boolean(exploreBoard),
    longDescription:shortDescription,breadcrumbs:['Laos','Tad Lo','Things to do',name],
    fieldCard:{template:'compact' as const,whyGo:shortDescription,practical:'Confirm current opening, price, weather and availability locally before setting out.',access:'Use Tad Lo as the base and confirm the current access with the host, Tourism Office or accommodation.',faq:[]},
    ...(exploreBoard ? { exploreBoard } : {}),
  };
};

const things = [
  thing('Tad Hang Waterfall','Easy riverside waterfall close to the village, combining broad rocks, water and everyday local life.','Less than 3 hours','free','Morning'),
  thing('Tad Lo Waterfall','Graceful waterfall woven into the village landscape and an easy slow-travel outing from Tad Lo.','Less than 3 hours','free','Morning or late afternoon','accept',{kicker:'THE VILLAGE WATERFALL',duration:'Easy outing',route:'From Tad Lo village'}),
  thing('Tad Soung Waterfall','Higher rural waterfall reached through fields and villages, with wide views over the surrounding landscape.','Half day','free','Morning'),
  thing('Katu Weaving Workshop','Hands-on introduction to Katu weaving, textile technique and the patience behind local craft.','Half day','paid','By arrangement'),
  thing('Lao Cooking Class with Nyay','Prepare, understand and share a Lao meal in a relaxed local cooking workshop.','Half day','paid','By arrangement'),
  thing('Tad Lo Treasure Hunt','Free self-guided village game using phone-based clues to notice details most visitors walk past.','Less than 1 hour','free','Daytime'),
  thing('Fandee Adventure Park','Forest aerial course with thirteen ziplines and suspended monkey bridges near Tad Lo.','Less than 3 hours','paid','Daytime'),
  thing('Coffee and Katu Culture with Mr Hook','Guided coffee, useful-plants and Katu cultural experience around Mr Hook’s home area.','Half day','paid','By arrangement','accept',{kicker:'COFFEE & KATU CULTURE',duration:'Half day',route:'Local guided experience'}),
  thing('Coffee from Tree to Cup with Mr Vieng','Friendly tree-to-cup coffee experience near Laongam covering growing, processing and preparation.','Less than 3 hours','paid','By arrangement'),
  thing('Traditional Coffee Roasting with Mr M','Seasonal hands-on traditional coffee roasting workshop when the host is available.','Half day','paid','By arrangement','manual-review'),
  thing('Vat Paa Forest, Buddha and Mystery Cave','Quiet forest outing among mature trees, a large Buddha and a cave entrance that should not be explored unsupported.','Less than 3 hours','free','Daytime','accept',{kicker:'FOREST & MYSTERY CAVE',duration:'Short outing',route:'From Tad Lo village'}),
  thing('Tad Lo Half-Day Guided Trek','Official locally guided short trek option for travellers who want forest and village paths beyond the immediate waterfalls.','Half day','paid','Morning'),
  thing('Tad Soung Community Trek','Full-day community-based guided route linking forest, rural scenery, villages and the Tad Soung area.','Full day','paid','Morning'),
  thing('Tad Lo Two-Day Village Trek','Longer guided trekking format using Tad Lo as a base for remote village and forest exploration.','2 days','paid','Morning departure'),
  thing('Traditional Lao Massage in Tad Lo','Arrange a local traditional massage in the village after walking, riding or waterfall days.','About 1 hour','paid','By arrangement'),
  thing('Sacred Forest Tad Lo Trees','Short nature stop focused on the mature forest and locally significant trees near Tad Lo.','Less than 2 hours','free','Daytime','manual-review'),
  thing('Fandee Waterpark','Small water-play stop in the Fandee area for a relaxed afternoon near the village.','Less than 3 hours','paid','Daytime'),
  thing('Tad Lo Riverside & Village Walk','Unhurried self-guided walk through Tad Lo, linking village life, river edges and the waterfall landscape.','1–2 hours','free','Early morning or late afternoon'),
];

export { city };
export { places };
export { things };
export const typedCity = city as City;
export const typedPlaces = places as Place[];
export const typedThings = things as ThingToDo[];
