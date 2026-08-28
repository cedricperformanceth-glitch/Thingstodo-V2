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
    assert.ok(item.author, `${item.id}: author is required for the seeded licensed example`);
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

console.log('Media provenance registry tests passed.');
