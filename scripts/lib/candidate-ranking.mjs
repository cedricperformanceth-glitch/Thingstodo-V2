import { readFileSync } from 'node:fs';

const contract = JSON.parse(readFileSync(new URL('../../pipeline/contracts/candidate-ranking.json', import.meta.url), 'utf8'));
export const CANDIDATE_RANKING_CONTRACT = contract;

const DAY_MS = 24 * 60 * 60 * 1000;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const clean = (value) => String(value ?? '').trim();

function ageDays(value, now) {
  const parsed = Date.parse(value ?? '');
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, (now.getTime() - parsed) / DAY_MS);
}

function linearFreshness(days, fullWithin, zeroAfter) {
  if (days === null) return 0;
  if (days <= fullWithin) return 1;
  if (days >= zeroAfter) return 0;
  return 1 - ((days - fullWithin) / (zeroAfter - fullWithin));
}

function haversineKm(a, b) {
  const lat1 = Number(a?.latitude); const lon1 = Number(a?.longitude);
  const lat2 = Number(b?.latitude); const lon2 = Number(b?.longitude);
  if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) return null;
  const rad = (value) => value * Math.PI / 180;
  const dLat = rad(lat2 - lat1); const dLon = rad(lon2 - lon1);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function validateReputationSnapshot(snapshot) {
  const errors = [];
  const forbidden = ['reviewText', 'reviews', 'quote', 'excerpt', 'reviewBodies'];
  for (const key of forbidden) if (key in (snapshot ?? {})) errors.push(`reputation snapshot must not store ${key}`);
  if (!clean(snapshot?.sourceName)) errors.push('reputation snapshot sourceName is required');
  const rating = Number(snapshot?.rating);
  const scale = Number(snapshot?.ratingScale ?? 5);
  if (!Number.isFinite(rating) || !Number.isFinite(scale) || scale <= 0 || rating < 0 || rating > scale) errors.push('reputation snapshot rating/ratingScale is invalid');
  if (snapshot?.reviewCount !== undefined && (!Number.isInteger(Number(snapshot.reviewCount)) || Number(snapshot.reviewCount) < 0)) errors.push('reputation snapshot reviewCount must be a non-negative integer');
  if (snapshot?.observedAt && !Number.isFinite(Date.parse(snapshot.observedAt))) errors.push('reputation snapshot observedAt must be a valid date');
  return { valid: errors.length === 0, errors };
}

function independentReputationSnapshots(candidate, now) {
  const snapshots = candidate?.rankingSignals?.reputation ?? [];
  const valid = snapshots
    .filter((snapshot) => validateReputationSnapshot(snapshot).valid)
    .filter((snapshot) => {
      const days = ageDays(snapshot.observedAt, now);
      return days === null || days <= contract.reputation.maximumSnapshotAgeDays;
    })
    .sort((a, b) => (Date.parse(b.observedAt ?? '') || 0) - (Date.parse(a.observedAt ?? '') || 0));
  const seen = new Set();
  const selected = [];
  for (const snapshot of valid) {
    const source = clean(snapshot.sourceName).toLowerCase();
    if (seen.has(source)) continue;
    seen.add(source);
    selected.push(snapshot);
    if (selected.length >= contract.principles.maxReputationSnapshotsUsedPerCandidate) break;
  }
  return selected;
}

function reputation01(candidate, now) {
  const snapshots = independentReputationSnapshots(candidate, now);
  const neutral = contract.reputation.neutralNormalizedRating;
  if (!snapshots.length) return { value: neutral, evidenceCount: 0 };
  let weighted = 0; let totalWeight = 0;
  for (const snapshot of snapshots) {
    const normalized = clamp(Number(snapshot.rating) / Number(snapshot.ratingScale ?? 5));
    const reviewCount = Math.min(Number(snapshot.reviewCount ?? 0), contract.reputation.reviewCountConfidenceCap);
    const confidence = Math.max(0.15, Math.log10(reviewCount + 1) / Math.log10(contract.reputation.reviewCountConfidenceCap + 1));
    const freshness = linearFreshness(ageDays(snapshot.observedAt, now), contract.freshness.fullScoreWithinDays, contract.freshness.zeroScoreAfterDays);
    const weight = confidence * (0.6 + 0.4 * freshness);
    weighted += normalized * weight;
    totalWeight += weight;
  }
  const evidenceMean = totalWeight ? weighted / totalWeight : neutral;
  const effectiveReviews = snapshots.reduce((sum, snapshot) => sum + Math.min(Number(snapshot.reviewCount ?? 0), contract.reputation.reviewCountConfidenceCap), 0);
  const evidenceWeight = effectiveReviews / (effectiveReviews + contract.reputation.priorReviewCount);
  return { value: (neutral * (1 - evidenceWeight)) + (evidenceMean * evidenceWeight), evidenceCount: snapshots.length };
}

