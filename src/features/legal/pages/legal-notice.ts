import type { LegalPageData } from '../types';

export const legalNoticePage: LegalPageData = {
  slug: 'legal-notice',
  eyebrow: 'Legal',
  documentLabel: 'Legal note · Site information',
  title: 'Legal Notice',
  heroIntro: 'Website, hosting and editorial information for Things To Do Atlas.',
  documentIntro: 'Things To Do Atlas is currently an independent personal editorial travel project. This page explains the status of the website, its technical hosting, editorial responsibility and the rules that apply to its original content and third-party material.',
  lastUpdated: 'August 26, 2026',
  seo: {
    title: 'Legal Notice | Things To Do Atlas',
    description: 'Website, hosting, editorial responsibility and legal information for Things To Do Atlas.',
    canonicalPath: '/legal/legal-notice',
    indexable: false,
  },
  sections: [
    {
      id: 'website',
      title: 'Website information',
      blocks: [
        {
          type: 'table',
          caption: 'Website',
          columns: ['Item', 'Information'],
          rows: [
            ['Website name', 'Things To Do Atlas'],
            ['Website type', 'Independent editorial travel atlas'],
            ['Current canonical website', 'https://thingstodoatlas-v2.pages.dev'],
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas publishes editorial travel information about destinations, activities, places and practical travel planning. The website is intended to help visitors discover and organise travel ideas; it is not a booking platform or the official website of the places and businesses it describes.',
            },
          ],
        },
      ],
    },
    {
      id: 'project-status',
      title: 'Project status',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas is currently developed and operated as an independent personal editorial project. The website is not presently presented as a company, registered organisation or separate commercial entity.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'If the operating structure of the project changes in the future, or if additional public publisher information becomes appropriate, this Legal Notice will be updated to reflect the new situation.',
            },
          ],
        },
        {
          type: 'callout',
          label: 'Current status',
          title: 'Independent personal project',
          paragraphs: [
            [
              {
                text: 'No company name, registration number, business address or corporate status is currently published for Things To Do Atlas because the project is not presently operated through such an entity.',
              },
            ],
          ],
        },
      ],
    },
    {
      id: 'hosting',
      title: 'Hosting',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'The current Things To Do Atlas deployment uses Cloudflare Pages as its technical hosting platform.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Technical host',
          columns: ['Item', 'Information'],
          rows: [
            ['Provider', 'Cloudflare, Inc.'],
            ['Address', '101 Townsend St., San Francisco, CA 94107, USA'],
            ['Service', 'Cloudflare Pages'],
          ],
        },
        {
          type: 'paragraph',
          content: [
            { text: 'Cloudflare publishes its own privacy and legal information on the ' },
            {
              text: 'Cloudflare website',
              href: 'https://www.cloudflare.com/policies/privacy/',
              external: true,
            },
            { text: '.' },
          ],
        },
      ],
    },
    {
      id: 'editorial-responsibility',
      title: 'Editorial responsibility',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Editorial content on Things To Do Atlas is prepared for travel discovery and planning. Research may draw on official sources, local information, specialist publications, independent travel reporting and first-hand experience where available. Sources and photo licences may also be identified directly on individual field cards when relevant.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'A listing or mention of a restaurant, accommodation, activity provider, rental business, attraction or other third party does not by itself imply sponsorship, endorsement, partnership or any formal relationship with Things To Do Atlas.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { text: 'More detail about research, verification, personal experience and editorial independence is available in the ' },
            { text: 'Editorial Policy', href: '/legal/editorial-policy' },
            { text: '.' },
          ],
        },
        {
          type: 'callout',
          label: 'Field note',
          title: 'Travel information changes',
          paragraphs: [
            [
              {
                text: 'Opening hours, prices, routes, access conditions, transport and local circumstances can change. Important details should be confirmed with the relevant operator or official authority before travelling.',
              },
            ],
          ],
        },
      ],
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual property and media',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Original Things To Do Atlas text, branding, interface design, illustrations and other original material are protected to the extent provided by applicable law. Some photographs and other media are used under open licences, public-domain terms, permission or other source-specific conditions; those rights remain with their respective authors or rights holders.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { text: 'Rules about using site content are set out in the ' },
            { text: 'Terms of Use', href: '/legal/terms-of-use' },
            { text: ', while the sourcing, attribution and reuse framework for photographs and other visual material is explained in ' },
            { text: 'Media Credits & Licensing', href: '/legal/media-credits' },
            { text: '.' },
          ],
        },
      ],
    },
    {
      id: 'external-services',
      title: 'External websites and services',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas may link to maps, official websites, businesses, research sources, social platforms or other third-party services. Those websites are controlled by their own operators. Things To Do Atlas does not control their availability, security, content, prices, privacy practices or terms.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { text: 'Privacy-related information about the Atlas itself is available in the ' },
            { text: 'Privacy Policy', href: '/legal/privacy-policy' },
            { text: ' and ' },
            { text: 'Cookie Policy', href: '/legal/cookie-policy' },
            { text: '.' },
          ],
        },
      ],
    },
    {
      id: 'contact-and-corrections',
      title: 'Contact, corrections and rights concerns',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas aims to correct material factual errors and to handle legitimate copyright, privacy or attribution concerns responsibly.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'A dedicated public contact channel is not yet published on the website. A public email address and other appropriate contact links may be added to this page when they are introduced for the project.',
            },
          ],
        },
      ],
    },
  ],
  footerNote: 'Things To Do Atlas · Legal Notice',
};
