# Atlas content pipeline

The scripts in `/scripts` run only for developers. The public Astro runtime reads
static, versioned content and never researches businesses, maps, or media for a visitor.

`pnpm create-city laos city-slug --profile compact` creates a valid empty City
module and a versioned pipeline container. It registers the city with the shared
City Engine without copying components or routes.

`pnpm generate-city laos city-slug --dry-run` validates the source container and
shows the deterministic output plan. Without `--dry-run`, it fills only unlocked
gaps. It never overwrites fields listed in `manualLocks` with `source: manual` and
`locked: true`. Locks live on the relevant city/entity record as `manualLocks["nested.field"]`; a lock on a parent path protects its children. Pipeline-draft root locks are not supported.

Candidate-discovery data may name a business from TripAdvisor, but that source is
restricted to `candidate-discovery` and `name-only`. Descriptions, ratings, reviews,
rankings, photos, and editorial wording from competing guide or booking platforms
are rejected. All publishable prose is generated from independently recorded facts.
