import assert from 'node:assert/strict';
import fs from 'node:fs';
import { emptyDraft } from './lib/city-pipeline.mjs';

assert.equal('media' in emptyDraft('testland', 'test-city', 'compact').cityData, false, 'new City drafts must use hero.media only');
const draft = JSON.parse(fs.readFileSync('pipeline/cities/laos/don-det.json', 'utf8'));
assert.equal('media' in draft.cityData, false, 'Don Det must not keep a duplicate City media manifest');
assert.ok(draft.cityData.hero.media.photos.length > 0, 'Don Det Hero media remains canonical');
assert.ok(draft.cityData.manualLocks['hero.media.photos'], 'Don Det keeps the canonical Hero media lock');
assert.equal(draft.cityData.manualLocks['media.hero.photos'], undefined, 'obsolete duplicate Hero lock is removed');
console.log('City media duplication tests passed.');
