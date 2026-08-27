export type AtlasRouteMediaAspect = 'landscape' | 'portrait' | 'square';

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
): AtlasRoutePersonalNote => ({ id, label, text });

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
        personalNote('don-det-personal-02', 'QUICK MEMORY', 'Second post-it placeholder — ideal for one spontaneous sentence.'),
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
        personalNote('bolaven-personal-02', 'REMEMBER THIS', 'A second short handwritten memory can sit beside the chapter without adding another paragraph.'),
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
      personalNotes: [
        personalNote('thakhek-personal-01'),
        personalNote('thakhek-personal-02', 'LITTLE STORY', 'Post-it placeholder for a guesthouse moment, encounter or funny detail from the road.'),
      ],
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
        personalNote('vang-vieng-personal-01', 'AFTERWARDS', 'Post-it placeholder for the one detail you remember after the activity itself.'),
        personalNote('vang-vieng-personal-02', 'NIGHT NOTE', 'A second small note can capture an evening, encounter or atmosphere.'),
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
        personalNote('luang-prabang-personal-02', 'ONE MORE THING', 'Second personal-note slot for a longer chapter.'),
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

const routeContent: AtlasRouteContent[] = [southToNorth];

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
