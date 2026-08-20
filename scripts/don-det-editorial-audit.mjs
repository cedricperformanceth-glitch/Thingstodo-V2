import assert from 'node:assert/strict';
import fs from 'node:fs';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));

const city = readJson('pipeline/cities/laos/don-det.json');
const editorial = {
  hero: readJson('src/content/field-card-hero-copy.json'),
  quickRead: readJson('src/content/field-card-quick-read-copy.json'),
  primaryStory: readJson('src/content/field-card-primary-story-copy.json'),
  secondaryStory: readJson('src/content/field-card-secondary-story-copy.json'),
  practical: readJson('src/content/field-card-practical-copy.json'),
  faq: readJson('src/content/field-card-faq-copy.json'),
  media: readJson('src/content/field-card-media-copy.json'),
  seo: readJson('src/content/field-card-seo-copy.json'),
  spa: readJson('src/content/spa-thing-card-copy.json'),
  sources: readJson('src/content/field-card-source-copy.json'),
};

const things = city.things ?? [];
assert.equal(things.length, 11, 'Don Det must keep exactly 11 Things to do');
assert.equal(new Set(things.map((thing) => thing.id)).size, things.length, 'Don Det Thing IDs must be unique');

for (const thing of things) {
  const id = thing.id;
  assert.ok(editorial.hero[id], `${id}: missing editorial Hero`);
  assert.ok(editorial.quickRead[id], `${id}: missing editorial Quick Read`);
  assert.ok(editorial.primaryStory[id], `${id}: missing editorial primary story`);
  assert.ok(Object.prototype.hasOwnProperty.call(editorial.secondaryStory, id), `${id}: secondary-story decision must be explicit (content or null)`);
  assert.ok(editorial.practical[id], `${id}: missing editorial practical notes`);
  assert.equal(editorial.faq[id]?.length, 5, `${id}: editorial FAQ must contain exactly five items`);
  assert.ok(editorial.seo[id], `${id}: missing editorial SEO`);
  assert.ok(editorial.spa[id], `${id}: missing editorial SPA card`);
  assert.ok(editorial.sources[id]?.length, `${id}: missing final editorial sources`);

  const media = editorial.media[id];
  assert.ok(media?.length >= 1, `${id}: at least one editorial image is required`);
  assert.equal(editorial.seo[id].image, media[0].src, `${id}: SEO image must match the first editorial image`);

  assert.equal(editorial.spa[id].handwrittenTags?.length, 3, `${id}: SPA card must keep exactly three handwritten tags`);
  assert.ok(editorial.spa[id].gettingThere, `${id}: SPA gettingThere is required`);
  assert.ok(editorial.spa[id].duration, `${id}: SPA duration is required`);
  assert.ok(['free', 'paid'].includes(editorial.spa[id].costType), `${id}: SPA costType must be free or paid`);
  assert.ok(editorial.spa[id].bestTime, `${id}: SPA bestTime is required`);

  for (const photo of media) {
    assert.ok(photo.id && photo.src && photo.alt, `${id}: every editorial photo needs id, src and alt`);
    assert.ok(photo.sourceName, `${id}: every editorial photo needs sourceName`);
    assert.ok(photo.license, `${id}: every editorial photo needs a recorded licence`);
    assert.equal(photo.manual, true, `${id}: editorial photos must be manual overrides`);
    assert.equal(photo.locked, true, `${id}: editorial photos must be locked`);
  }

  for (const source of editorial.sources[id]) {
    assert.ok(source.sourceName, `${id}: sourceName is required`);
    assert.ok(source.sourceUrl, `${id}: final editorial sources must have a URL`);
    assert.doesNotMatch(source.sourceUrl, /thingstodoatlas/i, `${id}: Atlas/V1 must never be used as a final editorial source`);
  }
}

const compactWithoutSecondary = [
  'thing-4000-islands-kayaking',
  'thing-cycle-don-det-don-khon',
  'thing-don-det-tubing',
  'thing-don-det-sunset',
];
for (const id of compactWithoutSecondary) {
  assert.equal(editorial.secondaryStory[id], null, `${id}: compact activity must not regain filler secondary content`);
}

const genericRuntimeFiles = [
  'src/engines/field-card/field-card-engine.ts',
  'src/engines/field-card/related-activities-engine.ts',
  'src/engines/explore-board/explore-board-engine.ts',
  'src/components/cards/ThingToDoCard.astro',
  'src/components/field-card/FieldCard.astro',
  'src/pages/[country]/[city]/things-to-do/[slug].astro',
];
for (const path of genericRuntimeFiles) {
  const source = fs.readFileSync(path, 'utf8');
  assert.doesNotMatch(source, /don-det|thing-don-det/i, `${path}: generic runtime must not contain Don Det-specific branches`);
}

console.log(`Don Det final editorial audit passed: ${things.length}/11 activities complete and detached from generic runtime.`);
