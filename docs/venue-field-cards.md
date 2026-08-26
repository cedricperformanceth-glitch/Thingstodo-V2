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

## Universal Field Card composition

Venue Field Cards **must use the same Field Card composition system as Things To Do**. The venue renderer is an adapter into the universal blocks, not a separate visual template.

Published venue pages use the existing components in this order:

1. `FieldCardHero`
2. `FieldCardQuickRead`
3. `FieldCardStoryBlock` for the Primary Story
4. `FieldCardSecondaryStory` when the story is long enough
5. `FieldCardBeforeYouLeave` whenever a Secondary Story is present
6. `FieldCardFaq`
7. `FieldCardPracticalNotes`
8. `FieldCardAtlasCta`
9. optional related personal venue notes

The component owns the layout. Editorial code supplies content only; it must not recreate the Hero, story sheets, post-its, FAQ or practical notebook with venue-specific HTML/CSS.

### Depth rule

Story depth follows the amount of genuine first-hand material:

- 1–2 editorial angles: `compact`; Primary Story only.
- 3 editorial angles: `compact`; two Primary Story chapters, one Secondary Story chapter, then a concise Before You Leave block.
- 4 editorial angles: `deep`; two Primary Story chapters, two Secondary Story chapters, then a concise Before You Leave block.
- 5 editorial angles: `deep`; chapters 01–04 fill Primary + Secondary Story and the fifth angle becomes Before You Leave.
- Do not pad a short personal account merely to unlock a deeper layout.

The first Field Card media slot belongs to the Hero, the second to the Primary Story and, when Secondary Story is present, the third belongs to that block. Missing personal media remain explicit placeholders.

Venue Field Cards do **not** inherit the activity advertising or related-activities engines.

## Editorial shape

- Default short Field Card: **2 personal media**.
- Longer first-hand story: **3 personal media**, naturally created when Secondary Story needs the third universal photo slot.
- If personal media are not supplied yet, keep explicit media placeholders; do not scrape or substitute third-party imagery by default.
- FAQ: **2–5 questions** when the personal notes support useful questions. Do not pad a short story to reach a fixed count.
- No venue FAQ is published until its answers can be grounded in the traveller’s notes and/or clearly separated factual venue information.
- Closely related venues can link to one another when that relationship genuinely helps the reader, but avoid copying the same editorial paragraphs between sibling venues.

## Architecture

- The explicit opt-in venue list is assembled by `src/content/venue-field-card-registry.ts`.
- Established venue copy remains in `src/content/venue-field-card-editorial.ts`; newer venue modules can be registered without growing that legacy file indefinitely.
- `src/content/venue-field-card-layouts.ts` contains venue-specific copy for the universal Hero, Quick Read, Practical Notes and story labels.
- `src/engines/field-card/venue-field-card-engine.ts` maps personal editorial chapters into the universal Field Card block protocol and chooses `compact` or `deep` from story depth.
- `VenueFieldCard.astro` composes the existing universal Field Card components. It must not become a parallel page design.
- `PlaceCard.astro` exposes “Open the Field Card” only when the place id exists in the venue registry.
- Venue routes live at `/[country]/[city]/places/[slug]`.
- Related personal venue notes use `relatedPlaceIds`; the renderer resolves those ids into internal Field Card links.
- Do not add a `fieldCard` property to `Place`: `fieldCard` is currently the activity discriminator in category rendering. Keeping venue editorial separate prevents accidental coupling with Things To Do.
