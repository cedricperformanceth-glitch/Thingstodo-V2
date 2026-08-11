import { readFileSync } from 'node:fs';

const contract = JSON.parse(readFileSync(new URL('../../pipeline/contracts/spa-card-editorial.json', import.meta.url), 'utf8'));

export const SPA_CARD_EDITORIAL_CONTRACT = contract;

const clean = (value) => String(value ?? '').trim();
const wordCount = (value) => clean(value).split(/\s+/).filter(Boolean).length;
const normalizeText = (value) => clean(value).replace(/\s+/g, ' ');

function formatTimeToken(value) {
  const match = clean(value).toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return clean(value);
  let hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const meridiem = match[3];
  if (minute > 59) return clean(value);
  if (meridiem) {
    if (hour < 1 || hour > 12) return clean(value);
    if (meridiem === 'am') hour = hour === 12 ? 0 : hour;
    else hour = hour === 12 ? 12 : hour + 12;
  } else if (hour > 23) return clean(value);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function normalizeOpeningHours(value) {
  let text = normalizeText(value);
  if (!text) return '';
  text = text.replace(/\bevery\s*day\b|\beveryday\b/gi, 'Daily');
  text = text.replace(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:-|–|—|\bto\b)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/gi, (_match, start, end) => `${formatTimeToken(start)}–${formatTimeToken(end)}`);
  return text.replace(/\s*·\s*/g, ' · ').replace(/\s+/g, ' ').trim();
}

export function normalizeDuration(value) {
  let text = normalizeText(value);
  if (!text) return '';
  if (/^half[ -]?day$/i.test(text)) return 'Half-day';
  if (/^full[ -]?day$/i.test(text)) return 'Full day';
  text = text
    .replace(/\bhrs?\b/gi, 'hours')
    .replace(/\bmins?\b/gi, 'min')
    .replace(/\b1 hours\b/gi, '1 hour')
    .replace(/(\d)\s*(?:-|—)\s*(\d)/g, '$1–$2');
  return text;
}

