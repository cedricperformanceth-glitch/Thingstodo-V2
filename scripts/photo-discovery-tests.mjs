import assert from 'node:assert/strict';
import { discoverFlickrPhotos, discoverOpenversePhotos, discoverPhotoCandidates } from './lib/photo-discovery.mjs';

const candidate = { id: 'place-river-cafe', name: 'River Cafe', coordinates: { latitude: 15.1, longitude: 105.8 } };
const context = { cityName: 'Atlas Town', country: 'laos' };

const openverseFetch = async () => ({ ok: true, json: async () => ({ results: [{
  id: 'ov1', title: 'River Cafe in Atlas Town', creator: 'Open Author', license: 'by-sa', license_version: '4.0',
  width: 1600, height: 1000, url: 'https://images.example/river.jpg', foreign_landing_url: 'https://source.example/river', provider: 'wikimedia', tags: [{ name: 'river cafe' }]
}] }) });
const openverse = await discoverOpenversePhotos(candidate, context, openverseFetch);
assert.equal(openverse.length, 1);
assert.equal(openverse[0].license, 'CC BY-SA 4.0');
assert.equal(openverse[0].subjectVerified, true);

const flickrFetch = async (url) => {
  const method = new URL(url).searchParams.get('method');
  if (method === 'flickr.photos.licenses.getInfo') return { ok: true, json: async () => ({ licenses: { license: [
    { id: '4', name: 'Attribution License' }, { id: '6', name: 'Attribution-NoDerivs License' }, { id: '9', name: 'CC0' }
  ] } }) };
  if (method === 'flickr.photos.search') return { ok: true, json: async () => ({ photos: { photo: [{
    id: '42', owner: 'owner-id', ownername: 'Photographer', title: 'River Cafe storefront', tags: 'river cafe atlas', license: '4',
    url_l: 'https://live.staticflickr.com/river.jpg', width_l: 1400, height_l: 900
  }] } }) };
  throw new Error('unexpected Flickr method');
};
const flickr = await discoverFlickrPhotos(candidate, context, flickrFetch, 'test-key');
assert.equal(flickr.length, 1);
assert.equal(flickr[0].sourceName, 'Flickr');
assert.equal(flickr[0].license, 'CC BY 2.0');

const none = await discoverFlickrPhotos(candidate, context, flickrFetch, '');
assert.deepEqual(none, [], 'Flickr must be optional when no API key is configured');

const combined = await discoverPhotoCandidates(candidate, context, { fetchImpl: openverseFetch, flickrApiKey: '' });
assert.equal(combined.length, 1);

console.log('Photo discovery tests passed.');
