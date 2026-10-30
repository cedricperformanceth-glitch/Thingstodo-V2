import type { AtlasEntity } from '../core/models/types';
import { places } from './registry/places';
import cityFieldNoteMedia from './city-field-note-media-copy.json';
import { things } from './registry/things-to-do';
import type { AtlasRouteMedia, AtlasRouteMediaAspect } from './atlas-route-content';
import type { AtlasRouteExperienceContent, AtlasRouteExperienceNote, AtlasRouteReference } from './atlas-route-experience';

/**
 * Kathleen's editorial working draft.
 * North to south is a proposed route assembled from approved Atlas material
 * and the publisher's firsthand experience. It is not a claim that the
 * original journey occurred in this exact order.
 *
 * Source of truth for exact addresses, media and practical details: Atlas
 * entity registries. Do not duplicate those records into this narrative.
 */
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
const heritage = thing('luang-prabang', 'heritage walk');
const phousi = thing('luang-prabang', 'phou si');
const madMonkey = place('luang-prabang', 'mad monkey');

const namXay = thing('vang-vieng', 'nam xay');
const waterCave = thing('vang-vieng', 'tham nam');
const kayak = thing('vang-vieng', 'kayaking');
const lagoon = thing('vang-vieng', 'blue lagoon 3') ?? thing('vang-vieng', 'blue lagoon 1');
const gardenBungalows = place('vang-vieng', 'garden bungalows');

const siSaket = thing('vientiane', 'si saket');
const mekongWalk = thing('vientiane', 'mekong riverside');
const nightMarket = thing('vientiane', 'night market');
const khopChai = place('vientiane', 'khop chai deu', 'kop chai deu');
const barn1920 = place('vientiane', 'barn1920s');

const boulange = place('pakse', 'boulange');
const missNoy = place('pakse', 'miss noy');
const italao = place('pakse', 'italao');
const phouSalao = thing('pakse', 'phou salao');

const tadLo = thing('tad-lo', 'tad lo waterfall');
const tadHang = thing('tad-lo', 'tad hang');
const fandee = place('tad-lo', 'fandee island');
const fandeePark = thing('tad-lo', 'fandee adventure');
const bolavenGarden = place('tad-lo', 'bolaven garden');
const tadLoWalk = thing('tad-lo', 'riverside village walk');

