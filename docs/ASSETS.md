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
