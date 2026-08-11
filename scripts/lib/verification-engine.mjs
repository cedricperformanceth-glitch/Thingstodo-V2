import { sourceVerificationPlan } from './source-verification.mjs';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function timestamp(value) {
  const parsed = Date.parse(value ?? '');
  return Number.isFinite(parsed) ? parsed : null;
}

function monthsAgo(nowMs, months) {
  return nowMs - (months * 30.4375 * MS_PER_DAY);
}

function independentKey(signal) {
  return signal.independenceKey || signal.authorId || signal.sourceId || signal.sourceUrl || signal.sourceName || JSON.stringify(signal);
}

function uniqueSignals(signals) {
  const seen = new Set();
  return signals.filter((signal) => {
    const key = independentKey(signal);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function evaluateExistence(signals, country = 'laos', now = new Date()) {
  const plan = sourceVerificationPlan(country);
  if (!plan) return { status: 'manual-review', reason: 'no-country-verification-contract' };
  const rules = plan.existenceVerification;
  const nowMs = now.getTime();

  if (signals.some((signal) => signal.officialClosure === true)) {
    return { status: 'closed-permanently', reason: 'official-closure-notice' };
  }
  if (signals.some((signal) => signal.placesBusinessStatus === 'CLOSED_PERMANENTLY')) {
    return { status: 'closed-permanently', reason: 'places-api-closed-permanently' };
  }

  const operational = signals.filter((signal) => ['operational', 'exists'].includes(signal.status));
  const latestOperational = operational.reduce((latest, signal) => Math.max(latest, timestamp(signal.observedAt) ?? 0), 0);
  const cutoff = monthsAgo(nowMs, rules.permanentClosure.closureReportMaxAgeMonths);
  const recentClosureReports = uniqueSignals(signals.filter((signal) => {
    if (signal.status !== 'closed-permanently' && signal.explicitPermanentClosureReport !== true) return false;
    const observed = timestamp(signal.observedAt);
    return observed !== null && observed >= cutoff;
  }));
  const latestClosure = recentClosureReports.reduce((latest, signal) => Math.max(latest, timestamp(signal.observedAt) ?? 0), 0);

  if (
    recentClosureReports.length >= rules.permanentClosure.independentExplicitClosureReportsThreshold &&
    (!rules.permanentClosure.requireNoNewerOperationalSignal || latestOperational <= latestClosure)
  ) {
    return { status: 'closed-permanently', reason: 'three-independent-recent-closure-reports' };
  }

  if (signals.some((signal) => signal.placesBusinessStatus === 'CLOSED_TEMPORARILY' || signal.status === 'closed-temporarily')) {
    return { status: 'manual-review', reason: 'temporary-closure' };
  }

  if (latestOperational > 0) return { status: 'operational', reason: 'current-operational-signal' };
  return { status: 'unknown', reason: 'insufficient-existence-evidence' };
}

export function evaluateCandidateAcceptance({ kind = 'business', signals = [] }, country = 'laos', now = new Date()) {
  const plan = sourceVerificationPlan(country);
  if (!plan) return { decision: 'manual-review', reason: 'no-country-verification-contract' };

  const existence = evaluateExistence(signals, country, now);
  if (existence.status === 'closed-permanently') return { decision: 'reject-closed', reason: existence.reason };
  if (existence.status === 'manual-review') return { decision: 'manual-review', reason: existence.reason };

  const current = uniqueSignals(signals.filter((signal) => signal.current !== false && signal.status !== 'closed-permanently'));
  const strong = current.filter((signal) => signal.strength === 'strong' || signal.authoritative === true || signal.firstParty === true);

  if (kind === 'static-landmark' || kind === 'natural-site' || kind === 'cultural-site') {
    const rules = plan.acceptance.staticLandmarkOrNaturalSite;
    if (rules.singleCurrentAuthoritativeSourceCanConfirmExistence && current.some((signal) => signal.authoritative === true)) {
      return { decision: 'accept', reason: 'authoritative-static-site-source' };
    }
    if (current.length >= rules.otherwiseMinimumIndependentSignals) return { decision: 'accept', reason: 'multiple-independent-static-site-signals' };
    return { decision: 'manual-review', reason: 'insufficient-static-site-evidence' };
  }

  if (kind === 'public-experience') {
    const rules = plan.acceptance.publicExperience;
    if (rules.singleCurrentAuthoritativeSourceCanConfirmAvailability && current.some((signal) => signal.authoritative === true)) {
      return { decision: 'accept', reason: 'authoritative-public-experience-source' };
    }
    if (current.length >= rules.otherwiseMinimumIndependentSignals) return { decision: 'accept', reason: 'multiple-independent-public-experience-signals' };
    return { decision: 'manual-review', reason: 'insufficient-public-experience-evidence' };
  }

  const rules = plan.acceptance.businessOrOperator;
  if (current.length < rules.minimumIndependentCurrentSignals) return { decision: 'manual-review', reason: 'insufficient-independent-signals' };
  if (rules.requireAtLeastOneStrongSignal && strong.length === 0) return { decision: 'manual-review', reason: 'missing-strong-signal' };
  return { decision: 'accept', reason: 'verified-current-business-or-operator' };
}
