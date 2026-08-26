import type { VenueFieldCardContent } from './venue-field-card-editorial';
import type { VenueFieldCardLayoutProfile } from './venue-field-card-layouts';

export const fandeeIslandPlaceId = 'place-fandee-island';

export const fandeeIslandFieldCard: VenueFieldCardContent = {
  status: 'published',
  kindLabel: 'Guesthouse',
  mediaSlots: 3,
  intro: 'Fandee Island is one of my favourite places in Tad Lo, and I say that after staying there for two months rather than passing through for a night. The island is small enough to feel intimate but spacious enough that even with around a dozen guests I never felt crowded. My strongest memory is the tree-house cabin: a mattress on the floor, mosquito net, fan, little terrace and hammock, then one wall you can open so you fall asleep facing the lake. It is simple, but for me that simplicity is exactly why the place works.',
  chapters: [
    {
      title: 'The cabin that opens onto the lake',
      body: 'The tree-house cabins are simple in the best possible way. I slept on a mattress on the floor and found it genuinely comfortable. There is a mosquito net, a fan, a small terrace and a hammock up in the trees, but the detail that changes the whole room is the wall panel you can open toward the lake. At night I could leave that side open and fall asleep facing the water. I stayed long enough for the novelty to wear off, and it never really did.',
    },
    {
      title: 'Quiet when you want it, social when you do not',
      body: 'Fandee feels bigger than the island looks. There could be around a dozen guests staying on the island and I still never had the feeling that everyone was on top of one another. There is enough shoreline and enough little corners to disappear for a while. Then, when you want people around, the restaurant becomes a large common room where everyone can sit without being squeezed together. Loïc is a big part of that balance. He has been based in Laos for around a decade, Fandee is his second guesthouse, and he is easy to talk to about almost anything. He knows the region, gives useful directions, likes a game of darts, and some evenings turn into chess or a small poker game. The place can be lively without forcing you to be social.',
    },
    {
      title: 'I ended up eating here a lot',
      body: 'After two months, the restaurant was not just a convenient place to eat because I happened to be staying there. I actually liked the food. My three small favourites are the pineapple shake, the lava cake and the cheeseburger. When I was there, some of the French products such as cheese and charcuterie were imported from France, while the bread came from a French baker in Pakse. The burger bun is one of those details I kept noticing because it was simply very good. The restaurant is also spacious enough that a full table still feels relaxed rather than crowded.',
    },
    {
      title: 'The island gives you reasons not to rush',
      body: 'You can swim in the lake, take the pedal boat out, do treasure hunts on the island and through the village, or spend time doing almost nothing. Outside the property, the waterfalls are close enough for a walk, the nearby temple has much more history than its quiet setting suggests, and Fandee Adventure Park adds ziplines when you want something more active. I also appreciated the scooter setup: parking is at the entrance and, when I stayed, it was watched at night with someone sleeping there. I never worried about leaving the scooter.',
    },
    {
      title: 'Give it at least two or three nights',
      body: 'I stayed for two months, which is obviously not the normal Tad Lo itinerary, but I would not reduce Fandee to a one-night stop. Two or three nights is the minimum I would personally give it if you want time to enjoy the island, walk around Tad Lo and let the social side happen naturally. Pi Mai was another level for me. The little village became completely different for Lao New Year, with days of water games and a much wilder atmosphere than you would expect from Tad Lo. Being based on an island beside the lake, close to the temple, made that week feel like part of the celebration rather than something I had come to watch from outside.',
    },
  ],
  faq: [
    {
      question: 'Does Fandee Island feel crowded when it is full?',
      answer: 'Not in my experience. Even with around a dozen guests on the island, I still found plenty of space to sit by the water, read, swim or spend time alone. The communal areas are large enough that being social never felt compulsory.',
    },
    {
      question: 'What are the tree-house cabins actually like?',
      answer: 'They are simple rather than luxurious: a comfortable mattress on the floor, mosquito net, fan, small terrace and hammock. The detail I loved is that one wall panel can open toward the lake, so I could fall asleep facing the water.',
    },
    {
      question: 'Can you swim at Fandee Island?',
      answer: 'Yes. I swam in the lake regularly, and there was also a pedal boat when I stayed. The island is a place where spending time around the water is part of the stay rather than a separate excursion.',
    },
    {
      question: 'What would I personally order at the restaurant?',
      answer: 'My three small favourites are the pineapple shake, the lava cake and the cheeseburger. I especially liked the burger bread, which came from a French baker in Pakse when I was there.',
    },
    {
      question: 'How long would I stay at Fandee Island?',
      answer: 'I stayed two months, which is obviously far beyond a normal visit. For most travellers I would give it at least two or three nights so there is time to enjoy the island itself, walk around Tad Lo and not turn the stay into another overnight stop.',
    },
  ],
};

export const fandeeIslandLayout: VenueFieldCardLayoutProfile = {
  heroDescription: 'Fandee Island is one of my favourite stays in Tad Lo: a small lake island with simple tree-house cabins, enough space to disappear for a while, and a social side that never felt forced during the two months I spent there.',
  hero: {
    eyebrow: 'PERSONAL STAY · TAD LO',
    aliases: ['Tree-house cabins', 'Lake island', 'Loïc’s guesthouse'],
    steps: ['Sleep facing the lake', 'Meet Loïc and the other guests', 'Eat in the common room', 'Give Tad Lo more than one night'],
    rhythmNote: 'The rare balance here is privacy and company: I could be alone by the lake, then walk a few metres and find people around the restaurant or a darts game.',
    photoNote: 'Personal photos to add · Fandee Island',
  },
  primaryNote: {
    label: 'MY FAVOURITE DETAIL',
    text: 'Open the cabin wall and fall asleep facing the lake.',
  },
  quickRead: {
    time: { primary: '2–3 NIGHTS', secondary: 'my minimum for enjoying the island slowly' },
    route: { primary: 'TAD LO', secondary: 'lake island · waterfalls and village nearby' },
    budget: { primary: 'CHECK CURRENT RATE', secondary: 'room type and season can change the price' },
    bestFor: { primary: 'SLOW ISLAND STAY', secondary: 'lake mornings · simple cabins · easy social atmosphere' },
  },
  practicalNotes: {
    items: [
      { label: 'Cabin', value: 'Mattress · mosquito net · fan', detail: 'The tree-house setup is simple, comfortable and built around the lake-facing opening.' },
      { label: 'Space', value: 'More private than it looks', detail: 'Even with around a dozen guests, I never felt that the island was crowded.' },
      { label: 'Food', value: 'Restaurant on the island', detail: 'My picks are the pineapple shake, lava cake and cheeseburger.' },
      { label: 'Water', value: 'Swimming + pedal boat', detail: 'The lake is part of daily life here rather than just the view.' },
      { label: 'Around Tad Lo', value: 'Waterfalls · temple · Adventure Park', detail: 'There is enough nearby to fill several days without rushing the village.' },
      { label: 'Scooter parking', value: 'Watched at the entrance', detail: 'When I stayed, someone remained at the parking area overnight and I felt comfortable leaving the scooter there.' },
    ],
  },
  chapterLabels: ['THE CABIN', 'THE ISLAND', 'THE TABLE', 'AROUND TAD LO', 'STAY LONGER'],
  beforeYouLeaveNote: {
    label: 'PI MAI',
    text: 'During Lao New Year, the quiet village became a completely different place for me.',
  },
};
