import assert from 'node:assert/strict';
import fs from 'node:fs';

const panel = fs.readFileSync('src/components/spa/FavoritesPanel.astro', 'utf8');
const client = fs.readFileSync('src/features/favorites/client.ts', 'utf8');
assert.doesNotMatch(panel, /content\/registry\/(places|things-to-do)|\.map\(/, 'FavoritesPanel must not pre-render Atlas registries.');
assert.match(panel, /data-favorites-panel/, 'FavoritesPanel exposes an empty client-rendered container.');
assert.match(client, /favoritesStore\.all\(\)/, 'Favorites renderer reads only saved snapshots.');
assert.match(client, /groupByCountry/, 'Favorites renderer groups saved snapshots by country.');
assert.match(client, /data-favorite-country-cards/, 'Country accordions expose lazy card containers.');
assert.match(client, /if \(!cards \|\| cards\.dataset\.rendered === 'true'\) return;/, 'Closed country groups must not rebuild their cards.');
assert.match(client, /if \(details\.open\) fillCountry\(details, items\)/, 'Only the initially open country renders cards immediately.');
console.log('Favorites scalability tests passed.');
