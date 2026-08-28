import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function generatedData() {
  const source = readFileSync(new URL('../src/content/generated/laos/don-det.ts', import.meta.url), 'utf8');
  const marker = 'const data = ';
  const start = source.indexOf(marker);
  const end = source.indexOf('\nexport const city =', start);
  assert.ok(start >= 0 && end > start, 'Unable to parse generated Don Det payload.');
  return JSON.parse(source.slice(start + marker.length, end).trim().replace(/;$/, ''));
}

const data = generatedData();
const editorial = JSON.parse(readFileSync(new URL('../src/content/field-card-editorial.json', import.meta.url), 'utf8'));
const fieldNote = JSON.parse(readFileSync(new URL('../src/content/city-field-note-editorial-don-det.json', import.meta.url), 'utf8'));
const fieldNoteMedia = JSON.parse(readFileSync(new URL('../src/content/city-field-note-media-copy.json', import.meta.url), 'utf8'))['city-don-det'];
const provenanceRegistry = JSON.parse(readFileSync(new URL('../pipeline/media-provenance.json', import.meta.url), 'utf8'));
const provenanceById = new Map(provenanceRegistry.items.map((item) => [item.id, item]));
const cityOverrides = readFileSync(new URL('../src/content/city-runtime-overrides.ts', import.meta.url), 'utf8');
const thingOverrides = readFileSync(new URL('../src/content/thing-runtime-overrides.ts', import.meta.url), 'utf8');
const mediaOverrides = readFileSync(new URL('../src/content/field-card-media-don-det-overrides.ts', import.meta.url), 'utf8');
const editorialLoader = readFileSync(new URL('../src/content/field-card-editorial-data.ts', import.meta.url), 'utf8');
const placeRegistry = readFileSync(new URL('../src/content/registry/places.ts', import.meta.url), 'utf8');
const thingRegistry = readFileSync(new URL('../src/content/registry/things-to-do.ts', import.meta.url), 'utf8');

const hasExplicitMediaOverride = (id) => {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const block = mediaOverrides.match(new RegExp(`'${escaped}':\\s*\\{([\\s\\S]*?)\\n\\s*\\},`))?.[1] ?? '';
  return /license:\s*'CC BY-SA 4\.0'/.test(block) && /author:\s*'Christophe95'/.test(block);
};

const tubingSupplementId = 'tubing-don-det-golden-hour-pirogue';
assert.ok(mediaOverrides.includes(tubingSupplementId), 'Tubing must retain its third canonical media record.');
assert.ok(mediaOverrides.includes('Pirogue_running_on_the_Mekong_at_golden_hour_between_Don_Det_and_Don_Khon_Laos.jpg'), 'Tubing supplement must remain an exact Don Det / Don Khon Mekong image.');
assert.ok(mediaOverrides.includes("author: 'Basile Morin'"), 'Tubing supplement must retain its Wikimedia author.');
assert.ok(mediaOverrides.includes("license: 'CC BY-SA 4.0'"), 'Tubing supplement must retain its explicit Wikimedia licence.');
assert.ok(mediaOverrides.includes("provenance: 'wikimedia'"), 'Don Det Wikimedia activity media must receive explicit Wikimedia provenance.');
assert.ok(mediaOverrides.includes("treatment: 'none'"), 'Don Det Wikimedia activity media must record no AI treatment.');
assert.ok(mediaOverrides.includes("'public-domain'"), 'CC0/public-domain Commons media must retain a public-domain rights basis.');
assert.ok(mediaOverrides.includes("'open-license'"), 'Open-licence Commons media must retain an open-license rights basis.');

assert.equal(data.city.id, 'city-don-det');
assert.equal(data.city.slug, 'don-det');
assert.deepEqual(data.city.categories, ['things-to-do', 'restaurants', 'cafes', 'accommodation', 'practical-services']);
assert.ok(data.city.seo.indexable, 'Don Det city must remain indexable.');
assert.ok(cityOverrides.includes("'city-don-det'"), 'Don Det needs a canonical city runtime override.');
assert.ok(cityOverrides.includes('Plan Don Det in Si Phan Don'), 'Don Det city SEO description must remain editorial, not generic.');

const expectedThingIds = [
  'thing-old-french-railway-bridge',
  'thing-li-phi-somphamit-waterfalls',
  'thing-khone-phapheng-falls',
  'thing-don-som-island',
  'thing-khone-pa-soi-waterfall',
  'thing-xai-kong-nyai-beach',
  'thing-si-phan-don-by-boat',
  'thing-4000-islands-kayaking',
  'thing-cycle-don-det-don-khon',
  'thing-don-det-tubing',
  'thing-don-det-sunset',
];
assert.equal(data.things.length, expectedThingIds.length, `Expected ${expectedThingIds.length} Don Det activities; found ${data.things.length}.`);
assert.deepEqual(new Set(data.things.map((thing) => thing.id)), new Set(expectedThingIds));

