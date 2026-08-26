import type { LegalPageData } from '../types';

export const privacyPolicyPage: LegalPageData = {
  slug: 'privacy-policy',
  eyebrow: 'Legal',
  documentLabel: 'Legal note · Privacy',
  title: 'Privacy Policy',
  heroIntro: 'How Things To Do Atlas handles information and browser-based features.',
  documentIntro: 'This preview uses the reusable legal-page system. The legal wording will be reviewed and completed separately.',
  lastUpdated: 'August 26, 2026',
  seo: {
    title: 'Privacy Policy | Things To Do Atlas',
    description: 'Privacy information for Things To Do Atlas.',
    canonicalPath: '/legal/privacy-policy',
    indexable: false,
  },
  sections: [
    {
      id: 'about-this-policy',
      title: 'About this policy',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas is an editorial travel atlas. This page will explain how information is handled when visitors browse the site and use its interactive features.',
            },
          ],
        },
        {
          type: 'callout',
          label: 'Preview note',
          title: 'Layout preview only',
          paragraphs: [
            [
              {
                text: 'The content on this page is intentionally incomplete for now. It exists so the legal-page design can be reviewed before the final policy is written.',
              },
            ],
          ],
        },
      ],
    },
    {
      id: 'browser-storage',
      title: 'Information stored in your browser',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Some Atlas features can remember choices on the visitor’s own device so that a trip selection can remain available between visits.',
            },
          ],
        },
        {
          type: 'list',
          style: 'dash',
          items: [
            [{ text: 'Saved places and activities can be kept locally in the browser.' }],
            [{ text: 'The current favourites feature does not require a user account.' }],
            [{ text: 'Advertising and third-party services will be documented before they are enabled.' }],
          ],
        },
      ],
    },
    {
      id: 'future-services',
      title: 'Third-party services',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'This section will describe analytics, advertising, consent tools and other external services if and when they are introduced on Things To Do Atlas.',
            },
          ],
        },
      ],
    },
  ],
  footerNote: 'Preview version · legal wording not yet final.',
};
