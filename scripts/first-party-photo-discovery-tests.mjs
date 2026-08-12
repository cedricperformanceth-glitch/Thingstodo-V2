import assert from 'node:assert/strict';
import { collectFirstPartySources, discoverFirstPartyPhotoLeads } from './lib/first-party-photo-discovery.mjs';

const candidate = {
  id: 'place-river-cafe',
  name: 'River Cafe',
  officialWebsiteUrl: 'https://rivercafe.example/',
  socialLinks: {
    facebook: 'https://www.facebook.com/rivercafeatlas/',
    instagram: 'https://www.instagram.com/rivercafeatlas/',
  },
  sources: [
    { sourceName: 'Booking.com', sourceUrl: 'https://www.booking.com/hotel/example.html', purpose: 'candidate-discovery' },
    { sourceName: 'Official profile duplicate', sourceUrl: 'https://rivercafe.example/', purpose: 'first-party', sourceType: 'first-party-official' },
  ],
};

const sources = collectFirstPartySources(candidate);
assert.equal(sources.length, 3, 'official website and two official social profiles should be retained once each');
assert.equal(sources.some((source) => source.sourceUrl.includes('booking.com')), false, 'booking/travel platforms must never be classified as first-party');

const fetchImpl = async (url) => {
  const parsed = new URL(url);
  if (parsed.hostname === 'rivercafe.example') return {
    ok: true,
    url,
    headers: { get: () => 'text/html; charset=utf-8' },
    text: async () => '<html><head><title>River Cafe · Atlas Town</title><meta property="og:image" content="/media/terrace.jpg"></head><body><img src="/media/room.jpg" alt="River Cafe room"><img src="/assets/logo.svg" alt="River Cafe logo" width="120" height="120"></body></html>',
  };
  if (parsed.hostname.includes('facebook.com')) return {
    ok: true,
    url,
    headers: { get: () => 'text/html' },
    text: async () => '<meta property="og:title" content="River Cafe"><meta property="og:image" content="https://cdn.example/facebook-preview.jpg">',
  };
  throw new Error('social platform blocked automated HTML access');
};

const leads = await discoverFirstPartyPhotoLeads(candidate, { cityName: 'Atlas Town' }, fetchImpl);
assert.equal(leads.length, 4);
assert.equal(leads[0].autoPublishable, false);
assert.equal(leads[0].rightsStatus, 'unconfirmed-first-party');
assert.equal(leads.some((lead) => lead.imageUrl === 'https://rivercafe.example/media/terrace.jpg'), true, 'official website og:image should be captured as an editorial lead');
assert.equal(leads.some((lead) => lead.imageUrl === 'https://rivercafe.example/media/room.jpg'), true, 'official website body/gallery images should be captured as editorial leads');
assert.equal(leads.some((lead) => lead.imageUrl?.includes('logo.svg')), false, 'decorative logo/icon images must be filtered out');
assert.equal(leads.some((lead) => lead.sourceType === 'facebook' && lead.imageUrl), true, 'public Facebook preview image should be captured when available');
const blockedInstagram = leads.find((lead) => lead.sourceType === 'instagram');
assert.equal(blockedInstagram?.discoveryStatus, 'page-found', 'a blocked social page remains a useful first-party page lead');
assert.equal(blockedInstagram?.autoPublishable, false);
assert.equal('license' in blockedInstagram, false, 'first-party leads must never invent a reuse licence');

console.log('First-party photo lead discovery tests passed.');
