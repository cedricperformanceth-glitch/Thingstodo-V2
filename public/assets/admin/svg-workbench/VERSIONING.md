# SVG workbench versioning rules

Validated SVGs are immutable. Rejected SVG studies are disposable.

## Rules

1. A working SVG lives under `current/` while it is being reviewed.
2. Only an explicit user validation can promote that exact SVG into `catalogue/`.
3. Once validated, a catalogue SVG is frozen and must never be overwritten or edited in place.
4. If work continues from a validated SVG, create a separate working copy under `current/`; the validated catalogue file remains untouched.
5. If the user rejects a working SVG, asks for a new version, or asks to redo it, delete the rejected working SVG instead of archiving it, duplicating it, or keeping its old source in the active codebase.
6. Rejected studies must not be added to the catalogue and must not remain as hidden helper files or stale working copies.
7. The `current/` folder should contain only SVG studies that are still actively under review.
8. Catalogue entries remain available as historical validated assets unless the user explicitly asks to remove them.

## Current catalogue

- Frozen validated SVG: `catalogue/globe-flight-line-art-v1.svg`

The active compass study is not validated and remains disposable until the user explicitly approves it.
