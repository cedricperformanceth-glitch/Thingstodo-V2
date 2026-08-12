# SPA card photo workflow

This step chooses the image slot used by SPA cards. It also prepares a reusable-photo reserve for Things to do, but it does not generate or modify Field Card media yet.

## Automatic discovery

Prefer, in order:

1. a manual owned/authorized image already locked by the editor;
2. Wikimedia Commons;
3. Openverse as a broad open-media discovery index;
4. public-domain repositories;
5. official sources only when the individual asset has an explicit compatible reuse licence;
6. other explicit open-licence sources.

Openverse is a discovery layer, not a reason to lower the licence or identity rules. Atlas currently auto-materializes an Openverse result only when its source is a Wikimedia Commons file page that can be re-checked through the Commons API for the source licence, author and dimensions. Other Openverse results remain discovery leads until a source-specific verifier exists.

Flickr is not part of the active Atlas discovery pipeline. The project must not require a Flickr API subscription or key to generate a city.

## Photo policy by entity type

### General Places

Restaurants, cafes, accommodation and other practical Place cards have **one photo only**.

The engine may evaluate several reusable candidates while searching, ranks them using the normal media criteria, selects the single best image for `media.card.image`, and discards reusable surplus from generated Place data. A general Place must never create `media.research.activityPhotoReserve`.

First-party editorial leads are separate from reusable photos. They may still be retained under `media.research.firstPartyPhotoLeads` for later human review, but they do not create additional public Place images.

### Things to do

Things to do also have **one primary SPA photo**, selected using the same ranking and validation rules.

Unlike a general Place, finding one qualified activity photo does **not** stop discovery. Atlas continues looking for additional qualified reusable images and stores the surplus under:

`media.research.activityPhotoReserve`

This reserve is intended to feed the future Field Card media workflow. It does not populate `media.fieldCard.gallery` yet and therefore cannot change the current Field Card presentation by itself.

Activity discovery aims to retain as many useful qualified images as practical, with a current technical safety cap of 24 reusable reserve images per activity. This cap is a storage safeguard, not a final admin/editorial rule.

## First-party discovery for editorial leads

When research has identified an establishment's official website, Facebook page or Instagram profile, Atlas scans that first-party page as a separate discovery layer. It looks for public page metadata such as `og:image`, `twitter:image` or the legacy `image_src` preview. On ordinary official websites it also scans page/gallery `<img>` elements, resolves relative and lazy-loaded image URLs, and filters obvious logos, icons, sprites and undersized decorative assets. Social-network pages stay restricted to public preview metadata because their HTML frequently contains unrelated interface imagery. Each page request has a short timeout so a dead or slow establishment site cannot stall a city generation.

First-party sources can be supplied directly through `firstPartySources`, `officialWebsiteUrl`, `websiteUrl`, `socialLinks` / `socialUrls`, or through a research source explicitly marked first-party. The generator also supports an optional versioned `pipeline/sources/<country>/<city>.first-party.mjs` enrichment shard. That shard maps entity IDs to official-source URLs and is loaded generically before media discovery; it contains destination data, not destination-specific generator logic. Booking, Agoda, TripAdvisor, Google and similar third-party hosts are never inferred to be first-party sources.

For read-only diagnostics, `npm run audit:first-party -- <country> <city>` reports how many configured official pages are reachable and how many image/page-only leads are discovered. It never publishes or rewrites content.

These results are **editorial leads, not reusable media candidates**. Publishing a photo on an official website or social account does not by itself prove Atlas has reuse rights. Therefore every first-party lead is stored with:

- `rightsStatus = "unconfirmed-first-party"`;
- `autoPublishable = false`;
- `editorialAction = "review-rights-before-use"`.

The leads are ranked by whether an actual image was found, identity confidence, source type and page accessibility, then persisted under `media.research.firstPartyPhotoLeads` for later admin/editor review. They never satisfy the automatic SPA photo slot on their own.

Google Image results, booking/travel platforms, social networks and generic web images may help identify that an image exists, but they are not automatically reusable media sources. The individual asset still needs a valid reuse right.

Network discovery is best-effort. `--skip-photo-discovery` or `ATLAS_OFFLINE=1` disables it.

## Automatic acceptance

An automatic image is usable only when all of the following are true:

- it is verified as showing the exact selected place/activity;
- subject confidence is at least 0.90;
- source confidence is at least 0.75;
- the individual asset has a compatible licence;
- source URL is recorded;
- attribution author is recorded when required;
- minimum size is 640×400.

Automatic accepted licences are Public Domain, CC0, CC BY and CC BY-SA. Unknown/all-rights-reserved and non-commercial licences are rejected for automatic Atlas use.

When several photos qualify, the engine prefers the strongest subject match, then source confidence, then resolution. A manual photo always wins the primary SPA slot.

## No-photo state

No qualified image is a valid result. The engine must not:

- generate an AI image;
- substitute a generic destination image;
- use a photo of a similar establishment;
- lower licence/identity standards just to fill the slot.

Instead it writes:

- `spaCard.photoStatus = "missing"`;
- `spaCard.photoRequiresManualFill = true`;
- no `media.card.image`.

The public SPA card keeps the full photo slot and displays the neutral `Photo to add` placeholder. First-party leads can still be present in `media.research.firstPartyPhotoLeads` even while the public card remains in the missing-photo state.

## Attribution

For selected external media and activity reserve media, source URL, source name, author and licence are retained when available. Cards display a small linked photo credit when attribution metadata exists.
