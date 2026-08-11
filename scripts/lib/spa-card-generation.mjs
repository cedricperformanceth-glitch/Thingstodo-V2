import { readFileSync } from 'node:fs';

const contract = JSON.parse(readFileSync(new URL('../../pipeline/contracts/spa-card-generation.json', import.meta.url), 'utf8'));

export const SPA_CARD_GENERATION_CONTRACT = contract;

const wordCount = (value) => String(value ?? '').trim().split(/\s+/).filter(Boolean).length;
const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export function validateSpaCardCandidate(candidate, kind = 'place') {
  const errors = [];
  const image = candidate?.image ?? candidate?.media?.card?.image;
  const spaCard = candidate?.spaCard;

  if (!image?.src) errors.push('photo is required');
  if (!String(candidate?.name ?? '').trim()) errors.push('exact name is required');

  const description = String(candidate?.shortDescription ?? '').trim();
  if (!description) errors.push('short description is required');
  else if (wordCount(description) > contract.allCards.shortDescription.hardMaxWords) {
    errors.push(`short description must be at most ${contract.allCards.shortDescription.hardMaxWords} words`);
  }

  if (!isHttpUrl(candidate?.googleMapsUrl)) errors.push('valid Google Maps URL is required');

  const tags = spaCard?.handwrittenTags;
  if (!Array.isArray(tags) || tags.length !== contract.allCards.handwrittenTags.count) {
    errors.push(`exactly ${contract.allCards.handwrittenTags.count} handwritten tags are required`);
  } else {
    tags.forEach((tag, index) => {
      const words = wordCount(tag);
      if (words < 1 || words > contract.allCards.handwrittenTags.maxWordsPerTag) {
        errors.push(`handwritten tag ${index + 1} must contain 1-${contract.allCards.handwrittenTags.maxWordsPerTag} words`);
      }
    });
  }

  if (kind === 'thing-to-do') {
    if (!String(spaCard?.duration ?? '').trim()) errors.push('activity duration is required');
    if (!contract.thingsToDoCards.costType.allowed.includes(spaCard?.costType)) errors.push('activity costType must be free or paid');
    if (!String(spaCard?.bestTime ?? '').trim()) errors.push('activity bestTime is required');
  }

  return { valid: errors.length === 0, errors };
}

export function assertValidSpaCardCandidate(candidate, kind = 'place') {
  const result = validateSpaCardCandidate(candidate, kind);
  if (!result.valid) throw new Error(`Invalid SPA card for ${candidate?.name ?? 'unnamed candidate'}: ${result.errors.join('; ')}`);
  return candidate;
}
