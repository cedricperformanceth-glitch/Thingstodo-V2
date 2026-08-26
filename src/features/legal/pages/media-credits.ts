import type { LegalPageData } from '../types';

export const mediaCreditsPage: LegalPageData = {
  slug: 'media-credits',
  eyebrow: 'Legal',
  documentLabel: 'Legal note · Media',
  title: 'Media Credits & Licensing',
  heroIntro: 'How photographs, illustrations and other visual material are sourced, credited and licensed across Things To Do Atlas.',
  documentIntro: 'Things To Do Atlas combines original media with carefully selected third-party material. This page explains the credit and licensing system used across the Atlas, how individual licences should be read, and what may or may not be reused.',
  lastUpdated: 'August 26, 2026',
  seo: {
    title: 'Media Credits & Licensing | Things To Do Atlas',
    description: 'Media sourcing, photo credits, open licences, original media and reuse information for Things To Do Atlas.',
    canonicalPath: '/legal/media-credits',
    indexable: false,
  },
  sections: [
    {
      id: 'how-credits-work',
      title: 'How media credits work',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Media used by Things To Do Atlas can come from different sources and can therefore be subject to different rights and licence conditions. A photograph that may be freely reused under an open licence is not treated in the same way as an original Things To Do Atlas photograph, a public-domain work or an editorial illustration.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Where source information is recorded for an individual asset, the Atlas can retain the source name, source URL, author and licence alongside that media. Activity Field Cards may also display a dedicated “Sources & photo licences” section so the credit remains close to the image it concerns.',
            },
          ],
        },
        {
          type: 'callout',
          label: 'Field note',
          title: 'The individual asset licence comes first',
          paragraphs: [
            [
              {
                text: 'This page describes the Atlas crediting system as a whole. When a specific photograph or other asset carries its own author, source or licence information, those specific terms control the reuse of that asset.',
              },
            ],
          ],
        },
      ],
    },
    {
      id: 'media-categories',
      title: 'Media categories used by the Atlas',
      blocks: [
        {
          type: 'table',
          caption: 'Media source categories',
          columns: ['Category', 'Typical treatment'],
          rows: [
            [
              'Original / first-party media',
              'Created for or supplied to Things To Do Atlas. Reuse should not be assumed unless a licence or permission is expressly stated.',
            ],
            [
              'Wikimedia Commons / open-licence media',
              'Used under the licence shown for the individual file, with attribution and licence information where required.',
            ],
            [
              'Public-domain media',
              'Used where the underlying work is identified as public domain. Provenance may still be credited for transparency.',
            ],
            [
              'First-party official sources',
              'Used only where the source and applicable rights permit the intended use. An official source is not automatically copyright-free.',
            ],
            [
              'Generated or illustrative media',
              'May be used where expressly identified as generated or illustrative. It should not be treated as documentary evidence of an exact real-world scene.',
            ],
          ],
        },
      ],
    },
    {
      id: 'wikimedia-and-open-licences',
      title: 'Wikimedia Commons and open licences',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas may use media from ',
            },
            {
              text: 'Wikimedia Commons',
              href: 'https://commons.wikimedia.org/',
              external: true,
            },
            {
              text: ' when a file is available under terms suitable for the intended use. Files hosted on Wikimedia Commons do not all use the same licence, so each file must be checked individually.',
            },
          ],
        },
        {
          type: 'list',
          style: 'dash',
          items: [
            [{ text: 'The creator or other required attribution party should be credited when the licence requires attribution.' }],
            [{ text: 'The applicable licence should be identified or linked where required by that licence.' }],
            [{ text: 'If a licence contains a ShareAlike or similar condition, adaptations must comply with that condition.' }],
            [{ text: 'A Wikimedia upload page is used as a source of licensing information, but the copyright status of the underlying work still needs to be considered.' }],
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Wikimedia Commons itself explains that reuse conditions can differ from file to file and that users should verify the licence displayed on the individual file description page.',
            },
          ],
        },
      ],
    },
    {
      id: 'public-domain',
      title: 'Public-domain material',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Some historical images, maps, artworks or other material may be identified as public domain. Public-domain status can depend on the work, its publication history and the jurisdiction in which it is used.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Where practical, Things To Do Atlas may still identify the creator, institution or source even when attribution is not a condition of copyright. This is done to preserve provenance and help visitors understand where the material came from.',
            },
          ],
        },
      ],
    },
    {
      id: 'original-media',
      title: 'Original Things To Do Atlas media',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Photographs, illustrations, graphics and other media created by or specifically for Things To Do Atlas remain subject to the rights that apply to those works. The fact that an image is publicly visible on the website does not by itself grant permission to copy, republish, sell, redistribute or create commercial derivatives from it.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'If a particular original asset is released under a separate licence, that licence will be stated with the asset or in its associated credit information.',
            },
          ],
        },
      ],
    },
    {
      id: 'generated-media',
      title: 'Generated and illustrative media',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Things To Do Atlas may use generated or editorially constructed imagery when suitable original or appropriately licensed photography is unavailable. These visuals are intended to illustrate a place, atmosphere or editorial subject and should not be understood as a photographic record of an exact moment or scene unless expressly stated otherwise.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Reference material may be consulted to understand factual characteristics such as architecture, landscape, colours, vegetation or spatial context. The objective is to create a new editorial composition rather than reproduce a particular reference photograph.',
            },
          ],
        },
        {
          type: 'callout',
          label: 'Licensing note',
          title: 'Do not assume generated media is freely reusable',
          paragraphs: [
            [
              {
                text: 'The legal treatment of generated material can vary by jurisdiction and by how a work was created. Things To Do Atlas does not grant broader reuse rights merely because an image was generated or assisted by generative tools. Any express licence shown with the asset takes precedence.',
              },
            ],
          ],
        },
      ],
    },
    {
      id: 'third-party-rights',
      title: 'Third-party rights shown in media',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'A licence covering a photograph or illustration does not necessarily remove other rights connected with what appears inside it. Trademarks, logos, artworks, architecture, identifiable people, private property and other protected elements may be subject to separate rights or restrictions depending on the intended reuse and applicable law.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Anyone reusing third-party media is responsible for checking the complete licence and any additional restrictions that may apply to their own use.',
            },
          ],
        },
      ],
    },
    {
      id: 'reuse',
      title: 'Reusing media from Things To Do Atlas',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'If a media item is credited to an external creator under an open licence, you may be able to reuse the original work directly under that licence. In that case, follow the licence terms and use the original source information rather than treating Things To Do Atlas as the rights holder.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'For original Things To Do Atlas media, generated or illustrative material, or any asset whose reuse status is unclear, do not assume permission. Check the specific credit information or contact the publisher before republishing the material.',
            },
          ],
        },
      ],
    },
    {
      id: 'corrections',
      title: 'Corrections and rights concerns',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Media credits are maintained to preserve attribution and licensing information, but errors can occur. If you are a creator or rights holder and believe an author credit, licence, source, copyright status or permission has been recorded incorrectly, please provide the relevant asset and supporting information so the record can be reviewed.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              text: 'Publisher contact details will be maintained in the ',
            },
            {
              text: 'Legal Notice',
              href: '/legal/legal-notice',
            },
            {
              text: ' once the final publisher information is completed.',
            },
          ],
        },
      ],
    },
  ],
  footerNote: 'Media licences are asset-specific · always check the credit attached to the individual work.',
};
