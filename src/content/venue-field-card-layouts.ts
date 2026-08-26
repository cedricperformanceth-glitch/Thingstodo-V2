import type {
  FieldCardBeforeYouLeaveContent,
  FieldCardHeroContent,
  FieldCardPracticalContent,
  FieldCardQuickReadContent,
  FieldCardStoryNote,
} from '../core/models/types';

export interface VenueFieldCardLayoutProfile {
  heroDescription: string;
  hero: Omit<FieldCardHeroContent, 'description'>;
  primaryNote: FieldCardStoryNote;
  quickRead: FieldCardQuickReadContent;
  practicalNotes: FieldCardPracticalContent;
  chapterLabels: string[];
  beforeYouLeave?: FieldCardBeforeYouLeaveContent;
  beforeYouLeaveNote?: FieldCardStoryNote;
}

export const venueFieldCardLayouts: Readonly<Record<string, VenueFieldCardLayoutProfile>> = {
  'place-sabai-ca-baille-guesthouse': {
    heroDescription: 'Sabai ça Baille is the Pakse guesthouse I return to for simple reasons: Pierre and Benoît keep it exceptionally clean, the rooms are comfortable, Wi-Fi is strong, and Street 24 stays quiet while the centre remains only a few steps away.',
    hero: {
      eyebrow: 'PERSONAL STAY · PAKSE',
      aliases: ['Quiet side street', 'Private rooms', 'Local hosts'],
      steps: ['Meet Pierre and Benoît', 'Settle into a clean cool room', 'Walk into central Pakse', 'Keep breakfast plans flexible'],
      rhythmNote: 'For me, the combination of cleanliness, calm and location makes this one of Pakse’s strongest-value stays.',
      photoNote: 'Personal photos to add · Street 24',
    },
    primaryNote: {
      label: 'GOOD BASE',
      text: 'Quiet street, clean room, strong Wi-Fi and central access are the combination I value here.',
    },
    quickRead: {
      time: { primary: '1+ NIGHTS', secondary: 'an easy central base' },
      route: { primary: 'STREET 24', secondary: 'quiet side street · central Pakse' },
      budget: { primary: 'STRONG VALUE', secondary: 'one of my best-value picks in town' },
      bestFor: { primary: 'QUIET PRIVATE STAY', secondary: 'clean rooms · local advice · central access' },
    },
    practicalNotes: {
      items: [
        { label: 'Room', value: 'Private · air-conditioned', detail: 'I stayed in a room with a large, very comfortable bed.' },
        { label: 'Wi-Fi', value: 'Very good', detail: 'The connection was strong and reliable when I used it.' },
        { label: 'Location', value: 'Central but quiet', detail: 'The main road is only a very short walk away, without its constant traffic.' },
        { label: 'Scooter security', value: 'Gate + night guard', detail: 'The access gate closes at night and scooters stay inside.' },
        { label: 'Breakfast', value: 'Check the current menu', detail: 'The waffles I liked were served last year; I do not assume the same breakfast this season.' },
      ],
    },
    chapterLabels: ['THE HOSTS', 'THE ROOM', 'THE LOCATION', 'AT NIGHT', 'THE DETAILS'],
    beforeYouLeaveNote: {
      label: 'BREAKFAST NOTE',
      text: 'I loved last year’s waffles; the exact breakfast can change from season to season.',
    },
  },

  'place-sanga-hostel': {
    heroDescription: 'I know Sanga through its owner, regular visits and the guests I meet there rather than from sleeping in a dorm myself. What stands out is an unusually clean, organized hostel backed by a woman who can solve almost any practical travel problem.',
    hero: {
      eyebrow: 'PERSONAL NOTE · PAKSE',
      aliases: ['Central hostel', 'Spotless dorms', 'Hands-on owner'],
      steps: ['Meet the person behind Sanga', 'See the dorm standard', 'Use the central location', 'Remember the laundry service'],
      rhythmNote: 'I have not slept in the dorm myself; my view comes from repeated time here and direct contact with its guests.',
      photoNote: 'Personal photos to add · central Pakse',
    },
    primaryNote: {
      label: 'MY PERSPECTIVE',
      text: 'I know Sanga through repeated visits and its guests, not from sleeping in the dorm.',
    },
    quickRead: {
      time: { primary: '1+ NIGHTS', secondary: 'easy backpacker base' },
      route: { primary: 'CENTRAL PAKSE', secondary: 'market · services · transport close by' },
      budget: { primary: 'EXCELLENT VALUE', secondary: 'a remarkably polished dorm for the price' },
      bestFor: { primary: 'YOUNGER TRAVELLERS', secondary: 'clean dorms · practical help · central location' },
    },
    practicalNotes: {
      items: [
        { label: 'Stay style', value: 'Dormitory hostel', detail: 'A younger, international crowd and a large number of beds.' },
        { label: 'Cleanliness', value: 'Exceptional', detail: 'This is the standard I notice most consistently when I am there.' },
        { label: 'Wi-Fi', value: 'Excellent', detail: 'A strong practical point for a budget hostel.' },
        { label: 'Late arrival', value: 'Night access available', detail: 'There is a night guard and late check-in can be handled when needed.' },
        { label: 'Laundry', value: 'Professional service', detail: 'Cold wash, hot wash and ironing are handled through the owner’s own laundry operation.' },
        { label: 'Food', value: 'Restaurant inside', detail: 'The cooler indoor restaurant is much more comfortable than the street tables at midday.' },
      ],
    },
    chapterLabels: ['THE OWNER', 'THE DORMS', 'THE STREET', 'INSIDE SANGA', 'LAUNDRY'],
    beforeYouLeaveNote: {
      label: 'MY PERSPECTIVE',
      text: 'I know Sanga through repeated visits and its guests, not from sleeping in the dorm.',
    },
  },

  'place-sanga-rooftop-hostel': {
    heroDescription: 'Sanga Rooftop is the newer sister to the original Sanga, only a short walk away in central Pakse. The basics already feel polished, while the rooftop restaurant and bar give this first-season hostel a more open social identity.',
    hero: {
      eyebrow: 'PERSONAL NOTE · PAKSE',
      aliases: ['New Sanga hostel', 'Rooftop bar', 'Central dorms'],
      steps: ['Understand the Sanga connection', 'Check the new dorm setup', 'Use the rooftop', 'See how the first season develops'],
      rhythmNote: 'This is the first season, so I am deliberately leaving room for the atmosphere to find its long-term rhythm.',
      photoNote: 'Personal photos to add · central Pakse',
    },
    primaryNote: {
      label: 'FIRST SEASON',
      text: 'The building is ready; the long-term hostel atmosphere is still taking shape.',
    },
    quickRead: {
      time: { primary: '1+ NIGHTS', secondary: 'new hostel in its first season' },
      route: { primary: 'CENTRAL PAKSE', secondary: 'roughly one street from the original Sanga' },
      budget: { primary: 'HOSTEL STAY', secondary: 'dorm format with a newer rooftop setup' },
      bestFor: { primary: 'SOCIAL CITY BASE', secondary: 'new beds · rooftop · central access' },
    },
    practicalNotes: {
      items: [
        { label: 'Status', value: 'First season', detail: 'The building is new and I am still watching how the atmosphere develops.' },
        { label: 'Stay style', value: 'Dormitory hostel', detail: 'The beds are very good and the setup still feels new.' },
        { label: 'Wi-Fi', value: 'Excellent', detail: 'The connection is one of the practical basics already working well.' },
        { label: 'Rooftop', value: 'Restaurant + bar', detail: 'A separate social space above the dormitory areas.' },
        { label: 'Late access', value: 'Night guard', detail: 'Late access can be handled when necessary.' },
      ],
    },
    chapterLabels: ['THE SECOND SANGA', 'THE BASICS', 'THE ROOFTOP', 'THE LOCATION'],
    beforeYouLeave: {
      title: 'Give the first season time to define the place',
      body: 'The structure and service are already there, but I would not pretend to know yet what the hostel will feel like in every month of the year. For now, I see a very new central hostel with good basics and a rooftop that gives it a different identity from the original Sanga.',
      note: {
        label: 'FIRST SEASON',
        text: 'The building is ready; the long-term hostel atmosphere is still taking shape.',
      },
    },
  },

  'place-bolaven-trail-guesthouse': {
    heroDescription: 'Bolaven Trail is a small, quiet private-room guesthouse on Street 24. The rooms are clean and comfortable, but the distinctive reason to remember it is Xavier: his trail-bike rental business gives him a different kind of knowledge of the routes around Pakse.',
    hero: {
      eyebrow: 'PERSONAL STAY · PAKSE',
      aliases: ['Private rooms', 'Trail motorbikes', 'Quiet Street 24'],
      steps: ['Talk routes with Xavier', 'Choose the right bike', 'Come back to a quiet room', 'Park inside the night gate'],
      rhythmNote: 'The rooms do the basics well; Xavier’s knowledge of trail bikes and rougher routes is what makes the address distinctive.',
      photoNote: 'Personal photos to add · Street 24',
    },
    primaryNote: {
      label: 'BIKE ANGLE',
      text: 'Xavier’s trail-bike knowledge is what makes this address different from a normal private-room guesthouse.',
    },
    quickRead: {
      time: { primary: '1+ NIGHTS', secondary: 'small private-room guesthouse' },
      route: { primary: 'STREET 24', secondary: 'quiet pocket close to central Pakse' },
      budget: { primary: 'SIMPLE PRIVATE STAY', secondary: 'the real extra is the motorbike know-how' },
      bestFor: { primary: 'TRAIL RIDERS', secondary: 'private rooms · secure parking · route advice' },
    },
    practicalNotes: {
      items: [
        { label: 'Rooms', value: 'Private · air-conditioned', detail: 'A small guesthouse with a limited number of rooms.' },
        { label: 'Wi-Fi', value: 'Good', detail: 'Reliable enough for the normal needs of a stay.' },
        { label: 'Location', value: 'Quiet Street 24', detail: 'Very little through-traffic compared with Pakse’s busier roads.' },
        { label: 'Bike parking', value: 'Inside the courtyard', detail: 'The gate closes at night; cameras and a night guard add another layer of security.' },
        { label: 'Motorbikes', value: 'Trail / off-road options', detail: 'Xavier works with larger motorcycles as well as ordinary local transport.' },
      ],
    },
    chapterLabels: ['THE BIKES', 'THE ROOMS', 'BIKE SECURITY'],
    beforeYouLeave: {
      title: 'Tell Xavier what kind of riding you actually want to do',
      body: 'The interesting part of staying here is not simply renting a machine. A larger trail bike changes which roads and tracks make sense, so I would start by explaining the kind of terrain and day you have in mind. That is where Xavier’s local knowledge becomes more useful than a generic scooter-rental counter.',
      note: {
        label: 'MATCH THE BIKE',
        text: 'A trail route and a small-scooter loop are not the same day out.',
      },
    },
  },

  'place-samlees-garden': {
    heroDescription: 'Samlee’s Garden is a tiny Mekong-facing guesthouse built around only two spacious private rooms. Jay’s long experience in Laos, fluent Lao, tour network and personal approach to food make the place feel closer to a hosted stay than a conventional hotel.',
    hero: {
      eyebrow: 'PERSONAL STAY · MEKONG',
      aliases: ['Mekong terrace', 'Two private rooms', 'Jay’s guesthouse'],
      steps: ['Meet Jay', 'Settle into a spacious room', 'Look out over the Mekong', 'Use his local tour network'],
      rhythmNote: 'For me, the scale is the charm: only two guest rooms, a river view and a host who is deeply connected to Laos.',
      photoNote: 'Personal photos to add · Mekong Riverside',
    },
    primaryNote: {
      label: 'SMALL SCALE',
      text: 'Two rooms, a river view and a deeply local host give this place its character.',
    },
    quickRead: {
      time: { primary: '1+ NIGHTS', secondary: 'small, apartment-like private stay' },
      route: { primary: 'MEKONG RIVERSIDE', secondary: 'opposite Pakse night market' },
      budget: { primary: 'PRIVATE COMFORT', secondary: 'large rooms rather than a conventional hotel format' },
      bestFor: { primary: 'SMALL GROUPS', secondary: 'two double beds · terrace · river view' },
    },
    practicalNotes: {
      items: [
        { label: 'Rooms', value: 'Two private guest rooms', detail: 'Each is unusually spacious and has two double beds.' },
        { label: 'View', value: 'Mekong + Phou Salao', detail: 'The private terrace is the feature I remember most.' },
        { label: 'Wi-Fi', value: 'Available', detail: 'Part of the normal guest-room setup.' },
        { label: 'Food', value: 'Restaurant + breakfast', detail: 'Jay aims for balanced, nourishing cooking with careful use of products and less oil.' },
        { label: 'Tours', value: 'Guides can be arranged', detail: 'Jay speaks Lao fluently and has a strong local network for southern Laos.' },
        { label: 'Night market', value: 'Usually quiet by 22:00–22:30', detail: 'Pi Mai, holidays and special events can be noticeably louder.' },
      ],
    },
    chapterLabels: ['JAY', 'THE ROOMS', 'THE FOOD', 'THE RIVERFRONT'],
    beforeYouLeave: {
      title: 'Choose the riverfront for the atmosphere, not for guaranteed silence',
      body: 'Most normal evenings settle down fairly early, and I like having the night market and Mekong directly in front of the guesthouse. During Pi Mai, public holidays or special events, I would expect more noise. That is part of choosing this particular part of Pakse rather than something I would hide in the small print.',
      note: {
        label: 'FESTIVAL NIGHTS',
        text: 'If silence matters, check whether a major celebration is happening on the riverfront.',
      },
    },
  },
};
