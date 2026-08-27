import type {
  AtlasRouteContent,
  AtlasRouteMedia,
  AtlasRouteMediaAspect,
  AtlasRoutePersonalNote,
  AtlasRoutePersonalNotePlacement,
} from './atlas-route-content';

const placeholder = (
  id: string,
  label: string,
  aspect: AtlasRouteMediaAspect = 'landscape',
): AtlasRouteMedia => ({
  id,
  alt: `${label} photo placeholder`,
  label,
  aspect,
});

const personalNote = (
  id: string,
  label: string,
  text: string,
  placement: AtlasRoutePersonalNotePlacement = 'story',
): AtlasRoutePersonalNote => ({ id, label, text, placement });

const southToNorthEditorial: AtlasRouteContent = {
  country: 'laos',
  slug: 'south-to-north',
  label: 'South → North',
  eyebrow: 'ATLAS ROUTE',
  title: 'Laos South to North — 30 Days',
  subtitle:
    'A month through Mekong islands, southern road loops, limestone country and northern Laos — with enough room to stay when a place deserves another day.',
  durationLabel: 'About 30 days',
  directionLabel: 'Cambodia → Thailand',
  intro: [
    'This is the Laos route I would build for roughly one month when entering from Cambodia and travelling north. It begins slowly on Don Det, uses Pakse as the hinge into the Bolaven Plateau, crosses central Laos through Thakhek, pauses in Vientiane, climbs into the limestone landscape of Vang Vieng and finishes with enough time in Luang Prabang before leaving the country by slow boat toward the Thai border.',
    'It is a route proposal, not a rigid day-by-day programme. The named stops account for most of the month, while the remaining time belongs to transfers, a return night in Pakse, weather, tired mornings and the places that make you change your plan. That breathing room is part of the itinerary, not time that still needs to be filled.',
  ],
  heroMedia: [
    placeholder('hero-01', 'Mekong arrival in Don Det', 'portrait'),
    placeholder('hero-02', 'Bolaven Plateau road and landscape'),
    placeholder('hero-03', 'Vang Vieng limestone landscape', 'square'),
    placeholder('hero-04', 'Luang Prabang and the Mekong'),
  ],
  stops: [
    { label: 'Don Det', durationLabel: '4 days', chapterId: 'don-det' },
    { label: 'Pakse', durationLabel: '2 days + return night', chapterId: 'pakse' },
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
      intro:
        'Crossing in from Cambodia, I would not start Laos by rushing north. Don Det is where I would let the journey slow down first: four days for the islands, the river and the feeling that the Atlas has actually begun.',
      body: [
        'Keep one full day for a bicycle across Don Det and Don Khon, another for the Mekong — kayaking, a swim stop or whatever water activity fits the conditions — and resist the temptation to fill every remaining hour. The island works because breakfast can run long, a ride can stop for no reason and sunset can become the plan.',
        'Four days may look generous on a map, but that is exactly the point. After a border crossing, this is a soft landing into Laos rather than a checklist stop. If you want more waterfalls, boats or activities, the Atlas cards can take you deeper; the route itself only needs to protect the island rhythm.',
      ],
      highlights: ['Cycle Don Det & Don Khon', 'Kayak or spend time on the Mekong', 'Keep one slow island day'],
      personalNotes: [
        personalNote(
          'don-det-personal-01',
          'ATLAS STARTS HERE',
          'I like Don Det as the first page because it forces the trip to slow down before it has even really started.',
        ),
        personalNote(
          'don-det-personal-02',
          'QUICK MEMORY',
          'Leave one afternoon empty. On these islands, doing less is often the part you remember.',
          'gallery-top-right-gap',
        ),
      ],
      media: [
        placeholder('don-det-01', 'Don Det bicycle and island tracks'),
        placeholder('don-det-02', 'Mekong water day from Don Det', 'portrait'),
      ],
      notebook: {
        id: 'don-det-notes',
        label: 'FIELD NOTES',
        title: 'A few pages from Don Det',
        intro:
          'Open this only if you want the island to become more than the first pin on the route.',
        pages: [
          {
            id: 'don-det-note-01',
            kicker: 'PAGE 01',
            title: 'The bicycle day',
            copy:
              'Take the bicycle beyond the busy arrival side and let Don Det and Don Khon become one long, easy island chapter. The point is not speed; it is being able to stop whenever the river, a bridge or a quiet track looks better than the next planned pin.',
            handwrittenNote: 'No stopwatch today. Just ride until something makes you stop.',
            media: [placeholder('don-det-note-media-01', 'Bicycle on Don Det or Don Khon')],
          },
          {
            id: 'don-det-note-02',
            kicker: 'PAGE 02',
            title: 'A day on the water',
            copy:
              'Use another day for the Mekong: kayaking, a boat or a swimming stop chosen for the conditions. It changes the scale of Si Phan Don completely — the islands stop being places on a map and become pieces of one huge river landscape.',
            handwrittenNote: 'The river is the activity and the road at the same time.',
            media: [placeholder('don-det-note-media-02', 'Kayaking or swimming around Don Det', 'square')],
          },
        ],
      },
      transfer: {
        label: 'On the road · Don Det → Pakse',
        note:
          'Leave the islands with margin for the boat and mainland handover. Pakse is the next base, not a connection worth racing toward.',
      },
    },
    {
      id: 'pakse',
      chapterLabel: 'Chapter 02',
      title: 'Pakse',
      durationLabel: '2 days + return night',
      intro:
        'Pakse is the hinge of this southern route. I would keep the city itself light, use one day for Vat Phou, leave another window for training at Naga Muay Lao Boxing Gym, then come back through Pakse after the Bolaven Loop before continuing north.',
      body: [
        'The useful thing about Pakse is not a giant urban checklist. It is how cleanly the city opens different directions: Champasak and Vat Phou to the south, the Bolaven Plateau to the east, and the long road north. Give those directions their own time instead of trying to compress them into one sightseeing day.',
        'This route also allows Pakse to reappear naturally. After the loop, sleep here again before the next long transfer. A base is doing its job when returning to it removes friction rather than feeling like backtracking.',
      ],
      highlights: ['Vat Phou day', 'Muay Thai at Naga Gym', 'Breakfast and a slow Pakse morning'],
      personalNotes: [
        personalNote(
          'pakse-personal-01',
          'DON’T FORGET',
          'La Boulange Garden is one of the breakfasts I still think about. I once stayed an extra day in Pakse largely because I wanted another breakfast there.',
        ),
      ],
      media: [
        placeholder('pakse-01', 'Pakse Mekong city morning'),
        placeholder('pakse-02', 'Vat Phou or Pakse training day'),
      ],
      transfer: {
        label: 'On the road · Pakse → Bolaven Loop',
        note:
          'Sort the scooter, cash, fuel and offline map in Pakse, then let the plateau become a separate chapter rather than a day trip squeezed around the city.',
      },
    },
    {
      id: 'bolaven-loop',
      chapterLabel: 'Chapter 03',
      title: 'The Bolaven Loop',
      durationLabel: '4 days',
      intro:
        'This is the section I would refuse to rush. Four days on the Bolaven Loop are not four days spent collecting waterfalls; they are four days where the road, the forest, the guesthouses, the coffee and the people you meet become as important as the famous stops.',
      body: [
        'I would build the loop around slow overnight stops rather than mileage: enough time around Fandee Island and Tad Lo to actually settle in, a stop at Samaki for the easy traveller atmosphere, time with Mr Hook for coffee and local perspectives, and room for the Tad Lo treasure hunt to thread through the village and viewpoints instead of becoming another task to finish.',
        'The landscape is the continuity between all of it. Roads climb through coffee country, forest opens into viewpoints, waterfalls appear between ordinary villages and the best moments often happen because you stopped earlier than planned. Four days are useful because they let that happen without turning every detour into a scheduling problem.',
      ],
      highlights: ['Fandee Island & Tad Lo', 'Mr Hook coffee experience', 'Treasure hunt, waterfalls & road landscapes'],
      personalNotes: [
        personalNote(
          'bolaven-personal-01',
          'ROAD NOTE',
          'Do not ride this loop like a race between waterfalls. Half of the Bolaven is everything that happens between the pins.',
        ),
        personalNote(
          'bolaven-personal-02',
          'REMEMBER THIS',
          'Give the plateau enough time for the unplanned stops. Those are usually the stories that survive the itinerary.',
          'gallery-bottom-left-gap',
        ),
      ],
      media: [
        placeholder('bolaven-01', 'Bolaven road through forest and coffee country'),
        placeholder('bolaven-02', 'Fandee Island or Tad Lo slow stay', 'portrait'),
        placeholder('bolaven-03', 'Bolaven waterfall or wide plateau viewpoint'),
      ],
      notebook: {
        id: 'bolaven-notes',
        label: 'OPEN THE ROAD BOOK',
        title: 'Inside the Bolaven Loop',
        intro:
          'These are the details I would hide behind the main route: the places and small moments that explain why the loop deserves several days.',
        pages: [
          {
            id: 'bolaven-note-01',
            kicker: 'PAGE 01',
            title: 'Fandee Island',
            copy:
              'Stay long enough for Fandee Island to become more than a bed. Use the lake, take a pedal boat, play pétanque, wander around Tad Lo and let the evening arrive without needing a second destination.',
            handwrittenNote: 'They are way too good at pétanque here.',
            media: [placeholder('bolaven-note-media-01', 'Fandee Island lake, pétanque or pedal boat')],
          },
          {
            id: 'bolaven-note-02',
            kicker: 'PAGE 02',
            title: 'Samaki and the traveller pause',
            copy:
              'A simple guesthouse stop can become part of the trip when nobody is trying to leave immediately. Sit down, order a fruit juice, talk about where everyone has come from and where they are going next. The loop needs places where the scooter is parked for a while.',
            handwrittenNote: 'One fruit juice can turn into an afternoon of travel stories.',
            media: [placeholder('bolaven-note-media-02', 'Samaki Guesthouse and Tad Lo traveller atmosphere', 'portrait')],
          },
          {
            id: 'bolaven-note-03',
            kicker: 'PAGE 03',
            title: 'Coffee with Mr Hook',
            copy:
              'Make room for the coffee and cultural experience with Mr Hook instead of fitting it between two waterfalls. It works because it changes the rhythm: you stop travelling through the plateau for a moment and start listening to someone explain the place from inside it.',
            handwrittenNote: 'Don’t rush the coffee.',
            media: [placeholder('bolaven-note-media-03', 'Mr Hook coffee and village experience')],
          },
          {
            id: 'bolaven-note-04',
            kicker: 'PAGE 04',
            title: 'Follow the clues, not the clock',
            copy:
              'Let the Tad Lo treasure hunt stretch across the stay if it wants to. The clues give you a reason to notice paths, viewpoints and pieces of village life that are easy to ride past when the only objective is the next waterfall.',
            handwrittenNote: 'The best part is everything you notice between the clues.',
            media: [placeholder('bolaven-note-media-04', 'Tad Lo treasure hunt, paths and viewpoints', 'square')],
          },
        ],
      },
      transfer: {
        label: 'On the road · Bolaven Loop → Pakse → Thakhek',
        note:
          'Close the loop back in Pakse. I would keep one recovery night there before taking the long northbound transfer to Thakhek rather than stacking the ride and the bus into the same exhausted day.',
      },
      variant: 'feature',
    },
    {
      id: 'thakhek',
      chapterLabel: 'Chapter 04',
      title: 'Thakhek',
      durationLabel: '3 days',
      intro:
        'Thakhek changes the scenery completely. After the plateau, three days here give you a Mekong town, a scooter key and enough time to push east into the limestone and cave country without pretending you are completing the entire classic Loop.',
      body: [
        'Use the town as the base, rent the scooter carefully and give Route 12 its own day. Caves, Tha Falang and the karst landscape are stronger when the road itself is part of the experience instead of a commute between attractions. A second riding day can go deeper or stay flexible depending on weather and how much time you actually want underground.',
        'I would keep the final evening easy: bring the scooter back, walk the old centre or Mekong edge and reset before the next long movement. Thakhek is one of those places where preparation and return are part of the chapter, not dead time around the activity.',
      ],
      highlights: ['Route 12 cave country', 'Tha Falang', 'Scooter days from Thakhek'],
      personalNotes: [
        personalNote(
          'thakhek-personal-01',
          'SCOOTER KEY',
          'Thakhek makes more sense once you have the scooter key in your pocket — but give the bike a real check before the limestone road begins.',
        ),
      ],
      media: [
        placeholder('thakhek-01', 'Thakhek Route 12 limestone and scooter road'),
        placeholder('thakhek-02', 'Thakhek cave or Tha Falang landscape'),
      ],
      transfer: {
        label: 'Choice on the road · Thakhek → Vientiane',
        note:
          'The direct overland option is the cheaper, simpler line on the map. Personally, I chose comfort over avoiding a detour: I went back to Pakse and flew to Vientiane rather than spending a long night on a bus. Treat that as a choice, not a rule, and recheck current flight and bus schedules before travelling.',
      },
    },
    {
      id: 'vientiane',
      chapterLabel: 'Chapter 05',
      title: 'Vientiane',
      durationLabel: '2 days',
      intro:
        'I would not turn Vientiane into another heavy sightseeing chapter. After southern Laos and Thakhek, two days in the capital work better as a reset: walk, eat well, find a good breakfast and let the pace flatten out before the mountains return.',
      body: [
        'Keep the city loose. Choose a few places from the Atlas if they genuinely interest you, but protect the ordinary parts of the stop too — a long meal, a café, a Mekong evening, a morning without a scooter or a departure alarm. Not every destination has to compete for the title of most spectacular place on the route.',
        'That lighter rhythm is useful because Vang Vieng is next. Leave Vientiane rested enough that the outdoor days ahead still feel exciting rather than like the next obligation.',
      ],
      highlights: ['Walk the city slowly', 'Restaurants & breakfast', 'Mekong evening and reset'],
      personalNotes: [
        personalNote(
          'vientiane-personal-01',
          'CITY NOTE',
          'For me, Vientiane works as a pause between bigger chapters. Two easy days are enough when the point is to reset, not to complete a list.',
        ),
      ],
      media: [
        placeholder('vientiane-01', 'Vientiane street, café or breakfast morning'),
        placeholder('vientiane-02', 'Vientiane Mekong evening', 'portrait'),
      ],
      transfer: {
        label: 'On the road · Vientiane → Vang Vieng',
        note:
          'Keep this transfer uncomplicated and arrive with enough daylight to settle in. Train and road options can change, so check the current departure rather than building the route around an old timetable.',
      },
    },
    {
      id: 'vang-vieng',
      chapterLabel: 'Chapter 06',
      title: 'Vang Vieng',
      durationLabel: '3 days',
      intro:
        'Vang Vieng is where the route becomes playful again. Three days are enough for a strong mix of sky, river and limestone without trying to collect every cave, lagoon and viewpoint around town.',
      body: [
        'I would protect one morning for a hot-air balloon, one afternoon for tubing on the Nam Song and keep the remaining full day for the karst landscape — a viewpoint, cave or other activity chosen from the Atlas according to the weather and your energy. The centre is only the base; the mountains and river are the real scale of the stop.',
        'Vang Vieng is also one of the easiest places on this route to meet other travellers. Leave the evening socially open. Someone you met on the river can become dinner, and dinner can become the story you remember more clearly than the activity that introduced you.',
      ],
      highlights: ['Hot-air balloon', 'Tubing on the Nam Song', 'Karst day & social evening'],
      personalNotes: [
        personalNote(
          'vang-vieng-personal-01',
          'CITY NOTE',
          'Leave one morning for the sky and one afternoon for the river. The rest can follow the conditions.',
          'gallery-top-right-gap',
        ),
        personalNote(
          'vang-vieng-personal-02',
          'NIGHT NOTE',
          'Vang Vieng is one of those places where dinner can turn into a night with people you met that afternoon.',
          'gallery-image-1-overlap',
        ),
      ],
      media: [
        placeholder('vang-vieng-01', 'Vang Vieng hot-air balloon and karst'),
        placeholder('vang-vieng-02', 'Nam Song tubing or river afternoon'),
      ],
      transfer: {
        label: 'On the road · Vang Vieng → Luang Prabang',
        note:
          'This is a natural rail connection in the shape of the route, but keep the exact train and station transfer current. Luang Prabang deserves an arrival that is not immediately buried under the next activity.',
      },
    },
    {
      id: 'luang-prabang',
      chapterLabel: 'Chapter 07',
      title: 'Luang Prabang',
      durationLabel: '6 days',
      intro:
        'This is where I would spend the largest block of the month. Luang Prabang can absorb six days without becoming repetitive because the old town, the Mekong, the waterfalls and the slower northern rhythm are different experiences rather than one attraction list.',
      body: [
        'Give the old town unbroken time first. Walk it, come back through the same streets at different hours, sit by the rivers and let the temples, markets and cafés become part of the daily rhythm. Then give Kuang Si its own day instead of squeezing it into a half-day between city sights. Add one hike or another Atlas activity, but keep at least one day loose enough to repeat something you loved.',
        'That last point matters here. A month-long route should have enough flexibility to go back to the same waterfall, café or street simply because the first time was not enough. Luang Prabang is the place where I would spend that extra margin before the final river journey out of Laos.',
      ],
      highlights: ['Kuang Si Waterfall', 'Old town & Mekong', 'One extra day with no pressure'],
      personalNotes: [
        personalNote(
          'luang-prabang-personal-01',
          'WORTH IT',
          'Kuang Si is still the most beautiful waterfall I have seen. I paid to go back a second time, and I would do it again.',
        ),
        personalNote(
          'luang-prabang-personal-02',
          'ONE MORE THING',
          'If a place makes you want to return the next day, return. That is exactly why this route has breathing room.',
          'gallery-bottom-left-gap',
        ),
      ],
      media: [
        placeholder('luang-prabang-01', 'Kuang Si turquoise pools and waterfall'),
        placeholder('luang-prabang-02', 'Luang Prabang old town and temple rhythm', 'portrait'),
        placeholder('luang-prabang-03', 'Mekong, walk or slow Luang Prabang day'),
      ],
      transfer: {
        label: 'Leaving Laos · Luang Prabang → Pakbeng → Houayxay',
        note:
          'Do not treat the exit as dead transport time. The slow boat north takes two days with an overnight in Pakbeng before continuing toward Houayxay and the Thai border. Confirm the current pier and departure locally before you go.',
      },
    },
    {
      id: 'slow-boat',
      chapterLabel: 'Epilogue',
      title: 'Two days on the Mekong',
      durationLabel: '2 days',
      intro:
        'The route finishes without a final attraction. For two days, the Mekong becomes the itinerary: long bends of river, forested banks, villages, boats passing in the opposite direction and an overnight in Pakbeng before the final run toward Houayxay.',
      body: [
        'This is a good way to leave Laos because the country does not disappear at airport speed. You watch it stretch out for hours instead. Bring patience, something to read, water and a seat you are happy to keep for a while; the point is the landscape moving past you, not arriving as quickly as possible.',
        'From Houayxay, the route can cross toward Thailand. Exact border, pier and transport procedures can change, so keep the final practical details current. Editorially, though, the idea stays the same: let the Atlas end slowly on the same river system that shaped so much of the month.',
      ],
      highlights: ['Luang Prabang → Pakbeng', 'Pakbeng → Houayxay', 'Mekong landscapes to the Thai border'],
      personalNotes: [
        personalNote(
          'slow-boat-personal-01',
          'LAST NOTE',
          'The visa clock may be ending, but this is not dead transport time. Let Laos fade out slowly.',
        ),
      ],
      media: [
        placeholder('slow-boat-01', 'Slow boat on the Mekong toward Pakbeng'),
        placeholder('slow-boat-02', 'Mekong landscapes toward Houayxay'),
      ],
      variant: 'epilogue',
    },
  ],
  closingTitle: 'Make this route yours',
  closingCopy:
    'Keep the direction, change the pace, remove the chapters that do not fit and save the places that do. The route is only useful once it becomes your Atlas.',
};

const editorialRoutes: AtlasRouteContent[] = [southToNorthEditorial];

export const getAtlasRouteEditorialContent = (
  country: string,
  slug: string,
): AtlasRouteContent | undefined =>
  editorialRoutes.find(
    (route) =>
      route.country === country.toLowerCase() &&
      route.slug === slug.toLowerCase(),
  );
