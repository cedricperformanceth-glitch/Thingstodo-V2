import assert from 'node:assert/strict';
import { evaluateCandidateAcceptance, evaluateExistence } from './lib/verification-engine.mjs';

const NOW = new Date('2026-08-11T12:00:00Z');

assert.deepEqual(
  evaluateCandidateAcceptance({
    kind: 'business',
    signals: [
      { sourceId: 'official-site', firstParty: true, strength: 'strong', status: 'operational', observedAt: '2026-08-01' },
      { sourceId: 'tourism-site', authoritative: true, status: 'exists', observedAt: '2026-07-20' },
    ],
  }, 'laos', NOW),
  { decision: 'accept', reason: 'verified-current-business-or-operator' },
);

assert.deepEqual(
  evaluateCandidateAcceptance({
    kind: 'business',
    signals: [
      { sourceId: 'single-blog', strength: 'supporting', status: 'exists', observedAt: '2026-07-01' },
    ],
  }, 'laos', NOW),
  { decision: 'manual-review', reason: 'insufficient-independent-signals' },
);

assert.deepEqual(
  evaluateCandidateAcceptance({
    kind: 'static-landmark',
    signals: [
      { sourceId: 'unesco', authoritative: true, strength: 'strong', status: 'exists', observedAt: '2026-06-01' },
    ],
  }, 'laos', NOW),
  { decision: 'accept', reason: 'authoritative-static-site-source' },
);

assert.deepEqual(
  evaluateCandidateAcceptance({
    kind: 'public-experience',
    signals: [
      { sourceId: 'official-tourism', authoritative: true, strength: 'strong', status: 'exists', observedAt: '2026-08-01' },
    ],
  }, 'laos', NOW),
  { decision: 'accept', reason: 'authoritative-public-experience-source' },
);

assert.deepEqual(
  evaluateCandidateAcceptance({
    kind: 'public-experience',
    signals: [
      { sourceId: 'guide-a', strength: 'supporting', status: 'exists', observedAt: '2026-07-01' },
      { sourceId: 'guide-b', strength: 'supporting', status: 'exists', observedAt: '2026-07-10' },
    ],
  }, 'laos', NOW),
  { decision: 'accept', reason: 'multiple-independent-public-experience-signals' },
);

assert.deepEqual(
  evaluateCandidateAcceptance({
    kind: 'public-experience',
    signals: [
      { sourceId: 'single-guide', strength: 'supporting', status: 'exists', observedAt: '2026-07-01' },
    ],
  }, 'laos', NOW),
  { decision: 'manual-review', reason: 'insufficient-public-experience-evidence' },
);

const threeClosureReports = [
  { authorId: 'traveller-1', status: 'closed-permanently', explicitPermanentClosureReport: true, observedAt: '2026-06-01' },
  { authorId: 'traveller-2', status: 'closed-permanently', explicitPermanentClosureReport: true, observedAt: '2026-06-10' },
  { authorId: 'traveller-3', status: 'closed-permanently', explicitPermanentClosureReport: true, observedAt: '2026-07-01' },
];
assert.deepEqual(
  evaluateExistence(threeClosureReports, 'laos', NOW),
  { status: 'closed-permanently', reason: 'three-independent-recent-closure-reports' },
);
assert.deepEqual(
  evaluateCandidateAcceptance({ kind: 'business', signals: threeClosureReports }, 'laos', NOW),
  { decision: 'reject-closed', reason: 'three-independent-recent-closure-reports' },
);

assert.deepEqual(
  evaluateExistence([
    ...threeClosureReports,
    { sourceId: 'official-reopened', firstParty: true, strength: 'strong', status: 'operational', observedAt: '2026-08-05' },
  ], 'laos', NOW),
  { status: 'operational', reason: 'current-operational-signal' },
);

assert.deepEqual(
  evaluateCandidateAcceptance({
    kind: 'business',
    signals: [{ sourceId: 'official-closure', officialClosure: true, observedAt: '2026-08-01' }],
  }, 'laos', NOW),
  { decision: 'reject-closed', reason: 'official-closure-notice' },
);

assert.deepEqual(
  evaluateCandidateAcceptance({
    kind: 'business',
    signals: [{ sourceId: 'places-status', placesBusinessStatus: 'CLOSED_PERMANENTLY', observedAt: '2026-08-01' }],
  }, 'laos', NOW),
  { decision: 'reject-closed', reason: 'places-api-closed-permanently' },
);

assert.deepEqual(
  evaluateCandidateAcceptance({
    kind: 'business',
    signals: [{ sourceId: 'temporary', placesBusinessStatus: 'CLOSED_TEMPORARILY', observedAt: '2026-08-01' }],
  }, 'laos', NOW),
  { decision: 'manual-review', reason: 'temporary-closure' },
);

console.log('Source verification decision tests passed.');
