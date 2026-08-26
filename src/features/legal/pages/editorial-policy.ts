import type { LegalPageData } from '../types';

export const editorialPolicyPage: LegalPageData = {
  slug: 'editorial-policy',
  eyebrow: 'Editorial',
  documentLabel: 'Atlas note · How we work',
  title: 'Editorial Policy',
  heroIntro: 'How Things To Do Atlas researches, selects, writes, reviews and updates its travel content.',
  documentIntro: 'Things To Do Atlas aims to be useful before it is impressive. The editorial process is built around verified facts, clear sourcing, practical traveller questions and an explicit separation between what is researched, what is personally experienced and what still needs confirmation.',
  lastUpdated: 'August 26, 2026',
  seo: {
    title: 'Editorial Policy | Things To Do Atlas',
    description: 'How Things To Do Atlas selects destinations and places, verifies facts, uses sources and AI-assisted tools, handles personal experience and corrects travel content.',
    canonicalPath: '/legal/editorial-policy',
    indexable: false,
  },
  sections: [
    {
      id: 'editorial-purpose',
      title: 'What the Atlas is trying to do',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas is an independent editorial travel atlas. Its purpose is to help travellers understand what is worth knowing about a destination, what they can realistically do there, and which practical places may be useful during a trip.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'The Atlas is not intended to be an exhaustive directory. Inclusion is an editorial decision based on relevance, usefulness, distinctiveness, available evidence and the role a place or activity can play in a traveller’s experience.',
            },
          ],
        },
        {
          type: 'callout',
          label: 'Editorial principle',
          title: 'Useful beats promotional',
          paragraphs: [
            [
              {
                text: 'The preferred tone is that of a knowledgeable traveller sharing a useful address with another traveller: warm and practical, but not advertising copy, tourism-board language or unsupported hype.',
              },
            ],
          ],
        },
      ],
    },
    {
      id: 'selection',
      title: 'How places and activities are selected',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Destinations, activities and practical places are selected because they help explain or experience a destination, solve a real traveller need, or add useful local context. A place does not have to be famous to be included, and popularity alone is not enough to justify inclusion.',
            },
          ],
        },
        {
          type: 'list',
          style: 'dash',
          items: [
            [{ text: 'Activities should represent things a traveller can meaningfully see, do or understand in the destination.' }],
            [{ text: 'Restaurants, cafés, accommodation, rentals, markets and practical services are selected for traveller relevance rather than as a complete business directory.' }],
            [{ text: 'Duplicate, weakly evidenced, closed or misleading candidates can be rejected or sent for manual review.' }],
            [{ text: 'Selection is not presented as a universal ranking of every available option.' }],
          ],
        },
      ],
    },
    {
      id: 'research-and-sources',
      title: 'Research and sources',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Published factual claims should be supported by evidence appropriate to the claim. Official, local and specialist sources are preferred for facts that those sources are well placed to confirm. Where useful, multiple sources are compared rather than relying on a single page.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Wikipedia may be used as a research starting point for history and geography when a relevant article exists, but it is not treated as the final authority for every claim. Independent travel blogs, field reports and traveller accounts may be used to identify recurring practical questions, context and traveller perspective; their wording is not copied into Atlas editorial copy.',
            },
          ],
        },
        {
          type: 'callout',
          label: 'Field note',
          title: 'No guessing to fill a gap',
          paragraphs: [
            [
              {
                text: 'When a useful detail cannot be supported confidently, the preferred outcome is to omit it, qualify it or send it for manual review rather than invent a precise answer.',
              },
            ],
          ],
        },
      ],
    },
    {
      id: 'writing-and-voice',
      title: 'Writing and editorial voice',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Atlas copy is written to be concise enough to scan and specific enough to be useful. Descriptions should explain what a place or activity actually is, add a defensible practical detail, and give the traveller a sense of when or why it may fit a trip without overselling it.',
            },
          ],
        },
        {
          type: 'list',
          style: 'dash',
          items: [
            [{ text: 'Unsupported superlatives such as “the best”, “perfect”, “must-see” or “hidden gem” are avoided.' }],
            [{ text: 'Source prose is not copied simply because the underlying fact is useful.' }],
            [{ text: 'Names, locations, opening information, prices and access details should not be made more precise than the evidence supports.' }],
            [{ text: 'Different places should not be forced into repetitive descriptions merely to satisfy a template.' }],
          ],
        },
      ],
    },
    {
      id: 'first-hand-experience',
      title: 'First-hand experience',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas distinguishes between researched information and genuine first-hand experience. A page may be useful and well researched without implying that the editor personally visited the place.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Personal observations, memories or recommendations should only be presented as first-hand when that experience has actually been recorded for the relevant place. Research, traveller reports or AI-assisted drafting must never be rewritten as a fabricated personal visit.',
            },
          ],
        },
      ],
    },
    {
      id: 'ai-assisted-work',
      title: 'AI-assisted editorial work',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas may use AI-assisted tools during research organisation, drafting, rewriting, consistency checking, structured generation or other parts of the editorial workflow. These tools are treated as production tools, not as authoritative sources.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Where automated generation is used, the intended workflow is evidence-first: verified facts are supplied to the writing layer and the output must remain within those facts. Unsupported additions, invented practical details, fabricated first-hand experience and copied source wording are not acceptable editorial outcomes.',
            },
          ],
        },
        {
          type: 'callout',
          label: 'Editorial principle',
          title: 'AI is not evidence',
          paragraphs: [
            [
              {
                text: 'A fluent sentence generated by a model does not make the underlying claim true. Facts still need an appropriate source or a genuine recorded first-hand basis.',
              },
            ],
          ],
        },
      ],
    },
    {
      id: 'dynamic-information',
      title: 'Opening hours, prices and changing information',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Travel information changes quickly. Opening hours, prices, transport, road conditions, entrance rules, business status and seasonal access may become outdated even when they were correct when researched.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Time-sensitive details should be published only when reasonably supported. Conflicting or stale hours are better omitted than guessed. Travellers should still verify information that materially affects safety, timing, cost or access before relying on it.',
            },
          ],
        },
      ],
    },
    {
      id: 'commercial-independence',
      title: 'Commercial and editorial independence',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'A business or activity appearing in Things To Do Atlas should not be understood as an endorsement, partnership or paid placement unless that relationship is explicitly disclosed. Likewise, omission does not necessarily mean that a place is poor or unsuitable.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'If advertising, sponsorships, affiliate links, hosted experiences or other commercial relationships are introduced, they should be identifiable as such and should not silently determine factual claims or disguise promotional material as independent editorial judgement.',
            },
          ],
        },
      ],
    },
    {
      id: 'media',
      title: 'Photos, illustrations and media',
      blocks: [
        {
          type: 'paragraph',
          content: [
            { text: 'The Atlas uses a mixture of original media, openly licensed media, public-domain material and, where appropriate, generated or illustrative media. Source, author and licence information is recorded when relevant. The detailed approach is explained in the ' },
            { text: 'Media Credits & Licensing', href: '/legal/media-credits' },
            { text: ' page.' },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Illustrative or generated imagery should not be presented in a way that intentionally misleads a traveller about a factual characteristic of a place. Where exact documentary accuracy matters, verified photography or clearly attributable factual media is preferred.',
            },
          ],
        },
      ],
    },
    {
      id: 'corrections',
      title: 'Corrections and updates',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Travel guides are never finished. When credible new information shows that a published fact is wrong, outdated or materially misleading, the goal is to correct the content rather than preserve an error for consistency.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { text: 'Venue owners, travellers, photographers, rights holders and other readers may raise factual or attribution concerns through the contact information provided in the ' },
            { text: 'Legal Notice', href: '/legal/legal-notice' },
            { text: '. A correction request does not guarantee a requested editorial conclusion, but specific evidence can be reviewed and the relevant content updated when appropriate.' },
          ],
        },
      ],
    },
  ],
  footerNote: 'Editorial standards are reviewed as the Atlas, its research workflow and its commercial model evolve.',
};
