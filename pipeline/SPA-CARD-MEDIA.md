# SPA card photo workflow

Atlas keeps automatic photo generation deliberately small. The only automatic photo search source is **Wikimedia Commons**, queried directly through the Commons API.

No Openverse, Flickr, social-network, official-site, booking-platform or generic web-image crawler participates in automatic photo generation.

## Priority

1. A manual owned/authorized image already supplied and locked by the editor always wins.
2. Otherwise Atlas searches Wikimedia Commons directly.
3. If no exact, reusable Commons image qualifies, the card stays in the `Photo to add` state for manual completion.

A future Google/Places photo integration may be added separately if Atlas obtains the appropriate API and usage rights. It is not implemented by this workflow.

## Wikimedia Commons acceptance

A Commons result is usable automatically only when all of the following are true:

- it represents the exact selected place/activity;
- subject confidence is at least 0.90;
- the source is Wikimedia Commons;
- the source page is retained;
- the individual file licence is Public Domain, CC0, CC BY or CC BY-SA;
- attribution author is retained when required;
- minimum size is 640×400.

Unknown, all-rights-reserved, non-commercial and no-derivatives media are rejected.

The Commons API returns search results, source metadata, file dimensions and licence metadata in the same source flow. Atlas does not use another search engine as an intermediary.

Network discovery is best-effort. `--skip-photo-discovery` or `ATLAS_OFFLINE=1` disables it.

## Places

Restaurants, cafes, accommodation and other Place cards have one public SPA photo. Atlas may inspect several Commons matches returned by the query, selects the best qualified image and does not retain Place surplus.

## Things to do

Things to do also have one primary SPA photo. When the same Commons query returns additional qualified images, Atlas may retain them under:

`media.research.activityPhotoReserve`

This reserve is intended for the future universal Field Card layout. It does not populate `media.fieldCard.gallery` and does not alter the current Field Card presentation by itself. The current safety cap is 24 reserve candidates per activity.

## No-photo state

No qualified image is a valid result. Atlas must not:

- generate an AI image;
- substitute another establishment or attraction;
- use a generic destination photo;
- search social networks or ordinary websites for a fallback;
- lower licence or identity standards just to fill the slot.

Instead it writes:

- `spaCard.photoStatus = "missing"`;
- `spaCard.photoRequiresManualFill = true`;
- no `media.card.image`.

The SPA keeps the full photo slot and displays `Photo to add`. The editor can later supply an authorized image manually.

## Attribution

For selected Commons media and activity reserve media, Atlas retains source URL, source name, author and licence metadata. A manual image can carry its own attribution metadata when needed.
