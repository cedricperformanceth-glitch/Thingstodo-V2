import { readFileSync } from 'node:fs';

const contract = JSON.parse(readFileSync(new URL('../../pipeline/contracts/field-card-practical.json', import.meta.url), 'utf8'));

export const FIELD_CARD_PRACTICAL_CONTRACT = contract;

const words = (value) => String(value ?? '').trim().split(/\s+/).filter(Boolean);
const wordCount = (value) => words(value).length;
const nonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const allowedTopLevelKeys = contract.editorial.contentOnlyShape.topLevelKeys;
const allowedItemKeys = contract.editorial.contentOnlyShape.itemKeys;

function validateItem(item, index, errors) {
  const path = `items[${index}]`;
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    errors.push(`${path} must be an object`);
    return;
  }

  for (const key of Object.keys(item)) {
    if (!allowedItemKeys.includes(key)) errors.push(`${path} contains unsupported key ${key}`);
  }

  for (const field of ['label', 'value']) {
    const rule = contract.editorial.item[field];
    const value = item[field];
    if (!nonEmptyString(value)) {
      errors.push(`${path}.${field} is required`);
      continue;
    }
    if (Number.isInteger(rule?.hardMaxWords) && wordCount(value) > rule.hardMaxWords) {
      errors.push(`${path}.${field} must be at most ${rule.hardMaxWords} words`);
    }
  }

  if (Object.prototype.hasOwnProperty.call(item, 'detail')) {
    const rule = contract.editorial.item.detail;
    if (!nonEmptyString(item.detail)) errors.push(`${path}.detail must be a non-empty string when provided`);
    else if (Number.isInteger(rule?.hardMaxWords) && wordCount(item.detail) > rule.hardMaxWords) {
      errors.push(`${path}.detail must be at most ${rule.hardMaxWords} words`);
    }
  }
}

export function validateFieldCardPractical(practical) {
  const errors = [];
  if (!practical || typeof practical !== 'object' || Array.isArray(practical)) {
    return { valid: false, errors: ['fieldCardPractical must be an object'] };
  }

  for (const key of Object.keys(practical)) {
    if (!allowedTopLevelKeys.includes(key)) errors.push(`fieldCardPractical contains unsupported key ${key}`);
  }

  const items = practical.items;
  if (!Array.isArray(items)) {
    errors.push('fieldCardPractical.items must be an array');
    return { valid: false, errors };
  }

  const min = contract.editorial.items.minCount;
  const max = contract.editorial.items.maxCount;
  if (items.length < min || items.length > max) errors.push(`fieldCardPractical.items must contain between ${min} and ${max} items`);

  items.forEach((item, index) => validateItem(item, index, errors));

  const labels = items.map((item) => String(item?.label ?? '').trim().toLowerCase()).filter(Boolean);
  if (new Set(labels).size !== labels.length) errors.push('fieldCardPractical.items must not repeat labels');

  return { valid: errors.length === 0, errors };
}

export function assertValidFieldCardPractical(practical, entityName = 'activity') {
  const result = validateFieldCardPractical(practical);
  if (!result.valid) throw new Error(`Invalid Field Card Practical Notes for ${entityName}: ${result.errors.join('; ')}`);
  return practical;
}
