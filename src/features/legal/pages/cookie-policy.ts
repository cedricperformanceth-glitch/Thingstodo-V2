import type { LegalPageData } from '../types';

export const cookiePolicyPage: LegalPageData = {
  slug: 'cookie-policy',
  eyebrow: 'Legal',
  documentLabel: 'Legal note · Cookies',
  title: 'Cookie Policy',
  heroIntro: 'What the Atlas stores in your browser and how analytics and advertising work.',
  documentIntro: 'Things To Do Atlas stores travel selections locally. Google Analytics is optional and requires your choice. On eligible editorial pages, an Adsterra banner loads independently of your analytics preference, within a dedicated iframe.',
  lastUpdated: 'November 6, 2026',
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
              text: 'The public version of Things To Do Atlas uses two local storage records for travel features and one for the optional Google Analytics consent choice.',
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
            [
              'atlas.optionalAnalyticsConsent.v1',
              'Stores the Google Analytics audience measurement choice and its timestamp.',
              'The choice is valid for up to 180 days.',
            ],
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'The first two records rebuild saved travel selections. The third records your optional Google Analytics choice for up to 180 days. These records do not create a visitor account. When an Adsterra banner is displayed, its advertising partners may process requests and use cookies or similar technologies. Analytics cookies may be used only after analytics consent.',
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
              text: 'Google Analytics 4 (measurement ID G-MR20XJMESG) measures visits, page views and engagement only after the visitor accepts audience measurement. Google may then set measurement cookies such as _ga. Adsterra is configured to load a single 300 × 250 banner automatically inside a dedicated iframe on eligible editorial pages, independently of the analytics setting. The site does not use Google AdSense.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'The infrastructure used to deliver or protect the website may process necessary technical requests. Google Analytics loads only with the visitor’s affirmative analytics choice, which is valid for up to 180 days. Adsterra loads independently on eligible editorial pages and its advertising partners may process technical request information or identifiers.',
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
              text: 'Things To Do Atlas loads some web fonts from Google Fonts. Google Analytics loads only after audience measurement consent. Adsterra banners load automatically in a dedicated iframe on eligible editorial pages. These external services may receive request information and, where applicable, use cookies or related browser identifiers.',
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
              text: 'Google Analytics 4 is an optional audience measurement service used to understand visits, pages viewed and engagement. After analytics consent, the Google tag loads and may use cookies or identifiers to distinguish visits. Adsterra provides display advertising: one 300 × 250 banner is configured for eligible activity cards and city Field Notes in a dedicated iframe, without a separate advertising consent checkbox. Adsterra or its partners may use advertising identifiers or similar technologies. No advertising is loaded on legal pages, the 404 page or Trip Summary.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { text: 'For further information, see the ' },
            { text: 'Google Privacy Policy', href: 'https://policies.google.com/privacy', external: true },
            { text: ' and the ' },
            { text: 'Adsterra Cookies Policy', href: 'https://adsterra.com/cookies/', external: true },
            { text: '. Browser settings can also be used to manage cookies and other site data.' },
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
                text: 'Visitors may accept or reject optional Google Analytics measurement. Rejecting analytics prevents the Google tag from loading but does not stop display advertising on eligible editorial pages. Adsterra operates independently of that setting, and may use advertising cookies or identifiers. Cookie settings are available on every page. Withdrawing analytics consent reloads the page to prevent further Google Analytics loading. Previously set third-party cookies may need to be cleared in browser settings.',
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
              text: 'The cookie banner provides one optional Google Analytics checkbox, plus Reject optional, Save choices and Accept analytics. All Atlas features remain available if analytics is rejected. Advertising is separate from this preference and is displayed on eligible editorial pages. Visitors can reopen Cookie settings on any page; their analytics choice is valid for up to 180 days.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Visitors can change or withdraw optional Google Analytics consent at any time. Withdrawing consent after Google Analytics has loaded reloads the page. Advertising is not controlled through this analytics setting. Third-party cookies already stored are not automatically erased and may be cleared through browser settings.',
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
              text: 'For questions about cookies or privacy preferences, email cedric.performance.th@gmail.com.',
            },
          ],
        },
      ],
    },
  ],
  footerNote: 'Current version · reflects the public site configuration on November 5, 2026.',
};
