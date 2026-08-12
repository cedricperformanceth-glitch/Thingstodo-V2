import assert from 'node:assert/strict';
import { enrichEntitiesWithFirstPartySources } from './lib/first-party-source-enrichment.mjs';
import { places as donDetPlaces } from '../pipeline/sources/laos/don-det.places.mjs';
import { firstPartySources as donDetFirstPartySources } from '../pipeline/sources/laos/don-det.first-party.mjs';

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

const donDetResult = enrichEntitiesWithFirstPartySources(structuredClone(donDetPlaces), [], donDetFirstPartySources);
assert.equal(donDetResult.enrichedEntityIds.length, 6, 'Don Det first-party source data must resolve to six known practical candidates');
for (const entityId of donDetResult.enrichedEntityIds) {
  const entity = donDetResult.places.find((place) => place.id === entityId);
  assert.ok(entity?.firstPartySources?.length, `Don Det first-party sources must attach to ${entityId}`);
}

console.log('First-party source enrichment tests passed.');
