# Step 7 — City assembly and publication QA

This is the final gate for the current SPA-card generation pipeline. It does **not** generate Field Cards and does not deploy the website.

## Final workflow

1. `City.categories` is the explicit editorial source of truth for the categories enabled in that city; the settlement type defines what is allowed. The editor decides when each category has enough useful content.
2. Selection rules define what qualifies for each category, including Things to do.
3. Source verification decides whether candidates are current and trustworthy enough to use.
4. The SPA-card contract defines the data required on every visible card.
5. The editorial contract turns verified facts into Atlas card copy and practical labels.
6. The media contract selects only qualified real photos; otherwise it keeps the full `Photo to add` placeholder for manual completion.
7. Publication QA assembles the city and checks the whole result before it is considered publishable.

Field Card generation remains outside this pipeline until it is developed separately.

## Commands

Normal iterative generation:

```bash
npm run generate-city -- laos <city-slug>
```

Preview generation without writing:

```bash
npm run generate-city -- laos <city-slug> --dry-run
```

Final generation with strict publication preflight:

```bash
npm run generate-city -- laos <city-slug> --publish-check
```

The `--publish-check` flow prepares verification, editorial data and media, assembles the complete city in memory, runs the publication QA, and writes the generated city only when the QA is not blocked.

A strict dry-run is also available:

```bash
npm run generate-city -- laos <city-slug> --publish-check --dry-run
```

To inspect an already generated city without changing it:

```bash
npm run qa-city -- laos <city-slug>
```

Use `--json` for a machine-readable report.

## QA statuses

### `ready`

No blocking issue and no manual photo placeholder remains.

### `ready-with-warnings`

No blocking issue, but one or more SPA cards have no qualified real photo. Those cards remain publishable with the intentional `Photo to add` placeholder and are clearly marked for later manual completion.

### `blocked`

The city must not be treated as publication-ready. Blocking problems include:

- the city/settlement SPA contract is inconsistent;
- `City.categories` is missing, duplicated, contains a category not allowed for the settlement, or omits Things to do;
- duplicate IDs, slugs or normalized names;
- a card is in a category not enabled by `City.categories`;
- required SPA-card data is missing or invalid;
- the Google Maps CTA is invalid;
- an automatically researched entity does not have an accepted source-verification decision;
- an automatically researched entity lost its research-source provenance;
- a CC BY / CC BY-SA photo lacks required attribution metadata;
- Explore Board landmark references are broken or incomplete.

## Count policy

Publication QA validates category membership, identifiers, source provenance and card completeness. It does not impose numeric category quotas: the admin/editor decides when a category is sufficiently useful for publication.

## Source verification handoff

When source adapters provide `verificationSignals`, generation runs the Step 3 verification engine before editorial/media work. Only `accept` continues automatically. `manual-review` and `reject-closed` stop automatic generation for that candidate.

The accepted decision is persisted on the entity as `verification`, so final QA can prove that the selection stage was not bypassed.

Legacy or manually managed content that has not yet been migrated to the current verification/card contracts may therefore fail strict publication QA. This is intentional: normal generation remains available while the city is being built, and strict QA is the final publication gate.

## Photo rule

A missing SPA photo is **never** replaced by AI art, a generic destination image or a photograph of a similar business. It is a warning, not an error.

The card keeps its complete photo slot with the neutral `Photo to add` placeholder so the missing media is obvious to the editor and can be filled manually later.

Explore Board featured landmarks remain stricter because the existing Explore Board contract requires its shared landmark image.

## Final repository-level verification

Before actual deployment/publication, also run the existing repository verification chain:

```bash
npm run verify:city-template
```

That chain covers architecture, generated-data validation, regression tests, Astro checks and the production build. Publication QA validates the selected city content; the repository verification chain validates that the website as a whole still builds correctly.
