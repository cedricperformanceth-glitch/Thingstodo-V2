import type { AtlasEntity, CategorySlug } from '../core/models/types';
import { places } from './registry/places';
import { things } from './registry/things-to-do';
import type { AtlasRouteMedia, AtlasRouteMediaAspect, AtlasRoutePersonalNotePlacement } from './atlas-route-content';
import type {
  AtlasRouteExperienceContent,
  AtlasRouteExperienceNote,
  AtlasRouteNotebookPageVariant,
  AtlasRouteNoteSize,
  AtlasRouteNoteStyle,
  AtlasRouteNoteTone,
  AtlasRouteReference,
} from './atlas-route-experience';

const cleanVisible = (value: string) => value.replace(/[\-‐‑‒–—]/g, ' ').replace(/\s+/g, ' ').trim();
const searchable = (value: string) => cleanVisible(value).toLowerCase();

const pickThing = (city: string, ...terms: string[]) =>
  things.find((thing) =>
    thing.city === city
    && terms.some((term) => searchable(`${thing.name} ${thing.slug}`).includes(searchable(term))),
  );

const pickPlace = (city: string, ...terms: string[]) =>
  places.find((place) =>
    place.city === city
    && terms.some((term) => searchable(`${place.name} ${place.slug}`).includes(searchable(term))),
  );

const pickPlaceByCategory = (city: string, category: CategorySlug) =>
  places.find((place) => place.city === city && place.category === category && Boolean(place.media.card?.image));

const entityImage = (entity?: AtlasEntity) => entity?.media.card?.image ?? entity?.media.fieldCard?.gallery?.[0];

const entityHref = (entity: AtlasEntity) =>
  entity.category === 'things-to-do'
    ? `/${entity.country}/${entity.city}/things-to-do/${entity.slug}`
    : `/${entity.country}/${entity.city}/places/${entity.slug}`;

const mediaFrom = (
  id: string,
  entity: AtlasEntity | undefined,
  fallbackLabel: string,
  aspect: AtlasRouteMediaAspect = 'landscape',
): AtlasRouteMedia => {
  const image = entityImage(entity);
  return {
    id,
    alt: cleanVisible(image?.alt ?? fallbackLabel),
    label: cleanVisible(entity?.name ?? fallbackLabel),
    ...(image?.src ? { src: image.src } : {}),
    aspect,
  };
};

const reference = (
  id: string,
  title: string,
  entity: AtlasEntity | undefined,
  note: string,
  kicker = 'FROM THE ATLAS',
): AtlasRouteReference => ({
  id,
  title: cleanVisible(entity?.name ?? title),
  note,
  kicker,
  status: entity ? 'published' : 'coming-soon',
  ...(entity ? { entity, href: entityHref(entity), media: mediaFrom(`${id}-media`, entity, title, 'square') } : {}),
});

const note = (
  id: string,
  label: string,
  text: string,
  options: {
    placement?: AtlasRoutePersonalNotePlacement;
    tone?: AtlasRouteNoteTone;
    style?: AtlasRouteNoteStyle;
    size?: AtlasRouteNoteSize;
    items?: string[];
  } = {},
): AtlasRouteExperienceNote => ({
  id,
  label,
  text,
  placement: options.placement ?? 'story',
  tone: options.tone ?? 'butter',
  style: options.style ?? 'memory',
  size: options.size ?? 'medium',
  ...(options.items ? { items: options.items } : {}),
});

const page = (
  id: string,
  variant: AtlasRouteNotebookPageVariant,
  title: string,
  copy: string,
  extras: Record<string, unknown> = {},
) => ({ id, variant, title, copy, ...extras });

const donBridge = pickThing('don-det', 'old railway bridge');
const donCycle = pickThing('don-det', 'cycle don det');
const donKayak = pickThing('don-det', 'kayaking');
const donSwim = pickThing('don-det', 'xai kong nyai');
const donSunset = pickThing('don-det', 'sunset on don det');

const vatPhou = pickThing('pakse', 'vat phou', 'wat phou');
const boulange = pickPlace('pakse', 'boulange', 'la boulange');
const pakseCafe = pickPlaceByCategory('pakse', 'cafes');

const fandee = pickPlace('tad-lo', 'fandee');
const samaki = pickPlace('tad-lo', 'samaki');
const mrHook = pickThing('tad-lo', 'mr hook');
const treasureHunt = pickThing('tad-lo', 'treasure');
const tadLoWaterfall = pickThing('tad-lo', 'tad lo waterfall', 'tad hang');

