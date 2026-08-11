# Atlas content pipeline

The scripts in `/scripts` run only for developers. The public Astro runtime reads
static, versioned content and never researches businesses, maps, or media for a visitor.

`pnpm create-city laos city-slug --settlement village --profile compact` creates a valid empty City
module and a versioned pipeline container. `--settlement` is mandatory and accepts only
`village` or `city`; it selects the universal SPA category contract. The profile remains
a separate density/content-volume setting. The command registers the city with the shared
City Engine without copying components or routes.

Village SPA order: Things to do → Guest Houses → Restaurants → Coffee → Essential Information → My Favorites.

City SPA order: Things to do → Guest Houses → Restaurants → Coffee → Rental Scooter → Gym & Fitness → Market & Shopping → Essential Information → My Favorites.

`pnpm generate-city laos city-slug --dry-run` validates the source container and
shows the deterministic output plan. Without `--dry-run`, it fills only unlocked
gaps. It never overwrites fields listed in `manualLocks` with `source: manual` and
`locked: true`. Locks live on the relevant city/entity record as `manualLocks["nested.field"]`; a lock on a parent path protects its children. Pipeline-draft root locks are not supported.

Candidate-discovery data may name a business from TripAdvisor, but that source is
restricted to `candidate-discovery` and `name-only`. Descriptions, ratings, reviews,
rankings, photos, and editorial wording from competing guide or booking platforms
are rejected. All publishable prose is generated from independently recorded facts.
