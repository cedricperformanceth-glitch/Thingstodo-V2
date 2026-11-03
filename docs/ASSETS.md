# Asset convention

All manually managed visual assets live under `public/assets/`, using descriptive lowercase kebab-case filenames.

- `public/assets/navbar/` — global Navbar assets, including `things-to-do-atlas-logo-v2.webp`.
- `public/assets/shared/hero/` — shared City Hero furniture. Shared postal marks live in `postmarks/`.
- `public/assets/countries/<country-slug>/` — country-wide visuals such as maps, notebooks, stamps or drawings.
- `public/assets/cities/<country-slug>/<city-slug>/` — city-specific visuals. Use natural folders such as `hero/`, `explore-board/`, `restaurants/`, `cafes/`, `accommodation/`, `activities/`, `scooter-rental/`, `gyms/`, `markets/` and `practical-services/` when the corresponding assets exist.

WebP is preferred for photographic and raster web assets. Name files for what they show, for example `don-det-mekong-sunset.webp` or `river-cafe-front.webp`; never use opaque names such as `image-4.webp` or `DSC00123.webp`.

Keep manually managed editorial files easy to browse. Do not dump unrelated images into a generic media folder or introduce hashed paths for human-managed assets. Content-generation/import tooling must write manually reviewable assets to this convention.

City-specific Hero media belongs in `public/assets/cities/<country-slug>/<city-slug>/hero/`. Shared Hero furniture belongs in `public/assets/shared/hero/` and must not be duplicated in individual city folders.

For each prepared city, the three required variable Hero assets must exist in these exact locations before publication:

- `public/assets/cities/<country-slug>/<city-slug>/hero/drawings/<city-slug>-hero-drawing.webp`
- `public/assets/cities/<country-slug>/<city-slug>/hero/stamps/<city-slug>-hero-stamp.webp`
- `public/assets/cities/<country-slug>/<city-slug>/hero/photos/<city-slug>-hero-photo.webp`

Country scope prevents slug collisions between destinations in different countries.

The drawing, stamp and Hero photo are city-specific. `CityHeroEnvelope.astro` uses the shared envelope background in `public/assets/shared/hero/envelope/`; the `PAR AVION / AIR MAIL` postmark remains a separate shared overlay in `public/assets/shared/hero/postmarks/`.

## Tad Lo partner and licensed activity media library

The canonical manually curated Field Card galleries for Tad Lo are registered in
`src/content/field-card-media-tad-lo.json`. The media registry is loaded by
`src/content/field-card-editorial-data.ts` and overrides older inline Field Card
arrays for the listed activities. The underlying pipeline activity card images
remain in `pipeline/cities/laos/tad-lo.json` and
`src/content/generated/laos/tad-lo.ts`.

Partner images come from Visit Tad Lo with the owner's permission and require
attribution and a link to the partner. Their original source page and direct image
URL are retained. Do not infer that partner image permission covers unrelated
third-party images.

Wikimedia Commons entries have individual source URLs, authors, licences and
licence links recorded in the media JSON. These images are used as **illustrative**
or **local-context** media if they show a different venue or a similar experience;
they must never be described as photographs of Nyay, Fandee, Mr Hook, Mr Vieng
or Vat Paa if the image was made elsewhere. The `caption`, `depictionType`,
`subjectMatch` and `depictionNote` fields record this distinction. Field Card
photo captions expose this information to readers alongside attribution.

Audit date: 2026-11-03. The Visit Tad Lo source photograph for Mr Hook was
unavailable during this review, so the Mr Hook Field Card uses contextual
Commons coffee imagery until a working authorized exact-activity photo is
supplied. When an exact image is recovered, replace the contextual image in
the library without changing unrelated editorial copy or rights attribution.