const thaFalang = pickThing('thakhek', 'tha falang', 'falang');
const thakhekCave = pickThing('thakhek', 'xieng liap', 'buddha cave', 'cave');
const bamboo = pickPlace('thakhek', 'bamboo');

const vientianeCafe = pickPlaceByCategory('vientiane', 'cafes');
const vientianeRestaurant = pickPlaceByCategory('vientiane', 'restaurants');

const balloon = pickThing('vang-vieng', 'hot air balloon', 'balloon');
const tubing = pickThing('vang-vieng', 'tubing');
const namXay = pickThing('vang-vieng', 'nam xay');

const kuangSi = pickThing('luang-prabang', 'kuang si');
const phousi = pickThing('luang-prabang', 'phousi', 'phu si');
const pakOu = pickThing('luang-prabang', 'pak ou');
const slowBoat = pickThing('luang-prabang', 'slow boat', 'mekong boat');

const southToNorthEditorial: AtlasRouteExperienceContent = {
  country: 'laos',
  slug: 'south-to-north',
  label: 'South → North',
  eyebrow: 'ATLAS ROUTE',
  title: 'Laos South to North in 30 Days',
  subtitle: 'One month from the Cambodian border to the Thai border, built around islands, road days, limestone, river time and places worth staying for.',
  durationLabel: 'About 30 days',
  directionLabel: 'Cambodia → Thailand',
  intro: [
    'If I had one month to cross Laos from south to north, this is the route I would build. I would start slowly on the Mekong, give the southern roads real time, use the cities as breathing spaces and keep the biggest block for Luang Prabang before leaving by boat.',
    'Nothing here needs to be followed like a timetable. Save the places that speak to you, open the little field books when you want more detail, and leave enough room for one breakfast, one guesthouse or one conversation to change the plan.',
  ],
  heroMedia: [
    mediaFrom('hero-01', donBridge ?? donSunset, 'Don Det and the Mekong', 'portrait'),
    mediaFrom('hero-02', tadLoWaterfall ?? mrHook, 'Bolaven Plateau'),
    mediaFrom('hero-03', balloon ?? namXay, 'Vang Vieng limestone', 'square'),
    mediaFrom('hero-04', kuangSi ?? phousi, 'Luang Prabang'),
  ],
  stops: [
    { label: 'Don Det', durationLabel: '4 days', chapterId: 'don-det' },
    { label: 'Pakse', durationLabel: '2 days plus one return night', chapterId: 'pakse' },
    { label: 'Bolaven Loop', durationLabel: '4 days', chapterId: 'bolaven-loop' },
    { label: 'Thakhek', durationLabel: '3 days', chapterId: 'thakhek' },
    { label: 'Vientiane', durationLabel: '2 days', chapterId: 'vientiane' },
    { label: 'Vang Vieng', durationLabel: '3 days', chapterId: 'vang-vieng' },
    { label: 'Luang Prabang', durationLabel: '6 days', chapterId: 'luang-prabang' },
    { label: 'Slow Boat', durationLabel: '2 days', chapterId: 'slow-boat' },
  ],
  chapters: [
    {
      id: 'don-det',
      chapterLabel: 'Chapter 01',
      title: 'Don Det',
      durationLabel: '4 days',
      intro: 'Cross the Cambodian border, get onto the island and stop trying to move north for a few days. Don Det is where I would let Laos begin slowly.',
      marginNote: 'The Atlas begins here. Not with a checklist. With a river.',
      body: ['Give one day to the bicycle, one to the water, then keep the rest loose enough for a swim, a sunset or simply another lap of the island.'],
      highlights: ['Cycle Don Det and Don Khon', 'Choose one proper Mekong day', 'Keep an afternoon completely free'],
      references: [
        reference('don-cycle-ref', 'Cycle Don Det and Don Khon', donCycle, 'The easiest way to let the two islands become one day.'),
        reference('don-kayak-ref', '4,000 Islands Kayaking', donKayak, 'A full river day when you want more movement.'),
        reference('don-swim-ref', 'Xai Kong Nyai Beach', donSwim, 'A slower stop for the part of the day that needs less ambition.'),
      ],
      personalNotes: [
        note('don-det-personal-01', 'FIRST PAGE', 'Do not rush the first four days.', { tone: 'sage', style: 'scribble', size: 'small' }),
        note('don-det-personal-02', 'QUICK MEMORY', 'Leave one afternoon empty. That empty afternoon may become the memory.', { placement: 'gallery-top-right-gap', tone: 'butter', style: 'memory', size: 'medium' }),
      ],
      media: [
        mediaFrom('don-det-01', donBridge, 'Don Khon bridge'),
        mediaFrom('don-det-02', donSunset ?? donSwim, 'Mekong light', 'portrait'),
      ],
      notebook: {
        id: 'don-det-notes',
        label: 'FIELD BOOK',
        title: 'Open the island pages',
        intro: 'A few pages for the days when you want more than the short route.',
        pages: [
          page('don-page-01', 'scrapbook', 'Ride until something makes you stop', 'The bicycle day does not need a perfect circuit. Cross the old bridge, follow the island roads and stop whenever the Mekong looks better than the next pin.', {
            kicker: 'ISLAND SCRAPBOOK',
            media: [mediaFrom('don-book-bridge', donBridge, 'Old railway bridge'), mediaFrom('don-book-sunset', donSunset, 'Sunset on Don Det')],
            handwrittenNote: 'No stopwatch today.',
            noteTone: 'sky',
          }),
          page('don-page-02', 'atlas-picks', 'Choose your water day', 'The river can be active or lazy. Pick the version that fits the day.', {
            kicker: 'PICK ONE',
            list: ['Kayak if you want a full day', 'Swim only where the current and local advice make sense', 'Keep the sunset free'],
            references: [reference('don-book-kayak', 'Kayaking', donKayak, 'Save it if a proper paddle belongs in your route.'), reference('don-book-swim', 'River beach', donSwim, 'Save it if a quiet swim stop sounds better.')],
          }),
          page('don-page-03', 'memory', 'Nothing planned after lunch', 'A route page should be allowed to recommend nothing. Don Det is one of those places where an empty block can be the right decision.', {
            kicker: 'MEMORY',
            handwrittenNote: 'One drink. One hammock. No next stop.',
            noteTone: 'rose',
            media: [mediaFrom('don-book-last', donSunset, 'Don Det at the end of the day')],
          }),
        ],
      },
      transfer: { label: 'Don Det → Pakse', note: 'Leave enough margin for the boat and the mainland handover. Pakse is a base, not a connection worth racing toward.' },
    },
    {
      id: 'pakse',
      chapterLabel: 'Chapter 02',
      title: 'Pakse',
      durationLabel: '2 days plus one return night',
      intro: 'Pakse is useful because several southern chapters meet here. I would keep the city light, give Vat Phou a real day and leave space for training before the Bolaven road begins.',
      marginNote: 'Pakse works best when tomorrow already has a direction.',
      body: ['Return after the loop for one quiet night before the long movement north. Coming back is not wasted time when the base removes friction.'],
      highlights: ['Vat Phou gets its own day', 'Naga Gym when the field note is ready', 'Breakfast before the road'],
      references: [
        reference('pakse-vat-ref', 'Vat Phou', vatPhou, 'The heritage day I would protect rather than squeeze around the city.'),
        reference('pakse-boulange-ref', 'Boulange Garden', boulange ?? pakseCafe, 'The breakfast stop that can become a reason to stay longer.', 'PERSONAL PICK'),
        reference('pakse-naga-ref', 'Naga Gym', undefined, 'The Muay Thai stop belongs here. Its Atlas field note is still coming.', 'COMING NEXT'),
      ],
      personalNotes: [
        note('pakse-personal-01', 'BREAKFAST NOTE', 'I stayed an extra day largely because I wanted that breakfast again.', { tone: 'rose', style: 'memory', size: 'large' }),
        note('pakse-personal-02', 'PACK BEFORE THE LOOP', '', { tone: 'paper', style: 'list', size: 'small', items: ['Cash', 'Fuel', 'Offline map'] }),
      ],
      media: [
        mediaFrom('pakse-01', vatPhou, 'Vat Phou'),
        mediaFrom('pakse-02', boulange ?? pakseCafe, 'Pakse breakfast'),
      ],
      notebook: {
        id: 'pakse-notes',
        label: 'CITY NOTES',
        title: 'Two pages from Pakse',
        intro: 'This chapter is small on purpose. Pakse gives the route direction rather than volume.',
        pages: [
          page('pakse-page-01', 'atlas-picks', 'One day south', 'Give Vat Phou enough room that the drive and the landscape belong to the same day.', {
            kicker: 'DAY DIRECTION',
            references: [reference('pakse-book-vat', 'Vat Phou', vatPhou, 'Open the full field note before you build the day.')],
            media: [mediaFrom('pakse-book-vat-media', vatPhou, 'Vat Phou')],
          }),
          page('pakse-page-02', 'memory', 'The breakfast that changed the schedule', 'The best personal recommendations are sometimes tiny. Mine in Pakse is breakfast.', {
            kicker: 'PERSONAL MEMORY',
            handwrittenNote: 'Yes, I stayed another day for it.',
            noteTone: 'butter',
            references: [reference('pakse-book-breakfast', 'Boulange Garden', boulange ?? pakseCafe, 'Save it if breakfast matters as much as the next attraction.')],
          }),
          page('pakse-page-03', 'checklist', 'Before the scooter leaves town', 'Use Pakse to remove the boring problems before the plateau gets wider.', {
            kicker: 'POCKET LIST',
            list: ['Check the bike', 'Fill the tank', 'Save the map', 'Carry enough cash'],
            handwrittenNote: 'Then stop thinking about logistics.',
            noteTone: 'sage',
          }),
        ],
      },
      transfer: { label: 'Pakse → Bolaven Loop', note: 'Sort the scooter and the practical details in town. Once the road climbs, let the plateau become its own chapter.' },
    },
    {
      id: 'bolaven-loop',
      chapterLabel: 'Chapter 03',
      title: 'The Bolaven Loop',
      durationLabel: '4 days',
      intro: 'This is the section I would refuse to rush. The loop is not a race between waterfalls. The road, the forest, the guesthouses, the coffee and the people are the chapter.',
      marginNote: 'Half of the Bolaven happens between the pins.',
      body: ['Build the four days around places where you actually stop. Fandee Island, Tad Lo, Samaki, Mr Hook and the treasure hunt can turn the loop from mileage into a journey.'],
      highlights: ['Sleep on the road', 'Let Tad Lo breathe', 'Follow the clues and the landscapes'],
      references: [
        reference('bolaven-fandee-ref', 'Fandee Island', fandee, 'A stop that deserves time for the lake, pétanque and an evening with nowhere else to be.', 'PERSONAL PICK'),
        reference('bolaven-hook-ref', 'Mr Hook', mrHook, 'Coffee and local context are stronger when they are not squeezed between two waterfalls.'),
        reference('bolaven-treasure-ref', 'Tad Lo Treasure Hunt', treasureHunt, 'A playful way to notice the village instead of riding straight through it.'),
      ],
      personalNotes: [
        note('bolaven-personal-01', 'ROAD NOTE', 'Park the scooter sometimes.', { tone: 'sky', style: 'scribble', size: 'small' }),
        note('bolaven-personal-02', 'REMEMBER THIS', 'The unplanned stop is often the story that survives the itinerary.', { placement: 'gallery-bottom-left-gap', tone: 'sage', style: 'memory', size: 'medium' }),
      ],
      media: [
        mediaFrom('bolaven-01', tadLoWaterfall ?? mrHook, 'Bolaven landscape'),
        mediaFrom('bolaven-02', fandee ?? samaki, 'Tad Lo stay', 'portrait'),
        mediaFrom('bolaven-03', mrHook ?? treasureHunt, 'Coffee and village road'),
      ],
      notebook: {
        id: 'bolaven-notes',
        label: 'ROAD BOOK',
        title: 'Inside the Bolaven Loop',
        intro: 'This is where the route becomes personal. Turn the pages only if you want the little stories.',
        pages: [
          page('bolaven-page-01', 'scrapbook', 'Fandee Island', 'Stay long enough for the accommodation to become part of the trip rather than just the place where you sleep.', {
            kicker: 'TAD LO MEMORY',
            media: [mediaFrom('bolaven-fandee-media', fandee, 'Fandee Island'), mediaFrom('bolaven-water-media', tadLoWaterfall, 'Tad Lo waterfall')],
            handwrittenNote: 'They are far too good at pétanque here.',
            noteTone: 'rose',
            references: [reference('bolaven-fandee-book', 'Fandee Island', fandee, 'Open the place note or save it straight to your Atlas.')],
          }),
          page('bolaven-page-02', 'memory', 'One fruit juice becomes an afternoon', 'Samaki works in the story because the scooter is parked. Sit down, talk about the road and let other travellers alter your sense of time.', {
            kicker: 'SMALL STORY',
            handwrittenNote: 'One juice. Then another story. Then it is evening.',
            noteTone: 'sky',
            media: [mediaFrom('bolaven-samaki-media', samaki, 'Samaki guesthouse')],
            references: [reference('bolaven-samaki-book', 'Samaki Guesthouse', samaki, 'Keep it if you want a social pause in Tad Lo.')],
          }),
          page('bolaven-page-03', 'atlas-picks', 'Coffee with Mr Hook', 'Do not treat this like a quick coffee stop. Give the conversation and the place their own space.', {
            kicker: 'COFFEE PAGE',
            handwrittenNote: 'Do not rush the coffee.',
            noteTone: 'butter',
            references: [reference('bolaven-hook-book', 'Mr Hook', mrHook, 'Save the experience if this belongs in your loop.')],
            media: [mediaFrom('bolaven-hook-media', mrHook, 'Mr Hook coffee experience')],
          }),
          page('bolaven-page-04', 'checklist', 'Follow clues, not the clock', 'Let the treasure hunt pull you through the village and toward things you may otherwise ride past.', {
            kicker: 'TREASURE PAGE',
            list: ['Follow the clue', 'Look up from the phone', 'Stop at the viewpoint', 'Let the hunt spill into tomorrow'],
            references: [reference('bolaven-treasure-book', 'Tad Lo Treasure Hunt', treasureHunt, 'Open the full activity if you want the clues in the Atlas.')],
            handwrittenNote: 'The best bit is between the clues.',
            noteTone: 'sage',
          }),
        ],
      },
      transfer: { label: 'Bolaven Loop → Pakse → Thakhek', note: 'Close the loop back in Pakse and keep a recovery night. I would rather start the long northbound movement rested than stack everything into one exhausted day.' },
      variant: 'feature',
    },
    {
      id: 'thakhek',
      chapterLabel: 'Chapter 04',
      title: 'Thakhek',
      durationLabel: '3 days',
      intro: 'After the plateau, Thakhek changes the texture of the trip. Pick up a scooter and let Route 12 pull you into limestone, caves and swimming stops.',
      marginNote: 'The scooter is not the activity. It is the key that opens the landscape.',
      body: ['I would keep the final evening easy. Return the bike, walk toward the Mekong and leave a little margin before the next long transfer.'],
      highlights: ['Cave country', 'Tha Falang', 'One road day with no rush'],
      references: [
        reference('thakhek-cave-ref', 'Thakhek cave', thakhekCave, 'Choose one cave and give the road around it enough time.'),
        reference('thakhek-falang-ref', 'Tha Falang', thaFalang, 'A useful water stop when the day needs a different rhythm.'),
        reference('thakhek-bamboo-ref', 'Bamboo stay', bamboo, 'Keep the stay close if it fits the way you want to start the scooter day.', 'STAY NOTE'),
      ],
      personalNotes: [
        note('thakhek-personal-01', 'BIKE CHECK', '', { tone: 'paper', style: 'list', size: 'small', items: ['Tyres', 'Brakes', 'Lights', 'Helmet'] }),
      ],
      media: [
        mediaFrom('thakhek-01', thakhekCave, 'Thakhek cave country'),
        mediaFrom('thakhek-02', thaFalang, 'Tha Falang'),
      ],
      notebook: {
        id: 'thakhek-notes',
        label: 'SCOOTER BOOK',
        title: 'A few road pages from Thakhek',
        intro: 'Open this when the route starts feeling more like a road trip than a city stop.',
        pages: [
          page('thakhek-page-01', 'checklist', 'Before Route 12', 'Ten careful minutes in town are better than a mechanical surprise in limestone country.', {
            kicker: 'BEFORE YOU RIDE',
            list: ['Check both brakes', 'Look at the tyres', 'Test the lights', 'Save the route offline'],
            handwrittenNote: 'The first kilometres should confirm the bike.',
            noteTone: 'sage',
          }),
          page('thakhek-page-02', 'atlas-picks', 'Pick the cave, then enjoy the road', 'Do not stack every cave into one day. Pick the one that makes the route feel right.', {
            kicker: 'ONE DIRECTION',
            references: [reference('thakhek-book-cave', 'Cave country', thakhekCave, 'Open the full field note before you ride.'), reference('thakhek-book-falang', 'Tha Falang', thaFalang, 'Keep this as the water stop if it fits the day.')],
            media: [mediaFrom('thakhek-book-media', thakhekCave ?? thaFalang, 'Thakhek road day')],
          }),
          page('thakhek-page-03', 'memory', 'The comfort choice', 'The direct night bus is the cheaper line. Personally I went back to Pakse and flew to Vientiane because I wanted a proper night and a short flight. I am not twenty anymore.', {
            kicker: 'PERSONAL CHOICE',
            handwrittenNote: 'Cheapest and best are not always the same answer.',
            noteTone: 'rose',
          }),
        ],
      },
      transfer: { label: 'Thakhek → Vientiane', note: 'Choose the direct overland route if price matters most. Choose another connection if comfort matters more. Recheck current buses and flights before travelling.' },
    },
    {
      id: 'vientiane',
      chapterLabel: 'Chapter 05',
      title: 'Vientiane',
      durationLabel: '2 days',
      intro: 'I would use Vientiane as a reset rather than another heavy activity chapter. Walk, eat, find a breakfast you like and enjoy two days with less pressure.',
      marginNote: 'A quiet city can be useful in the middle of a busy route.',
      highlights: ['A long breakfast', 'A Mekong evening', 'No need to collect everything'],
      references: [
        reference('vientiane-cafe-ref', 'Vientiane cafe', vientianeCafe, 'Save one breakfast or coffee place and let the rest happen around it.', 'FOOD NOTE'),
        reference('vientiane-food-ref', 'Vientiane restaurant', vientianeRestaurant, 'A meal can be the main plan here.', 'FOOD NOTE'),
      ],
      personalNotes: [
        note('vientiane-personal-01', 'CITY NOTE', 'Two easy days. Good food. Legs off the scooter.', { tone: 'sky', style: 'scribble', size: 'medium' }),
      ],
      media: [
        mediaFrom('vientiane-01', vientianeCafe, 'Vientiane cafe'),
        mediaFrom('vientiane-02', vientianeRestaurant, 'Vientiane food stop', 'portrait'),
      ],
      notebook: {
        id: 'vientiane-notes',
        label: 'PAUSE BOOK',
        title: 'Two quiet pages in Vientiane',
        intro: 'This is the smallest field book on purpose.',
        pages: [
          page('vientiane-page-01', 'atlas-picks', 'Breakfast first', 'Choose one place you actually want to sit in. A slow morning is enough of a plan.', {
            kicker: 'MORNING',
            references: [reference('vientiane-book-cafe', 'Breakfast stop', vientianeCafe, 'Save it for the morning you do not want an alarm.')],
            media: [mediaFrom('vientiane-book-cafe-media', vientianeCafe, 'Vientiane breakfast')],
          }),
          page('vientiane-page-02', 'memory', 'Nothing heroic today', 'Walk, eat and watch the city settle toward the river. The route gets bigger again tomorrow.', {
            kicker: 'RESET',
            handwrittenNote: 'Rest is part of the Atlas too.',
            noteTone: 'paper',
          }),
        ],
      },
      transfer: { label: 'Vientiane → Vang Vieng', note: 'Keep the transfer simple and arrive with enough energy for the landscape. Check the current train or road departure before you go.' },
    },
    {
      id: 'vang-vieng',
      chapterLabel: 'Chapter 06',
      title: 'Vang Vieng',
      durationLabel: '3 days',
      intro: 'Vang Vieng is where the route becomes playful again. Three days are enough for sky, river and limestone if you stop trying to collect every lagoon and viewpoint.',
      marginNote: 'One morning in the sky. One afternoon on the river. One day for the karst.',
      highlights: ['Hot air balloon', 'Tubing on the Nam Song', 'One strong limestone day'],
      references: [
        reference('vv-balloon-ref', 'Hot air balloon', balloon, 'The morning I would protect for the sky.'),
        reference('vv-tubing-ref', 'Tubing', tubing, 'A river afternoon when the current and local conditions make sense.'),
        reference('vv-namxay-ref', 'Nam Xay Viewpoint', namXay, 'Use the remaining outdoor day for one strong climb rather than five rushed stops.'),
      ],
      personalNotes: [
        note('vang-vieng-personal-01', 'CITY NOTE', 'Sky. River. Karst. That is already enough.', { placement: 'gallery-top-right-gap', tone: 'sage', style: 'scribble', size: 'small' }),
        note('vang-vieng-personal-02', 'NIGHT NOTE', 'Dinner can become a night with people you met that afternoon.', { placement: 'gallery-image-1-overlap', tone: 'rose', style: 'memory', size: 'medium' }),
      ],
      media: [
        mediaFrom('vang-vieng-01', balloon ?? namXay, 'Vang Vieng limestone'),
        mediaFrom('vang-vieng-02', tubing, 'Nam Song river', 'portrait'),
      ],
      notebook: {
        id: 'vang-vieng-notes',
        label: 'PLAY BOOK',
        title: 'Three ways to read Vang Vieng',
        intro: 'Sky, water and limestone. The pages can be opened in any order even if the route cannot.',
        pages: [
          page('vv-page-01', 'photo', 'Morning above the karst', 'If the balloon belongs in your trip, give it the cleanest morning rather than squeezing it before another activity.', {
            kicker: 'SKY PAGE',
            media: [mediaFrom('vv-balloon-media', balloon, 'Hot air balloon')],
            references: [reference('vv-book-balloon', 'Hot air balloon', balloon, 'Open the full field note and save it if this is your morning.')],
            handwrittenNote: 'This one is for the view, not the checklist.',
            noteTone: 'sky',
          }),
          page('vv-page-02', 'atlas-picks', 'Let the river take the afternoon', 'Tubing changes the pace completely. Use it when the river conditions and your energy say yes.', {
            kicker: 'RIVER PAGE',
            references: [reference('vv-book-tubing', 'Tubing', tubing, 'Keep the river afternoon in your Atlas.')],
            media: [mediaFrom('vv-tubing-media', tubing, 'Tubing on the Nam Song')],
          }),
          page('vv-page-03', 'checklist', 'One limestone day', 'Pick one climb or cave direction and let it be enough.', {
            kicker: 'KARST PAGE',
            list: ['Start before the strongest heat', 'Bring water', 'Choose one main objective', 'Keep the evening open'],
            references: [reference('vv-book-namxay', 'Nam Xay Viewpoint', namXay, 'Open the field note if this is the climb you choose.')],
            handwrittenNote: 'More pins do not make a better day.',
            noteTone: 'butter',
          }),
        ],
      },
      transfer: { label: 'Vang Vieng → Luang Prabang', note: 'The railway makes this a natural northbound step. Keep the exact train and station transfer current, then let Luang Prabang start slowly.' },
    },
    {
      id: 'luang-prabang',
      chapterLabel: 'Chapter 07',
      title: 'Luang Prabang',
      durationLabel: '6 days',
      intro: 'This is where I would spend the largest block of the month. The old town, the Mekong, Kuang Si and the slower northern rhythm deserve to remain different experiences.',
      marginNote: 'If you love something enough to go back tomorrow, go back tomorrow.',
      body: ['Give the town unbroken time before the day trips. Then give Kuang Si its own day and keep at least one extra day with no obligation to be new.'],
      highlights: ['Kuang Si gets a full day', 'Walk the old town more than once', 'Keep one day for whatever you want to repeat'],
      references: [
        reference('lp-kuangsi-ref', 'Kuang Si Waterfall', kuangSi, 'The place I would protect even if the rest of the week had to move.'),
        reference('lp-phousi-ref', 'Mount Phousi', phousi, 'A small climb when you want to see the town from above.'),
        reference('lp-pakou-ref', 'Pak Ou', pakOu, 'A different Mekong direction if you want another full day out.'),
      ],
      personalNotes: [
        note('luang-prabang-personal-01', 'WORTH IT', 'Kuang Si is still the most beautiful waterfall I have seen. I paid to go back a second time.', { tone: 'butter', style: 'memory', size: 'large' }),
        note('luang-prabang-personal-02', 'ONE MORE THING', 'I would go back again.', { placement: 'gallery-bottom-left-gap', tone: 'sky', style: 'scribble', size: 'small' }),
      ],
      media: [
        mediaFrom('luang-prabang-01', kuangSi, 'Kuang Si Waterfall'),
        mediaFrom('luang-prabang-02', phousi, 'Luang Prabang old town', 'portrait'),
        mediaFrom('luang-prabang-03', pakOu ?? slowBoat, 'Mekong near Luang Prabang'),
      ],
      notebook: {
        id: 'luang-prabang-notes',
        label: 'FAVOURITE PAGES',
        title: 'The Luang Prabang pages I would keep',
        intro: 'This book gets more room because this is the part of the route where repeating a place is allowed.',
        pages: [
          page('lp-page-01', 'photo', 'Kuang Si once', 'Give the waterfall its own day. Walk through the levels, swim where it is allowed and do not schedule the afternoon so tightly that you have to leave before you want to.', {
            kicker: 'FIRST VISIT',
            media: [mediaFrom('lp-kuangsi-media-01', kuangSi, 'Kuang Si pools')],
            references: [reference('lp-book-kuangsi', 'Kuang Si Waterfall', kuangSi, 'Open the field note and save it before you build the day.')],
          }),
          page('lp-page-02', 'memory', 'Kuang Si twice', 'I went back. That is the whole recommendation.', {
            kicker: 'SECOND VISIT',
            handwrittenNote: 'Some places do not need a new activity. They need another day.',
            noteTone: 'rose',
            media: [mediaFrom('lp-kuangsi-media-02', kuangSi, 'Kuang Si again')],
          }),
          page('lp-page-03', 'scrapbook', 'The town between excursions', 'Walk the same streets at different hours. Let temples, markets, cafes and the river become familiar instead of trying to make every walk unique.', {
            kicker: 'OLD TOWN',
            media: [mediaFrom('lp-phousi-media', phousi, 'Mount Phousi'), mediaFrom('lp-pakou-media', pakOu, 'Mekong direction')],
            handwrittenNote: 'Familiar is not boring.',
            noteTone: 'sage',
          }),
          page('lp-page-04', 'atlas-picks', 'One more direction', 'If six days still have room, choose one more strong direction rather than filling every half day.', {
            kicker: 'CHOOSE ONE',
            references: [reference('lp-book-phousi', 'Mount Phousi', phousi, 'Keep the short climb if it fits your town day.'), reference('lp-book-pakou', 'Pak Ou', pakOu, 'Save the river day only if you actually want it.')],
          }),
        ],
      },
      transfer: { label: 'Luang Prabang → Pakbeng → Houayxay', note: 'The exit becomes part of the story. Two slow boat days, one night in Pakbeng and a final arrival near the Thai border.' },
    },
    {
      id: 'slow-boat',
      chapterLabel: 'Epilogue',
      title: 'Two Days on the Mekong',
      durationLabel: '2 days',
      intro: 'The route ends without a final attraction. For two days, the Mekong is the itinerary.',
      marginNote: 'Let Laos disappear at river speed.',
      body: ['Bring patience, water and something to read. The reason to choose the slow boat is the long river landscape between the places, not the efficiency of arriving.'],
      highlights: ['Luang Prabang to Pakbeng', 'Sleep in Pakbeng', 'Pakbeng to Houayxay'],
      references: [reference('slow-boat-ref', 'Slow boat', slowBoat, 'Open the Atlas note if a river exit belongs in your version of the route.')],
      personalNotes: [
        note('slow-boat-personal-01', 'LAST NOTE', 'The visa clock can be ending without the journey feeling finished.', { tone: 'paper', style: 'memory', size: 'large' }),
      ],
      media: [
        mediaFrom('slow-boat-01', slowBoat ?? pakOu, 'Mekong slow boat'),
        mediaFrom('slow-boat-02', pakOu ?? slowBoat, 'Mekong river landscape', 'portrait'),
      ],
      notebook: {
        id: 'slow-boat-notes',
        label: 'LAST PAGES',
        title: 'The Atlas closes slowly',
        intro: 'Two pages are enough for the last two river days.',
        pages: [
          page('slow-page-01', 'photo', 'Day one to Pakbeng', 'Settle into the boat and stop measuring the day by arrival time. The banks, villages and long bends of river are the point.', {
            kicker: 'RIVER DAY ONE',
            media: [mediaFrom('slow-book-01', slowBoat ?? pakOu, 'Mekong boat day')],
            handwrittenNote: 'No rush. That is why you chose the boat.',
            noteTone: 'sky',
          }),
          page('slow-page-02', 'memory', 'Day two toward Houayxay', 'The second day turns the border into an ending rather than a sudden cut. Recheck the current pier and border details when you travel, then let the editorial idea stay simple.', {
            kicker: 'RIVER DAY TWO',
            handwrittenNote: 'One last long look at Laos.',
            noteTone: 'butter',
            references: [reference('slow-book-ref', 'Slow boat', slowBoat, 'Save the field note if you want this ending in your Atlas.')],
          }),
        ],
      },
      variant: 'epilogue',
    },
  ],
  closingTitle: 'Make this route yours',
  closingCopy: 'Keep the direction, change the pace, remove what does not fit and save the places that do. The route becomes useful when it becomes your Atlas.',
};

const editorialRoutes: AtlasRouteExperienceContent[] = [southToNorthEditorial];

export const getAtlasRouteEditorialContent = (
  country: string,
  slug: string,
): AtlasRouteExperienceContent | undefined =>
  editorialRoutes.find(
    (route) => route.country === country.toLowerCase() && route.slug === slug.toLowerCase(),
  );
