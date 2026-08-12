import assert from 'node:assert/strict';
import { enrichEntitiesWithFirstPartySources } from './lib/first-party-source-enrichment.mjs';

const places = [{ id: 'place-a', name: 'A' }, { id: 'place-b', name: 'B' }];
const things = [{ id: 'thing-a', name: 'Thing A' }];
const entries = [
  {
    entityId: 'place-a',
    sources: [
      { sourceName: 'Official website', sourceUrl: 'https://example.com/' },
      { sourceName: 'Duplicate', sourceUrl: 'https://example.com/' },
      { sourceName: 'Official Facebook', sourceUrl: 'https://www.facebook.com/example', sourceType: 'first-party-social-network' },
    ],
  },
  { entityId: 'thing-a', sources: [{ sourceName: 'Operator', sourceUrl: 'https://operator.example/' }] },
];

const result = enrichEntitiesWithFirstPartySources(places, things, entries);
assert.deepEqual(result.enrichedEntityIds.sort(), ['place-a', 'thing-a']);
assert.equal(places[0].firstPartySources.length, 2);
assert.equal(places[0].firstPartySources[0].purpose, 'first-party');
assert.equal(places[0].firstPartySources[0].firstParty, true);
assert.equal(things[0].firstPartySources.length, 1);
assert.equal(places[1].firstPartySources, undefined);

assert.throws(
  () => enrichEntitiesWithFirstPartySources([{ id: 'place-a' }], [], [{ entityId: 'missing', sources: [{ sourceUrl: 'https://example.com/' }] }]),
  /unknown entity/,
);
assert.throws(
  () => enrichEntitiesWithFirstPartySources([{ id: 'place-a' }], [], [{ entityId: 'place-a', sources: [{ sourceUrl: 'javascript:alert(1)' }] }]),
  /http\(s\) URL/,
);

console.log('First-party source enrichment tests passed.');
