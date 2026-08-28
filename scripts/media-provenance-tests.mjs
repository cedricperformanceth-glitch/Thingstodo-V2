import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const registry = JSON.parse(readFileSync(new URL('../pipeline/media-provenance.json', import.meta.url), 'utf8'));

const allowedProvenance = new Set([
  'original-illustration',
  'original-photography',
  'authorized-third-party',
  'ai-created',
  'wikimedia',
  'public-domain',
  'first-party-official',
]);
const allowedTreatment = new Set(['none', 'ai-refined', 'generative-edit']);
const allowedRightsBasis = new Set(['creator-owned', 'permission-granted', 'open-license', 'public-domain', 'official-source']);

assert.equal(registry.schemaVersion, 1);
assert.equal(registry.rules.personalPhotographyTreatment, 'ai-refined');
assert.ok(Array.isArray(registry.items));
assert.ok(registry.items.length >= 5);

for (const item of registry.items) {
  assert.ok(item.id, 'every provenance item needs an id');
  assert.ok(item.entity, `${item.id}: entity is required`);
  assert.ok(allowedProvenance.has(item.provenance), `${item.id}: invalid provenance`);
  assert.ok(allowedTreatment.has(item.treatment), `${item.id}: invalid treatment`);
  if (item.rightsBasis) assert.ok(allowedRightsBasis.has(item.rightsBasis), `${item.id}: invalid rightsBasis`);

  if (item.provenance === 'original-photography') {
    assert.equal(item.treatment, 'ai-refined', `${item.id}: all personal photography must be AI-refined`);
    assert.equal(item.rightsBasis, 'creator-owned');
  }
  if (item.provenance === 'authorized-third-party') {
    assert.equal(item.rightsBasis, 'permission-granted');
    assert.ok(item.permissionNote, `${item.id}: permission evidence/note is required`);
  }
  if (item.provenance === 'wikimedia') {
    assert.equal(item.sourceType, 'wikimedia');
    assert.ok(item.sourceUrl?.startsWith('https://commons.wikimedia.org/'), `${item.id}: Commons source URL is required`);
    assert.ok(item.sourceName, `${item.id}: source name is required`);
    assert.ok(item.author, `${item.id}: author is required for Wikimedia media`);
    assert.ok(item.license, `${item.id}: per-asset license is required`);
    assert.ok(['open-license', 'public-domain'].includes(item.rightsBasis), `${item.id}: Wikimedia rights basis must be explicit`);
  }
}

const byId = new Map(registry.items.map((item) => [item.id, item]));
assert.equal(byId.get('don-det-crazy-gecko-card')?.provenance, 'original-illustration');
assert.equal(byId.get('tad-lo-fandee-island-guesthouse-card')?.treatment, 'ai-refined');
assert.equal(byId.get('tad-lo-fandee-island-restaurant-card')?.rightsBasis, 'permission-granted');
assert.equal(byId.get('tad-lo-bolaven-garden-card')?.provenance, 'ai-created');
assert.equal(byId.get('tad-lo-tad-hang-waterfall-wikimedia-example')?.provenance, 'wikimedia');

const donDetRule = registry.destinationRules?.['laos/don-det'];
assert.equal(donDetRule?.cardMedia?.restaurants, 'original-illustration');
assert.equal(donDetRule?.cardMedia?.cafes, 'original-illustration');
assert.equal(donDetRule?.cardMedia?.accommodation, 'original-illustration');
assert.equal(donDetRule?.essentialInfo, 'authorized-third-party');
assert.equal(donDetRule?.heroPhoto, 'authorized-third-party');
assert.equal(donDetRule?.permissionBasis, 'permission-granted');

const donDetItems = registry.items.filter((item) => item.entity.startsWith('laos/don-det/'));
assert.equal(donDetItems.length, 43, 'Don Det should have 43 classified media assets in this pass');
assert.equal(new Set(donDetItems.map((item) => item.src)).size, 43, 'Don Det classified src paths must be unique');

const donDetIllustrations = donDetItems.filter((item) => item.provenance === 'original-illustration');
assert.equal(donDetIllustrations.length, 36, 'Don Det has 35 venue-card illustrations plus the Xai Kong Nyai activity drawing');
for (const item of donDetIllustrations) {
  assert.equal(item.rightsBasis, 'creator-owned');
  assert.equal(item.treatment, 'none');
  assert.ok(item.src.startsWith('/assets/cities/laos/don-det/'), `${item.id}: Don Det illustration must use a local Don Det asset`);
}

const xaiDrawing = byId.get('xai-kong-nyai-beach-riverboats');
assert.equal(xaiDrawing?.entity, 'laos/don-det/things-to-do/xai-kong-nyai-beach');
assert.equal(xaiDrawing?.provenance, 'original-illustration');
assert.equal(xaiDrawing?.treatment, 'none');
assert.equal(xaiDrawing?.rightsBasis, 'creator-owned');

const donDetPermissionMedia = donDetItems.filter((item) => item.provenance === 'authorized-third-party');
assert.equal(donDetPermissionMedia.length, 3, 'Don Det hero photo + two Essential Info media are permission-granted');
for (const item of donDetPermissionMedia) {
  assert.equal(item.rightsBasis, 'permission-granted');
  assert.ok(item.permissionNote);
}
assert.equal(byId.get('don-det-hero-photo')?.rightsBasis, 'permission-granted');
assert.equal(byId.get('don-det-don-det-ferry-essential-info')?.rightsBasis, 'permission-granted');
assert.equal(byId.get('don-det-khon-health-center-khonnua-essential-info')?.rightsBasis, 'permission-granted');

const donDetFieldNoteIds = [
  'don-det-field-note-sunset-pirogue',
  'don-det-field-note-ricefields',
  'don-det-field-note-bridge-sunrise',
  'don-det-field-note-chapter-seven-sunset-islands',
];
for (const id of donDetFieldNoteIds) {
  const item = byId.get(id);
  assert.ok(item, `${id}: missing from canonical provenance registry`);
  assert.equal(item.entity, 'laos/don-det/city-field-note');
  assert.equal(item.provenance, 'wikimedia');
  assert.equal(item.treatment, 'none');
  assert.equal(item.sourceType, 'wikimedia');
}
assert.equal(byId.get('don-det-field-note-ricefields')?.rightsBasis, 'public-domain');
for (const id of donDetFieldNoteIds.filter((id) => id !== 'don-det-field-note-ricefields')) {
  assert.equal(byId.get(id)?.rightsBasis, 'open-license');
}

console.log('Media provenance registry tests passed.');
