# Content model

The strict TypeScript contracts are in `src/core/models/types.ts`.

- A `Country` owns identity, chapter, city references, media, map and SEO.
- A `City` references its country and declares a presentation profile, enabled categories, hero, Explore Board, media and SEO.
- A `Place` is a practical address. It has Maps and trip actions, not an editorial detail page.
- A `ThingToDo` is the single source for activities and landmarks. It can render in a category, Explore Board, Favorites, Trip and its editorial page.

Every media group is explicit, and every media record carries provenance. Never claim a social-media image is public domain. `ManualField` enables a manually locked field to override generated content granularly.
