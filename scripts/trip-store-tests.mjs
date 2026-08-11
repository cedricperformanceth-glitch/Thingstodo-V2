import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const values = new Map();
const events = [];
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
};
globalThis.window = { dispatchEvent: (event) => events.push(event) };
globalThis.CustomEvent = class CustomEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.detail = init.detail;
  }
};

// Exercise the real TypeScript store under Node 20 without maintaining a JS copy.
const storeSource = fs.readFileSync(new URL('../src/features/trip/store.ts', import.meta.url), 'utf8');
const transpiled = ts.transpileModule(storeSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  fileName: 'store.ts',
}).outputText;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-trip-test-'));
const tempModule = path.join(tempDir, 'store.mjs');
fs.writeFileSync(tempModule, transpiled);
const {
  MY_ATLAS_EVENT,
  MY_ATLAS_STORAGE_KEY,
  addToTrip,
  clearTrip,
  readTripStore,
  removeFromTrip,
} = await import(pathToFileURL(tempModule).href);

assert.deepEqual(readTripStore(), { entries: [] }, 'empty storage produces an empty Atlas');

const place = {
  id: 'place-1',
  slug: 'river-cafe',
  name: 'River Cafe',
  country: 'laos',
  city: 'don-det',
  category: 'cafes',
  shortDescription: 'Coffee by the river.',
};
const thing = {
  id: 'thing-1',
  slug: 'old-railway-bridge',
  name: 'Old Railway Bridge',
  country: 'laos',
  city: 'don-det',
  category: 'things-to-do',
  shortDescription: 'Historic bridge between the islands.',
  isLandmark: true,
};

addToTrip(place, '/laos/don-det/cafes');
let store = readTripStore();
assert.equal(store.entries.length, 1);
assert.equal(store.entries[0].kind, 'place');
assert.equal(store.entries[0].sourcePath, '/laos/don-det/cafes');

addToTrip(place, '/duplicate');
assert.equal(readTripStore().entries.length, 1, 'duplicate entities are ignored');

addToTrip(thing, '/laos/don-det/things-to-do/old-railway-bridge');
store = readTripStore();
assert.equal(store.entries.length, 2);
assert.equal(store.entries[1].kind, 'thing-to-do');

removeFromTrip(place.id);
store = readTripStore();
assert.deepEqual(store.entries.map((entry) => entry.id), [thing.id]);

values.set(MY_ATLAS_STORAGE_KEY, '{broken json');
assert.deepEqual(readTripStore(), { entries: [] }, 'corrupted storage never reaches the UI');

values.set(MY_ATLAS_STORAGE_KEY, JSON.stringify({ entries: [store.entries[0], { id: 'broken' }] }));
assert.equal(readTripStore().entries.length, 1, 'invalid saved entries are discarded individually');

clearTrip();
assert.deepEqual(readTripStore(), { entries: [] });
assert.equal(events.filter((event) => event.type === MY_ATLAS_EVENT).length, 4, 'writes emit one Atlas change event each');

fs.rmSync(tempDir, { recursive: true, force: true });
console.log('My Atlas store tests passed.');
