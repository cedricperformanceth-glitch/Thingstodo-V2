# Asset convention

All manually managed visual assets live under `public/assets/`, using descriptive lowercase kebab-case filenames.

- `public/assets/navbar/` — global Navbar assets, including `things-to-do-atlas-logo-v2.webp`.
- `public/assets/countries/<country-slug>/` — country-wide visuals such as future maps, notebooks, stamps, or drawings.
- `public/assets/cities/<city-slug>/` — city-specific visuals. Use natural folders such as `hero/`, `explore-board/`, `restaurants/`, `cafes/`, `accommodation/`, `activities/`, `scooter-rental/`, `gyms/`, `markets/`, and `practical-services/` when the corresponding assets exist.

WebP is preferred for photographic and raster web assets. Name files for what they show, for example `don-det-mekong-sunset.webp` or `river-cafe-front.webp`; never use opaque names such as `image-4.webp` or `DSC00123.webp`.

Keep manually managed editorial files easy to browse. Do not dump unrelated images into a generic media folder or introduce hashed paths for human-managed assets. Future content-generation/import tooling must write to this convention when it creates manually reviewable assets.
