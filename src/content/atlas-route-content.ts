export type AtlasRouteMediaAspect = 'landscape' | 'portrait' | 'square';
export type AtlasRoutePersonalNotePlacement =
  | 'story'
  | 'gallery-top-right-gap'
  | 'gallery-image-1-overlap'
  | 'gallery-bottom-left-gap';

export interface AtlasRouteMedia {
  id: string;
  alt: string;
  label?: string;
  src?: string;
  aspect?: AtlasRouteMediaAspect;
}

export interface AtlasRouteStop {
  label: string;
  durationLabel?: string;
  chapterId: string;
}

export interface AtlasRouteNotebookPage {
  id: string;
  kicker?: string;
  title: string;
  copy?: string;
  handwrittenNote?: string;
  media?: AtlasRouteMedia[];
}

export interface AtlasRouteNotebook {
  id: string;
  label?: string;
  title: string;
  intro?: string;
  pages: AtlasRouteNotebookPage[];
}

export interface AtlasRoutePersonalNote {
  id: string;
  label?: string;
  text: string;
  placement?: AtlasRoutePersonalNotePlacement;
}

export interface AtlasRouteTransfer {
  label: string;
  note?: string;
}

export interface AtlasRouteChapter {
  id: string;
  chapterLabel: string;
  title: string;
  durationLabel?: string;
  intro: string;
  body?: string[];
  highlights?: string[];
  personalNotes?: AtlasRoutePersonalNote[];
  media?: AtlasRouteMedia[];
  notebook?: AtlasRouteNotebook;
  transfer?: AtlasRouteTransfer;
  variant?: 'standard' | 'feature' | 'epilogue';
}

export interface AtlasRouteContent {
  country: string;
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  durationLabel: string;
  directionLabel: string;
  intro: string[];
  heroMedia: AtlasRouteMedia[];
  stops: AtlasRouteStop[];
  chapters: AtlasRouteChapter[];
  closingTitle: string;
  closingCopy: string;
}

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
  label = 'PERSONAL NOTE',
  text = 'Personal note placeholder — a short memory, reaction or recommendation can live here.',
  placement: AtlasRoutePersonalNotePlacement = 'story',
): AtlasRoutePersonalNote => ({ id, label, text, placement });

const genericParagraph =
  'Editorial copy placeholder. This block will later explain why this stop belongs in the route, how long it deserves, and the feeling or practical logic that connects it to the journey.';

const genericSecondParagraph =
  'A second editorial paragraph can be added when the stop needs more context. The route page should stay selective: detailed activity, venue and practical information belongs in the dedicated Atlas cards.';

