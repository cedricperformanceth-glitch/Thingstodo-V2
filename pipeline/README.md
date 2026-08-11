# Atlas content pipeline

The scripts in `/scripts` run only for developers. The public Astro runtime reads
static, versioned content and never researches businesses, maps, or media for a visitor.

`pnpm create-city laos city-slug --settlement village --profile compact` creates a valid empty City
module and a versioned pipeline container. `--settlement` is mandatory and accepts only
`village` or `city`; it selects the universal SPA category contract. The profile remains
a separate density/search-scope hint and does not override the country content ranges.
The command registers the city with the shared City Engine without copying components or routes.

Village SPA order: Restaurants → Coffee → Guest Houses → Things to do → Essential Information → My Favorites.

City SPA order: Restaurants → Coffee → Guest Houses → Rental Scooter → Gym & Fitness → Market & Shopping → Essential Information → My Favorites.

`My Favorites` is appended by the SPA engine for every settlement and is not part of the generated category count.

## Laos content targets

The versioned generation contract lives in `pipeline/contracts/content-targets.json`. Numeric values are
selected deterministically from the configured range using the country/city/category seed: different cities
vary naturally, while rebuilding the same city keeps the same target.

Village targets:
- Restaurants: 10–15, including a nested Bar research target of 3–5. Bar is not a standalone category.
- Coffee: 10–15.
- Guest Houses: 12–19.

City targets:
- Restaurants: 19–25.
- Coffee: 19–25.
- Guest Houses: 19–25.
- Rental Scooter: 5–12.

There is deliberately no numeric minimum/target/maximum for Gym & Fitness, Market & Shopping,
Essential Information, or Things to do unless a later country contract explicitly adds one.

For Essential Information in Laos, research always attempts to identify a hospital, a tourism office,
and a visa-extension location. These are search priorities, not guaranteed records: if a valid local option
does not exist or cannot be verified, generation does not invent one.

`pnpm generate-city laos city-slug --dry-run` validates the source container and
shows the deterministic output plan. Without `--dry-run`, it fills only unlocked
gaps and re-syncs the settlement/category generation contract before writing. Older draft containers
without a persisted `researchPlan` are migrated automatically on their next non-dry-run refresh.
It never overwrites fields listed in `manualLocks` with `source: manual` and
`locked: true`. Locks live on the relevant city/entity record as `manualLocks["nested.field"]`; a lock on a parent path protects its children. Pipeline-draft root locks are not supported.

Candidate-discovery data may name a business from TripAdvisor, but that source is
restricted to `candidate-discovery` and `name-only`. Descriptions, ratings, reviews,
rankings, photos, and editorial wording from competing guide or booking platforms
are rejected. All publishable prose is generated from independently recorded facts.
