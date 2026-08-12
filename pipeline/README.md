# Atlas content pipeline

The scripts in `/scripts` run only for developers. The public Astro runtime reads
static, versioned content and never researches businesses, maps, or media for a visitor.

`npm run create-city -- laos city-slug --settlement village --profile compact` creates a valid empty City
module and a versioned pipeline container. `--settlement` is mandatory and accepts only
`village` or `city`; it selects the universal SPA category allowance and seeds the initial
city category list. The profile remains a separate density/search-scope hint and does not
override the country content ranges.

`City.categories` is the explicit editorial source of truth for the categories enabled in a city and their order.
The admin/editor owns that decision. Generation validates the list against the settlement allowance and preserves it;
it must never silently replace the city's configured categories with a settlement default.
The command registers the city with the shared City Engine without copying components or routes.

Default village SPA order: Things to do → Restaurants → Coffee → Guest Houses → Essential Information → My Favorites.

Default city SPA order: Things to do → Restaurants → Coffee → Guest Houses → Rental Scooter → Gym & Fitness → Market & Shopping → Essential Information → My Favorites.

`My Favorites` is appended by the SPA engine for every settlement and is not part of `City.categories` or the generated category count.

## Laos content targets

The versioned generation contract lives in `pipeline/contracts/content-targets.json`. Automatic numeric values use
`random-once`: a value is drawn from the configured range when a city is first prepared, then persisted in the city draft.
Normal regeneration keeps that value. `--reroll-targets` deliberately redraws only automatic targets and leaves manually
locked editorial targets untouched.
Only categories enabled in `City.categories` receive a target or research plan.

Things to do is different from the automatic address categories:
- the admin/editor chooses the exact number for each settlement;
- hard minimum: 5 activities;
- hard maximum: 25 activities;
- until the admin selects a value, the pipeline stores the policy but does not invent a target;
- the selected value is manually locked and survives subsequent generation refreshes.

Village automatic targets:
- Restaurants: 10–15, including a nested Bar research target of 3–5. Bar is not a standalone category.
- Coffee: 10–15.
- Guest Houses: 12–19.

City automatic targets:
- Restaurants: 19–25.
- Coffee: 19–25.
- Guest Houses: 19–25.
- Rental Scooter: 5–12.

There is deliberately no global numeric target for Gym & Fitness, Market & Shopping,
or Essential Information. Their search limits and inclusion rules are defined separately in the selection contract.

For Essential Information in Laos, research always attempts to identify a hospital, a tourism office,
and the official immigration office used for immigration/visa-extension matters. These are search priorities,
not guaranteed records: if a valid local option does not exist or cannot be verified, generation does not invent one.
Visa agencies and travel agencies are not substitutes for the immigration office.

## Laos selection rules

`pipeline/contracts/content-selection.json` defines what the research stage is trying to select. These are internal
research rules, not visible SPA filters or additional public categories.

Geographic scope for practical addresses:
- search the requested city or village first;
- normally stay within roughly 2 km of it;
- the automatic scan may extend to a maximum of 3 km around the settlement;
- this radius applies to Restaurants, Coffee, Guest Houses, Rental Scooter, Gym & Fitness, Market & Shopping and Essential Information;
- it deliberately does **not** constrain Things to do;
- farther practical editorial additions can still be made manually later.

General selection style:
- favor affordable and normal mid-range places rather than luxury;
- keep enough variety that every shortlist is not made of identical price/style choices;
- manual editorial additions are expected after automatic generation.

### Automatic Place ranking

`pipeline/contracts/candidate-ranking.json` and `scripts/lib/candidate-ranking.mjs` rank verified practical Place candidates
before the category target is filled. Ranking is source-neutral: no booking, map or travel platform receives a built-in
vendor bonus.

The ranking can use a very small set of normalized `rankingSignals` supplied by the research stage:
- up to three independent reputation snapshots (source name, rating, rating scale, review count and observation date);
- proximity to the settlement;
- freshness of evidence;
- verification state;
- recent first-party social activity as a small positive signal;
- basic data completeness.

Different rating scales are normalized before comparison and large review counts have diminishing influence. Missing
ratings or missing social media never reject a candidate. Review text, excerpts and review corpora are forbidden from
ranking snapshots. The automatic shortlist remains a draft for later editorial review in the admin panel.

### Things to do

Things to do is the primary editorial category. For Laos, the existing Atlas activity database is the preferred seed
input. Seed entries are never accepted blindly: they are verified and enriched using the same public-source workflow
as newly discovered activities.

Activities:
- are linked to the destination but have no fixed kilometre radius;
- are selected for being distinct and genuinely useful/interesting to a visitor;
- avoid near-duplicate versions of the same experience;
- do not require a public-facing automatic subcategory taxonomy;
- use official tourism/government sources, institutional sources, Wikipedia/Wikimedia, Wikivoyage/Wikitravel,
  public web results, travel platforms, social networks and other public sources for discovery and cross-checking.

### Practical categories

Restaurants / Coffee / Rental Scooter:
- use their ordinary real-world meaning;
- bars belong inside Restaurants, never in a standalone category;
- no extra automatic public-facing subcategory/filter system is required.

Guest Houses / accommodation:
- suitable guesthouses, hostels, small hotels and budget hotels are valid candidates;
- there is no hard minimum nightly price;
- the main target price band is USD 10–30 per night;
- USD 50 per night is the automatic hard ceiling;
- at most three selected stays may sit in the upper part of the range.

