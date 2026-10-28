import type { LegalPageData } from '../types';

export const cookiePolicyPage: LegalPageData = {
  slug: 'cookie-policy',
  eyebrow: 'Legal',
  documentLabel: 'Legal note · Cookies',
  title: 'Cookie Policy',
  heroIntro: 'What the Atlas stores in your browser and how third-party advertising technologies may be used.',
  documentIntro: 'Things To Do Atlas uses local browser storage for its save and trip-planning features and includes an Infolinks script for publisher-site verification. This policy explains these technologies and the potential use of third-party advertising cookies.',
  lastUpdated: 'October 28, 2026',
  seo: {
    title: 'Cookie Policy | Things To Do Atlas',
    description: 'How Things To Do Atlas uses cookies, local browser storage and similar technologies.',
    canonicalPath: '/legal/cookie-policy',
    indexable: false,
  },
  sections: [
    {
      id: 'cookies-and-storage',
      title: 'Cookies and similar storage technologies',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'A cookie is a small piece of information stored on a device by a website. Websites can also use other browser technologies, including localStorage, to remember information between page visits. Privacy rules may treat these technologies in similar ways even though they work differently from a technical point of view.',
            },
          ],
        },
        {
          type: 'callout',
          label: 'Field note',
          title: 'The Atlas currently uses localStorage',
          paragraphs: [
            [
              {
                text: 'The current save and trip-planning features use localStorage in your browser. The information stays on that browser and device unless you remove it, clear browser storage or your browser removes it automatically.',
              },
            ],
          ],
        },
      ],
    },
    {
      id: 'current-storage',
      title: 'What is stored today',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'The public version of Things To Do Atlas currently uses two local storage records to support features that visitors choose to use.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Current browser storage',
          columns: ['Storage item', 'Purpose', 'Duration'],
          rows: [
            [
              'things-to-do-atlas:favorites',
              'Remembers places and activities saved as favourites on the current browser.',
              'Until removed by the visitor or cleared by the browser.',
            ],
            [
              'thingsToDoAtlas.makeYourOwnAtlas.v1',
              'Remembers places and activities added to My Atlas so a trip selection can remain available between visits.',
              'Until removed by the visitor or cleared by the browser.',
            ],
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'These records contain destination and activity information needed to rebuild the visitor’s saved selection. They are not used by the current application to create an account, identify a visitor by name or build an advertising profile.',
            },
          ],
        },
      ],
    },
    {
      id: 'why-storage-is-used',
      title: 'Why this storage is used',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Browser storage is used so that features explicitly chosen by the visitor can continue to work when moving between pages or returning later to the same browser.',
            },
          ],
        },
        {
          type: 'list',
          style: 'dash',
          items: [
            [{ text: 'Remembering saved places and activities.' }],
            [{ text: 'Keeping a My Atlas trip selection available between visits.' }],
            [{ text: 'Allowing a visitor to remove individual saved items or clear a trip selection.' }],
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Where applicable law provides an exemption for storage that is strictly necessary to deliver a feature requested by the visitor, this kind of functional storage may not require the same consent as advertising or tracking technologies. Requirements can vary by jurisdiction.',
            },
          ],
        },
      ],
    },
    {
      id: 'cookies-currently-used',
      title: 'Cookies currently used by the site',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'The current site does not include Google Analytics or Google AdSense. Its standard page layout loads Infolinks JavaScript for publisher-site verification and possible future advertising. This does not imply that an Infolinks publisher application has been approved or that ads are currently appearing. Infolinks and its partners may use cookies or similar identifiers when their technologies operate; the exact storage and requests can vary.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'The infrastructure used to host, deliver or protect the website may process technical requests and may use strictly necessary technologies of its own. Infolinks JavaScript may also make third-party network requests. This policy will be updated if further technologies are introduced or if their use materially changes.',
            },
          ],
        },
      ],
    },
    {
      id: 'third-party-services',
      title: 'Third-party services',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas loads some web fonts from Google Fonts and includes Infolinks JavaScript on its standard page layout. Loading these third-party resources may require the browser to contact their providers. These services are separate from the Atlas favourites and trip localStorage records.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { text: 'More information about broader third-party processing is available in the ' },
            { text: 'Privacy Policy', href: '/legal/privacy-policy' },
            { text: '.' },
          ],
        },
      ],
    },
    {
      id: 'advertising-and-analytics',
      title: 'Advertising and analytics',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas has included an Infolinks script for publisher-site verification and potential advertising. Depending on the provider's service and settings, advertising technologies can use cookies, local storage or related identifiers to measure usage, prevent fraud, limit repeated advertising, select ads or assess performance. Atlas does not currently use Google AdSense or Google Analytics.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { text: 'For further information, see the ' },
            { text: 'Infolinks Privacy Policy', href: 'https://sites0001.infolinks.com/privacy-policy', external: true },
            { text: ' and the ' },
            { text: 'Network Advertising Initiative opt-out information', href: 'https://optout.networkadvertising.org/', external: true },
            { text: '. Browser settings can also be used to manage cookies, although opting out of tailored advertising does not necessarily disable all cookies.' },
          ],
        },
        {
          type: 'callout',
          label: 'Important',
          tone: 'important',
          title: 'Non-essential tracking will not be treated like functional storage',
          paragraphs: [
            [
              {
                text: 'The Infolinks script is already included in the site. Where applicable law requires consent for non-essential advertising storage or tracking, that consent must be obtained through appropriate technical controls. Publishing this policy does not itself collect consent. The site's consent implementation and the script's actual cookie behaviour need to be verified before any applicable advertising tracking is enabled.',
              },
            ],
          ],
        },
      ],
    },
    {
      id: 'your-choices',
      title: 'Your choices and browser controls',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'You can control browser storage through the settings provided by your browser. Depending on the browser, you can inspect stored site data, remove individual records, clear all site data or configure how cookies and similar technologies are handled.',
            },
          ],
        },
        {
          type: 'list',
          style: 'dash',
          items: [
            [{ text: 'Removing Things To Do Atlas local storage will also remove saved favourites or My Atlas selections stored in that browser.' }],
            [{ text: 'Clearing browser data may remove preferences and saved information from other websites as well.' }],
            [{ text: 'Blocking storage entirely can prevent features that rely on it from remembering your selections.' }],
          ],
        },
      ],
    },
    {
      id: 'consent-controls',
      title: 'Consent controls',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'If a consent banner or consent-management interface is added to Things To Do Atlas, it will be used to provide information and choices for technologies that require consent. Functional storage that is necessary to deliver a feature requested by the visitor may be handled separately where the law permits.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Visitors should be able to change or withdraw consent for optional technologies through the consent controls when those controls are available.',
            },
          ],
        },
      ],
    },
    {
      id: 'policy-updates',
      title: 'Changes to this policy',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'This Cookie Policy will be updated when the technologies used by Things To Do Atlas change, when a new third-party service is introduced, or when a material change in applicable requirements makes an update appropriate. The date shown at the top and bottom of this page identifies the current version.',
            },
          ],
        },
      ],
    },
    {
      id: 'contact',
      title: 'Questions about cookies or storage',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Questions about browser storage, cookies or privacy on Things To Do Atlas can be addressed using the contact information published in the site’s legal information once those operator details are completed.',
            },
          ],
        },
      ],
    },
  ],
  footerNote: 'Current version · reflects the public site configuration on August 26, 2026.',
};
