# Personal Venue Field Cards

This is a site-wide editorial rule for SPA **places** (restaurants, cafés, accommodation and other venue categories). It does not change the Things To Do activity system.

## Publication rule

- Venue Field Cards are **opt-in only**. Never generate them automatically for every place in a city or category.
- A venue becomes eligible only when the traveller explicitly selects a place they personally visited.
- Keep the existing generic SPA card as the discovery layer; the optional Field Card is the deeper first-hand layer.
- Never invent first-person experience. Until personal notes exist, keep the Field Card in `draft` and noindex.
- Personal copy should read as lived experience, not as an aggregate review or “I heard that…” summary.
- Activities are frozen for this workflow. Do not modify activity content, activity generation, activity Field Card templates or activity routing while adding venue Field Cards.

## Editorial shape

- Default: short Field Card, **2 personal media**.
- Longer first-hand story: **3 media** and as many chapters as the source material genuinely supports.
- If personal media are not supplied yet, keep explicit media placeholders; do not scrape or substitute third-party imagery by default.
- FAQ: **2–5 questions** when the personal notes support useful questions. Do not pad a short story to reach a fixed count.
- No venue FAQ is published until its answers can be grounded in the traveller’s notes and/or clearly separated factual venue information.

## Architecture

- Selected venues live in `src/content/venue-field-card-editorial.ts`.
- `venueFieldCards` is the explicit opt-in registry.
- `PlaceCard.astro` exposes “Open the Field Card” only when the place id exists in that registry.
- Venue Field Cards use their own `VenueFieldCard.astro` renderer and `/[country]/[city]/places/[slug]` route.
- Do not add a `fieldCard` property to `Place`: `fieldCard` is currently the activity discriminator in category rendering. Keeping venue editorial separate prevents accidental coupling with Things To Do.
