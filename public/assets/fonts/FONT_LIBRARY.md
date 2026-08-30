# Things To Do Atlas — Font Library

This folder is the project font bank. Fonts are catalogued here with the user's internal visual annotation so they can be found again by style, not only by technical font name.

| Internal annotation | Font family | Style | License | Folder / file | Current Atlas usage |
|---|---|---|---|---|---|
| country & city calligraphy | Alex Brush | Regular | SIL Open Font License 1.1 | `AlexBrush-Regular.ttf` | PDF: `My Atlas <Country>` headings and city names |
| japonnais manuscrit | Dr Sugiyama | Regular | SIL Open Font License 1.1 | `dr-sugiyama/` | Reserved in the font bank |
| manuscrit attacher | Cookie | Regular | SIL Open Font License 1.1 | `cookie/` | Reserved in the font bank |

## PDF font rule

- Country and city handwritten headings use **Alex Brush Regular** from `/assets/fonts/AlexBrush-Regular.ttf`.
- The font is registered locally with `@font-face` in `src/core/design-system/tokens.css` as `Alex Brush`.
- `src/features/summary/atlas-export-pdf.ts` uses `COUNTRY_CITY_FONT = 'Alex Brush'` with weight `400` for the main country heading, multi-country headings, and city headings.
- PDF handwritten headings are rendered into the exported PDF at high resolution, so the recipient does not need Alex Brush installed locally.
- Annotation fonts remain separate from country/city calligraphy (for example Schoolbell and Indie Flower).

## Rule for future fonts

For every new font, keep:
- the exact internal annotation supplied by the user;
- the official font family/name;
- the license file when available;
- source/checksum information when available;
- a small usage note or CSS reference if useful.
