import type { LegalPageData } from '../types';

export const privacyPolicyPage: LegalPageData = {
  slug: 'privacy-policy',
  eyebrow: 'Legal',
  documentLabel: 'Legal note · Privacy',
  title: 'Privacy Policy',
  heroIntro: 'A clear account of what the Atlas stores, what third parties may receive, and the choices available to visitors.',
  documentIntro: 'Things To Do Atlas is designed to work with as little personal data as possible. This policy explains what information may be processed when you browse the site, save places or activities, and follow links to third-party services.',
  lastUpdated: 'August 26, 2026',
  seo: {
    title: 'Privacy Policy | Things To Do Atlas',
    description: 'How Things To Do Atlas handles browser storage, technical data, third-party services and visitor privacy.',
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
              text: 'Things To Do Atlas is an editorial travel website built to help visitors discover destinations, places and activities and save useful ideas while planning a trip. This Privacy Policy applies to the Things To Do Atlas website and its browser-based features.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'It does not govern the privacy practices of websites or services that you may reach through external links. Those services operate under their own privacy policies and terms.',
            },
          ],
        },
        {
          type: 'callout',
          label: 'Field note',
          title: 'No account required',
          paragraphs: [
            [
              {
                text: 'You can browse Things To Do Atlas and use the current save and trip-planning features without creating an account or providing your name, email address or other profile information.',
              },
            ],
          ],
        },
      ],
    },
    {
      id: 'information-we-handle',
      title: 'Information we handle',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'The information involved in using Things To Do Atlas depends on how you use the site. The current public version is intentionally light on personal-data collection.',
            },
          ],
        },
        {
          type: 'list',
          style: 'dash',
          items: [
            [{ text: 'Browsing the site does not require registration, a user profile or the submission of contact details.' }],
            [{ text: 'When you save places, activities or trip ideas, the relevant destination information is stored locally in your browser so the selection can remain available on that device.' }],
            [{ text: 'As with most websites, technical infrastructure used to deliver and secure the site may process information such as an IP address, browser or device information, requested pages, timestamps and basic request or error data.' }],
            [{ text: 'Things To Do Atlas does not currently ask visitors to provide payment-card details, passport information or precise GPS location in order to browse or save travel ideas.' }],
          ],
        },
      ],
    },
    {
      id: 'local-browser-storage',
      title: 'Saved places and local browser storage',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'The favourites and “Make Your Own Atlas” features use local browser storage. This allows the site to remember the places and activities you have chosen without requiring an online account.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'The saved information can include details needed to rebuild your selection, such as the name of a place or activity, its destination, category, short description and related page path. Trip entries can also include the time at which an item was saved.',
            },
          ],
        },
        {
          type: 'callout',
          label: 'Stored on your device',
          title: 'Your Atlas stays in the browser',
          paragraphs: [
            [
              {
                text: 'The current save and trip-planning stores are written to localStorage on your device. Those features do not require Things To Do Atlas to maintain a personal account or profile for you.',
              },
            ],
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'You can remove individual saved items through the site where that control is available, clear your Atlas, or remove stored site data using your browser settings. Clearing browser storage may remove your saved selections permanently from that device.',
            },
          ],
        },
      ],
    },
    {
      id: 'technical-delivery',
      title: 'Technical delivery and security',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'When a website is requested, some technical information must normally be processed by the hosting, network and security infrastructure that delivers the page. This can include an IP address and request metadata needed to transmit content, diagnose errors, maintain availability and protect the service from abuse.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Where service providers process this information on behalf of Things To Do Atlas, they may retain technical logs according to their own operational, security and legal requirements. We aim to use only the information reasonably necessary to operate and protect the site.',
            },
          ],
        },
      ],
    },
    {
      id: 'google-fonts',
      title: 'Google Fonts',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas currently uses Google Fonts to load several typefaces used by the site. When your browser requests those font resources, it connects to Google-operated font domains. As part of that connection, Google necessarily receives technical request information such as the IP address used to deliver the font files.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { text: 'Google states that the Google Fonts Web API is designed to limit the collection, storage and use of end-user data and that Google Fonts requests are kept separate from authenticated Google services. You can read more in the ' },
            { text: 'Google Fonts privacy information', href: 'https://developers.google.com/fonts/faq/privacy', external: true },
            { text: ' and the ' },
            { text: 'Google Privacy Policy', href: 'https://policies.google.com/privacy', external: true },
            { text: '.' },
          ],
        },
      ],
    },
    {
      id: 'external-links',
      title: 'External links and third-party websites',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas contains links to third-party websites and services, including map links, official sources, travel resources, venue websites and media or licence sources. Following one of these links takes you outside Things To Do Atlas.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'The destination service may receive ordinary technical information when your browser connects to it and may use cookies or other technologies under its own policies. Things To Do Atlas does not control how those independent services process information.',
            },
          ],
        },
      ],
    },
    {
      id: 'cookies-advertising-analytics',
      title: 'Cookies, advertising and analytics',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'At the date shown on this policy, Things To Do Atlas does not intentionally use Google AdSense or a general audience-analytics platform on its public pages. The browser storage described above is used for visitor-requested Atlas features rather than advertising profiling.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'If advertising, analytics, consent-management tools or other tracking technologies are introduced, this Privacy Policy and the site’s cookie information will be updated to explain what is used, why it is used, which providers are involved and what choices are available. Consent controls will be provided where required by applicable law.',
            },
          ],
        },
        {
          type: 'callout',
          label: 'Current status',
          title: 'No advertising profile is created by the Atlas features',
          paragraphs: [
            [
              {
                text: 'The current favourites and trip stores are designed to remember your own travel selections on your device. They are not used by Things To Do Atlas to build an advertising profile about you.',
              },
            ],
          ],
        },
      ],
    },
    {
      id: 'sharing-and-sale',
      title: 'Sharing and sale of personal information',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas does not currently sell personal information. Information may be processed by technical service providers where this is necessary to host, deliver, secure or operate the site, and may be disclosed where required to comply with law, protect legal rights or respond to a valid legal request.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Third-party services that you choose to visit or that are used to deliver a resource, such as Google Fonts, process information under their own privacy terms. Depending on the provider and your location, that processing may take place in countries other than the country from which you access Things To Do Atlas.',
            },
          ],
        },
      ],
    },
    {
      id: 'legal-bases-and-retention',
      title: 'Legal bases and retention',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Where applicable data-protection law requires a legal basis, the basis depends on the activity involved. It may include providing a feature you have requested, legitimate interests in operating and securing the website, compliance with legal obligations, or your consent where consent is required.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Local Atlas information remains in your browser until you remove it, clear the relevant Atlas data or clear your browser’s site storage. Technical logs and data processed by infrastructure or third-party providers are retained according to the needs and policies applicable to those services. We do not intend to keep personal information for longer than reasonably necessary for the purpose for which it is processed.',
            },
          ],
        },
      ],
    },
    {
      id: 'your-choices-and-rights',
      title: 'Your choices and privacy rights',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Your browser gives you direct control over locally stored Atlas data. You can remove saved items through available site controls or clear the site’s local storage through your browser settings.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Depending on where you live and the law that applies, you may also have rights concerning personal information processed about you. These may include rights to request access, correction or deletion, to restrict or object to certain processing, to receive portable data in some circumstances, to withdraw consent where processing is based on consent, and to complain to a competent data-protection authority.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Because the current save features are local and do not require an account, Things To Do Atlas may not possess server-side information that can be linked back to a particular visitor simply because that visitor saved an activity in their browser.',
            },
          ],
        },
      ],
    },
    {
      id: 'children',
      title: 'Children’s privacy',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas is a general travel-information website and is not designed to ask children to create profiles or submit personal information. If a feature aimed specifically at children or requiring the collection of information from children is introduced in the future, the privacy approach will be reviewed before that feature is made available.',
            },
          ],
        },
      ],
    },
    {
      id: 'changes-and-contact',
      title: 'Changes and privacy questions',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'This policy may be updated when the website changes, when a new service is introduced, or when legal or operational requirements change. The “Last updated” date at the top of the page shows when this version was most recently revised.',
            },
          ],
        },
        {
          type: 'contact',
          eyebrow: 'Privacy contact',
          title: 'Questions about this policy?',
          body: 'Privacy questions or requests can be addressed to Things To Do Atlas using the operator contact details published in the site’s Legal Notice.',
        },
      ],
    },
  ],
  footerNote: 'Things To Do Atlas · Privacy Policy',
};
