import assert from 'node:assert/strict';
import { mergeGenerated } from './lib/city-pipeline.mjs';

const lock = (value) => ({ value, source: 'manual', locked: true });

// A: a locked descendant survives an incoming replacement of its parent object.
const nestedImage = { media: { card: { image: 'manual-image', caption: 'old' } }, manualLocks: { 'media.card.image': lock('manual-image') } };
mergeGenerated(nestedImage, { media: { card: { image: 'generated-image', caption: 'new' } } });
assert.equal(nestedImage.media.card.image, 'manual-image');
assert.equal(nestedImage.media.card.caption, 'new');

// B: a parent lock protects its entire subtree.
const parentMedia = { media: { card: { image: 'manual-image' } }, manualLocks: { media: lock('manual-media') } };
mergeGenerated(parentMedia, { media: { card: { image: 'generated-image' }, hero: { image: 'generated-hero' } } });
assert.deepEqual(parentMedia.media, { card: { image: 'manual-image' } });

// C and D: a locked field survives while an unlocked sibling updates.
const description = { shortDescription: 'manual description', name: 'Old name', manualLocks: { shortDescription: lock('manual description') } };
mergeGenerated(description, { shortDescription: 'generated description', name: 'New name' });
assert.equal(description.shortDescription, 'manual description');
assert.equal(description.name, 'New name');

// E: incoming lock maps never erase existing editorial locks.
const locks = { shortDescription: 'manual description', manualLocks: { shortDescription: lock('manual description') } };
mergeGenerated(locks, { shortDescription: 'generated description', manualLocks: {} });
assert.deepEqual(locks.manualLocks, { shortDescription: lock('manual description') });

console.log('Manual lock merge tests passed.');
