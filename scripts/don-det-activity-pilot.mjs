import assert from 'node:assert/strict';
import fs from 'node:fs';
import { setEditorialCategoryTarget, syncGenerationContract, validateSource } from './lib/city-pipeline.mjs';
import { evaluateCandidateAcceptance } from './lib/verification-engine.mjs';
import { materializeSpaCardEditorial } from './lib/spa-card-editorial.mjs';
import { applySpaCardPhotoSelection } from './lib/spa-card-media.mjs';
import { assertValidSpaCardCandidate } from './lib/spa-card-generation.mjs';

const pilot = JSON.parse(fs.readFileSync('pipeline/pilots/laos/don-det-activities.json', 'utf8'));
const draft = JSON.parse(fs.readFileSync('pipeline/cities/laos/don-det.json', 'utf8'));
const NOW = new Date('2026-08-12T00:00:00Z');

assert.equal(pilot.country, 'laos');
assert.equal(pilot.city, 'don-det');
assert.equal(pilot.target, 11);
assert.equal(pilot.activities.length, pilot.target, 'pilot activity count must equal the editorial target');
assert.equal(new Set(pilot.activities.map((item) => item.id)).size, pilot.target, 'pilot activity IDs must be unique');
assert.equal(new Set(pilot.activities.map((item) => item.name.toLowerCase())).size, pilot.target, 'pilot activity names must be unique');

// Use the exact mechanism the future admin will use: an editorial target with a manual lock.
setEditorialCategoryTarget(draft, 'things-to-do', pilot.target);
syncGenerationContract(draft);
assert.equal(draft.cityData.categoryTargets['things-to-do'], 11);
assert.equal(draft.cityData.manualLocks['categoryTargets.things-to-do']?.source, 'manual');
assert.equal(draft.cityData.manualLocks['categoryTargets.things-to-do']?.locked, true);
assert.deepEqual(
  draft.cityData.categories,
  ['things-to-do', 'restaurants', 'cafes', 'accommodation', 'practical-services'],
  'old Don Det drafts must migrate to the current village SPA category order in memory',
);

const output = [];
for (const compact of pilot.activities) {
  const candidate = expandCandidate(compact);
  for (const source of candidate.sources) validateSource(source);

  const verification = evaluateCandidateAcceptance({
    kind: compact.kind,
    signals: candidate.verificationSignals,
  }, pilot.country, NOW);
  assert.equal(verification.decision, 'accept', `${candidate.name}: verification must accept the pilot candidate`);

  candidate.verification = { ...verification, checkedAt: NOW.toISOString() };
  delete candidate.verificationSignals;

  const editorial = materializeSpaCardEditorial(candidate, candidate.editorialDraft, 'thing-to-do', candidate.editorialFacts);
  assert.equal(editorial.status, 'ready', `${candidate.name}: editorial generation must be ready`);
  assert.equal('fieldCard' in editorial.candidate, false, `${candidate.name}: SPA editorial generation must never create a Field Card`);

  const media = applySpaCardPhotoSelection(editorial.candidate);
  const ready = media.candidate;
  assertValidSpaCardCandidate(ready, 'thing-to-do');

  assert.equal(ready.googleMapsUrl.startsWith('https://www.google.com/maps/'), true, `${candidate.name}: Google Maps CTA must be present`);
  assert.equal(ready.spaCard.handwrittenTags.length, 3, `${candidate.name}: exactly three handwritten tags are required`);
  assert.ok(ready.spaCard.gettingThere, `${candidate.name}: gettingThere is required`);
  assert.ok(ready.spaCard.duration, `${candidate.name}: duration is required`);
  assert.ok(['free', 'paid'].includes(ready.spaCard.costType), `${candidate.name}: free/paid is required`);
  assert.ok(ready.spaCard.bestTime, `${candidate.name}: bestTime is required`);
  assert.equal(ready.spaCard.photoStatus, media.image ? 'verified' : 'missing');
  assert.equal(ready.spaCard.photoRequiresManualFill, !media.image);
  assert.equal('photoCandidates' in ready, false, `${candidate.name}: raw photo candidates must not leak into generated content`);

  output.push({
    id: ready.id,
    name: ready.name,
    verification: verification.reason,
    photoStatus: ready.spaCard.photoStatus,
    description: ready.shortDescription,
    gettingThere: ready.spaCard.gettingThere,
    duration: ready.spaCard.duration,
    costType: ready.spaCard.costType,
    bestTime: ready.spaCard.bestTime,
  });
}

assert.equal(output.length, 11);
const verifiedPhotos = output.filter((item) => item.photoStatus === 'verified').length;
const placeholders = output.filter((item) => item.photoStatus === 'missing').length;
assert.equal(verifiedPhotos, 4, 'pilot deliberately expects four exact licensed photos');
assert.equal(placeholders, 7, 'pilot deliberately expects seven Photo to add placeholders');

console.log('Don Det activity pilot');
console.log(`Target: ${pilot.target} activities`);
console.log(`Verified photos: ${verifiedPhotos} · Photo to add placeholders: ${placeholders}`);
for (const [index, item] of output.entries()) {
  console.log(`${String(index + 1).padStart(2, '0')}. ${item.name} · ${item.duration} · ${item.costType} · ${item.bestTime} · photo:${item.photoStatus}`);
}
console.log('Don Det 11-activity pipeline pilot passed.');

function expandCandidate(compact) {
  return {
    id: compact.id,
    name: compact.name,
    isLandmark: compact.isLandmark === true,
    googleMapsUrl: compact.googleMapsUrl,
    sources: compact.sources.map(([sourceName, sourceUrl, purpose]) => ({ sourceName, sourceUrl, purpose })),
    verificationSignals: compact.signals.map(([sourceId, authoritative, strong]) => ({
      sourceId,
      status: 'exists',
      observedAt: '2026-08-12',
      ...(authoritative ? { authoritative: true } : {}),
      ...(strong ? { strength: 'strong' } : { strength: 'supporting' }),
    })),
    editorialFacts: compact.facts.map(([id, text, field]) => ({
      id,
      text,
      field,
      verified: true,
      sourceClass: 'verified-pilot-source',
    })),
    editorialDraft: structuredClone(compact.draft),
    photoCandidates: structuredClone(compact.photoCandidates ?? []),
  };
}