assert.ok(editorialLoader.includes('applyDonDetMediaCorrections(thakhekMedia, id)'), 'Don Det media corrections must remain scoped by the canonical activity id.');
const spaDescriptions = [];
const manualActivityMediaIds = new Set();
let wikimediaActivityMediaCount = 0;
for (const thing of data.things) {
  const entry = editorial[thing.id];
  assert.ok(entry, `Missing canonical Field Card editorial for ${thing.id}.`);
  for (const key of ['faq', 'hero', 'practical', 'primaryStory', 'quickRead', 'seo', 'sources', 'spa']) {
    assert.ok(entry[key], `Missing ${key} editorial for ${thing.id}.`);
  }
  assert.ok(entry.faq.length >= 3, `Don Det FAQ is too thin for ${thing.id}.`);
  assert.ok(entry.sources.length >= 2, `Don Det sourcing is too thin for ${thing.id}.`);
  assert.ok(entry.seo.description.length >= 100 && entry.seo.description.length <= 190, `SEO description length is weak for ${thing.id}: ${entry.seo.description.length}.`);
  assert.ok(entry.spa.description.length >= 85, `SPA description is too short for ${thing.id}.`);
  spaDescriptions.push(entry.spa.description.trim());

  const effectiveMediaCount = entry.media.length + (thing.id === 'thing-don-det-tubing' ? 1 : 0);
  assert.ok(Array.isArray(entry.media) && effectiveMediaCount >= 3, `Expected at least 3 effective editorial media records for ${thing.id}; found ${effectiveMediaCount}.`);
  for (const media of entry.media) {
    assert.ok(media.src.startsWith('/assets/') || media.src.startsWith('https://commons.wikimedia.org/wiki/Special:Redirect/file/'), `Non-renderable media src for ${thing.id}: ${media.src}`);
    assert.ok(media.alt?.trim().length >= 20, `Weak media alt for ${thing.id}: ${media.id}`);

    if (media.sourceType === 'manual') {
      manualActivityMediaIds.add(media.id);
      assert.equal(media.id, 'xai-kong-nyai-beach-riverboats', `Unexpected non-Wikimedia Don Det activity media: ${thing.id}: ${media.id}`);
      continue;
    }

    assert.equal(media.sourceType, 'wikimedia', `Don Det activity photos must be Wikimedia unless explicitly identified as Atlas artwork: ${thing.id}: ${media.id}`);
    wikimediaActivityMediaCount += 1;
    assert.ok(media.sourceUrl?.startsWith('http'), `Missing source URL for ${thing.id}: ${media.id}`);
    assert.ok(media.author?.trim(), `Missing media author for ${thing.id}: ${media.id}`);
    assert.ok(media.license?.trim(), `Missing media licence for ${thing.id}: ${media.id}`);
    const rawLicenceIsVague = /^cc-by(?:-sa)?$/i.test(media.license.trim()) || /see .*file page/i.test(media.license);
    if (rawLicenceIsVague) {
      assert.ok(hasExplicitMediaOverride(media.id), `Vague media licence has no canonical explicit override for ${thing.id}: ${media.id}`);
    }
  }
}
assert.ok(wikimediaActivityMediaCount > 0, 'Don Det activity photo audit unexpectedly found no Wikimedia media.');
assert.deepEqual([...manualActivityMediaIds], ['xai-kong-nyai-beach-riverboats'], 'Only the known Xai Kong Nyai Atlas drawing may sit outside the Wikimedia activity-photo flow.');
assert.ok(mediaOverrides.includes("'xai-kong-nyai-beach-riverboats'"), 'Xai Kong Nyai drawing must have a canonical media override.');
assert.ok(mediaOverrides.includes("provenance: 'original-illustration'"), 'Xai Kong Nyai drawing must be classified as an original illustration.');
assert.ok(mediaOverrides.includes("rightsBasis: 'creator-owned'"), 'Xai Kong Nyai drawing must be creator-owned.');
assert.equal(provenanceById.get('xai-kong-nyai-beach-riverboats')?.provenance, 'original-illustration');
assert.equal(provenanceById.get('xai-kong-nyai-beach-riverboats')?.rightsBasis, 'creator-owned');
assert.ok(mediaOverrides.includes("sourceType === 'wikimedia'"), 'All effective Don Det Wikimedia activity media must be provenance-normalized at runtime.');
assert.ok(mediaOverrides.includes('wikimediaRightsBasis(corrected.license)'), 'Don Det Wikimedia rights basis must derive from each individual licence.');
assert.equal(new Set(spaDescriptions).size, spaDescriptions.length, 'Don Det activity SPA descriptions must remain unique.');
assert.ok(thingRegistry.includes("photoStatus: 'verified' as const"), 'Editorial activity media must synchronize runtime photo status.');
assert.ok(thingRegistry.includes('fieldCard: { ...thing.media.fieldCard, gallery: editorialMedia }'), 'Editorial media must remain the runtime activity gallery.');
assert.ok(thingOverrides.includes("'thing-don-som-island'"), 'Don Som identity correction must remain canonical.');
assert.ok(thingOverrides.includes("name: 'Don Som Island'"), 'Don Som must not regress to the broad Si Phan Don label.');
assert.ok(thingOverrides.includes("'thing-si-phan-don-by-boat'"), 'Boat activity must remain area-scoped rather than tied to one operator point.');

