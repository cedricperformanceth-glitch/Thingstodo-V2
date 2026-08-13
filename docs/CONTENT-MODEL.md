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

## Field Card Primary Story

The Primary Story is the first universal editorial chapter block after Quick Read. Its composition is fixed; its subjects are not.

- `src/components/field-card/FieldCardStoryBlock.astro` always owns the same light sheet, top/bottom dividers, two chapter positions on the left, one secondary photo position on the right and one fixed-position post-it.
- Every Primary Story contains exactly two chapters. Their titles and bodies are activity-specific editorial decisions. Chapter one is not inherently an access chapter and chapter two is not inherently a price chapter.
- Atlas chooses the two strongest distinct angles supported by verified information. A difficult journey may justify an access chapter; an easy or free visit should not be forced into route or price copy when another subject is more useful.
- The post-it is always present, but both its label and text are variable. It may carry a route note, price, clothing advice, timing, etiquette, weather, equipment, safety or another concise field note that complements the chapters.
- The block requests `thing.media.fieldCard.gallery[1]`. Missing qualified media renders `Photo to add`; the runtime does not recycle an unrelated image simply to fill the slot.
- Future generation can supply `fieldCardPrimaryStory: { chapters: [{ title, body }, { title, body }], note: { label, text } }`. It is validated and persisted into `ThingToDo.fieldCard.primaryStory`. When this explicit block is supplied, `candidate.sections` is reserved for later Field Card chapters.
- `src/content/field-card-primary-story-copy.json` is the reviewed editorial override layer. Legacy activities without explicit Primary Story data receive a deterministic compatibility fallback so the universal block remains present while editorial personalization is completed.

The executable Primary Story rules live in `pipeline/contracts/field-card-primary-story.json` and are verified in CI.

## Field Card Secondary Story

The Secondary Story is the universal chapter-three page after the Primary Story. It keeps the V1 one-story-plus-paper-note composition without inheriting V1's destination-specific TIME semantics.

- `src/components/field-card/FieldCardSecondaryStory.astro` owns a new light sheet, top/bottom dividers, the structural `03` marker, one editorial text position on the left and one fixed-position post-it on the right. It has no photo slot.
- The sheet and post-it are universal presentation. `label`, `title`, `body`, `note.label` and `note.text` are activity-specific editorial content.
- The body is exactly one text string. This block is not a container for two chapters, paragraph arrays, photos, lists or custom layouts.
- The subject is deliberately undefined. TIME is appropriate when timing, duration or overnight planning is the strongest next angle; another activity may instead need conditions, etiquette, equipment, seasonality, context or another verified subject.
- Atlas should choose an angle that adds to rather than repeats the two Primary Story chapters. The post-it should complement rather than summarize the main text.
- Future generation can supply `fieldCardSecondaryStory: { label, title, body, note: { label, text } }`. It is valid only alongside `fieldCardPrimaryStory`, is validated before persistence into `ThingToDo.fieldCard.secondaryStory`, and leaves `candidate.sections` for later Field Card chapters.
- `src/content/field-card-secondary-story-copy.json` is the reviewed editorial override layer. Legacy activities without explicit Secondary Story data receive a deterministic compatibility fallback from the next available Field Card section.

The executable Secondary Story rules live in `pipeline/contracts/field-card-secondary-story.json` and are verified in CI.

## Field Card typography

Field Cards use semantic typography roles rather than component-specific font choices.

- Titles: `Newsreader 600`.
- Editorial narrative, selected introductions and photo captions: `Newsreader 400`.
- Practical information, itinerary, route, price, metadata and labels: `Manrope 400`.
- Field notes, handwritten annotations and post-it text: `Caveat` through the handwritten role.

The font roles are defined once in `src/core/design-system/tokens.css`. Each Field Card component consumes those roles directly in its own scoped CSS; there is no global typography override stylesheet layered on top of component styles.

Every media group is explicit, and every media record carries provenance. Never claim a social-media image is public domain.

Manual locks have one canonical form on the record they protect: `manualLocks["nested.field"] = { value, source: "manual", locked: true }`. This applies equally to `City`, `Place`, and `ThingToDo`; parent locks protect all nested fields beneath them. Pipeline drafts do not have a separate root-level lock map.
