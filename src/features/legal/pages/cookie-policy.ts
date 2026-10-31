import type { LegalPageData } from '../types';

export const cookiePolicyPage: LegalPageData = {
  slug: 'cookie-policy',
  eyebrow: 'Legal',
  documentLabel: 'Legal note · Cookies',
  title: 'Cookie Policy',
  heroIntro: 'What the Atlas stores in your browser and how optional analytics and advertising technologies may be used.',
  documentIntro: 'Things To Do Atlas stores travel selections locally and offers optional Google Analytics audience measurement and Infolinks advertising. Both services require a separate, explicit choice and are disabled until accepted.',
  lastUpdated: 'October 31, 2026',
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
              text: 'The public version of Things To Do Atlas uses two local storage records for visitor-requested travel features and two for optional analytics and advertising preferences.',
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
              'atlas.optionalAdvertisingConsent.v1',
              'Stores the Infolinks advertising choice and its timestamp.',
              'The choice is valid for up to 180 days.',
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
              text: 'The first two records rebuild saved travel selections. The other two contain separate choices and timestamps for optional advertising and analytics. Neither the travel features nor these consent records create a visitor account. After explicit analytics consent, Google Analytics may also set its own measurement cookies.',
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
              text: 'Google Analytics 4 (measurement ID G-MR20XJMESG) measures visits, page views and engagement only after the visitor accepts audience measurement. Google may then set measurement cookies such as _ga. The site does not use Google AdSense. Infolinks advertising JavaScript is separately optional, and is loaded only after advertising consent on eligible pages; this does not imply advertising approval.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'The infrastructure used to deliver or protect the website may process necessary technical requests. With consent, Google Analytics and Infolinks may each make third-party requests and use relevant identifiers. The site stores the two consent choices independently, each for up to 180 days. Older advertising consent never authorizes Analytics. Expired choices do not count as consent.',
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
              text: 'Things To Do Atlas loads some web fonts from Google Fonts. Google Analytics is loaded only after analytics consent, and Infolinks only after advertising consent on eligible pages. Each external service may receive request information and, when applicable, use cookies or related browser identifiers.',
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
              text: 'Google Analytics 4 is an optional audience measurement service used to understand visits, pages viewed and engagement. After analytics consent, Google's tag loads and may use cookies or identifiers to distinguish visits. Separately, Infolinks is optional for potential advertising and may use cookies, local storage or identifiers. No optional provider script is loaded solely because another optional service was accepted.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { text: 'For further information, see the ' },
            { text: 'Infolinks Privacy Policy', href: 'https://sites0001.infolinks.com/privacy-policy', external: true },
            { text: ', the ' },
            { text: 'Google Privacy Policy', href: 'https://policies.google.com/privacy', external: true },
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
                text: 'Visitors may consent to advertising and audience measurement independently or reject both. Without a positive choice, the respective external script remains unloaded. Cookie settings are available on every page. Withdrawing consent reloads the page to stop further loading of a previously activated service. Previously set third-party cookies may need to be cleared in browser settings.',
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
              text: 'The cookie banner provides separate advertising and analytics checkboxes, plus Reject optional, Save choices and Accept all. All site features remain available when both are rejected. Visitors can reopen Cookie settings on any page; each choice is retained locally for up to 180 days.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Visitors can independently change or withdraw advertising and analytics consent at any time. Withdrawing permission after a script has loaded reloads the page. Previously stored third-party cookies are not automatically erased and may also be cleared through browser settings.',
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
              text: 'For questions about cookies, privacy or advertising preferences, email cedric.performance.th@gmail.com.',
            },
          ],
        },
      ],
    },
  ],
  footerNote: 'Current version · reflects the public site configuration on August 26, 2026.',
};
