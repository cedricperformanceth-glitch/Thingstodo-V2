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
const cityOverrides = readFileSync(new URL('../src/content/city-runtime-overrides.ts', import.meta.url), 'utf8');
const thingOverrides = readFileSync(new URL('../src/content/thing-runtime-overrides.ts', import.meta.url), 'utf8');
const mediaOverrides = readFileSync(new URL('../src/content/field-card-media-don-det-overrides.ts', import.meta.url), 'utf8');
const mediaRouter = readFileSync(new URL('../src/content/field-card-media-router.ts', import.meta.url), 'utf8');
const fieldCardEngine = readFileSync(new URL('../src/engines/field-card/field-card-engine.ts', import.meta.url), 'utf8');
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

assert.ok(mediaRouter.includes('applyDonDetMediaCorrections'), 'Don Det media corrections must be applied by the canonical media policy.');
assert.ok(fieldCardEngine.includes('applyCanonicalActivityMediaPolicy'), 'The Field Card runtime must apply the canonical media policy.');
const spaDescriptions = [];
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
    if (media.sourceType !== 'manual') {
      assert.ok(media.sourceUrl?.startsWith('http'), `Missing source URL for ${thing.id}: ${media.id}`);
      assert.ok(media.author?.trim(), `Missing media author for ${thing.id}: ${media.id}`);
      assert.ok(media.license?.trim(), `Missing media licence for ${thing.id}: ${media.id}`);
      const rawLicenceIsVague = /^cc-by(?:-sa)?$/i.test(media.license.trim()) || /see .*file page/i.test(media.license);
      if (rawLicenceIsVague) {
        assert.ok(hasExplicitMediaOverride(media.id), `Vague media licence has no canonical explicit override for ${thing.id}: ${media.id}`);
      }
    }
  }
}
assert.equal(new Set(spaDescriptions).size, spaDescriptions.length, 'Don Det activity SPA descriptions must remain unique.');
assert.ok(thingRegistry.includes("photoStatus: 'verified' as const"), 'Editorial activity media must synchronize runtime photo status.');
assert.ok(thingRegistry.includes('fieldCard: { ...baseMedia.fieldCard, gallery: editorialMedia }'), 'Editorial media must remain the runtime activity-gallery input.');
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
}

console.log(`Don Det publication contract passed: ${data.things.length} activities, ${data.places.length} places, ${stalePhotoLocks.length} historical photo locks safely normalized at runtime.`);
