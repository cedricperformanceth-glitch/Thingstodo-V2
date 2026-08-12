# Content model

The strict TypeScript contracts are in `src/core/models/types.ts`.

- A `Country` owns identity, chapter, city references, media, map and SEO.
- A `City` references its country and declares a presentation profile, enabled categories, hero, Explore Board, media and SEO.
- A `Place` is a practical address. It has Maps and trip actions, not an editorial detail page.
- A `ThingToDo` is the single source for activities and landmarks. It can render in a category, Explore Board, Favorites, Trip and its editorial page.

## Field Card Hero

The Field Card Hero separates presentation from editorial authorship.

- `src/components/field-card/FieldCardHero.astro` owns the universal paper, borders, tape, photo mount, four-node visit axis, handwritten-note placement, stamp and responsive layout.
- The exact activity title always comes from `ThingToDo.name` and is never duplicated inside Hero editorial copy.
- Hero media is resolved from the Field Card gallery first, then the card image, then a visible `Photo to add` placeholder. Editorial Hero copy never carries image URLs.
- `FieldCardHeroContent` carries only variable editorial copy: eyebrow, exactly three aliases, description, exactly four axis steps, rhythm note and photo note.
- Generated `ThingToDo.fieldCard.hero` is supported for future city generation. The generator is a transport layer: authored Hero copy is validated and copied; destination-specific prose is not invented by runtime code.
- `src/content/field-card-hero-copy.json` is the universal manual editorial override layer. It is where Atlas can deliberately personalize a generated Hero after review without introducing activity-specific branches in components.
- Activities without authored Hero copy still render the same universal Hero through a deterministic fallback based only on existing `ThingToDo` data. That fallback keeps pages functional while editorial personalization is completed progressively.

The executable Hero rules live in `pipeline/contracts/field-card-hero.json` and are verified in CI.

## Field Card Quick Read

The Quick Read is the universal magazine-index block directly below the Hero.

- `src/components/field-card/FieldCardQuickRead.astro` owns the section heading, invisible 2×2 editorial grid, ghost `01–04` indexes, fixed `TIME / ROUTE / BUDGET / BEST FOR` labels, typography, asymmetry and mobile stack.
- The four modules are deliberately not UI cards: the reusable component does not add module backgrounds, borders, shadows or border radii.
- `FieldCardQuickReadContent` carries only two editorial lines per slot: `primary` and `secondary`. Labels, numbering and slot order belong to presentation and cannot be overridden by activity data.
- Generated `ThingToDo.fieldCard.quickRead` is supported for future city generation through an authored `fieldCardQuickRead` source block. The generator validates and transports the copy; it does not invent destination-specific Quick Read prose.
- `src/content/field-card-quick-read-copy.json` is the manual editorial override layer for reviewed activities.
- Activities without authored Quick Read copy still render the same universal block through a deterministic fallback using existing duration, best-time, route, cost type and SPA handwritten tags.

The executable Quick Read rules live in `pipeline/contracts/field-card-quick-read.json` and are verified in CI.

Every media group is explicit, and every media record carries provenance. Never claim a social-media image is public domain.

Manual locks have one canonical form on the record they protect: `manualLocks["nested.field"] = { value, source: "manual", locked: true }`. This applies equally to `City`, `Place`, and `ThingToDo`; parent locks protect all nested fields beneath them. Pipeline drafts do not have a separate root-level lock map.
