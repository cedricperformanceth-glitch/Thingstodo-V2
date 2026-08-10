# Asset convention

All manually managed visual assets live under `public/assets/`, using descriptive lowercase kebab-case filenames.

- `public/assets/navbar/` — global Navbar assets, including `things-to-do-atlas-logo-v2.webp`.
- `public/assets/shared/hero/` — shared City Hero furniture. Shared postal marks live in `postmarks/`.
- `public/assets/countries/<country-slug>/` — country-wide visuals such as future maps, notebooks, stamps, or drawings.
- `public/assets/cities/<country-slug>/<city-slug>/` — city-specific visuals. Use natural folders such as `hero/`, `explore-board/`, `restaurants/`, `cafes/`, `accommodation/`, `activities/`, `scooter-rental/`, `gyms/`, `markets/`, and `practical-services/` when the corresponding assets exist.

WebP is preferred for photographic and raster web assets. Name files for what they show, for example `don-det-mekong-sunset.webp` or `river-cafe-front.webp`; never use opaque names such as `image-4.webp` or `DSC00123.webp`.

Keep manually managed editorial files easy to browse. Do not dump unrelated images into a generic media folder or introduce hashed paths for human-managed assets. Future content-generation/import tooling must write to this convention when it creates manually reviewable assets.

City-specific Hero media belongs in `public/assets/cities/<country-slug>/<city-slug>/hero/`. Shared Hero furniture belongs in `public/assets/shared/hero/` and must not be duplicated in individual city folders.

For each prepared city, keep its two variable Hero assets in these exact locations:

- `public/assets/cities/<country-slug>/<city-slug>/hero/drawings/<city-slug>-hero-drawing.webp`
- `public/assets/cities/<country-slug>/<city-slug>/hero/stamps/<city-slug>-hero-stamp.webp`

Country scope prevents slug collisions between destinations in different countries.

Drawings and stamps are city-specific. The envelope and the `PAR AVION / AIR MAIL` postmark remain shared Hero furniture and must never be copied into city folders.

## Shared city envelope

The generated V2 SVG envelope has been removed. `CityHeroEnvelope.astro` now uses the original V1 WebP calque directly as its envelope background, preserving the same raster artwork and the V1 `100% 100%` background-fit behavior. The shared `PAR AVION / AIR MAIL` mark remains a separate overlay at `public/assets/shared/hero/postmarks/air-mail-par-avion.webp`.
