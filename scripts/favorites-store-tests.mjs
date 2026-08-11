import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const values = new Map();
globalThis.localStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };

// Node 20 does not load TypeScript source directly. Transpile the store with the
// project's existing TypeScript dependency so this test exercises the real source
// without adding a second runtime or maintaining a JavaScript copy.
const storeSource = fs.readFileSync(new URL('../src/features/favorites/store.ts', import.meta.url), 'utf8');
const transpiled = ts.transpileModule(storeSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  fileName: 'store.ts',
}).outputText;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-favorites-test-'));
const tempModule = path.join(tempDir, 'store.mjs');
fs.writeFileSync(tempModule, transpiled);
const { favoriteSnapshot, favoritesStore } = await import(pathToFileURL(tempModule).href);

const laos = { type: 'place', id: 'shared-id', slug: 'same', name: 'Laos item', country: 'laos', city: 'same-city', shortDescription: 'A', googleMapsUrl: 'https://maps.example/laos', address: 'Laos address' };
const otherCountry = { ...laos, name: 'Other item', country: 'testland' };

favoritesStore.toggle(laos);
assert.equal(favoritesStore.has(laos), true);
assert.equal(JSON.parse(values.get('things-to-do-atlas:favorites')).length, 1);
favoritesStore.toggle(otherCountry);
assert.equal(favoritesStore.all().length, 2, 'country and city remain part of the global favorite identity');
favoritesStore.toggle(laos);
assert.equal(favoritesStore.has(laos), false);
assert.equal(favoritesStore.has(otherCountry), true);
const thingSnapshot = favoriteSnapshot({ id: 'thing-1', slug: 'walk', name: 'Walk', country: 'laos', city: 'same-city', category: 'things-to-do', coordinates: { latitude: 0, longitude: 0 }, shortDescription: 'Walk description', media: { card: { image: { id: 'image', src: '/walk.jpg', alt: 'Walk image', sourceType: 'manual', manual: true, locked: true } }, fieldCard: { gallery: [] } }, sourceMetadata: { sourceName: 'Atlas' }, manualLocks: {}, googleMapsUrl: 'https://maps.example/walk', isLandmark: false, longDescription: '', breadcrumbs: [], fieldCard: { template: 'compact', whyGo: '', practical: '', access: '', faq: [] } });
assert.deepEqual(thingSnapshot, { type: 'thing', id: 'thing-1', slug: 'walk', name: 'Walk', country: 'laos', city: 'same-city', shortDescription: 'Walk description', cardImage: { src: '/walk.jpg', alt: 'Walk image' }, googleMapsUrl: 'https://maps.example/walk', fieldCardPath: '/laos/same-city/things-to-do/walk', address: undefined });

// Legacy snapshots that still contain isMySelection are accepted but the obsolete field is discarded.
values.set('things-to-do-atlas:favorites', JSON.stringify([{ ...laos, isMySelection: true }]));
assert.equal('isMySelection' in favoritesStore.all()[0], false);

values.set('things-to-do-atlas:favorites', '{not valid json');
assert.deepEqual(favoritesStore.all(), [], 'corrupted localStorage never reaches the UI');
values.set('things-to-do-atlas:favorites', JSON.stringify([laos, { id: 'broken' }]));
assert.equal(favoritesStore.all().length, 1, 'valid records survive while incomplete records are discarded');
assert.equal(favoritesStore.all()[0].id, laos.id);
values.set('things-to-do-atlas:favorites', JSON.stringify({ id: 'not-an-array' }));
assert.deepEqual(favoritesStore.all(), [], 'non-array storage values are ignored');
fs.rmSync(tempDir, { recursive: true, force: true });
console.log('Favorites store tests passed.');
