# Architecture

`src/content` contains versioned data. `src/engines` resolves data into page-ready models. `src/components` renders those models. `src/pages` stays thin and selects an engine plus a layout.

Global concerns live in `src/core`: routing, SEO, media provenance, ad slots and design tokens. Browser persistence is isolated in `src/features`; cards communicate through stable data attributes and do not import a city-specific store.

The city `profile` (`compact`, `standard`, `large`) is a presentation preset. Categories are independently configured. Manual media/content locks are field-level: a locked manual value wins over generated data without blocking unrelated regeneration.

Destination-specific editorial content belongs in `src/content`, never as destination branches or filename registrations inside reusable engines. Reusable engines may consume generic content registries/resolvers only.

No route may carry city-specific behaviour. No public URL exposes internal terms such as `field-card`.