const southToNorth: AtlasRouteContent = {
  country: 'laos',
  slug: 'south-to-north',
  label: 'South → North',
  eyebrow: 'ATLAS ROUTE',
  title: 'South to North',
  subtitle: 'A flexible journey template built chapter by chapter.',
  durationLabel: 'Around 30 days',
  directionLabel: 'South → North',
  intro: [
    'Route introduction placeholder. This space will later set the rhythm of the trip, the entry point, the exit point and the kind of traveller this simulation is designed for.',
    'The route is a proposal rather than a fixed day-by-day programme. Each chapter can grow, shrink or disappear without changing the page template.',
  ],
  heroMedia: [
    placeholder('hero-01', 'Hero image 01', 'portrait'),
    placeholder('hero-02', 'Hero image 02'),
    placeholder('hero-03', 'Hero image 03', 'square'),
    placeholder('hero-04', 'Hero image 04'),
  ],
  stops: [
    { label: 'Don Det', durationLabel: '4 days', chapterId: 'don-det' },
    { label: 'Pakse', durationLabel: '2 days', chapterId: 'pakse' },
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
      intro: 'Chapter introduction placeholder for the first stop and the beginning of the Atlas.',
      body: [genericParagraph],
      highlights: ['Activity placeholder', 'Slow moment placeholder', 'Local stop placeholder'],
      personalNotes: [
        personalNote('don-det-personal-01'),
        personalNote(
          'don-det-personal-02',
          'QUICK MEMORY',
          'Second post-it placeholder — ideal for one spontaneous sentence.',
          'gallery-top-right-gap',
        ),
      ],
      media: [
        placeholder('don-det-01', 'Don Det image 01'),
        placeholder('don-det-02', 'Don Det image 02', 'portrait'),
      ],
      notebook: {
        id: 'don-det-notes',
        label: 'FIELD NOTES',
        title: 'A few pages from Don Det',
        intro: 'Optional detail layer. Open only if the reader wants more of this stop.',
        pages: [
          {
            id: 'don-det-note-01',
            kicker: 'PAGE 01',
            title: 'A small moment',
            copy: 'Notebook copy placeholder for one short personal memory, venue or activity.',
            handwrittenNote: 'Handwritten note placeholder — short, human and specific.',
            media: [placeholder('don-det-note-media-01', 'Notebook photo 01')],
          },
          {
            id: 'don-det-note-02',
            kicker: 'PAGE 02',
            title: 'Another page',
            copy: 'A second optional page can hold another photo, recommendation or tiny story without lengthening the main route.',
            handwrittenNote: 'Another quick note can live here.',
            media: [placeholder('don-det-note-media-02', 'Notebook photo 02', 'square')],
          },
        ],
      },
      transfer: {
        label: 'On the road · Don Det → Pakse',
        note: 'Transfer note placeholder. Transport details can be added later without becoming a full chapter.',
      },
    },
    {
      id: 'pakse',
      chapterLabel: 'Chapter 02',
      title: 'Pakse',
      durationLabel: '2 days',
      intro: 'Chapter introduction placeholder for a shorter city pause.',
      body: [genericParagraph],
      highlights: ['City activity placeholder', 'Food placeholder', 'Practical stop placeholder'],
      personalNotes: [
        personalNote('pakse-personal-01', 'DON’T FORGET', 'Post-it placeholder for a favourite café, meal, person or unexpected reason to stay longer.'),
      ],
      media: [
        placeholder('pakse-01', 'Pakse image 01'),
        placeholder('pakse-02', 'Pakse image 02'),
      ],
      transfer: {
        label: 'On the road · Pakse → Bolaven Loop',
        note: 'A compact transition can introduce the next road section.',
      },
    },
    {
      id: 'bolaven-loop',
      chapterLabel: 'Chapter 03',
      title: 'The Bolaven Loop',
      durationLabel: '4 days',
      intro: 'Feature chapter placeholder. Loops and road sections can use the same data model while receiving a more immersive visual treatment.',
      body: [genericParagraph, genericSecondParagraph],
      highlights: ['Loop highlight', 'Landscape highlight', 'Stay highlight'],
      personalNotes: [
        personalNote('bolaven-personal-01', 'ROAD NOTE', 'Main-route post-it placeholder for a personal observation before opening the deeper notebook.'),
        personalNote(
          'bolaven-personal-02',
          'REMEMBER THIS',
          'A second short handwritten memory can sit beside the chapter without adding another paragraph.',
          'gallery-bottom-left-gap',
        ),
      ],
      media: [
        placeholder('bolaven-01', 'Bolaven image 01'),
        placeholder('bolaven-02', 'Bolaven image 02', 'portrait'),
        placeholder('bolaven-03', 'Bolaven image 03'),
      ],
      notebook: {
        id: 'bolaven-notes',
        label: 'OPEN THE ROAD BOOK',
        title: 'Inside the Bolaven Loop',
        intro: 'This optional notebook demonstrates the page-turning layer for deeper stories, extra photos and small personal notes.',
        pages: [
          {
            id: 'bolaven-note-01',
            kicker: 'PAGE 01',
            title: 'First overnight stop',
            copy: 'Guesthouse or place copy placeholder. This is deliberately shorter than a full venue card.',
            handwrittenNote: 'Post-it style memory goes here.',
            media: [placeholder('bolaven-note-media-01', 'Bolaven notebook photo 01')],
          },
          {
            id: 'bolaven-note-02',
            kicker: 'PAGE 02',
            title: 'An afternoon on the road',
            copy: 'Short experience placeholder with room for one strong image and one memorable detail.',
            handwrittenNote: 'Keep this spontaneous — one sentence is enough.',
            media: [placeholder('bolaven-note-media-02', 'Bolaven notebook photo 02', 'portrait')],
          },
          {
            id: 'bolaven-note-03',
            kicker: 'PAGE 03',
            title: 'A place worth slowing down for',
            copy: 'Another optional page. Readers who are not interested never need to load or scroll through this content.',
            handwrittenNote: 'A tiny recommendation can sit here.',
            media: [placeholder('bolaven-note-media-03', 'Bolaven notebook photo 03')],
          },
          {
            id: 'bolaven-note-04',
            kicker: 'PAGE 04',
            title: 'Last page before moving on',
            copy: 'Closing notebook placeholder before returning to the main vertical route.',
            handwrittenNote: 'End the notebook on a human detail.',
            media: [placeholder('bolaven-note-media-04', 'Bolaven notebook photo 04', 'square')],
          },
        ],
      },
      transfer: {
        label: 'On the road · Bolaven Loop → Thakhek',
        note: 'Longer transfer placeholder.',
      },
      variant: 'feature',
    },
    {
      id: 'thakhek',
      chapterLabel: 'Chapter 04',
      title: 'Thakhek',
      durationLabel: '3 days',
      intro: 'Chapter introduction placeholder for an exploration-focused stop.',
      body: [genericParagraph],
      highlights: ['Exploration placeholder', 'Scooter placeholder', 'Stay placeholder'],
      personalNotes: [personalNote('thakhek-personal-01')],
      media: [
        placeholder('thakhek-01', 'Thakhek image 01'),
        placeholder('thakhek-02', 'Thakhek image 02'),
      ],
      transfer: {
        label: 'On the road · Thakhek → Vientiane',
        note: 'This area can later compare transport choices in a concise way.',
      },
    },
    {
      id: 'vientiane',
      chapterLabel: 'Chapter 05',
      title: 'Vientiane',
      durationLabel: '2 days',
      intro: 'Chapter introduction placeholder for a lighter urban pause.',
      body: [genericParagraph],
      highlights: ['Walk placeholder', 'Restaurant placeholder', 'Rest placeholder'],
      personalNotes: [
        personalNote('vientiane-personal-01', 'CITY NOTE', 'One compact personal note is enough for a lighter chapter like this.'),
      ],
      media: [
        placeholder('vientiane-01', 'Vientiane image 01'),
        placeholder('vientiane-02', 'Vientiane image 02', 'portrait'),
      ],
      transfer: {
        label: 'On the road · Vientiane → Vang Vieng',
        note: 'Short transport transition placeholder.',
      },
    },
    {
      id: 'vang-vieng',
      chapterLabel: 'Chapter 06',
      title: 'Vang Vieng',
      durationLabel: '3 days',
      intro: 'Chapter introduction placeholder for a more active stop.',
      body: [genericParagraph],
      highlights: ['Activity placeholder', 'Viewpoint placeholder', 'Evening placeholder'],
      personalNotes: [
        personalNote(
          'vang-vieng-personal-01',
          'CITY NOTE',
          'Post-it placeholder for the one detail you remember after the activity itself.',
          'gallery-top-right-gap',
        ),
        personalNote(
          'vang-vieng-personal-02',
          'NIGHT NOTE',
          'A second small note can capture an evening, encounter or atmosphere.',
          'gallery-image-1-overlap',
        ),
      ],
      media: [
        placeholder('vang-vieng-01', 'Vang Vieng image 01'),
        placeholder('vang-vieng-02', 'Vang Vieng image 02'),
      ],
      transfer: {
        label: 'On the road · Vang Vieng → Luang Prabang',
        note: 'Journey transition placeholder.',
      },
    },
    {
      id: 'luang-prabang',
      chapterLabel: 'Chapter 07',
      title: 'Luang Prabang',
      durationLabel: '6 days',
      intro: 'Chapter introduction placeholder for a longer final destination.',
      body: [genericParagraph, genericSecondParagraph],
      highlights: ['Waterfall placeholder', 'Walk placeholder', 'Slow day placeholder'],
      personalNotes: [
        personalNote('luang-prabang-personal-01', 'WORTH IT', 'Post-it placeholder for a strong recommendation that deserves a more personal voice.'),
        personalNote(
          'luang-prabang-personal-02',
          'ONE MORE THING',
          'Second personal-note slot for a longer chapter.',
          'gallery-bottom-left-gap',
        ),
      ],
      media: [
        placeholder('luang-prabang-01', 'Luang Prabang image 01'),
        placeholder('luang-prabang-02', 'Luang Prabang image 02', 'portrait'),
        placeholder('luang-prabang-03', 'Luang Prabang image 03'),
      ],
      transfer: {
        label: 'Leaving Laos · Luang Prabang → Slow Boat',
        note: 'The final transfer can become part of the story rather than a purely practical note.',
      },
    },
    {
      id: 'slow-boat',
      chapterLabel: 'Epilogue',
      title: 'Two days on the river',
      durationLabel: '2 days',
      intro: 'Epilogue placeholder. A route does not need to end with the same visual structure as a standard city chapter.',
      body: [genericParagraph],
      personalNotes: [
        personalNote('slow-boat-personal-01', 'LAST NOTE', 'Final handwritten-note placeholder before the route closes.'),
      ],
      media: [
        placeholder('slow-boat-01', 'Slow boat image 01'),
        placeholder('slow-boat-02', 'Slow boat image 02'),
      ],
      variant: 'epilogue',
    },
  ],
  closingTitle: 'Your route continues from here',
  closingCopy:
    'Closing copy placeholder. This block can later send the reader back to the country, into their saved Atlas, or toward another proposed route.',
};

