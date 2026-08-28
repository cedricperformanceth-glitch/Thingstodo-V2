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

### Don Det activity audit

The 11 Don Det activity Field Cards use Wikimedia Commons as their photo provenance. The canonical Don Det media correction layer applies `provenance: wikimedia`, `treatment: none` and a licence-derived `rightsBasis` to every effective Commons activity image at runtime. CC0/public-domain records receive `public-domain`; compatible licensed Commons records receive `open-license`.

Every Wikimedia activity image must retain a canonical Commons file URL, author and explicit per-asset licence. The Don Det publication contract fails when one of those fields is missing or when an unexpected non-Wikimedia activity photo is introduced.

There is one legacy local media exception in the Xai Kong Nyai Beach Field Card, `xai-kong-nyai-beach-riverboats`. Its existing metadata identifies it as `Atlas-provided artwork`, not as a third-party photograph. Its precise creation provenance is not evidenced by the repository history, so it must not be relabelled as AI-created, original photography or owner-authorized without supporting provenance information.

## Seed examples

The canonical starter records live in `pipeline/media-provenance.json`:

- Crazy Gecko, Don Det — original illustration.
- Fandee Island guesthouse, Tad Lo — original photography + AI refined.
- Fandee Island Restaurant, Tad Lo — authorized third-party photo with direct permission.
- Bolaven Garden, Tad Lo — AI-created editorial image; the final asset path is still pending in the city pipeline.
- Tad Hang Waterfall, Tad Lo — Wikimedia Commons open-licence example.

These records are the migration reference for classifying the rest of the media library city by city.
