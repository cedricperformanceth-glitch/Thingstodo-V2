# SPA card photo workflow

This step covers only the image slot used by SPA cards. It does not generate or modify Field Card media.

## Automatic discovery

Prefer, in order:

1. a manual owned/authorized image already locked by the editor;
2. Wikimedia Commons;
3. public-domain repositories;
4. official sources only when the individual asset has an explicit compatible reuse licence;
5. other explicit open-licence sources.

Google Image results, booking/travel platforms, social networks and generic web images may help identify that an image exists, but they are not automatically reusable media sources. The individual asset still needs a valid reuse right.

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
