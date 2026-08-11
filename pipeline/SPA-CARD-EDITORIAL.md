# SPA card editorial generation

This document covers Step 5 only: turning verified research facts into the small pieces of visitor-facing copy used by SPA cards. It does not generate Field Cards.

## Principle

The writing layer receives verified facts, not raw search results. It may vary wording naturally, but it may not invent facts, fill gaps from general knowledge, copy source prose, alter the verified establishment name, replace the selected photo, or change the Google Maps URL.

If a required activity field cannot be supported by verified facts, the candidate goes to manual review rather than being completed by guesswork.

## Atlas voice

The English copy should feel like a knowledgeable traveller sharing a useful address with another traveller: friendly, warm, cordial, polite and lightly endearing. It should not sound like an advert, a ranked review, SEO filler or a tourism-board slogan.

Avoid unsupported superlatives and stock phrases such as “must-see”, “hidden gem”, “perfect” or “the best”. Do not pretend Atlas personally visited a place unless that fact was actually recorded manually.

## Short description

Target 18–38 words; hard maximum 45 words; normally one or two sentences.

For a practical place:
1. say what the place actually is;
2. add one useful, verified specific detail;
3. naturally explain what kind of traveller moment it may fit.

For an activity:
1. say what the visitor actually does or sees;
2. add one useful, verified specific detail;
3. convey the character of the experience without hype.

## Three handwritten photo tags

Generate exactly three distinct notes, each one or two words. They should summarize different useful aspects rather than repeat the establishment name.

Preferred axes for a practical place are setting/identity, use/experience, and timing/character. For an activity they are setting/feature, action/experience, and timing/character. These axes are guidance, not a reason to invent unsupported information.

## Hours

Hours are optional. Use them only when current hours are reasonably verified. Conflicting or stale hours are omitted rather than guessed. The final card uses concise 24-hour wording, for example `Daily · 07:30–18:00`.

## Activity metadata

Duration is mandatory and uses the least-false useful precision supported by the evidence: `45 min`, `1–2 hours`, `Half-day`, `Full day`, `2 days`, etc.

Cost is only `free` or `paid` on the SPA card. `free` means no mandatory entry or participation fee; an optional donation does not make an activity paid. `paid` means a mandatory ticket, entry, rental, tour or operator fee.

Best time is mandatory and remains a short human label such as `Sunset`, `Early morning`, `Sunday morning`, `Late afternoon` or `Dry season`. It must come from a defensible reason in the verified facts. If there is no defensible recommendation, the activity goes to manual review.

## Traceability

The editorial output includes internal `evidenceRefs`. Every generated field points back to one or more verified fact IDs. These references stay in pipeline metadata and are not visitor-facing copy.

The pipeline rejects unknown fact IDs, missing evidence for required fields, unsupported promotional language, duplicate/oversized handwritten tags, incomplete activity metadata and any attempt to include Field Card content.

## Provider independence

The contract deliberately does not depend on a specific AI provider. `buildSpaCardEditorialBrief()` produces the structured brief a future model call consumes. `materializeSpaCardEditorial()` validates the returned editorial draft and either produces a SPA-ready candidate or returns `manual-review`.

`generate-city` can already consume an `editorialDraft` supplied by the future research/generation layer. The actual model/API orchestration belongs to the later end-to-end automation step, not to the public Astro runtime.
