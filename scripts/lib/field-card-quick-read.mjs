import { readFileSync } from 'node:fs';

const contract = JSON.parse(readFileSync(new URL('../../pipeline/contracts/field-card-quick-read.json', import.meta.url), 'utf8'));

export const FIELD_CARD_QUICK_READ_CONTRACT = contract;

const words = (value) => String(value ?? '').trim().split(/\s+/).filter(Boolean);
const wordCount = (value) => words(value).length;
const nonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const slots = contract.universalStructure.slots.map((slot) => slot.key);

function validateItem(item, slot, errors) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    errors.push(`${slot} must be an object`);
    return;
  }

  for (const key of contract.forbiddenItemKeys ?? []) {
    if (Object.prototype.hasOwnProperty.call(item, key)) errors.push(`${slot} must not define ${key}; presentation owns that value`);
  }

  for (const [field, rule] of Object.entries(contract.editorialItemFields ?? {})) {
    const value = item[field];
    if (!nonEmptyString(value)) {
      errors.push(`${slot}.${field} is required`);
      continue;
    }
    if (Number.isInteger(rule?.hardMaxWords) && wordCount(value) > rule.hardMaxWords) {
      errors.push(`${slot}.${field} must be at most ${rule.hardMaxWords} words`);
    }
  }
}

export function validateFieldCardQuickRead(quickRead) {
  const errors = [];
  if (!quickRead || typeof quickRead !== 'object' || Array.isArray(quickRead)) {
    return { valid: false, errors: ['fieldCardQuickRead must be an object'] };
  }

  const unknown = Object.keys(quickRead).filter((key) => !slots.includes(key));
  for (const key of unknown) errors.push(`fieldCardQuickRead contains unsupported slot ${key}`);
  for (const slot of slots) validateItem(quickRead[slot], slot, errors);

  return { valid: errors.length === 0, errors };
}

export function assertValidFieldCardQuickRead(quickRead, entityName = 'activity') {
  const result = validateFieldCardQuickRead(quickRead);
  if (!result.valid) throw new Error(`Invalid Field Card Quick Read for ${entityName}: ${result.errors.join('; ')}`);
  return quickRead;
}