function freshness01(candidate, now) {
  const snapshots = independentReputationSnapshots(candidate, now);
  const dates = [
    ...snapshots.map((snapshot) => snapshot.observedAt),
    ...(candidate?.rankingSignals?.firstPartyActivity ?? []).map((signal) => signal.observedAt),
    ...(candidate?.verificationSignals ?? []).map((signal) => signal.observedAt),
  ].filter(Boolean);
  if (!dates.length) return 0.35;
  const parsed = dates.map((value) => ageDays(value, now)).filter((value) => value !== null);
  if (!parsed.length) return 0.35;
  const newestDays = Math.min(...parsed);
  return linearFreshness(newestDays, contract.freshness.fullScoreWithinDays, contract.freshness.zeroScoreAfterDays);
}

function firstPartyActivity01(candidate, now) {
  const signals = candidate?.rankingSignals?.firstPartyActivity ?? [];
  const current = signals.filter((signal) => signal?.active !== false && Number.isFinite(Date.parse(signal?.observedAt ?? '')));
  if (!current.length) return 0;
  const newestDays = Math.min(...current.map((signal) => ageDays(signal.observedAt, now)));
  return linearFreshness(newestDays, contract.firstPartyActivity.fullScoreWithinDays, contract.firstPartyActivity.zeroScoreAfterDays);
}

function proximity01(candidate, cityCoordinates) {
  const distance = haversineKm(candidate?.coordinates, cityCoordinates);
  if (distance === null) return 0.45;
  const { fullScoreWithinKm, zeroScoreAtKm } = contract.proximity;
  if (distance <= fullScoreWithinKm) return 1;
  if (distance >= zeroScoreAtKm) return 0;
  return 1 - ((distance - fullScoreWithinKm) / (zeroScoreAtKm - fullScoreWithinKm));
}

function verification01(candidate) {
  if (candidate?.verification?.decision === 'accept') return 1;
  if ((candidate?.verificationSignals ?? []).some((signal) => signal?.authoritative === true || signal?.firstParty === true || signal?.strength === 'strong')) return 0.85;
  return 0.55;
}

function completeness01(candidate) {
  const checks = [
    clean(candidate?.name), clean(candidate?.googleMapsUrl), clean(candidate?.address),
    Number.isFinite(Number(candidate?.coordinates?.latitude)) && Number.isFinite(Number(candidate?.coordinates?.longitude)),
    clean(candidate?.shortDescription) || candidate?.editorialDraft,
  ];
  return checks.filter(Boolean).length / checks.length;
}

export function scorePlaceCandidate(candidate, { cityCoordinates, now = new Date() } = {}) {
  const reputation = reputation01(candidate, now);
  const parts = {
    reputation: reputation.value,
    proximity: proximity01(candidate, cityCoordinates),
    freshness: freshness01(candidate, now),
    verification: verification01(candidate),
    firstPartyActivity: firstPartyActivity01(candidate, now),
    dataCompleteness: completeness01(candidate),
  };
  const score = Object.entries(contract.weights).reduce((sum, [key, weight]) => sum + ((parts[key] ?? 0) * weight), 0);
  return { score: Math.round(score * 100) / 100, parts, reputationSourcesUsed: reputation.evidenceCount };
}

export function rankPlaceCandidates(candidates, options = {}) {
  return candidates
    .map((candidate, sourceIndex) => ({ candidate, sourceIndex, rank: scorePlaceCandidate(candidate, options) }))
    .sort((a, b) => b.rank.score - a.rank.score || a.sourceIndex - b.sourceIndex)
    .map(({ candidate }) => candidate);
}
