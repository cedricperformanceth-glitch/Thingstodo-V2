import { readFileSync } from 'node:fs';

const contract = JSON.parse(readFileSync(new URL('../../pipeline/contracts/field-card-hero.json', import.meta.url), 'utf8'));

export const FIELD_CARD_HERO_CONTRACT = contract;

const words = (value) => String(value ?? '').trim().split(/\s+/).filter(Boolean);
const wordCount = (value) => words(value).length;
const nonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

function validateText(value, rule, label, errors) {
  if (!nonEmptyString(value)) {
    errors.push(`${label} is required`);
    return;
  }
  if (Number.isInteger(rule?.hardMaxWords) && wordCount(value) > rule.hardMaxWords) {
    errors.push(`${label} must be at most ${rule.hardMaxWords} words`);
  }
}

function validateList(value, rule, label, errors) {
  if (!Array.isArray(value) || value.length !== rule.count) {
    errors.push(`${label} must contain exactly ${rule.count} items`);
    return;
  }
  value.forEach((item, index) => {
    if (!nonEmptyString(item)) {
      errors.push(`${label} ${index + 1} is required`);
      return;
    }
    if (Number.isInteger(rule.hardMaxWordsPerItem) && wordCount(item) > rule.hardMaxWordsPerItem) {
      errors.push(`${label} ${index + 1} must be at most ${rule.hardMaxWordsPerItem} words`);
    }
  });
}

export function validateFieldCardHero(hero) {
  const errors = [];
  if (!hero || typeof hero !== 'object' || Array.isArray(hero)) {
    return { valid: false, errors: ['fieldCardHero must be an object'] };
  }

  for (const key of contract.forbiddenEditorialKeys ?? []) {
    if (Object.prototype.hasOwnProperty.call(hero, key)) errors.push(`fieldCardHero must not define ${key}; presentation owns that value`);
  }

  const rules = contract.editorialFields;
  validateText(hero.eyebrow, rules.eyebrow, 'eyebrow', errors);
  validateList(hero.aliases, rules.aliases, 'aliases', errors);
  validateText(hero.description, rules.description, 'description', errors);
  validateList(hero.steps, rules.steps, 'steps', errors);
  validateText(hero.rhythmNote, rules.rhythmNote, 'rhythmNote', errors);
  validateText(hero.photoNote, rules.photoNote, 'photoNote', errors);

  if (Array.isArray(hero.aliases) && new Set(hero.aliases.map((item) => String(item).trim().toLowerCase())).size !== hero.aliases.length) {
    errors.push('aliases must be unique');
  }
  if (Array.isArray(hero.steps) && new Set(hero.steps.map((item) => String(item).trim().toLowerCase())).size !== hero.steps.length) {
    errors.push('steps must be unique');
  }

  return { valid: errors.length === 0, errors };
}

export function assertValidFieldCardHero(hero, entityName = 'activity') {
  const result = validateFieldCardHero(hero);
  if (!result.valid) throw new Error(`Invalid Field Card Hero for ${entityName}: ${result.errors.join('; ')}`);
  return hero;
}
