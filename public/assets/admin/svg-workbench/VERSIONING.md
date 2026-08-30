# SVG workbench versioning rules

Validated SVGs are immutable.

## Rules

1. A working SVG lives under `current/` while it is being reviewed.
2. When the user explicitly validates it, that exact SVG becomes a frozen catalogue version.
3. A validated version must never be overwritten or edited in place.
4. If work continues from a validated SVG, create a new versioned file under `current/` and edit that new file only.
5. Re-validating the edited drawing creates another frozen catalogue file; it does not replace the previous validated version.
6. Catalogue entries are historical assets and remain available even when later variants exist.

## Current lineage

- Frozen validated V1: `catalogue/globe-flight-line-art-v1.svg`
- New editable working copy: `current/globe-flight-line-art-v2.svg`

The two files intentionally start with identical SVG content. Any future edits belong only to the V2 working copy until the user explicitly validates it.
