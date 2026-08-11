# Atlas content pipeline

The scripts in `/scripts` run only for developers. The public Astro runtime reads
static, versioned content and never researches businesses, maps, or media for a visitor.

`pnpm create-city laos city-slug --settlement village --profile compact` creates a valid empty City
module and a versioned pipeline container. `--settlement` is mandatory and accepts only
`village` or `city`; it selects the universal SPA category contract. The profile remains
a separate density/search-scope hint and does not override the country content ranges.
The command registers the city with the shared City Engine without copying components or routes.

Village SPA order: Things to do → Restaurants → Coffee → Guest Houses → Essential Information → My Favorites.

City SPA order: Things to do → Restaurants → Coffee → Guest Houses → Rental Scooter → Gym & Fitness → Market & Shopping → Essential Information → My Favorites.

`My Favorites` is appended by the SPA engine for every settlement and is not part of the generated category count.

## Laos content targets

The versioned generation contract lives in `pipeline/contracts/content-targets.json`. Automatic numeric values are
selected deterministically from the configured range using the country/city/category seed: different cities
vary naturally, while rebuilding the same city keeps the same automatic target.

Things to do is different from the automatic address categories. For every Laos settlement it has:
- hard minimum: 7 activities;
- ideal editorial range: 19–28 activities;
- hard maximum: 35 activities;
- selection mode: editorial.

The future admin/editor chooses the actual Things to do target for each settlement. Until an editorial target is
selected, the pipeline keeps the policy but does not invent a numeric activity target. The selected value is stored
in `cityData.categoryTargets["things-to-do"]` with a manual lock on `categoryTargets.things-to-do`; subsequent
generation refreshes preserve that choice. Values outside 7–35 are rejected.

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

Geographic scope:
- search the requested city or village first;
- normally stay within roughly 2 km of it;
- the automatic scan may extend to a maximum of 3 km around the settlement;
- farther editorial additions can still be made manually later.

General selection style:
- favor affordable and normal mid-range places rather than luxury;
- keep enough variety that every shortlist is not made of identical price/style choices;
- manual editorial additions are expected after automatic generation.

Restaurants / Coffee / Rental Scooter:
- use their ordinary real-world meaning;
- bars belong inside Restaurants, never in a standalone category;
- no extra automatic public-facing subcategory/filter system is required.

Guest Houses / accommodation:
- suitable guesthouses, hostels, small hotels and budget hotels are valid candidates;
- there is no hard minimum nightly price;
- the main target price band is USD 10–30 per night;
- USD 50 per night is the automatic hard ceiling;
- at most three selected stays may sit in the upper part of the range, so a few pool/nicer options can exist without turning the guide into a luxury-hotel list.

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
- tourism and immigration entries must be official offices, not commercial agencies;
- visa agencies and travel agencies are explicitly excluded as substitutes;
- extra practical information is expected to be added manually when useful.

Things to do remains editorially count-controlled as described above. Step 2 does not impose an automatic
subcategory taxonomy or visible filter system on activities.

## Candidate discovery and existence checks

Candidate discovery may use a broad mix of public sources: official establishment websites, official tourism
sites, general web-search results, travel platforms, social networks, and other public sources. Repeated appearance
across independent sources is a useful discovery/ranking signal, but repetition alone is not proof. Before an
establishment is accepted as current, the research stage must verify that it still exists using current public or
official signals. A place that cannot be reasonably verified as active is not invented or silently treated as current.

Travel and booking platforms are discovery inputs, not sources to copy from. Descriptions, ratings, reviews,
rankings, photos, and editorial wording from competing guide or booking platforms are not republished. TripAdvisor
candidate discovery remains restricted to name-only use. Publishable prose is generated from independently recorded
facts and attributable public sources.

`pnpm generate-city laos city-slug --dry-run` validates the source container and
shows the deterministic output plan. Without `--dry-run`, it fills only unlocked
gaps and re-syncs the settlement/category generation contract before writing. Older draft containers
without a persisted `researchPlan` are migrated automatically on their next non-dry-run refresh.
It never overwrites fields listed in `manualLocks` with `source: manual` and
`locked: true`. Locks live on the relevant city/entity record as `manualLocks["nested.field"]`; a lock on a parent path protects its children. Pipeline-draft root locks are not supported.