assert.ok(data.places.length >= 30, `Don Det place bank is unexpectedly thin: ${data.places.length}.`);
const placeDescriptions = data.places.map((place) => place.shortDescription.trim());
assert.equal(new Set(placeDescriptions).size, placeDescriptions.length, 'Don Det place descriptions must remain unique.');
for (const place of data.places) {
  assert.ok(place.shortDescription.length >= 75, `Place description is too thin: ${place.id}.`);
  assert.ok(place.media?.card?.image, `Missing Don Det place card media: ${place.id}.`);
  assert.ok(place.googleMapsUrl?.includes('google.com/maps'), `Missing specific Maps link: ${place.id}.`);
  assert.ok(place.researchSources?.length >= 1, `Missing research source: ${place.id}.`);
  const image = place.media.card.image;
  if (image.sourceType === 'manual') {
    assert.equal(image.license, 'User-supplied', `Manual Don Det media must retain its ownership label: ${place.id}.`);
    assert.equal(image.manual, true, `Manual Don Det media must remain manual: ${place.id}.`);
    assert.equal(image.locked, true, `Manual Don Det media must remain locked: ${place.id}.`);
  }
}

const stalePhotoLocks = data.places.filter((place) => {
  const hasPhoto = Boolean(place.media?.card?.image);
  const statusLock = place.manualLocks?.['spaCard.photoStatus']?.value;
  const fillLock = place.manualLocks?.['spaCard.photoRequiresManualFill']?.value;
  return hasPhoto && (statusLock === 'missing' || fillLock === true);
});
if (stalePhotoLocks.length) {
  assert.ok(placeRegistry.includes('hasCardImage'), 'Runtime must neutralize stale manual photo-status locks when a place has media.');
  assert.ok(placeRegistry.includes("photoStatus: 'verified' as const"), 'Runtime must publish existing place photos as verified.');
  assert.ok(placeRegistry.includes('photoRequiresManualFill: false'), 'Runtime must clear stale manual-fill state when a place photo exists.');
}
assert.ok(placeRegistry.includes("place.city === 'don-det'"), 'Don Det place metadata normalization must remain scoped.');
assert.ok(placeRegistry.includes("locationScope: 'area' as const"), 'Don Det centroid placeholders must remain marked as approximate areas.');
assert.ok(placeRegistry.includes("source.sourceName === 'Google Maps'"), 'Generic Don Det Google Maps research links must remain normalized to entity-specific links.');

assert.equal(fieldNote.id, 'city-don-det');
assert.equal(fieldNote.copy.chapters.length, 7, 'Don Det Field Note must retain its seven editorial chapters.');
assert.ok(fieldNote.sources.length >= 6, 'Don Det Field Note source bank is unexpectedly thin.');
assert.ok(fieldNote.seo.description.length >= 120, 'Don Det Field Note SEO description is too short.');
assert.equal(fieldNoteMedia.length, 4, 'Don Det Field Note must retain exactly four curated media records.');
for (const media of fieldNoteMedia) {
  assert.ok(media.sourceUrl?.includes('commons.wikimedia.org/wiki/File:'), `Field Note media source URL is not canonical: ${media.id}.`);
  assert.ok(media.author?.trim(), `Field Note media author missing: ${media.id}.`);
  assert.ok(media.license?.trim(), `Field Note media licence missing: ${media.id}.`);
  assert.equal(media.provenance, 'wikimedia', `Field Note provenance must record Wikimedia origin: ${media.id}.`);
  assert.equal(media.treatment, 'none', `Field Note media must record no AI treatment: ${media.id}.`);
  const expectedRights = media.id === 'don-det-field-note-ricefields' ? 'public-domain' : 'open-license';
  assert.equal(media.rightsBasis, expectedRights, `Field Note rights basis mismatch: ${media.id}.`);
  const registered = provenanceById.get(media.id);
  assert.ok(registered, `Field Note media missing from canonical provenance registry: ${media.id}.`);
  assert.equal(registered.entity, 'laos/don-det/city-field-note');
  assert.equal(registered.provenance, media.provenance);
  assert.equal(registered.rightsBasis, media.rightsBasis);
}

console.log(`Don Det publication contract passed: ${data.things.length} activities, ${wikimediaActivityMediaCount}+ Wikimedia activity photo records audited, ${manualActivityMediaIds.size} Atlas drawing exception, ${fieldNoteMedia.length} City Field Note media classified, ${data.places.length} places, ${stalePhotoLocks.length} historical photo locks safely normalized at runtime.`);
