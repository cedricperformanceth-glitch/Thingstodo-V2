import assert from 'node:assert/strict';
import fs from 'node:fs';
import { emptyDraft } from './lib/city-pipeline.mjs';

const fresh = emptyDraft('testland', 'test-city', 'compact', 'city');
assert.equal('media' in fresh.cityData, false, 'new City drafts must not own a duplicate media manifest');
assert.equal('media' in fresh.cityData.hero, false, 'new City Hero data must resolve visual assets from the asset convention');
const draft = JSON.parse(fs.readFileSync('pipeline/cities/laos/don-det.json', 'utf8'));
assert.equal('media' in draft.cityData, false, 'Don Det must not keep a duplicate City media manifest');
assert.equal('media' in draft.cityData.hero, false, 'Don Det Hero photo/stamp/drawing come from the global asset resolver');
assert.equal(draft.cityData.manualLocks['hero.media.photos'], undefined, 'obsolete Hero photo media lock is removed');
for (const entity of [...draft.places, ...draft.things]) assert.equal(entity.media?.hero, undefined, 'Place/ThingToDo media must not own Hero media');
console.log('City media ownership tests passed.');
