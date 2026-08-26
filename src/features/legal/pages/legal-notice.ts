import type { LegalPageData } from '../types';

export const legalNoticePage: LegalPageData = {
  slug: 'legal-notice',
  eyebrow: 'Legal',
  documentLabel: 'Legal note · Publisher information',
  title: 'Legal Notice',
  heroIntro: 'Publisher, hosting and editorial information for Things To Do Atlas.',
  documentIntro: 'This page identifies the website, its publisher and technical host, and explains where responsibility for the editorial content sits. Some publisher details are intentionally marked as pending until the final legal identity used to operate Things To Do Atlas is confirmed.',
  lastUpdated: 'August 26, 2026',
  seo: {
    title: 'Legal Notice | Things To Do Atlas',
    description: 'Publisher, hosting, editorial responsibility and legal information for Things To Do Atlas.',
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
      id: 'publisher',
      title: 'Publisher information',
      blocks: [
        {
          type: 'callout',
          tone: 'important',
          label: 'To complete before final publication',
          title: 'Publisher identity still required',
          paragraphs: [
            [
              {
                text: 'The legal identity used to operate Things To Do Atlas has not yet been entered into the site. The fields below must be completed with the real publisher details before this Legal Notice is treated as final or made indexable.',
              },
            ],
          ],
        },
        {
          type: 'table',
          caption: 'Publisher details',
          columns: ['Field', 'Information'],
          rows: [
            ['Publisher / legal operator', '[To be completed]'],
            ['Legal form or status', '[To be completed if applicable]'],
            ['Registered or business address', '[To be completed if legally required]'],
            ['Registration / tax identifiers', '[To be completed if applicable]'],
            ['Public contact email', '[To be completed]'],
            ['Publication or editorial director', '[To be completed if applicable]'],
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'The exact information that must be published here depends on the legal status and jurisdiction of the person or organisation operating the website. Only information that is actually required and appropriate for publication should be added.',
            },
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
            { text: 'More detailed rules about using site content are set out in the ' },
            {
              text: 'Terms of Use',
              href: '/legal/terms-of-use',
            },
            { text: '. A dedicated Media Credits & Licensing page will provide the central media-credit framework.' },
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
              text: 'Things To Do Atlas aims to correct material factual errors and to handle legitimate copyright, privacy or attribution concerns responsibly. A public contact channel will be added here once the publisher contact details are confirmed.',
            },
          ],
        },
        {
          type: 'contact',
          eyebrow: 'Publisher contact',
          title: 'Contact details pending',
          body: 'The final public contact email will be inserted here together with the confirmed publisher identity before this notice is considered complete.',
        },
      ],
    },
  ],
  footerNote: 'Draft publisher notice · publisher identity and public contact details still to be completed.',
};
