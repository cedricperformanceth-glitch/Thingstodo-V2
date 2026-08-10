import assert from 'node:assert/strict';
import fs from 'node:fs';

const panel = fs.readFileSync('src/components/spa/FavoritesPanel.astro', 'utf8');
const client = fs.readFileSync('src/features/favorites/client.ts', 'utf8');
assert.doesNotMatch(panel, /content\/registry\/(places|things-to-do)|\.map\(/, 'FavoritesPanel must not pre-render Atlas registries.');
assert.match(panel, /data-favorites-panel/, 'FavoritesPanel exposes an empty client-rendered container.');
assert.match(client, /favoritesStore\.all\(\)/, 'Favorites renderer reads saved snapshots.');
assert.match(client, /panel\.innerHTML = saved\.map\(favoriteCard\)/, 'Favorites renderer creates only saved cards.');
console.log('Favorites scalability tests passed.');
