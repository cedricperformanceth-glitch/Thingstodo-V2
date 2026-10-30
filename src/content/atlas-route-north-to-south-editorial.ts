import type { AtlasEntity } from '../core/models/types';
import { places } from './registry/places';
import cityFieldNoteMedia from './city-field-note-media-copy.json';
import { things } from './registry/things-to-do';
import type { AtlasRouteMedia, AtlasRouteMediaAspect } from './atlas-route-content';
import type { AtlasRouteExperienceContent, AtlasRouteExperienceNote, AtlasRouteReference } from './atlas-route-experience';

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const thing = (city: string, ...terms: string[]) =>
  things.find((entry) =>
    entry.city === city && terms.some((term) => normalise(entry.name + ' ' + entry.slug).includes(normalise(term)))
  );
const place = (city: string, ...terms: string[]) =>
  places.find((entry) =>
    entry.city === city && terms.some((term) => normalise(entry.name + ' ' + entry.slug).includes(normalise(term)))
  );

const photo = (
  id: string,
  entity: AtlasEntity | undefined,
  caption: string,
  aspect: AtlasRouteMediaAspect = 'landscape',
): AtlasRouteMedia => {
  const image = entity?.media.card?.image ?? entity?.media.fieldCard?.gallery?.[0];
  return {
    id,
    alt: image?.alt ?? caption,
    label: caption,
    ...(image?.src ? { src: image.src } : {}),
    aspect,
  };
};


/* These are already licensed and catalogued in the Atlas city media bank. */
const cityPhoto = (
  id: string,
  cityId: keyof typeof cityFieldNoteMedia,
  index: number,
  caption: string,
): AtlasRouteMedia => {
  const image = cityFieldNoteMedia[cityId]?.[index];
  return {
    id,
    alt: image?.alt ?? caption,
    label: caption,
    ...(image?.src ? { src: image.src } : {}),
    aspect: 'landscape',
  };
};

const linkTo = (entity: AtlasEntity) => entity.category === 'things-to-do'
  ? '/' + entity.country + '/' + entity.city + '/things-to-do/' + entity.slug
  : '/' + entity.country + '/' + entity.city + '/places/' + entity.slug;

const pick = (id: string, title: string, entity: AtlasEntity | undefined, description: string): AtlasRouteReference => ({
  id,
  title,
  note: description,
  kicker: 'OPEN IN THE ATLAS',
  status: entity ? 'published' : 'coming-soon',
  ...(entity ? { entity, href: linkTo(entity), media: photo(id + '-photo', entity, title, 'square') } : {}),
});

const margin = (
  id: string,
  label: string,
  text: string,
  options: Partial<AtlasRouteExperienceNote> = {},
): AtlasRouteExperienceNote => ({
  id,
  label,
  text,
  placement: 'story',
  tone: 'butter',
  style: 'memory',
  size: 'medium',
  ...options,
});

const kuangSi = thing('luang-prabang', 'kuang si');
const pakOu = thing('luang-prabang', 'pak ou');
const madMonkey = place('luang-prabang', 'mad monkey');

const namXay = thing('vang-vieng', 'nam xay');
const waterCave = thing('vang-vieng', 'tham nam');
const kayak = thing('vang-vieng', 'kayaking');
const gardenBungalows = place('vang-vieng', 'garden bungalows');

const siSaket = thing('vientiane', 'si saket');
const khopChai = place('vientiane', 'khop chai deu', 'kop chai deu');
const barn1920 = place('vientiane', 'barn1920s');

const boulange = place('pakse', 'boulange');
const missNoy = place('pakse', 'miss noy');
const italao = place('pakse', 'italao');
const phouSalao = thing('pakse', 'phou salao');

const tadLo = thing('tad-lo', 'tad lo waterfall');
const fandee = place('tad-lo', 'fandee island');
const bolavenGarden = place('tad-lo', 'bolaven garden');

