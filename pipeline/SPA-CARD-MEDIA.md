# SPA card photo workflow

This step covers only the image slot used by SPA cards. It does not generate or modify Field Card media.

## Automatic discovery

Prefer, in order:

1. a manual owned/authorized image already locked by the editor;
2. Wikimedia Commons;
3. Openverse as a broad open-media discovery index;
4. Flickr through the official API when a suitable `FLICKR_API_KEY` is configured and the individual photo licence permits Atlas use;
5. public-domain repositories;
6. official sources only when the individual asset has an explicit compatible reuse licence;
7. other explicit open-licence sources.

Openverse is a discovery layer, not a reason to lower the licence or identity rules: retain the original source landing page and verify the media metadata during editorial review. Flickr discovery asks Flickr for its current licence catalogue, filters out non-commercial/no-derivatives licences, and uses geo search when the entity has coordinates.

Google Image results, booking/travel platforms, social networks and generic web images may help identify that an image exists, but they are not automatically reusable media sources. The individual asset still needs a valid reuse right.

Network discovery is best-effort. `--skip-photo-discovery` or `ATLAS_OFFLINE=1` disables it. Missing Flickr configuration never blocks a city generation.

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

When several photos qualify, the engine prefers the strongest subject match, then source confidence, then resolution. A manual photo always wins.

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

The public SPA card keeps the full photo slot and displays the neutral `Photo to add` placeholder. This makes missing media immediately visible for later manual completion.

## Attribution

For selected external media, source URL, source name, author and licence are retained when available. Cards display a small linked photo credit when attribution metadata exists.