export const northToSouthEditorial: AtlasRouteExperienceContent = {
  country: 'laos',
  slug: 'north-to-south',
  label: 'North → South',
  eyebrow: 'THE ATLAS JOURNEY · KATHLEEN',
  title: 'Laos North to South in 15 Days',
  subtitle: 'Temple mornings, limestone mountains, long conversations and one quite unforgettable chocolate cake.',
  durationLabel: '15 days · flexible from 12 to 19',
  directionLabel: 'Luang Prabang → Chong Mek',
  intro: [
    "There are countries where fifteen days feel like an organised sprint. Laos is not especially interested in that kind of travel. Here, a morning can disappear inside a temple, an afternoon can end beside a river, and the person running your guesthouse can be reason enough to stay another night.",
    "My own travels took me through these places in a different order. For this Atlas, I would start in Luang Prabang and work south through Vang Vieng, Vientiane and Pakse, then give the Bolaven Plateau its own stretch of road. The places and memories are real. The fifteen day route is the version I would offer a friend.",
    "You can compress it to twelve days or stretch it towards nineteen. Just resist the temptation to turn every lovely afternoon into a departure deadline.",
  ],
  heroMedia: [
    photo('n2s-hero-kuang-si', kuangSi, 'Kuang Si falls, near Luang Prabang', 'portrait'),
    photo('n2s-hero-vang-vieng', namXay ?? kayak, 'Limestone country around Vang Vieng'),
    photo('n2s-hero-vientiane', siSaket, 'Wat Si Saket, Vientiane', 'square'),
    photo('n2s-hero-tad-lo', tadLo, 'Waterfall country on the Bolaven Plateau'),
  ],
  stops: [
    { label: 'Luang Prabang', durationLabel: 'Days 1 to 4', chapterId: 'north-luang-prabang' },
    { label: 'Vang Vieng', durationLabel: 'Days 5 to 7', chapterId: 'north-vang-vieng' },
    { label: 'Vientiane', durationLabel: 'Days 8 to 9', chapterId: 'north-vientiane' },
    { label: 'Pakse', durationLabel: 'Day 10', chapterId: 'north-pakse' },
    { label: 'Bolaven Loop', durationLabel: 'Days 11 to 13', chapterId: 'north-bolaven-loop' },
    { label: 'Back to Pakse', durationLabel: 'Day 14', chapterId: 'north-pakse-return' },
    { label: 'Chong Mek border', durationLabel: 'Day 15', chapterId: 'north-border' },
  ],
  chapters: [
    {
      id: 'north-luang-prabang',
      galleryStyle: 'photo-essay',
      chapterLabel: 'CHAPTER 01 · DAYS 1 TO 4',
      title: 'Luang Prabang',
      durationLabel: '4 days',
      intro: "I would begin in Luang Prabang, not because it has the longest list of sights, but because it gives you a proper introduction to the country. The old town lies between the Mekong and the Nam Khan. Temple roofs appear along narrow streets, cafés interrupt the walking, and the town still feels lived in despite the crowds it now attracts.",
      marginNote: 'A town to explore slowly, before you start collecting kilometres.',
      body: [
        "I spent time wandering through the town and found that the atmosphere mattered as much as any single building. The historic centre is protected by UNESCO, but it is not an empty museum. Monasteries, local homes and ordinary routines share the same streets as the visitors. I would keep the first day free for walking and let the river tell me when it was time for dinner.",
        "Then I would give Kuang Si an entire day. It is, to my mind, the most beautiful waterfall in Laos. Possibly one of the finest in Southeast Asia, although I am prepared to have that argument over a drink. Water tumbles through successive limestone pools, surrounded by greenery, and I found one beautiful level after another. I did notice the growth of tourist facilities around the site. Better access has advantages, but I hope the natural setting remains the reason people come.",
        "Pak Ou Caves left a quieter impression. I did enjoy them, especially the river journey and the sense of history in the caves themselves, but I would not promise an extraordinary underground spectacle. The place is more compelling for its Buddhist significance and the rather unpolished atmosphere. It offers a contrast to the busier streets of town.",
        "In the evening I walked through Luang Prabang's night market. It felt more directed at travellers than the markets I visited elsewhere in Laos, and I would not choose it as the cheapest place to buy all my souvenirs. It was still a pleasant place to spend an evening. I stayed at Mad Monkey, where the pool was a very welcome luxury after the heat. Oddly enough, it was the only swimming pool I made time for on the journey. Rivers, lagoons and waterfalls did most of the work.",
        "The hostel was sociable, too. Luang Prabang is the first stop for some travellers and the last for others. You meet people who are just setting off and people who already know which guesthouse they would return to. That makes the evenings interesting without needing to manufacture a big night out.",
      ],
      highlights: ['One day for the old town and its temples', 'A full day at Kuang Si', 'Pak Ou and the Mekong on a separate outing'],
      references: [
        pick('n2s-lp-kuang-si', 'Kuang Si Waterfalls', kuangSi, 'The waterfall I would never squeeze into a rushed morning.'),
        pick('n2s-lp-pak-ou', 'Pak Ou Caves', pakOu, 'Part of the pleasure is the river journey.'),
        pick('n2s-lp-heritage', 'Luang Prabang Heritage Walk', heritage, 'Start here to understand the town before the excursions.'),
        pick('n2s-lp-mad-monkey', 'Mad Monkey Luang Prabang', madMonkey, 'A social base with the pool I remember fondly.'),
      ],
      personalNotes: [
        margin('n2s-lp-note-pool', 'SMALL LUXURY', "One hostel pool in an entire journey. Apparently that was enough.", { tone: 'sky', style: 'scribble', size: 'small' }),
        margin('n2s-lp-note-market', 'SHOPPING NOTE', "I would browse the night market here, but compare souvenir prices elsewhere.", { placement: 'gallery-bottom-left-gap', tone: 'butter' }),
      ],
      media: [
        photo('n2s-lp-kuang-si', kuangSi, 'The tiers of Kuang Si'),
        photo('n2s-lp-old-town', heritage ?? phousi, 'Streets and temples of the old town', 'portrait'),
        photo('n2s-lp-pak-ou', pakOu, 'Pak Ou and the Mekong'),
        cityPhoto('n2s-lp-city-mekong', 'city-laos-luang-prabang', 0, 'Luang Prabang across the Mekong'),
        cityPhoto('n2s-lp-city-wat', 'city-laos-luang-prabang', 1, 'Wat Xieng Thong'),
        cityPhoto('n2s-lp-city-evening', 'city-laos-luang-prabang', 2, 'Evening on the Mekong'),
        cityPhoto('n2s-lp-city-falls', 'city-laos-luang-prabang', 3, 'The pools of Kuang Si'),
        photo('n2s-lp-madmonkey', madMonkey, 'Mad Monkey Luang Prabang'),
      ],
      notebook: {
        id: 'n2s-lp-fieldbook',
        label: 'KATHLEEN’S FIELD BOOK',
        title: 'The Luang Prabang pages',
        intro: 'The parts I would give more time than a standard checklist allows.',
        pages: [
          {
            id: 'n2s-lp-book-kuang-si',
            variant: 'photo',
            kicker: 'WATERFALL DAY',
            title: 'Let Kuang Si take the day',
            copy: "Don't make it the first of five stops. The different pools and paths deserve time, and swimming is only for the sections where it is permitted and safe on the day.",
            handwrittenNote: 'I wanted to stay longer at nearly every level.',
            noteTone: 'sage',
            media: [photo('n2s-lp-notebook-kuang-si', kuangSi, 'More of Kuang Si')],
            references: [pick('n2s-lp-book-kuang-ref', 'Kuang Si Waterfalls', kuangSi, 'Open the full activity and practical notes.')],
          },
          {
            id: 'n2s-lp-book-pak-ou',
            variant: 'memory',
            kicker: 'RIVER NOTE',
            title: 'The journey counts too',
            copy: "I liked Pak Ou for its context, its Buddhist images and the feeling that the place has a life beyond today's visitors. I would not oversell the caves themselves.",
            handwrittenNote: 'Some places are quieter than their reputation, in a good way.',
            noteTone: 'paper',
            media: [photo('n2s-lp-notebook-pak-ou', pakOu, 'Pak Ou cave details')],
          },
          {
            id: 'n2s-lp-book-social',
            variant: 'atlas-picks',
            kicker: 'WHERE I STAYED',
            title: 'A social start',
            copy: 'Mad Monkey was good for meeting people. I particularly appreciated the pool in the afternoon heat.',
            references: [pick('n2s-lp-book-mad-monkey', 'Mad Monkey Luang Prabang', madMonkey, 'The sociable place I chose as a base.')],
            handwrittenNote: 'The people you meet will often reappear farther down the road.',
            noteTone: 'sky',
          },
        ],
      },
      transfer: {
        label: 'Luang Prabang → Vang Vieng',
        note: "The Laos China Railway makes this a natural southbound move. Book the train separately from the station transfer, and leave time to reach both stations outside the town centres.",
      },
    },
    {
      id: 'north-vang-vieng',
      galleryStyle: 'photo-essay',
      chapterLabel: 'CHAPTER 02 · DAYS 5 TO 7',
      title: 'Vang Vieng',
      durationLabel: '3 days',
      intro: "Vang Vieng was where I stopped trying to organise every hour. There is an astonishing amount to do in the countryside around the Nam Song, but the atmosphere is relaxed enough that an afternoon's plan can change entirely because of the people you met over breakfast.",
      marginNote: 'Leave space for people, not just places.',
      body: [
        "I stayed in Vang Vieng Garden Bungalows. The little wooden bungalows were simple and affordable, and yes, occasionally you could hear the neighbours. At that price, a little acoustic honesty seemed fair. The real attraction was the welcome. The owner, Philippe, was friendly, full of character and remarkably helpful with scooters, train tickets and the little arrangements that make travelling easier.",
        "I had planned to spend one night there and move to another guesthouse. Instead, I stayed for the whole visit. That probably tells you more about the place than a paragraph of accommodation adjectives would.",
        "I hired a scooter to explore outside town. Vang Vieng itself is compact, but the caves, viewpoints and lagoons spread across a much wider valley. With the limestone peaks rising around you, even the ride between places becomes part of the day. A bicycle or arranged transport may be better if you are not qualified or comfortable riding a motorcycle.",
        "Kayaking on the Nam Song was a real highlight for me. So was Tham Nam Water Cave, where I spent most of an afternoon. I would give the caves time rather than trying to tick several off in one hurried circuit. The lagoons were a completely different kind of pleasure: swimming, sitting around, meeting people and accepting that the afternoon had rather got away from us.",
        "I also climbed Nam Xay Viewpoint. The view is wonderful, but go when the heat and trail conditions make sense, and wear shoes that can cope with a climb. This is one of those places where looking at the mountains and being on top of them require very different levels of effort.",
      ],
      highlights: ['Kayak the Nam Song', 'Give Tham Nam Water Cave a proper afternoon', 'Nam Xay and a lagoon, without a strict timetable'],
      references: [
        pick('n2s-vv-garden', 'Vang Vieng Garden Bungalows', gardenBungalows, 'Philippe and the team made me want to stay.'),
        pick('n2s-vv-water-cave', 'Tham Nam Water Cave', waterCave, 'A cave afternoon I would happily repeat.'),
        pick('n2s-vv-kayak', 'Nam Song River Kayaking', kayak, 'The river completely changes how you see the landscape.'),
        pick('n2s-vv-nam-xay', 'Nam Xay Viewpoint', namXay, 'Worth the climb if you choose the right conditions.'),
        pick('n2s-vv-lagoon', 'Blue Lagoons', lagoon, 'Keep a few hours free for swimming and people watching.'),
      ],
      personalNotes: [
        margin('n2s-vv-owner', 'THE PERSON I REMEMBER', 'Philippe, the owner of Garden Bungalows. Friendly, attentive and entertaining, without trying too hard.', { tone: 'rose', style: 'scribble' }),
        margin('n2s-vv-no-plan', 'MY RULE HERE', "Plan the first activity. Let the rest of the day negotiate.", { placement: 'gallery-top-right-gap', tone: 'butter', size: 'small' }),
      ],
      media: [
        photo('n2s-vv-nam-xay', namXay, 'Above the limestone valley'),
        photo('n2s-vv-water-cave', waterCave, 'Tham Nam Water Cave', 'portrait'),
        photo('n2s-vv-kayak', kayak, 'On the Nam Song'),
        cityPhoto('n2s-vv-city-river', 'city-laos-vang-vieng', 0, 'The Nam Song and limestone mountains'),
        cityPhoto('n2s-vv-city-lagoon', 'city-laos-vang-vieng', 1, 'Blue Lagoon'),
        cityPhoto('n2s-vv-city-bridge', 'city-laos-vang-vieng', 2, 'Crossing the Nam Song'),
        cityPhoto('n2s-vv-city-namxay', 'city-laos-vang-vieng', 3, 'The karst valley from Nam Xay'),
        photo('n2s-vv-garden-gallery', gardenBungalows, 'Vang Vieng Garden Bungalows'),
      ],
      notebook: {
        id: 'n2s-vv-fieldbook',
        label: 'KATHLEEN’S FIELD BOOK',
        title: 'The days that refused a schedule',
        intro: 'A few moments that made Vang Vieng feel like more than an activity base.',
        pages: [
          {
            id: 'n2s-vv-book-guesthouse',
            variant: 'memory',
            kicker: 'GUESTHOUSE PAGE',
            title: 'I only booked one night',
            copy: "The bungalows were basic, the welcome was excellent and Philippe could help with the practical side of almost anything. I had intended to move on to a different place. I didn't.",
            handwrittenNote: 'Sometimes the best review is staying.',
            noteTone: 'sage',
            media: [photo('n2s-vv-book-garden', gardenBungalows, 'Vang Vieng Garden Bungalows')],
            references: [pick('n2s-vv-book-garden-link', 'Garden Bungalows', gardenBungalows, 'See the accommodation in the Atlas.')],
          },
          {
            id: 'n2s-vv-book-water',
            variant: 'scrapbook',
            kicker: 'WATER DAY',
            title: 'Caves, kayaks and lagoons',
            copy: 'Kayaking was superb. Tham Nam occupied nearly an entire afternoon. The lagoons were where I ended up meeting people and forgetting the plan.',
            handwrittenNote: 'I could lose another hour here.',
            noteTone: 'sky',
            media: [photo('n2s-vv-book-kayak', kayak, 'Nam Song kayak trip'), photo('n2s-vv-book-lagoon', lagoon, 'One of the Vang Vieng lagoons')],
          },
        ],
      },
      transfer: {
        label: 'Vang Vieng → Vientiane',
        note: 'Continue south by train or road. Vientiane is a different rhythm entirely, with less countryside wandering and more temples, cafés and evenings beside the Mekong.',
      },
    },
    {
      id: 'north-vientiane',
      galleryStyle: 'photo-essay',
      chapterLabel: 'CHAPTER 03 · DAYS 8 TO 9',
      title: 'Vientiane',
      durationLabel: '2 days',
      intro: "I liked Vientiane for being a capital that doesn't insist on overwhelming you. It has national monuments and beautiful temples, but there is also room for a slow meal and an evening walk by the Mekong.",
      marginNote: 'I came for the temples. I stayed out for the music.',
      body: [
        "Wat Si Saket is the temple that stayed with me. I spent about an hour and a half there, observing the atmosphere rather than racing through. Having spent so much time in Thailand, I found myself noticing small differences. In Laos, I felt the local religious and community presence particularly strongly, even in temples open to visitors. That is a personal impression, not a claim that Thai temples lack community life.",
        "I deliberately did not rent a scooter in Vientiane. Traffic enforcement felt stricter than in the southern places I knew, and for a short city visit I preferred walking and local transport. Whatever you choose, the legal requirements do not change by region: use a helmet, carry a valid licence for the vehicle and check whether you need an international driving permit.",
        "I stayed at Barn1920s Hostel. It was cosy, clean, well spaced for a dormitory and very affordable when I visited. There was a female dormitory as well. For a simple base in the capital, that was all I really needed.",
        "An evening at Khop Chai Deu gave me another good memory. The restaurant has been around since 1998 and serves Lao as well as international food. I liked the indoor and outdoor seating, but especially the live music. I spent around 200,000 kip on my evening there, which felt very reasonable at the time. That was my bill, not a guaranteed current price.",
        "I also walked through Vientiane's night market. It felt different from Luang Prabang's, less like an entire town leaning towards souvenirs and more like another part of an ordinary capital evening. The two countries I know best, Laos and Thailand, have plenty in common, but their daily rhythms are not interchangeable.",
      ],
      highlights: ['Ninety unhurried minutes at Wat Si Saket', 'A night market walk along the Mekong', 'An evening with live music at Khop Chai Deu'],
      references: [
        pick('n2s-vte-si-saket', 'Wat Si Saket', siSaket, 'The temple I lingered in for about ninety minutes.'),
        pick('n2s-vte-khop-chai', 'Khop Chai Deu', khopChai, 'A relaxed evening with Lao food and live music.'),
        pick('n2s-vte-barn', 'Barn1920s Hostel', barn1920, 'Clean, comfortable and cosy when I stayed.'),
        pick('n2s-vte-market', 'Vientiane Night Market', nightMarket ?? mekongWalk, 'For the city after dark.'),
      ],
      personalNotes: [
        margin('n2s-vte-200k', 'MY EVENING BILL', 'Around 200,000 kip at Khop Chai Deu when I went. A personal memory, not a price list.', { tone: 'butter', style: 'scribble' }),
        margin('n2s-vte-scooter', 'CITY TRANSPORT', 'I chose not to rent a scooter here. Walking suited my two days much better.', { placement: 'gallery-bottom-left-gap', tone: 'sage' }),
      ],
      media: [
        photo('n2s-vte-si-saket', siSaket, 'At Wat Si Saket'),
        photo('n2s-vte-khop-chai', khopChai, 'Khop Chai Deu', 'portrait'),
        photo('n2s-vte-market', nightMarket ?? mekongWalk, 'Evening along the Mekong'),
        cityPhoto('n2s-vte-city-temple', 'city-laos-vientiane', 0, 'Pha That Luang at sunrise'),
        cityPhoto('n2s-vte-city-saket', 'city-laos-vientiane', 1, 'Wat Si Saket courtyard'),
        cityPhoto('n2s-vte-city-patuxai', 'city-laos-vientiane', 2, 'The capital from Patuxai'),
        cityPhoto('n2s-vte-city-mekong', 'city-laos-vientiane', 3, 'The Mekong in Vientiane'),
        photo('n2s-vte-barn-gallery', barn1920, 'Barn1920s Hostel'),
      ],
      notebook: {
        id: 'n2s-vte-fieldbook',
        label: 'CITY NOTES',
        title: 'A capital in two days',
        intro: 'Two nights, a few good stops and no reason to rush.',
        pages: [
          {
            id: 'n2s-vte-book-temples',
            variant: 'memory',
            kicker: 'TEMPLE NOTE',
            title: 'Ninety minutes in one place',
            copy: 'Wat Si Saket made me pay attention to the way the temple was used, not just what it looked like. I appreciated the slight differences from what I was used to in Thailand.',
            handwrittenNote: 'Sometimes the atmosphere is the thing to remember.',
            noteTone: 'paper',
            media: [photo('n2s-vte-book-saket', siSaket, 'Details inside Wat Si Saket')],
          },
          {
            id: 'n2s-vte-book-evening',
            variant: 'atlas-picks',
            kicker: 'FOOD AND SLEEP',
            title: 'The useful addresses',
            copy: 'Khop Chai Deu for a sociable dinner and live music. Barn1920s for the cosy, clean bed I was pleased to return to.',
            references: [
              pick('n2s-vte-book-khop-chai', 'Khop Chai Deu', khopChai, 'The restaurant I remember.'),
              pick('n2s-vte-book-barn', 'Barn1920s Hostel', barn1920, 'The hostel I chose.'),
            ],
            handwrittenNote: 'Good food and a comfortable bed are still travel highlights.',
            noteTone: 'sky',
          },
        ],
      },
      transfer: {
        label: 'Vientiane → Pakse',
        note: "I travelled between these cities by overnight bus on my original trip, in the opposite direction. For this itinerary the same kind of night transfer keeps the following day available. Check the actual operator, departure point and arrival time before relying on a particular service.",
      },
    },
    {
      id: 'north-pakse',
      galleryStyle: 'photo-essay',
      chapterLabel: 'CHAPTER 04 · DAY 10',
      title: 'Pakse, the southern base',
      durationLabel: '1 day',
      intro: "Pakse is not a city I would try to conquer with a sightseeing list. For me it is a friendly base, the place to eat well, collect a scooter and begin the Bolaven Plateau at a sensible pace.",
      marginNote: 'The road starts tomorrow. Breakfast matters today.',
      body: [
        "I still remember my breakfast at La Boulange Garden. Proper French style bread after a long stretch away from European food can feel almost absurdly good. I also enjoyed Ita Lao, where I met a Lao pizza maker known as Sticky Rice, who had grown up in the United States. The pizza was excellent. These are small memories, perhaps, but they make Pakse feel like a place rather than just a transport junction.",
        "I rented my scooter through Miss Noy, where Yves was the person I dealt with. I would sort out the bike, check its condition, have the legal documents in order and save the Bolaven route offline before setting out. Pakse sits at the meeting of the Mekong and Sedone rivers and works as a gateway to the plateau, but the real travelling distances begin outside town.",
      ],
      highlights: ['Breakfast at La Boulange Garden', 'Pizza at Ita Lao', 'Collect the scooter from Miss Noy'],
      references: [
        pick('n2s-pakse-boulange', 'La Boulange Garden', boulange, 'French bread I genuinely looked forward to.'),
        pick('n2s-pakse-italao', 'Ita Lao', italao, 'Pizza and the meeting with Sticky Rice.'),
        pick('n2s-pakse-miss-noy', 'Miss Noy Motorbike Rental', missNoy, 'Where I rented my scooter through Yves.'),
      ],
      personalNotes: [
        margin('n2s-pakse-bread', 'BREAKFAST MEMORY', 'The bread was exceptional. After weeks in Asia I was not going to pretend otherwise.', { tone: 'butter', style: 'scribble' }),
      ],
      media: [
        photo('n2s-pakse-boulange', boulange, 'La Boulange Garden'),
        photo('n2s-pakse-italao', italao, 'Ita Lao in Pakse', 'portrait'),
        photo('n2s-pakse-miss-noy', missNoy, 'Scooter rental in Pakse'),
        cityPhoto('n2s-pakse-city-river', 'city-laos-pakse', 0, 'Pakse beside the Xe Don'),
        cityPhoto('n2s-pakse-city-plateau', 'city-laos-pakse', 2, 'Waterfall country east of Pakse'),
      ],
      transfer: {
        label: 'Pakse → Bolaven Plateau',
        note: 'Ride east towards the plateau with a flexible plan. The waterfalls and Tad Lo are worth an overnight stay, not just an ambitious day of detours.',
      },
    },
    {
      id: 'north-bolaven-loop',
      galleryStyle: 'photo-essay',
      chapterLabel: 'CHAPTER 05 · DAYS 11 TO 13',
      title: 'The Bolaven Loop',
      durationLabel: '3 days',
      variant: 'feature',
      intro: "This is where the route becomes a road trip. The scenery turns greener, waterfalls become regular reasons to pull over, and the small places along the plateau are every bit as important as the views.",
      marginNote: "I remember the lava cake. Rather vividly.",
      body: [
        "I spent one night at Bolaven Garden and gave an easy day to the area around Tad Lo. I visited Tad Lo Waterfall, went to a nearby Katu village and enjoyed the atmosphere of the surrounding countryside. I would keep that visit respectful and simple. A village is somebody's home before it is anybody's excursion.",
        "Fandee Island was where I really settled into the day. I enjoyed activities around the area, went for a swim and then found myself extremely pleased with a burger and chips. It had been a while since I had eaten that kind of food, and the meal was fantastic. The lava cake was even more memorable. If you had asked me later for one detail from that afternoon, I suspect the cake would have beaten several very beautiful views.",
        "I ended the evening peacefully in a hammock. That is not a gap in the itinerary. That is the point of having an itinerary that still leaves room to breathe. There are also organised adventure activities around Fandee Island for travellers who prefer ziplines and suspended bridges to doing absolutely nothing for an hour.",
        "The wider Bolaven Plateau has coffee country, waterfalls and very different stretches of road, so I would give it three days rather than treating it as a quick excursion from Pakse. My strongest memory is not a kilometre count or a perfect circuit. It is the combination of green landscapes, water, good food and a day that never seemed in a hurry.",
      ],
      highlights: ['Waterfalls and a slow walk around Tad Lo', 'Fandee Island, swimming and the lava cake', 'A night at Bolaven Garden with time to explore'],
      references: [
        pick('n2s-bolaven-tad-lo', 'Tad Lo Waterfall', tadLo, 'Part of a slow village and river day.'),
        pick('n2s-bolaven-tad-hang', 'Tad Hang Waterfall', tadHang, 'An easy second waterfall to combine with Tad Lo.'),
        pick('n2s-bolaven-fandee', 'Fandee Island', fandee, 'My very relaxed food and swimming stop.'),
        pick('n2s-bolaven-garden', 'Bolaven Garden', bolavenGarden, 'Where I spent the night.'),
        pick('n2s-bolaven-walk', 'Tad Lo Riverside and Village Walk', tadLoWalk, 'A way to enjoy the village without rushing.'),
      ],
      personalNotes: [
        margin('n2s-bolaven-cake', 'THE LAVA CAKE', 'A proper chocolate lava cake, plus a burger and chips. I can still remember both.', { tone: 'rose', style: 'scribble', size: 'large' }),
        margin('n2s-bolaven-hammock', 'AFTERNOON LOG', 'A swim. A hammock. Very little ambition. Perfect.', { placement: 'gallery-top-right-gap', tone: 'sage', size: 'small' }),
      ],
      media: [
        photo('n2s-bolaven-tad-lo', tadLo, 'Tad Lo Waterfall'),
        photo('n2s-bolaven-fandee', fandee, 'Fandee Island', 'portrait'),
        photo('n2s-bolaven-garden', bolavenGarden, 'Bolaven Garden'),
        cityPhoto('n2s-bolaven-tad-hang-evening', 'city-tad-lo', 0, 'Tad Hang at sunset'),
        cityPhoto('n2s-bolaven-village', 'city-tad-lo', 1, 'Tad Lo village landscape'),
        cityPhoto('n2s-bolaven-waterfall', 'city-tad-lo', 2, 'Tad Lo waterfall on the plateau'),
        cityPhoto('n2s-bolaven-footbridge', 'city-tad-lo', 3, 'River and footbridge at Tad Lo'),
        photo('n2s-bolaven-adventure', fandeePark, 'Activities at Fandee Island'),
      ],
      notebook: {
        id: 'n2s-bolaven-fieldbook',
        label: 'OPEN THE ROAD BOOK',
        title: 'The Bolaven days',
        intro: 'Waterfalls, Katu village life, and a very good reason to stop at Fandee Island.',
        pages: [
          {
            id: 'n2s-bolaven-book-tad-lo',
            variant: 'scrapbook',
            kicker: 'WATERFALL PAGE',
            title: 'Tad Lo without a stopwatch',
            copy: "I visited Tad Lo Waterfall and the area around the village, then a nearby Katu village. I liked the slower pace here. Rather than treating every waterfall as an individual appointment, I'd allow the paths and village to form one relaxed day.",
            handwrittenNote: 'Stay long enough to notice where you are.',
            noteTone: 'sage',
            media: [photo('n2s-bolaven-book-tad-hang', tadHang, 'Tad Hang Waterfall')],
            references: [pick('n2s-bolaven-book-tad-lo-link', 'Tad Lo Waterfall', tadLo, 'The full Atlas note for the waterfall.')],
          },
          {
            id: 'n2s-bolaven-book-fandee',
            variant: 'photo',
            kicker: 'FOOD MEMORY',
            title: 'A burger and an excellent lava cake',
            copy: "I spent most of this day around Fandee Island. I swam, relaxed and had a burger with chips that felt wonderful after so much time away from European style food. The chocolate lava cake is the detail that never really left my memory.",
            handwrittenNote: 'Give me an afternoon like this and I am happy.',
            noteTone: 'butter',
            media: [photo('n2s-bolaven-book-fandee', fandee, 'Fandee Island')],
            references: [pick('n2s-bolaven-book-fandee-link', 'Fandee Island', fandee, 'The address from my afternoon.')],
          },
          {
            id: 'n2s-bolaven-book-garden',
            variant: 'memory',
            kicker: 'OVERNIGHT',
            title: 'One night off the main road',
            copy: 'I slept at Bolaven Garden. Staying out on the plateau gave the loop an entirely different rhythm from riding every road as an excursion from Pakse.',
            handwrittenNote: 'There is no prize for returning to the city before dark.',
            noteTone: 'sky',
            media: [photo('n2s-bolaven-book-garden', bolavenGarden, 'Bolaven Garden stay')],
            references: [pick('n2s-bolaven-book-garden-link', 'Bolaven Garden', bolavenGarden, 'The place where I stayed.')],
          },
          {
            id: 'n2s-bolaven-book-activities',
            variant: 'atlas-picks',
            kicker: 'IF YOU WANT MORE ACTION',
            title: 'Fandee is not only for hammocks',
            copy: "For a more active afternoon, the Atlas also documents Fandee's guided adventure course. That is an option, not something I need to pretend I completed.",
            handwrittenNote: 'Choose your level of ambition.',
            noteTone: 'paper',
            references: [pick('n2s-bolaven-book-fandee-park', 'Fandee Adventure Park', fandeePark, 'Ziplines and suspended bridges on the documented course.')],
            media: [photo('n2s-bolaven-book-fandee-park-photo', fandeePark, 'Fandee Adventure Park')],
          },
        ],
      },
      transfer: {
        label: 'Bolaven Plateau → Pakse',
        note: 'Close the loop back in Pakse. Returning the scooter and keeping one final night in the city makes the departure towards Thailand much more comfortable.',
      },
    },
    {
      id: 'north-pakse-return',
      galleryStyle: 'photo-essay',
      chapterLabel: 'CHAPTER 06 · DAY 14',
      title: 'One last night in Pakse',
      durationLabel: '1 day',
      intro: "Coming back to Pakse after the plateau felt pleasantly familiar. I returned the scooter, settled in for the night and made time for Wat Phou Salao on the hill above the city.",
      body: [
        "The golden Buddha is the landmark you can recognise from a distance. From up there, though, the pleasure is also looking out over the Mekong and Pakse itself. It makes a satisfying final stop after several days on the road.",
        "I wouldn't fill this day with another long excursion. Eat somewhere you enjoyed, deal with the scooter return and leave yourself a quiet evening. Pakse is good at being a comfortable base, and I think that is a compliment.",
      ],
      highlights: ['Return the scooter', 'Wat Phou Salao and the view across Pakse', 'A relaxed final meal'],
      references: [
        pick('n2s-pakse-return-salao', 'Wat Phou Salao', phouSalao, 'The golden Buddha overlooking the city.'),
        pick('n2s-pakse-return-rental', 'Miss Noy Motorbike Rental', missNoy, 'Return the scooter before leaving town.'),
      ],
      personalNotes: [
        margin('n2s-pakse-return-note', 'FINAL CITY MOMENT', 'A view over the city, then an easy evening. No heroic scheduling required.', { tone: 'sage' }),
      ],
      media: [
        photo('n2s-pakse-return-salao', phouSalao, 'Wat Phou Salao and Pakse'),
        photo('n2s-pakse-return-city', boulange, 'A familiar Pakse address', 'portrait'),
        cityPhoto('n2s-pakse-return-golden-buddha', 'city-laos-pakse', 1, 'The golden Buddha above Pakse'),
        photo('n2s-pakse-return-missnoy', missNoy, 'Back to Miss Noy to return the scooter'),
      ],
      transfer: {
        label: 'Pakse → Vang Tao → Chong Mek',
        note: "The final border day runs west from Pakse to the Lao exit at Vang Tao and the Thai entry at Chong Mek. Check border opening times, entry conditions and onward transport before leaving.",
      },
    },
    {
      id: 'north-border',
      galleryStyle: 'photo-essay',
      chapterLabel: 'FINAL DAY · DAY 15',
      title: 'Across the border',
      durationLabel: '1 day',
      variant: 'epilogue',
      intro: "For this north to south route, I would leave Laos through Vang Tao and Chong Mek, returning to Thailand. It's the reverse of the direction in which I first entered Laos, and a neat way of ending the journey without retracing the entire country.",
      body: [
        "The important thing is to plan the border transfer rather than assuming the last few kilometres will arrange themselves. Check the requirements that apply to your passport, your chosen crossing and your onward journey in Thailand.",
        "Fifteen days are enough to see how different one part of Laos can feel from another: the heritage town in the north, the friendly disorder of Vang Vieng, the quiet capital and the greenery around the Bolaven Plateau. What I remember most vividly, though, is often much smaller. A welcoming guesthouse owner. An evening of live music. A good breakfast. A hammock. And yes, that cake.",
      ],
      personalNotes: [
        margin('n2s-border-note', 'LAST PAGE', "I wouldn't add another stop just to fill the final day. Let the journey end properly.", { tone: 'paper', style: 'scribble' }),
      ],
      // The border day stays text led rather than stretching an unrelated photo.
    },
  ],
  closingTitle: 'Keep the route. Change the rhythm.',
  closingCopy: "Fifteen days is a way of crossing Laos, not a reason to race through it. Open the Atlas cards for the addresses and practical details, keep the places that speak to you, and leave an afternoon free when you can. The best memories do not always come from the busiest days.",
};
