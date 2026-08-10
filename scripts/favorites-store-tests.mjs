import assert from 'node:assert/strict';

const values = new Map();
globalThis.localStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
const { favoriteSnapshot, favoritesStore } = await import('../src/features/favorites/store.ts');
const laos = { type: 'place', id: 'shared-id', slug: 'same', name: 'Laos item', country: 'laos', city: 'same-city', shortDescription: 'A', googleMapsUrl: 'https://maps.example/laos', address: 'Laos address', isMySelection: true };
const otherCountry = { ...laos, name: 'Other item', country: 'testland' };

favoritesStore.toggle(laos);
assert.equal(favoritesStore.has(laos), true);
assert.equal(JSON.parse(values.get('things-to-do-atlas:favorites')).length, 1);
favoritesStore.toggle(otherCountry);
assert.equal(favoritesStore.all().length, 2, 'country and city remain part of the global favorite identity');
favoritesStore.toggle(laos);
assert.equal(favoritesStore.has(laos), false);
assert.equal(favoritesStore.has(otherCountry), true);
const thingSnapshot = favoriteSnapshot({ id: 'thing-1', slug: 'walk', name: 'Walk', country: 'laos', city: 'same-city', category: 'things-to-do', coordinates: { latitude: 0, longitude: 0 }, shortDescription: 'Walk description', media: { hero: { stamps: [], drawings: [], photos: [] }, card: { image: { id: 'image', src: '/walk.jpg', alt: 'Walk image', sourceType: 'manual', manual: true, locked: true } }, fieldCard: { gallery: [] } }, isMySelection: false, sourceMetadata: { sourceName: 'Atlas' }, manualLocks: {}, googleMapsUrl: 'https://maps.example/walk', isLandmark: false, longDescription: '', breadcrumbs: [], fieldCard: { template: 'compact', whyGo: '', practical: '', access: '', faq: [] } });
assert.deepEqual(thingSnapshot, { type: 'thing', id: 'thing-1', slug: 'walk', name: 'Walk', country: 'laos', city: 'same-city', shortDescription: 'Walk description', cardImage: { src: '/walk.jpg', alt: 'Walk image' }, googleMapsUrl: 'https://maps.example/walk', fieldCardPath: '/laos/same-city/things-to-do/walk', address: undefined, isMySelection: false });

values.set('things-to-do-atlas:favorites', '{not valid json');
assert.deepEqual(favoritesStore.all(), [], 'corrupted localStorage never reaches the UI');
values.set('things-to-do-atlas:favorites', JSON.stringify([laos, { id: 'broken' }]));
assert.equal(favoritesStore.all().length, 1, 'valid records survive while incomplete records are discarded');
assert.equal(favoritesStore.all()[0].id, laos.id);
values.set('things-to-do-atlas:favorites', JSON.stringify({ id: 'not-an-array' }));
assert.deepEqual(favoritesStore.all(), [], 'non-array storage values are ignored');
console.log('Favorites store tests passed.');