Gym & Fitness:
- there is no minimum; an empty result is valid;
- scan fitness gyms and weight-training gyms, with at most five selected automatically;
- scan Muay Thai gyms separately inside the same Gym & Fitness category, ideally around two when available and never more than three automatically;
- anything more specialized can be added manually by the editor.

Market & Shopping:
- automatically look only for real markets and night markets;
- there is no minimum and no automatic need to fill the category with shops;
- other shopping entries are editorial/manual additions.

Essential Information:
- automatically search for a hospital, tourism office and immigration office;
- the immigration entry must be the actual official immigration office, never a commercial visa/travel agency substitute;
- extra practical information is expected to be added manually when useful.

## Source discovery, verification and reuse

`pipeline/contracts/source-verification.json` defines the Step 3 source workflow.

### Discovery budget

Research is adaptive rather than trying to scan a fixed huge number of sites:
- start with four discovery queries per category;
- expand when necessary, up to twelve queries per category;
- aim for a candidate pool around 1.5× the final target;
- stop once enough qualified candidates have been found and verified.

### Candidate identity and repeated mentions

Candidates are normalized by name, coordinates/address when available, and obvious aliases. Reposted/syndicated copies
of the same source are not counted as independent mentions. Repeated appearances across independent current sources
increase confidence/ranking, especially when an authoritative or first-party source is present.

The existing Atlas activity database is a seed source, not proof of current validity.

### Minimum evidence

For a business or commercial activity operator:
- normally require two independent current signals;
- at least one should be strong (official/first-party, government/tourism, authoritative current listing, or equivalent);
- a single weak travel/blog/social mention never auto-publishes a candidate.

For a static landmark or natural/cultural site:
- one current authoritative institutional source can confirm existence;
- otherwise require at least two independent signals.

Conflicting current evidence sends the candidate to manual review instead of guessing.

### Closure and existence checks

Strong operational signals include a current official site, recent first-party activity, an authoritative current
listing, or a permitted Places API operational status.

A candidate is considered permanently closed when:
- an official closure notice confirms it; or
- a permitted Places API status says `CLOSED_PERMANENTLY`; or
- three independent, explicit and recent closure reports are found (within 18 months), with no newer operational signal.

Temporary closure is not converted into permanent closure automatically. If a place moved, the replacement location
is followed only after verification.

Google review text is not scraped, copied or stored as Atlas source material. If Google Maps Platform is used,
status fields are preferred within the applicable Google terms.

### SPA photo discovery

Automatic photo discovery is deliberately limited to the Wikimedia Commons API. Atlas checks exact-entity metadata, file dimensions, source URL, author and a commercially compatible licence before a Commons image can fill the SPA photo slot. No Openverse, Flickr, social-network, official-site, booking-platform or generic web-image crawler is part of automatic generation.

If Commons returns no qualified image, the correct result is `Photo to add` for later manual completion. A future Google/Places photo integration can be added separately if the project adopts the appropriate API and usage terms. `--skip-photo-discovery` or `ATLAS_OFFLINE=1` disables the Commons request. Things to do may retain additional qualified Commons results from the same query in `media.research.activityPhotoReserve` for the future universal Field Card layout.

### Reuse/licensing policy

Publicly accessible does **not** automatically mean reusable. Atlas separates research/cross-checking from copying.

Facts:
- may be researched and cross-checked from public sources with provenance;
- Atlas prose is written independently rather than copied from travel guides/platforms.

Text:
- default is do not copy;
- reuse only when an explicit compatible licence permits it and all attribution/share-alike obligations are satisfied.

Media:
- every asset is checked individually;
- Public Domain, CC0, CC BY and CC BY-SA may be used when their exact terms are satisfied;
- unknown/all-rights-reserved assets are rejected without permission;
- non-commercial Creative Commons assets are rejected for normal Atlas commercial/advertising use;
- no-derivatives assets are not edited;
- author, licence, source URL and required attribution are stored.

Domain notes:
- Wikimedia Commons: check the licence on every individual file page;
- Wikipedia: excellent factual/reference input, but do not copy prose by default;
- Wikivoyage/Wikitravel: discovery/factual input by default; copied/adapted prose requires CC BY-SA compliance;
- UNESCO: authoritative factual source, but each text/photo/document must be checked for its specific reuse licence.

Travel and booking platforms are discovery and lightweight reputation inputs, not sources to copy from. Atlas may use a
small current rating snapshot as a ranking signal, but does not ingest review text or build a review database. Descriptions,
reviews, photos, and editorial wording from competing guide or booking platforms are not republished. TripAdvisor candidate
discovery remains restricted to name-only use outside the small normalized reputation signal.

`npm run generate-city -- laos city-slug --dry-run` validates the source container and shows the current persisted generation
plan and ranked output without writing Atlas content. Without `--dry-run`, it fills only unlocked gaps and re-syncs the
configured city/category generation contract before writing. Older draft containers without a persisted `researchPlan` are
migrated automatically on their next non-dry-run refresh. It never overwrites fields listed in `manualLocks` with
`source: manual` and `locked: true`. Locks live on the relevant city/entity record as `manualLocks["nested.field"]`; a lock
on a parent path protects its children. Pipeline-draft root locks are not supported.
