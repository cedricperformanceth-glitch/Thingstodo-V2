import assert from 'node:assert/strict';

const values = new Map();
globalThis.localStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
const { favoritesStore } = await import('../src/features/favorites/store.ts');
const laos = { id: 'shared-id', slug: 'same', name: 'Laos item', country: 'laos', city: 'same-city', shortDescription: 'A' };
const otherCountry = { ...laos, name: 'Other item', country: 'testland' };

favoritesStore.toggle(laos);
assert.equal(favoritesStore.has(laos), true);
assert.equal(JSON.parse(values.get('things-to-do-atlas:favorites')).length, 1);
favoritesStore.toggle(otherCountry);
assert.equal(favoritesStore.all().length, 2, 'country and city remain part of the global favorite identity');
favoritesStore.toggle(laos);
assert.equal(favoritesStore.has(laos), false);
assert.equal(favoritesStore.has(otherCountry), true);
console.log('Favorites store tests passed.');
