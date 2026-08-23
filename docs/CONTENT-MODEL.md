# Content model

The strict TypeScript contracts live in `src/core/models/types.ts`.

- A `Country` owns identity, chapter, media, map and SEO.
- A `City` references its country and declares presentation profile, enabled categories, category targets, Hero, Explore Board and SEO.
- A `Place` is a practical address. It has Maps and trip actions, not an editorial detail page.
- A `ThingToDo` is the single activity/attraction/landmark family. It can render in category listings, Explore Board, Favorites, Trip and its Field Card page.

## Editorial sources of truth

Generated city/entity records hold the structural and generated base content. Reviewed Field Card editorial content is consolidated in `src/content/field-card-editorial.json` and exposed through `src/content/field-card-editorial-data.ts` plus the generic Field Card editorial resolver. There is no runtime stack of additions, overrides or destination-specific fallback files.

City Hero destination copy, display facts and optional partners are consolidated in `src/content/city-hero-editorial.ts`. Shared Hero engines provide deterministic fallbacks and presentation logic only.

City Field Notes keep their destination editorial data in the `city-field-note-*-copy.json` files and expose it through `city-field-note-editorial.ts`; presentation components do not import those JSON files directly.

## Field Card Hero

`src/components/field-card/FieldCardHero.astro` owns the universal layout. `FieldCardHeroContent` carries only variable editorial copy: eyebrow, exactly three aliases, description, exactly four axis steps, rhythm note and photo note. The exact activity title comes from `ThingToDo.name`.

Hero media resolves from the Field Card gallery, then the card image, then a visible placeholder. Editorial Hero copy does not carry image URLs.

Generated `ThingToDo.fieldCard.hero` remains a valid base for future city generation. Reviewed content, when present, comes from the canonical Field Card editorial entry for that activity.

The executable Hero rules live in `pipeline/contracts/field-card-hero.json` and are verified in CI.

## Field Card Quick Read

`FieldCardQuickReadContent` carries two editorial lines for each fixed slot: TIME, ROUTE, BUDGET and BEST FOR. Labels, numbering and order belong to presentation. Generated Quick Read data remains valid; reviewed content comes from the same canonical Field Card editorial entry.

The executable Quick Read rules live in `pipeline/contracts/field-card-quick-read.json`.

## Field Card stories

The Primary Story is the universal first editorial chapter block. It contains exactly two chapters plus one concise note. The two subjects are activity-specific editorial choices supported by verified information.

The Secondary Story contains chapters `03` and `04`, followed by the separate Before You Leave block. A short Field Card explicitly stores `secondaryStory: null` in its canonical editorial entry; it does not retain unused secondary-story payloads elsewhere.

Generated Primary/Secondary Story data is supported for future generation. Reviewed story content uses the same canonical Field Card editorial entry rather than separate per-section files.

The executable story rules live in:
- `pipeline/contracts/field-card-primary-story.json`
- `pipeline/contracts/field-card-secondary-story.json`

## Field Card practical notes and FAQ

Practical notes, FAQ, media, SEO, sources, SPA presentation copy, display-name editorial changes and any short-card practical label selection all belong to the activity's canonical Field Card editorial entry when manually reviewed. Runtime resolvers fall back to generated `ThingToDo` data only where appropriate.

FAQ publication rules require exactly five useful non-empty questions and answers for an indexable activity. Media cardinality and source requirements are enforced by validation scripts.

## Field Card typography

Field Cards use semantic typography roles rather than component-specific font choices:
- Titles: `Newsreader 600`.
- Editorial narrative, selected introductions and photo captions: `Newsreader 400`.
- Practical information, itinerary, route, price, metadata and labels: `Manrope 400`.
- Field notes, handwritten annotations and post-it text: `Caveat` through the handwritten role.

The font roles are defined once in `src/core/design-system/tokens.css`. Components consume those roles directly in scoped CSS.

## Media, sources and locks

Every media record carries provenance. Publicly accessible does not mean reusable; licensing must be explicit and commercially compatible with the intended use.

Manual locks have one canonical form on the record they protect: `manualLocks["nested.field"] = { value, source: "manual", locked: true }`. A parent lock protects all nested fields beneath it. Pipeline drafts do not have a separate root-level lock map.

`VerificationMetadata` stores the current decision and reason. Source records store useful provenance. Audit timestamps are not persisted merely to record that a generation or editorial pass happened; time-sensitive evidence may still carry an observation date where freshness is functionally required by verification/ranking rules.