export function normalizeBestTime(value) {
  const text = normalizeText(value);
  if (!text) return '';
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

export function verifiedEditorialFacts(facts = []) {
  return facts
    .filter((fact) => fact?.verified === true && clean(fact?.id) && clean(fact?.text))
    .map((fact) => ({
      id: clean(fact.id),
      text: normalizeText(fact.text),
      field: clean(fact.field) || 'general',
      sourceClass: clean(fact.sourceClass) || 'verified',
    }));
}

function outputSchema(kind) {
  const shared = {
    shortDescription: 'string',
    handwrittenTags: ['string', 'string', 'string'],
    openingHours: 'string|null',
    evidenceRefs: {
      shortDescription: ['fact-id'],
      handwrittenTags: [['fact-id'], ['fact-id'], ['fact-id']],
      openingHours: ['fact-id'],
    },
  };
  if (kind !== 'thing-to-do') return shared;
  return {
    ...shared,
    duration: 'string',
    costType: 'free|paid',
    bestTime: 'string',
    evidenceRefs: {
      ...shared.evidenceRefs,
      duration: ['fact-id'],
      costType: ['fact-id'],
      bestTime: ['fact-id'],
    },
  };
}

export function buildSpaCardEditorialBrief(candidate, kind = 'place', facts = candidate?.editorialFacts ?? []) {
  const verifiedFacts = verifiedEditorialFacts(facts);
  if (!clean(candidate?.name)) throw new Error('Editorial generation requires the verified exact name.');
  if (verifiedFacts.length === 0) throw new Error(`Editorial generation for ${candidate.name} requires at least one verified fact.`);

  return {
    contractVersion: contract.schemaVersion,
    scope: contract.scope,
    language: contract.language,
    kind,
    immutable: {
      exactName: candidate.name,
      googleMapsUrl: candidate.googleMapsUrl ?? null,
      photoSrc: candidate?.image?.src ?? candidate?.media?.card?.image?.src ?? null,
    },
    verifiedFacts,
    instructions: {
      voice: contract.voice,
      shortDescription: contract.shortDescription,
      handwrittenTags: contract.handwrittenTags,
      openingHours: contract.openingHours,
      activityMetadata: kind === 'thing-to-do' ? contract.activityMetadata : null,
      traceability: contract.traceability,
      hardRules: [
        'Use only the verified facts supplied in this brief.',
        'Do not infer a fact merely because it is typical for this kind of place.',
        'Do not copy source prose; write fresh Atlas wording.',
        'Do not alter the verified name, map URL or selected photo.',
        'If a required activity field cannot be supported, return manual-review instead of guessing.',
        'Reference the supporting verified fact IDs for every generated field.',
        'Do not generate any Field Card content.',
      ],
    },
    outputSchema: outputSchema(kind),
  };
}

function referencedIds(refs) {
  if (!Array.isArray(refs)) return [];
  return refs.flat(Infinity).map(clean).filter(Boolean);
}

function unsupportedBannedTerms(description, facts) {
  const factCorpus = facts.map((fact) => fact.text.toLowerCase()).join(' ');
  const text = description.toLowerCase();
  return contract.shortDescription.bannedUnlessDirectlySupported.filter((term) => text.includes(term) && !factCorpus.includes(term));
}

export function validateSpaCardEditorialDraft(draft, kind = 'place', facts = []) {
  const errors = [];
  const verifiedFacts = verifiedEditorialFacts(facts);
  const validIds = new Set(verifiedFacts.map((fact) => fact.id));
  const description = normalizeText(draft?.shortDescription);

  if (!description) errors.push('shortDescription is required');
  else {
    const words = wordCount(description);
    if (words > contract.shortDescription.hardMaxWords) errors.push(`shortDescription must be at most ${contract.shortDescription.hardMaxWords} words`);
    const unsupported = unsupportedBannedTerms(description, verifiedFacts);
    if (unsupported.length) errors.push(`unsupported promotional language: ${unsupported.join(', ')}`);
  }

  const tags = draft?.handwrittenTags;
  if (!Array.isArray(tags) || tags.length !== contract.handwrittenTags.count) {
    errors.push(`exactly ${contract.handwrittenTags.count} handwrittenTags are required`);
  } else {
    const normalizedTags = tags.map((tag) => normalizeText(tag).toLowerCase());
    if (new Set(normalizedTags).size !== tags.length) errors.push('handwrittenTags must be distinct');
    tags.forEach((tag, index) => {
      const words = wordCount(tag);
      if (words < contract.handwrittenTags.wordsPerTagMin || words > contract.handwrittenTags.wordsPerTagMax) {
        errors.push(`handwrittenTag ${index + 1} must contain ${contract.handwrittenTags.wordsPerTagMin}-${contract.handwrittenTags.wordsPerTagMax} words`);
      }
    });
  }

  const refs = draft?.evidenceRefs;
  if (!refs || typeof refs !== 'object') errors.push('evidenceRefs are required');
  else {
    const requiredRefFields = ['shortDescription', 'handwrittenTags'];
    if (draft?.openingHours) requiredRefFields.push('openingHours');
    if (kind === 'thing-to-do') requiredRefFields.push('duration', 'costType', 'bestTime');
    for (const field of requiredRefFields) {
      const ids = referencedIds(refs[field]);
      if (ids.length === 0) errors.push(`evidenceRefs.${field} must reference verified facts`);
      else if (ids.some((id) => !validIds.has(id))) errors.push(`evidenceRefs.${field} contains an unknown fact id`);
    }
    if (Array.isArray(tags) && tags.length === 3) {
      if (!Array.isArray(refs.handwrittenTags) || refs.handwrittenTags.length !== 3) errors.push('evidenceRefs.handwrittenTags must contain one reference group per tag');
      else refs.handwrittenTags.forEach((group, index) => {
        if (referencedIds(group).length === 0) errors.push(`handwrittenTag ${index + 1} must reference a verified fact`);
      });
    }
  }

  if (draft?.openingHours && !normalizeOpeningHours(draft.openingHours)) errors.push('openingHours must be omitted or human-readable');

  if (kind === 'thing-to-do') {
    if (!normalizeDuration(draft?.duration)) errors.push('duration is required');
    if (!['free', 'paid'].includes(draft?.costType)) errors.push('costType must be free or paid');
    const bestTime = normalizeBestTime(draft?.bestTime);
    if (!bestTime) errors.push('bestTime is required');
    else if (wordCount(bestTime) > contract.activityMetadata.bestTime.hardMaxWords) errors.push(`bestTime must be at most ${contract.activityMetadata.bestTime.hardMaxWords} words`);
  }

  if ('fieldCard' in (draft ?? {})) errors.push('Field Card output is forbidden in SPA editorial generation');

  return { valid: errors.length === 0, errors };
}

export function materializeSpaCardEditorial(candidate, draft, kind = 'place', facts = candidate?.editorialFacts ?? []) {
  const validation = validateSpaCardEditorialDraft(draft, kind, facts);
  if (!validation.valid) return { status: 'manual-review', errors: validation.errors, candidate };

  const result = structuredClone(candidate);
  result.shortDescription = normalizeText(draft.shortDescription);
  result.spaCard = {
    handwrittenTags: draft.handwrittenTags.map(normalizeText),
    ...(draft.openingHours ? { openingHours: normalizeOpeningHours(draft.openingHours) } : {}),
    ...(kind === 'thing-to-do' ? {
      duration: normalizeDuration(draft.duration),
      costType: draft.costType,
      bestTime: normalizeBestTime(draft.bestTime),
    } : {}),
  };
  result.editorialEvidenceRefs = structuredClone(draft.evidenceRefs);
  return { status: 'ready', candidate: result };
}
