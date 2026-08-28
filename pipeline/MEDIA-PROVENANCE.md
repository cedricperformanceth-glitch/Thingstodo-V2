# Media provenance

Things To Do Atlas keeps media files in their existing destination/category folders. Provenance is recorded as metadata; media is not reorganized into separate provenance folders.

## Three independent dimensions

Every published media item should describe three different questions when applicable:

1. `provenance` — where the media fundamentally comes from.
2. `treatment` — how the publication version was transformed.
3. `rightsBasis` — why Atlas is allowed to use the media.

The legacy `sourceType`, `manual` and `locked` fields remain supported for compatibility while city data is migrated.

## Provenance values

- `original-illustration` — an original Atlas drawing or illustration.
- `original-photography` — a photograph taken by the Atlas publisher.
- `authorized-third-party` — media supplied by another person, establishment or rights holder with permission for Atlas to use it.
- `ai-created` — a new editorial image created with generative AI rather than an Atlas photograph merely being refined.
- `wikimedia` — media sourced from Wikimedia Commons with the individual asset licence checked.
- `public-domain` — public-domain media from a source other than the normal Wikimedia provenance flow when relevant.
- `first-party-official` — media from an official first-party source when its reuse basis has been verified.

A random image found on the public internet is **not** an acceptable provenance by itself. If rights cannot be established, the asset stays unpublished / requires rights review.

## Treatment values

- `none` — no relevant AI transformation is being recorded.
- `ai-refined` — an existing original photograph was cleaned, colour/tone corrected, sharpened or otherwise refined with AI while remaining fundamentally the original photograph.
- `generative-edit` — an existing asset was materially reconstructed with generative editing.

### Atlas rule for personal photography

All Atlas personal photographs published on the site use `provenance: original-photography` and `treatment: ai-refined`. The original capture remains the provenance even though an edited derivative is published.

## Rights basis values

- `creator-owned` — Atlas created the underlying photograph or illustration.
- `permission-granted` — the relevant third party supplied the media and granted permission for Atlas use.
- `open-license` — reuse is based on a compatible open licence, with attribution where required.
- `public-domain` — no copyright restriction applies under the recorded public-domain basis.
- `official-source` — reuse is based on a verified official-source permission or reuse basis.

## Wikimedia Commons

Automatic photo discovery remains Wikimedia-Commons-only. Every asset must still be checked individually. Source URL, author and licence are retained. CC BY and CC BY-SA attribution requirements remain mandatory; incompatible or unknown licences are rejected.

`provenance: wikimedia` identifies where the asset came from. `rightsBasis` records whether the particular Commons asset is used under an open licence or public-domain basis.

## Seed examples

The canonical starter records live in `pipeline/media-provenance.json`:

- Crazy Gecko, Don Det — original illustration.
- Fandee Island guesthouse, Tad Lo — original photography + AI refined.
- Fandee Island Restaurant, Tad Lo — authorized third-party photo with direct permission.
- Bolaven Garden, Tad Lo — AI-created editorial image; the final asset path is still pending in the city pipeline.
- Tad Hang Waterfall, Tad Lo — Wikimedia Commons open-licence example.

These records are the migration reference for classifying the rest of the media library city by city.
