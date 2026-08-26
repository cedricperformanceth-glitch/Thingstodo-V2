# Personal Venue Field Cards

This is a site-wide editorial rule for SPA **places** (restaurants, cafés, accommodation and other venue categories). It does not change the Things To Do activity system.

## Publication rule

- Venue Field Cards are **opt-in only**. Never generate them automatically for every place in a city or category.
- A venue becomes eligible only when the traveller explicitly selects a place they personally know or visited.
- Keep the existing generic SPA card as the discovery layer; the optional Field Card is the deeper first-hand layer.
- Never invent first-person experience. Until personal notes exist, keep the Field Card in `draft` and noindex.
- Personal copy should read as lived experience, not as an aggregate review or “I heard that…” summary.
- Activities are frozen for this workflow. Do not modify activity content, activity generation, activity Field Card templates or activity routing while adding venue Field Cards.

## Editorial voice and source of truth

- The traveller’s oral notes are **source material, not final copy**. Transform them into polished English editorial writing rather than transcribing them literally.
- The finished page should feel like a concise personal travel blog: the reader must understand that observations, preferences and judgements belong to the traveller.
- Do not automatically weaken a confident statement with phrases such as “during my stay”, “it seemed” or “probably”. Preserve the certainty level expressed by the traveller.
- Likewise, preserve uncertainty when the traveller explicitly gives it. If they say a detail may change this year, the published copy must keep that qualification.
- Personal knowledge can be strong and specific without becoming an institutional fact. A statement in a Venue Field Card remains the traveller’s account unless it is deliberately presented as separately verified practical information.
- Do not imply the traveller slept, ate or used a service when they did not. If their knowledge comes from repeated visits, friendship with the owner, work at the venue or direct feedback from guests, explain that perspective naturally when it matters to credibility.
- This voice is intentionally different from Things To Do Field Cards. Activities use a guide/service register grounded in verified sources; venue cards use a personal, first-person editorial register grounded primarily in the traveller’s own experience and knowledge.

## Editorial shape

- Default: short Field Card, **2 personal media**.
- Longer first-hand story: **3 media** and as many chapters as the source material genuinely supports.
- If personal media are not supplied yet, keep explicit media placeholders; do not scrape or substitute third-party imagery by default.
- FAQ: **2–5 questions** when the personal notes support useful questions. Do not pad a short story to reach a fixed count.
- No venue FAQ is published until its answers can be grounded in the traveller’s notes and/or clearly separated factual venue information.
- Closely related venues can link to one another when that relationship genuinely helps the reader, but avoid copying the same editorial paragraphs between sibling venues.

## Architecture

- Selected venues live in `src/content/venue-field-card-editorial.ts`.
- `venueFieldCards` is the explicit opt-in registry.
- `PlaceCard.astro` exposes “Open the Field Card” only when the place id exists in that registry.
- Venue Field Cards use their own `VenueFieldCard.astro` renderer and `/[country]/[city]/places/[slug]` route.
- Related personal venue notes use `relatedPlaceIds`; the renderer resolves those ids into internal Field Card links.
- Do not add a `fieldCard` property to `Place`: `fieldCard` is currently the activity discriminator in category rendering. Keeping venue editorial separate prevents accidental coupling with Things To Do.
