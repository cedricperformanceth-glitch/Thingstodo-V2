import assert from 'node:assert/strict';
import { rankPlaceCandidates, scorePlaceCandidate, validateReputationSnapshot } from './lib/candidate-ranking.mjs';

const now = new Date('2026-08-12T00:00:00Z');
const cityCoordinates = { latitude: 17.97, longitude: 102.61 };
const base = { name: 'Atlas Cafe', googleMapsUrl: 'https://maps.google.com/x', address: 'Main road', coordinates: cityCoordinates, shortDescription: 'Local cafe.' };

assert.equal(validateReputationSnapshot({ sourceName: 'Platform A', rating: 4.5, ratingScale: 5, reviewCount: 30, observedAt: '2026-08-01' }).valid, true);
assert.equal(validateReputationSnapshot({ sourceName: 'Platform A', rating: 4.5, ratingScale: 5, reviewText: 'copy' }).valid, false, 'review text must never enter ranking snapshots');

const noSocial = scorePlaceCandidate(base, { cityCoordinates, now });
assert.ok(noSocial.score > 0, 'missing social presence must not eliminate a place');

const good = {
  ...base,
  id: 'good',
  rankingSignals: {
    reputation: [
      { sourceName: 'Booking platform', rating: 9.2, ratingScale: 10, reviewCount: 140, observedAt: '2026-08-05' },
      { sourceName: 'Travel platform', rating: 4.6, ratingScale: 5, reviewCount: 85, observedAt: '2026-07-20' },
      { sourceName: 'Map platform', rating: 4.7, ratingScale: 5, reviewCount: 60, observedAt: '2026-08-02' }
    ],
    firstPartyActivity: [{ sourceName: 'Instagram', observedAt: '2026-07-30', active: true }]
  }
};
const weak = {
  ...base,
  id: 'weak',
  coordinates: { latitude: 17.99, longitude: 102.63 },
  rankingSignals: { reputation: [{ sourceName: 'Other platform', rating: 3.1, ratingScale: 5, reviewCount: 45, observedAt: '2026-07-30' }] }
};
assert.equal(rankPlaceCandidates([weak, good], { cityCoordinates, now })[0].id, 'good');

const duplicateSource = scorePlaceCandidate({ ...good, rankingSignals: { reputation: [
  { sourceName: 'Same Source', rating: 5, ratingScale: 5, reviewCount: 100, observedAt: '2026-08-10' },
  { sourceName: 'Same Source', rating: 1, ratingScale: 5, reviewCount: 100, observedAt: '2026-08-09' }
] } }, { cityCoordinates, now });
assert.equal(duplicateSource.reputationSourcesUsed, 1, 'only one snapshot per source may influence ranking');

console.log('Candidate ranking tests passed.');
