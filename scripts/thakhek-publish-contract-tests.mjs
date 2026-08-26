import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const placeEditorial = readFileSync(new URL('../src/content/place-card-editorial.ts', import.meta.url), 'utf8');
const placeOverrides = placeEditorial.split('export const supplementalPlaces')[0];
const descriptions = [...placeOverrides.matchAll(/shortDescription:\s*'([^']+)'/g)].map((match) => match[1].trim());

assert.ok(descriptions.length >= 35, `Expected the curated Thakhek place-card bank; found only ${descriptions.length} descriptions.`);
assert.equal(new Set(descriptions).size, descriptions.length, 'Thakhek place-card descriptions must remain unique.');

const genericPlacePhrases = [
  'option to consider when',
  'option to consider for',
  'option to compare for',
  'option to compare when',
];
for (const description of descriptions) {
  const lower = description.toLowerCase();
  for (const phrase of genericPlacePhrases) {
    assert.equal(lower.includes(phrase), false, `Generic SPA wording returned: "${description}"`);
  }
}

const mediaOverrides = readFileSync(new URL('../src/content/field-card-media-thakhek-overrides.ts', import.meta.url), 'utf8');
assert.equal(mediaOverrides.includes('See Wikimedia Commons file page'), false, 'Thakhek media overrides must use explicit licences.');
for (const licence of ['CC BY-SA 3.0', 'CC BY 2.0', 'CC BY 3.0']) {
  assert.ok(mediaOverrides.includes(licence), `Missing explicit Thakhek media licence: ${licence}`);
}
assert.match(
  mediaOverrides,
  /'xe-bang-fai-river-passage':\s*\{\s*remove:\s*true,/,
  'The non-renderable Xe Bang Fai UNESCO document URL must stay excluded from the runtime gallery.',
);

const thingRegistry = readFileSync(new URL('../src/content/registry/things-to-do.ts', import.meta.url), 'utf8');
assert.ok(thingRegistry.includes("photoStatus: 'verified' as const"), 'Editorial activity media must keep runtime photo status synchronized.');
assert.ok(thingRegistry.includes('photoRequiresManualFill: false'), 'Editorial activity media must clear stale manual-fill flags.');
assert.ok(thingRegistry.includes('fieldCard: { ...thing.media.fieldCard, gallery: editorialMedia }'), 'Editorial media must remain the runtime Field Card gallery.');

console.log(`Thakhek publication contract passed: ${descriptions.length} curated place descriptions and canonical media safeguards intact.`);