const northToSouth: AtlasRouteContent = {
  country: 'laos',
  slug: 'north-to-south',
  label: 'North → South',
  eyebrow: 'ATLAS ROUTE',
  title: 'North to South',
  subtitle: 'A second generic route generated from the same reusable Atlas Route system.',
  durationLabel: 'Around 30 days',
  directionLabel: 'North → South',
  intro: [
    'Generic route introduction placeholder. This second page exists to demonstrate that the Atlas Route layout is reusable and not tied to the South to North example.',
    'Editorial content will be written later. For now, every chapter, note, media slot and notebook is deliberately structural.',
  ],
  heroMedia: [
    placeholder('north-south-hero-01', 'Hero image 01', 'portrait'),
    placeholder('north-south-hero-02', 'Hero image 02'),
    placeholder('north-south-hero-03', 'Hero image 03', 'square'),
    placeholder('north-south-hero-04', 'Hero image 04'),
  ],
  stops: [
    { label: 'Luang Prabang', durationLabel: '5 days', chapterId: 'north-luang-prabang' },
    { label: 'Vang Vieng', durationLabel: '3 days', chapterId: 'north-vang-vieng' },
    { label: 'Vientiane', durationLabel: '2 days', chapterId: 'north-vientiane' },
    { label: 'Thakhek', durationLabel: '4 days', chapterId: 'north-thakhek' },
    { label: 'Bolaven Loop', durationLabel: '4 days', chapterId: 'north-bolaven-loop' },
    { label: 'Pakse', durationLabel: '2 days', chapterId: 'north-pakse' },
    { label: 'Don Det', durationLabel: '4 days', chapterId: 'north-don-det' },
  ],
  chapters: [
    {
      id: 'north-luang-prabang',
      chapterLabel: 'Chapter 01',
      title: 'Luang Prabang',
      durationLabel: '5 days',
      intro: 'Generic chapter introduction placeholder for the northern starting point.',
      body: [genericParagraph, genericSecondParagraph],
      highlights: ['Highlight placeholder', 'Activity placeholder', 'Slow moment placeholder'],
      personalNotes: [
        personalNote('north-lp-note-01', 'FIRST NOTE'),
        personalNote(
          'north-lp-note-02',
          'ONE MORE THING',
          'Gallery post-it placeholder for a future personal recommendation.',
          'gallery-bottom-left-gap',
        ),
      ],
      media: [
        placeholder('north-lp-01', 'Luang Prabang image 01'),
        placeholder('north-lp-02', 'Luang Prabang image 02', 'portrait'),
        placeholder('north-lp-03', 'Luang Prabang image 03'),
      ],
      notebook: {
        id: 'north-lp-notebook',
        label: 'FIELD NOTES',
        title: 'A few pages from Luang Prabang',
        intro: 'Generic notebook placeholder demonstrating optional page-turning content.',
        pages: [
          {
            id: 'north-lp-page-01',
            kicker: 'PAGE 01',
            title: 'A place to remember',
            copy: 'Notebook copy placeholder.',
            handwrittenNote: 'Short handwritten note placeholder.',
            media: [placeholder('north-lp-notebook-01', 'Notebook photo 01')],
          },
          {
            id: 'north-lp-page-02',
            kicker: 'PAGE 02',
            title: 'Another small moment',
            copy: 'Second notebook page placeholder.',
            handwrittenNote: 'Another personal memory can live here.',
            media: [placeholder('north-lp-notebook-02', 'Notebook photo 02', 'square')],
          },
        ],
      },
      transfer: {
        label: 'On the road · Luang Prabang → Vang Vieng',
        note: 'Generic transfer placeholder.',
      },
    },
    {
      id: 'north-vang-vieng',
      chapterLabel: 'Chapter 02',
      title: 'Vang Vieng',
      durationLabel: '3 days',
      intro: 'Generic chapter introduction placeholder for an active stop.',
      body: [genericParagraph],
      highlights: ['Activity placeholder', 'Viewpoint placeholder', 'Evening placeholder'],
      personalNotes: [
        personalNote(
          'north-vv-note-01',
          'CITY NOTE',
          'Gallery note placeholder.',
          'gallery-top-right-gap',
        ),
        personalNote(
          'north-vv-note-02',
          'NIGHT NOTE',
          'Overlapping photo note placeholder.',
          'gallery-image-1-overlap',
        ),
      ],
      media: [
        placeholder('north-vv-01', 'Vang Vieng image 01'),
        placeholder('north-vv-02', 'Vang Vieng image 02'),
      ],
      transfer: {
        label: 'On the road · Vang Vieng → Vientiane',
        note: 'Generic transfer placeholder.',
      },
    },
    {
      id: 'north-vientiane',
      chapterLabel: 'Chapter 03',
      title: 'Vientiane',
      durationLabel: '2 days',
      intro: 'Generic lighter city chapter placeholder.',
      body: [genericParagraph],
      highlights: ['Walk placeholder', 'Food placeholder', 'Rest placeholder'],
      personalNotes: [personalNote('north-vientiane-note-01', 'CITY NOTE')],
      media: [
        placeholder('north-vientiane-01', 'Vientiane image 01'),
        placeholder('north-vientiane-02', 'Vientiane image 02', 'portrait'),
      ],
      transfer: {
        label: 'On the road · Vientiane → Thakhek',
        note: 'Generic transfer placeholder.',
      },
    },
    {
      id: 'north-thakhek',
      chapterLabel: 'Chapter 04',
      title: 'Thakhek',
      durationLabel: '4 days',
      intro: 'Generic exploration chapter placeholder.',
      body: [genericParagraph],
      highlights: ['Exploration placeholder', 'Road placeholder', 'Stay placeholder'],
      personalNotes: [personalNote('north-thakhek-note-01', 'PERSONAL NOTE')],
      media: [
        placeholder('north-thakhek-01', 'Thakhek image 01'),
        placeholder('north-thakhek-02', 'Thakhek image 02'),
      ],
      transfer: {
        label: 'On the road · Thakhek → Bolaven Loop',
        note: 'Generic longer transfer placeholder.',
      },
    },
    {
      id: 'north-bolaven-loop',
      chapterLabel: 'Chapter 05',
      title: 'The Bolaven Loop',
      durationLabel: '4 days',
      intro: 'Generic feature chapter placeholder for a road loop.',
      body: [genericParagraph, genericSecondParagraph],
      highlights: ['Loop placeholder', 'Landscape placeholder', 'Stay placeholder'],
      personalNotes: [
        personalNote('north-bolaven-note-01', 'ROAD NOTE'),
        personalNote(
          'north-bolaven-note-02',
          'REMEMBER THIS',
          'Gallery-gap personal note placeholder.',
          'gallery-bottom-left-gap',
        ),
      ],
      media: [
        placeholder('north-bolaven-01', 'Bolaven image 01'),
        placeholder('north-bolaven-02', 'Bolaven image 02', 'portrait'),
        placeholder('north-bolaven-03', 'Bolaven image 03'),
      ],
      notebook: {
        id: 'north-bolaven-notebook',
        label: 'OPEN THE ROAD BOOK',
        title: 'Inside the Bolaven Loop',
        intro: 'Generic deeper notebook layer for extra photos and field notes.',
        pages: [
          {
            id: 'north-bolaven-page-01',
            kicker: 'PAGE 01',
            title: 'First road note',
            copy: 'Notebook placeholder copy.',
            handwrittenNote: 'Short memory placeholder.',
            media: [placeholder('north-bolaven-notebook-01', 'Bolaven notebook photo 01')],
          },
          {
            id: 'north-bolaven-page-02',
            kicker: 'PAGE 02',
            title: 'Second road note',
            copy: 'Another optional notebook page.',
            handwrittenNote: 'Another handwritten placeholder.',
            media: [placeholder('north-bolaven-notebook-02', 'Bolaven notebook photo 02', 'portrait')],
          },
          {
            id: 'north-bolaven-page-03',
            kicker: 'PAGE 03',
            title: 'One more stop',
            copy: 'Third optional notebook page.',
            handwrittenNote: 'Tiny personal recommendation placeholder.',
            media: [placeholder('north-bolaven-notebook-03', 'Bolaven notebook photo 03')],
          },
        ],
      },
      transfer: {
        label: 'On the road · Bolaven Loop → Pakse',
        note: 'Generic transfer placeholder.',
      },
      variant: 'feature',
    },
    {
      id: 'north-pakse',
      chapterLabel: 'Chapter 06',
      title: 'Pakse',
      durationLabel: '2 days',
      intro: 'Generic short city pause placeholder.',
      body: [genericParagraph],
      highlights: ['City placeholder', 'Food placeholder', 'Practical placeholder'],
      personalNotes: [personalNote('north-pakse-note-01', 'DON’T FORGET')],
      media: [
        placeholder('north-pakse-01', 'Pakse image 01'),
        placeholder('north-pakse-02', 'Pakse image 02'),
      ],
      transfer: {
        label: 'On the road · Pakse → Don Det',
        note: 'Generic transfer placeholder.',
      },
    },
    {
      id: 'north-don-det',
      chapterLabel: 'Epilogue',
      title: 'Don Det',
      durationLabel: '4 days',
      intro: 'Generic final chapter placeholder for the southern end of the route.',
      body: [genericParagraph],
      highlights: ['Slow moment placeholder', 'Activity placeholder', 'Final stop placeholder'],
      personalNotes: [
        personalNote('north-don-det-note-01', 'LAST NOTE'),
        personalNote(
          'north-don-det-note-02',
          'QUICK MEMORY',
          'Final gallery note placeholder.',
          'gallery-top-right-gap',
        ),
      ],
      media: [
        placeholder('north-don-det-01', 'Don Det image 01'),
        placeholder('north-don-det-02', 'Don Det image 02', 'portrait'),
      ],
      variant: 'epilogue',
    },
  ],
  closingTitle: 'Your route continues from here',
  closingCopy:
    'Closing copy placeholder retained for the generic data contract. The rendered page uses the standard final Atlas CTA.',
};

const routeContent: AtlasRouteContent[] = [southToNorth, northToSouth];

export const getAtlasRouteContent = (
  country: string,
  slug: string,
): AtlasRouteContent | undefined =>
  routeContent.find(
    (route) =>
      route.country === country.toLowerCase() &&
      route.slug === slug.toLowerCase(),
  );

export const getAllAtlasRouteContent = (): AtlasRouteContent[] => routeContent;
