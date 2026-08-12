import assert from 'node:assert/strict';
import { discoverOpenversePhotos, discoverPhotoCandidates } from './lib/photo-discovery.mjs';

const candidate = { id: 'place-river-cafe', name: 'River Cafe', coordinates: { latitude: 15.1, longitude: 105.8 } };
const context = { cityName: 'Atlas Town', country: 'laos' };

const openverseFetch = async (url) => {
  const parsed = new URL(url);
  if (parsed.hostname === 'api.openverse.org') return { ok: true, json: async () => ({ results: [{
    id: 'ov1', title: 'River Cafe in Atlas Town', creator: 'Open Author', license: 'by-sa', license_version: '4.0',
    foreign_landing_url: 'https://commons.wikimedia.org/wiki/File:River_Cafe_Atlas_Town.jpg', provider: 'wikimedia', tags: [{ name: 'river cafe' }]
  }, {
    id: 'ov2', title: 'River Cafe elsewhere', creator: 'Other Author', license: 'by', license_version: '4.0',
    foreign_landing_url: 'https://other.example/photo', provider: 'other', tags: [{ name: 'river cafe' }]
  }] }) };
  if (parsed.hostname === 'commons.wikimedia.org') return { ok: true, json: async () => ({ query: { pages: { 1: { imageinfo: [{
    thumburl: 'https://upload.wikimedia.org/river-1600.jpg', thumbwidth: 1600, thumbheight: 1000,
    url: 'https://upload.wikimedia.org/original.jpg', width: 3200, height: 2000,
    extmetadata: { LicenseShortName: { value: 'CC BY-SA 4.0' }, Artist: { value: '<span>Commons Author</span>' } }
  }] } } } }) };
  throw new Error(`unexpected Openverse/Commons URL: ${url}`);
};
const openverse = await discoverOpenversePhotos(candidate, context, openverseFetch);
assert.equal(openverse.length, 1, 'Openverse results are only auto-materialized after source verification');
assert.equal(openverse[0].license, 'CC BY-SA 4.0');
assert.equal(openverse[0].author, 'Commons Author');
assert.equal(openverse[0].sourceName, 'Wikimedia Commons via Openverse');
assert.equal(openverse[0].sourceConfidence, 1);
assert.equal(openverse[0].subjectVerified, true);

const combined = await discoverPhotoCandidates(candidate, context, { fetchImpl: openverseFetch, mode: 'place' });
assert.equal(combined.length, 1);

const activityCandidate = { id: 'thing-river-falls', name: 'River Falls', coordinates: { latitude: 15.2, longitude: 105.9 } };
const activityContext = { cityName: 'Atlas Town', country: 'laos' };
const activityFetch = async (url) => {
  const parsed = new URL(url);
  if (parsed.hostname === 'api.openverse.org') {
    const page = Number(parsed.searchParams.get('page') ?? 1);
    const count = page === 1 ? 20 : page === 2 ? 10 : 0;
    const offset = (page - 1) * 20;
    return {
      ok: true,
      json: async () => ({
        results: Array.from({ length: count }, (_, index) => {
          const number = offset + index + 1;
          return {
            id: `falls-${number}`,
            title: `River Falls Atlas Town view ${number}`,
            creator: `Author ${number}`,
            license: 'by',
            foreign_landing_url: `https://commons.wikimedia.org/wiki/File:River_Falls_${number}.jpg`,
            provider: 'wikimedia',
            tags: [{ name: 'river falls' }],
          };
        }),
      }),
    };
  }
  if (parsed.hostname === 'commons.wikimedia.org') {
    const title = parsed.searchParams.get('titles') ?? 'File:River_Falls_1.jpg';
    const number = title.match(/(\d+)/)?.[1] ?? '1';
    return {
      ok: true,
      json: async () => ({ query: { pages: { 1: { imageinfo: [{
        thumburl: `https://upload.wikimedia.org/river-falls-${number}.jpg`, thumbwidth: 1600, thumbheight: 1000,
        url: `https://upload.wikimedia.org/river-falls-${number}-original.jpg`, width: 3200, height: 2000,
        extmetadata: { LicenseShortName: { value: 'CC BY 4.0' }, Artist: { value: `<span>Author ${number}</span>` } }
      }] } } } }),
    };
  }
  throw new Error(`unexpected activity URL: ${url}`);
};

const activityPhotos = await discoverPhotoCandidates(activityCandidate, activityContext, { fetchImpl: activityFetch, mode: 'activity' });
assert.equal(activityPhotos.length, 24, 'activity discovery should search deeper and retain a larger reusable pool');
assert.equal(new Set(activityPhotos.map((photo) => photo.sourceUrl)).size, 24, 'activity photo pool must be deduplicated');

console.log('Photo discovery tests passed.');
