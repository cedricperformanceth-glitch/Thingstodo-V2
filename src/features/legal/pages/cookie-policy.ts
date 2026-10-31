import type { LegalPageData } from '../types';

export const cookiePolicyPage: LegalPageData = {
  slug: 'cookie-policy',
  eyebrow: 'Legal',
  documentLabel: 'Legal note · Cookies',
  title: 'Cookie Policy',
  heroIntro: 'What the Atlas stores in your browser and how third-party advertising technologies may be used.',
  documentIntro: 'Things To Do Atlas uses local browser storage for its save and trip-planning features and offers optional Infolinks advertising technology. This policy explains the stored advertising preference and potential third-party advertising cookies.',
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
              text: 'The public version of Things To Do Atlas currently uses three local storage records: two for visitor-requested travel features and one for optional advertising preferences.',
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
              'Records whether optional Infolinks advertising was accepted or rejected, together with the time of that choice.',
              'The choice is valid for 180 days. The record may remain until replaced or cleared, but an expired choice is no longer accepted.',
            ],
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'The first two records contain destination and activity information needed to rebuild saved selections. The third contains only the advertising choice and its timestamp. None of these records is used by the Atlas features to create an account or identify a visitor by name.',
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
              text: 'The site does not include Google Analytics or Google AdSense. Infolinks JavaScript is available for publisher-site verification and potential advertising but is loaded only after a visitor explicitly accepts optional advertising. This does not imply that Infolinks has approved the publisher application or that ads are currently being served. If loaded, Infolinks and its partners may use cookies and similar identifiers.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'The infrastructure used to host, deliver or protect the website may process technical requests and may use necessary technologies of its own. After optional advertising consent, Infolinks JavaScript may make third-party requests and use identifiers. The visitor’s advertising choice and timestamp are recorded locally under atlas.optionalAdvertisingConsent.v1. The preference is valid for 180 days; after that period the site asks again. An expired record may remain in localStorage until replaced or cleared, but it no longer counts as consent.',
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
              text: 'Things To Do Atlas loads some web fonts from Google Fonts. Infolinks JavaScript is loaded only when optional advertising is accepted. These third-party resources may require browser connections to their providers. They are separate from the Atlas favourites and trip localStorage records.',
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
              text: 'Things To Do Atlas offers an optional Infolinks script for publisher-site verification and potential advertising. It loads only after express consent. Once loaded, advertising technologies can use cookies, local storage or identifiers for fraud prevention, measurement, ad selection or frequency control. Atlas does not currently use Google AdSense or Google Analytics.',
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
                text: 'The Infolinks script is blocked until the visitor selects Accept optional ads. Reject optional ads leaves it unloaded. Cookie settings can be reopened on any page. Withdrawing consent after the script has run reloads the page to prevent it from loading again, although cookies already stored by third parties may need to be cleared in the browser.',
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
              text: 'Things To Do Atlas offers Accept optional ads and Reject optional ads before loading Infolinks. Both choices allow full use of the site. Visitors can reopen Cookie settings on any page; their choice is retained locally for up to 180 days.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Visitors can change or withdraw consent for optional advertising through Cookie settings at any time. Withdrawal after acceptance reloads the page. Previously stored third-party cookies are not automatically removed and may also be cleared in browser settings.',
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