export const northToSouthEditorial: AtlasRouteExperienceContent = {
  country: 'laos',
  slug: 'north-to-south',
  label: 'North → South',
  eyebrow: 'ATLAS ROUTE',
  title: 'Laos North to South in 15 Days',
  subtitle: 'From the northern temples to the Bolaven Plateau, with time for people, water and the occasional excellent meal.',
  durationLabel: '15 days · flexible from 12 to 19',
  directionLabel: 'Luang Prabang → Chong Mek',
  intro: [
    "I travelled through these places in the other direction, arriving from Thailand through Chong Mek. If I were to build a fifteen day journey from north to south, though, this is how I would arrange it.",
    "Start with Luang Prabang, leave room for the people you meet in Vang Vieng, slow down in Vientiane and finish with Pakse and the Bolaven Plateau. Some of my favourite memories involved very little sightseeing.",
  ],
  heroMedia: [
    photo('n2s-hero-kuang-si', kuangSi, 'Kuang Si falls, near Luang Prabang', 'portrait'),
    photo('n2s-hero-vang-vieng', namXay ?? kayak, 'Limestone country around Vang Vieng'),
    photo('n2s-hero-vientiane', siSaket, 'Wat Si Saket, Vientiane', 'square'),
    photo('n2s-hero-tad-lo', tadLo, 'Waterfall country on the Bolaven Plateau'),
  ],
  stops: [
    { label: 'Luang Prabang', durationLabel: '4 days', chapterId: 'north-luang-prabang' },
    { label: 'Vang Vieng', durationLabel: '3 days', chapterId: 'north-vang-vieng' },
    { label: 'Vientiane', durationLabel: '2 days', chapterId: 'north-vientiane' },
    { label: 'Pakse', durationLabel: '1 day', chapterId: 'north-pakse' },
    { label: 'Bolaven Loop', durationLabel: '3 days', chapterId: 'north-bolaven-loop' },
    { label: 'Pakse', durationLabel: '1 day', chapterId: 'north-pakse-return' },
    { label: 'Chong Mek', durationLabel: '1 day', chapterId: 'north-border' },
  ],
  chapters: [
    {
      id: 'north-luang-prabang',
      chapterLabel: 'Chapter 01',
      title: 'Luang Prabang',
      durationLabel: '4 days',
      intro: "Luang Prabang is the place I would choose to begin. Between the Mekong and Nam Khan, old temples, market streets and small cafés make it remarkably easy to settle in before travelling farther south.",
      body: [
        "Kuang Si deserves a full day. For me, it is the most beautiful waterfall in Laos, perhaps even one of the finest in Southeast Asia. I also enjoyed Pak Ou Caves, although the river journey and the caves' Buddhist atmosphere stayed with me more than the caves themselves.",
        "The night market is more tourist oriented than others I visited in Laos, so I would compare souvenir prices elsewhere. I stayed at Mad Monkey and enjoyed meeting people there, especially around the pool, the only hostel swimming pool I used on my trip.",
      ],
      highlights: ['Kuang Si for a full day', 'Pak Ou and the Mekong', 'Time for the old town'],
      references: [
        pick('n2s-lp-kuang-si', 'Kuang Si Waterfalls', kuangSi, 'The day I would protect on the itinerary.'),
        pick('n2s-lp-pak-ou', 'Pak Ou Caves', pakOu, 'A river journey and a quieter religious site.'),
        pick('n2s-lp-mad-monkey', 'Mad Monkey Luang Prabang', madMonkey, 'A sociable base with a pool.'),
      ],
      personalNotes: [
        margin('n2s-lp-note', 'WORTH THE DAY', 'Kuang Si. I would go again.', { tone: 'butter', size: 'small' }),
      ],
      media: [
        cityPhoto('n2s-lp-mekong', 'city-laos-luang-prabang', 0, 'Luang Prabang seen across the Mekong'),
        cityPhoto('n2s-lp-temple', 'city-laos-luang-prabang', 1, 'Wat Xieng Thong'),
      ],
      notebook: {
        id: 'n2s-lp-fieldbook',
        label: 'FIELD NOTES',
        title: 'The Luang Prabang pages',
        intro: 'Two places I would make time for, beyond the usual quick stops.',
        pages: [
          {
            id: 'n2s-lp-book-kuang-si',
            variant: 'photo',
            kicker: 'WATERFALL DAY',
            title: 'A whole day at Kuang Si',
            copy: "The different levels make this much more than a single waterfall. Follow the paths, take your time and swim only where it is allowed.",
            media: [cityPhoto('n2s-lp-book-falls', 'city-laos-luang-prabang', 3, 'Kuang Si waterfalls')],
          },
          {
            id: 'n2s-lp-book-pak-ou',
            variant: 'memory',
            kicker: 'RIVER MEMORY',
            title: 'The river was part of it',
            copy: "I liked Pak Ou for the journey, the Buddhist images and the way the caves still feel connected to the past. I would not oversell them, but I would visit.",
            media: [cityPhoto('n2s-lp-book-mekong', 'city-laos-luang-prabang', 2, 'Mekong evening in Luang Prabang')],
          },
        ],
      },
      transfer: {
        label: 'Luang Prabang → Vang Vieng',
        note: 'The Laos China Railway connects the two, with separate transfers between stations and town centres.',
      },
    },
    {
      id: 'north-vang-vieng',
      chapterLabel: 'Chapter 02',
      title: 'Vang Vieng',
      durationLabel: '3 days',
      intro: "Vang Vieng is where I would loosen the itinerary. The Nam Song, the limestone peaks, caves and lagoons give you plenty to do. The people you meet often decide what happens next.",
      body: [
        "I stayed at Vang Vieng Garden Bungalows. The wooden bungalows were simple and affordable, and you could sometimes hear the neighbours. Philippe, the owner, was friendly, entertaining and genuinely helpful with things like scooter rental and train tickets. I planned to stay one night and ended up staying the whole time.",
        "I loved kayaking, spent most of an afternoon at Tham Nam Water Cave, climbed Nam Xay and enjoyed swimming at the lagoons. A scooter helped me explore outside the town, but the best part of Vang Vieng was not needing to schedule every hour.",
      ],
      highlights: ['Kayak on the Nam Song', 'Tham Nam Water Cave', 'Nam Xay and a lagoon'],
      references: [
        pick('n2s-vv-garden', 'Vang Vieng Garden Bungalows', gardenBungalows, 'The place I intended to leave after one night.'),
        pick('n2s-vv-water-cave', 'Tham Nam Water Cave', waterCave, 'An afternoon worth taking slowly.'),
        pick('n2s-vv-nam-xay', 'Nam Xay Viewpoint', namXay, 'For the limestone landscape from above.'),
      ],
      personalNotes: [
        margin('n2s-vv-note', 'MY RULE HERE', 'Let the people you meet change the afternoon.', { tone: 'sage', size: 'small' }),
      ],
      media: [
        cityPhoto('n2s-vv-nam-song', 'city-laos-vang-vieng', 0, 'Nam Song and the limestone landscape'),
        cityPhoto('n2s-vv-bridge', 'city-laos-vang-vieng', 2, 'Bridge over the Nam Song'),
        cityPhoto('n2s-vv-view', 'city-laos-vang-vieng', 3, 'The valley from Nam Xay'),
      ],
      notebook: {
        id: 'n2s-vv-fieldbook',
        label: 'FIELD NOTES',
        title: 'Unplanned afternoons',
        intro: 'Water, guesthouses and the reason I never moved on after the first night.',
        pages: [
          {
            id: 'n2s-vv-book-lagoon',
            variant: 'photo',
            kicker: 'WATER DAY',
            title: 'Stay for the lagoon',
            copy: "I met people, went swimming and stayed longer than planned. That was really the mood of Vang Vieng.",
            media: [cityPhoto('n2s-vv-book-lagoon-photo', 'city-laos-vang-vieng', 1, 'The Blue Lagoon near Vang Vieng')],
          },
          {
            id: 'n2s-vv-book-philippe',
            variant: 'memory',
            kicker: 'GUESTHOUSE MEMORY',
            title: 'One night became three',
            copy: "Philippe made the place memorable. Good hospitality and a bit of personality mattered more to me than having a polished room.",
            handwrittenNote: 'Sometimes staying is the recommendation.',
            noteTone: 'butter',
          },
        ],
      },
      transfer: {
        label: 'Vang Vieng → Vientiane',
        note: 'Travel south by train or road and change pace for two nights in the capital.',
      },
    },
    {
      id: 'north-vientiane',
      chapterLabel: 'Chapter 03',
      title: 'Vientiane',
      durationLabel: '2 days',
      intro: "I spent two nights in Vientiane and liked the quieter pace of the capital. The temples and the Mekong evenings were enough without filling every hour with sightseeing.",
      body: [
        "I spent about ninety minutes at Wat Si Saket. After living and travelling in Thailand, I noticed subtle differences in the atmosphere of Lao temples. Here I felt particularly aware of their place in the local community, even with visitors walking through.",
        "Barn1920s Hostel was comfortable, clean, cosy and affordable on my visit. I also had a good evening at Khop Chai Deu, an established restaurant with Lao and international food and live music. I spent around 200,000 kip that night. I walked the night market too and decided against renting a scooter for this short city stay.",
      ],
      highlights: ['Wat Si Saket without rushing', 'Evening at Khop Chai Deu', 'Mekong night market'],
      references: [
        pick('n2s-vte-si-saket', 'Wat Si Saket', siSaket, 'The temple where I spent an hour and a half.'),
        pick('n2s-vte-khop-chai', 'Khop Chai Deu', khopChai, 'Lao food, international dishes and live music.'),
        pick('n2s-vte-barn', 'Barn1920s Hostel', barn1920, 'A clean and cosy place to stay.'),
      ],
      personalNotes: [
        margin('n2s-vte-note', 'EVENING NOTE', 'Live music always makes me want to linger.', { tone: 'rose', size: 'small' }),
      ],
      media: [
        cityPhoto('n2s-vte-saket', 'city-laos-vientiane', 1, 'Wat Si Saket'),
        cityPhoto('n2s-vte-that-luang', 'city-laos-vientiane', 0, 'Pha That Luang'),
        cityPhoto('n2s-vte-mekong', 'city-laos-vientiane', 3, 'The Mekong in Vientiane'),
      ],
      notebook: {
        id: 'n2s-vte-fieldbook',
        label: 'FIELD NOTES',
        title: 'Two evenings in the capital',
        intro: 'A little about the temples, the food and a comfortable place to sleep.',
        pages: [
          {
            id: 'n2s-vte-book-city',
            variant: 'photo',
            kicker: 'CITY WALK',
            title: 'More than a temple list',
            copy: "Vientiane is better when you leave time to walk, especially around the older city and the river.",
            media: [cityPhoto('n2s-vte-book-patuxai', 'city-laos-vientiane', 2, 'Patuxai and Lane Xang Avenue')],
          },
          {
            id: 'n2s-vte-book-dinner',
            variant: 'memory',
            kicker: 'DINNER MEMORY',
            title: 'Music at Khop Chai Deu',
            copy: "I remember the atmosphere as much as the meal. My bill was around 200,000 kip, which felt reasonable at the time.",
            handwrittenNote: 'One more song? Of course.',
            noteTone: 'sky',
          },
        ],
      },
      transfer: {
        label: 'Vientiane → Pakse',
        note: 'An overnight bus is a practical way south. I made this journey in the opposite direction during my travels.',
      },
    },
    {
      id: 'north-pakse',
      chapterLabel: 'Chapter 04',
      title: 'Pakse',
      durationLabel: '1 day',
      intro: "Pakse makes a good base for southern Laos. I would spend the first day eating well, organising the scooter and preparing to ride the Bolaven Plateau.",
      body: [
        "The French style bread at La Boulange Garden was exceptional. I also enjoyed Ita Lao, where I met a Lao pizza maker nicknamed Sticky Rice, who had grown up in the United States. His pizza was excellent.",
        "I rented my scooter from Miss Noy through Yves before heading out on the loop. Pakse is the place to make sure the bike, documents and route are ready before the plateau takes over.",
      ],
      highlights: ['La Boulange Garden', 'Pizza at Ita Lao', 'Scooter rental through Miss Noy'],
      references: [
        pick('n2s-pakse-boulange', 'La Boulange Garden', boulange, 'The French bread I still remember.'),
        pick('n2s-pakse-italao', 'Ita Lao', italao, 'Pizza and the meeting with Sticky Rice.'),
        pick('n2s-pakse-miss-noy', 'Miss Noy', missNoy, 'Where Yves organised the scooter rental.'),
      ],
      personalNotes: [
        margin('n2s-pakse-note', 'BREAKFAST', 'Good French bread. A small pleasure, but a memorable one.', { tone: 'butter', size: 'small' }),
      ],
      media: [
        cityPhoto('n2s-pakse-river', 'city-laos-pakse', 0, 'Pakse by the river'),
        cityPhoto('n2s-pakse-plateau', 'city-laos-pakse', 2, 'Tad Fane on the road towards Bolaven'),
      ],
      transfer: {
        label: 'Pakse → Bolaven Plateau',
        note: 'A few days on the scooter let the waterfalls and villages become more than quick stops.',
      },
    },
    {
      id: 'north-bolaven-loop',
      chapterLabel: 'Chapter 05',
      title: 'The Bolaven Loop',
      durationLabel: '3 days',
      variant: 'feature',
      intro: "The Bolaven Plateau is where I would slow down again. Waterfalls, greener roads and small villages make this more than a ride to tick off on a map.",
      body: [
        "I stayed one night at Bolaven Garden, visited Tad Lo Waterfall and went to a nearby Katu village. Fandee Island was the centre of a wonderfully quiet afternoon, with a swim, time in a hammock and a very good burger and chips.",
        "And the lava cake. I remember that chocolate cake almost more vividly than the road itself. There are activities around Fandee too, but I was perfectly happy allowing the day to be slow.",
      ],
      highlights: ['Tad Lo Waterfall and the village', 'Fandee Island for swimming and food', 'One night at Bolaven Garden'],
      references: [
        pick('n2s-bolaven-tad-lo', 'Tad Lo Waterfall', tadLo, 'A slow walk rather than a rushed photo stop.'),
        pick('n2s-bolaven-fandee', 'Fandee Island', fandee, 'The burger, lava cake, swim and hammock.'),
        pick('n2s-bolaven-garden', 'Bolaven Garden', bolavenGarden, 'The place I stayed overnight.'),
      ],
      personalNotes: [
        margin('n2s-bolaven-note', 'LAVA CAKE', 'Yes, I still remember the chocolate cake.', { tone: 'rose', size: 'small' }),
      ],
      media: [
        cityPhoto('n2s-bolaven-waterfall', 'city-tad-lo', 0, 'Tad Hang at sunset'),
        cityPhoto('n2s-bolaven-village', 'city-tad-lo', 1, 'Village life around Tad Lo'),
        cityPhoto('n2s-bolaven-falls', 'city-tad-lo', 2, 'Tad Lo Waterfall'),
      ],
      notebook: {
        id: 'n2s-bolaven-fieldbook',
        label: 'FIELD NOTES',
        title: 'A slow day on the plateau',
        intro: 'Fandee Island, village paths and an overnight stop.',
        pages: [
          {
            id: 'n2s-bolaven-book-village',
            variant: 'photo',
            kicker: 'TAD LO',
            title: 'Follow the river',
            copy: "I visited the waterfall and a nearby Katu village before returning to Fandee Island. This was a day for slowing down.",
            media: [cityPhoto('n2s-bolaven-book-footbridge', 'city-tad-lo', 3, 'River and footbridge at Tad Lo')],
          },
          {
            id: 'n2s-bolaven-book-food',
            variant: 'memory',
            kicker: 'FOOD MEMORY',
            title: 'An excellent lava cake',
            copy: "The burger and chips were exactly what I wanted after so much time travelling. Then came the cake, a swim and a quiet evening in the hammock.",
            handwrittenNote: 'Give me an afternoon like this and I am happy.',
            noteTone: 'butter',
          },
        ],
      },
      transfer: {
        label: 'Bolaven Loop → Pakse',
        note: 'Finish the loop back in Pakse and return the scooter before the final day.',
      },
    },
    {
      id: 'north-pakse-return',
      chapterLabel: 'Chapter 06',
      title: 'Back to Pakse',
      durationLabel: '1 day',
      intro: "Back in Pakse, I returned the scooter and spent another night in town. I also went to Wat Phou Salao to see the golden Buddha on the hillside above the Mekong.",
      body: [
        "After the loop, a familiar city, a good meal and a quiet night were enough. The view from Phou Salao is a particularly good way to finish the southern chapter.",
      ],
      references: [
        pick('n2s-pakse-return-salao', 'Wat Phou Salao', phouSalao, 'The golden Buddha and the view over Pakse.'),
      ],
      personalNotes: [
        margin('n2s-pakse-return-note', 'LAST NIGHT', 'A view over Pakse and a quiet evening.', { tone: 'sage', size: 'small' }),
      ],
      media: [
        cityPhoto('n2s-pakse-return-buddha', 'city-laos-pakse', 1, 'Wat Phou Salao above Pakse'),
        cityPhoto('n2s-pakse-return-river', 'city-laos-pakse', 3, 'The Champasak landscape south of Pakse'),
      ],
      transfer: {
        label: 'Pakse → Vang Tao → Chong Mek',
        note: 'Leave time for the border formalities and onward travel in Thailand.',
      },
    },
    {
      id: 'north-border',
      chapterLabel: 'Epilogue',
      title: 'Leaving Laos',
      durationLabel: '1 day',
      variant: 'epilogue',
      intro: "The final day takes the road from Pakse to the Vang Tao and Chong Mek border crossing. I originally arrived through Chong Mek from Thailand. For this version of the journey, it makes a natural way out.",
      body: [
        "Fifteen days, four quite different parts of Laos, and plenty of reasons to return. What I remember most is not always a famous attraction. Sometimes it is a welcoming guesthouse owner, live music or a particularly good chocolate cake.",
      ],
      personalNotes: [
        margin('n2s-border-note', 'LAST PAGE', "There is no need to add another stop just to fill the day.", { tone: 'paper', size: 'small' }),
      ],
    },
  ],
  closingTitle: 'Keep the route. Change the pace.',
  closingCopy: "If you have twelve days, make the stops shorter. If you have nineteen, stay where you like it. The Atlas cards have the practical details. The rest is your journey.",
};
