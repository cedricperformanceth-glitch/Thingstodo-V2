import assert from 'node:assert/strict';
import { discoverWikimediaCommonsPhotos, discoverPhotoCandidates } from './lib/photo-discovery.mjs';

const candidate = { id: 'place-river-cafe', name: 'River Cafe', coordinates: { latitude: 15.1, longitude: 105.8 } };
const context = { cityName: 'Atlas Town', country: 'laos' };

const commonsFetch = async (url) => {
  const parsed = new URL(url);
  assert.equal(parsed.hostname, 'commons.wikimedia.org');
  assert.equal(parsed.searchParams.get('generator'), 'search');
  assert.match(parsed.searchParams.get('gsrsearch') ?? '', /River Cafe/);
  return {
    ok: true,
    json: async () => ({ query: { pages: {
      10: {
        pageid: 10,
        index: 1,
        title: 'File:River Cafe Atlas Town.jpg',
        canonicalurl: 'https://commons.wikimedia.org/wiki/File:River_Cafe_Atlas_Town.jpg',
        imageinfo: [{
          thumburl: 'https://upload.wikimedia.org/river-1600.jpg', thumbwidth: 1600, thumbheight: 1000,
          url: 'https://upload.wikimedia.org/original.jpg', width: 3200, height: 2000,
          extmetadata: {
            LicenseShortName: { value: 'CC BY-SA 4.0' },
            Artist: { value: '<span>Commons Author</span>' },
            ObjectName: { value: 'River Cafe in Atlas Town' },
            ImageDescription: { value: 'River Cafe exterior in Atlas Town.' },
          },
        }],
      },
      11: {
        pageid: 11,
        index: 2,
        title: 'File:Another cafe.jpg',
        canonicalurl: 'https://commons.wikimedia.org/wiki/File:Another_cafe.jpg',
        imageinfo: [{
          thumburl: 'https://upload.wikimedia.org/other.jpg', thumbwidth: 1600, thumbheight: 1000,
          extmetadata: { LicenseShortName: { value: 'CC BY 4.0' }, Artist: { value: 'Other Author' } },
        }],
      },
    } } }),
  };
};

const commons = await discoverWikimediaCommonsPhotos(candidate, context, commonsFetch);
assert.equal(commons.length, 1, 'only an exact Commons entity match should survive');
assert.equal(commons[0].license, 'CC BY-SA 4.0');
assert.equal(commons[0].author, 'Commons Author');
assert.equal(commons[0].sourceName, 'Wikimedia Commons');
assert.equal(commons[0].sourceConfidence, 1);
assert.equal(commons[0].subjectVerified, true);

const combined = await discoverPhotoCandidates(candidate, context, { fetchImpl: commonsFetch, mode: 'place' });
assert.equal(combined.length, 1);

const incompatibleLicenseFetch = async () => ({
  ok: true,
  json: async () => ({ query: { pages: { 1: {
    pageid: 1,
    index: 1,
    title: 'File:River Cafe.jpg',
    canonicalurl: 'https://commons.wikimedia.org/wiki/File:River_Cafe.jpg',
    imageinfo: [{
      thumburl: 'https://upload.wikimedia.org/nc.jpg', thumbwidth: 1600, thumbheight: 1000,
      extmetadata: { LicenseShortName: { value: 'CC BY-NC 4.0' }, Artist: { value: 'Author' } },
    }],
  } } } }),
});
assert.equal((await discoverWikimediaCommonsPhotos(candidate, context, incompatibleLicenseFetch)).length, 0, 'non-commercial Commons media must be rejected');

const activityCandidate = { id: 'thing-river-falls', name: 'River Falls' };
const activityFetch = async (url) => {
  const parsed = new URL(url);
  assert.equal(parsed.hostname, 'commons.wikimedia.org');
  assert.equal(parsed.searchParams.get('gsrlimit'), '24', 'activities may keep a larger Commons reserve from the same API request');
  return {
    ok: true,
    json: async () => ({ query: { pages: Object.fromEntries(Array.from({ length: 24 }, (_, index) => {
      const number = index + 1;
      return [number, {
        pageid: number,
        index: number,
        title: `File:River Falls view ${number}.jpg`,
        canonicalurl: `https://commons.wikimedia.org/wiki/File:River_Falls_view_${number}.jpg`,
        imageinfo: [{
          thumburl: `https://upload.wikimedia.org/river-falls-${number}.jpg`, thumbwidth: 1600, thumbheight: 1000,
          extmetadata: { LicenseShortName: { value: 'CC BY 4.0' }, Artist: { value: `Author ${number}` } },
        }],
      }];
    })) } }),
  };
};
const activityPhotos = await discoverPhotoCandidates(activityCandidate, context, { fetchImpl: activityFetch, mode: 'activity' });
assert.equal(activityPhotos.length, 24);
assert.equal(new Set(activityPhotos.map((photo) => photo.sourceUrl)).size, 24);

const networkFailure = await discoverPhotoCandidates(candidate, context, { fetchImpl: async () => { throw new Error('offline'); } });
assert.deepEqual(networkFailure, [], 'Commons failure must leave the normal Photo to add path available');

console.log('Wikimedia Commons photo discovery tests passed.');
