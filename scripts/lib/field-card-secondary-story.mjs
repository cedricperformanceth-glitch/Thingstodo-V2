const wordCount = (value) => String(value ?? '').trim().split(/\s+/).filter(Boolean).length;
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const unknownKeys = (value, allowed) => Object.keys(value).filter((key) => !allowed.includes(key));

export function validateFieldCardSecondaryStory(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { valid: false, errors: ['Secondary story must be an object.'] };
  }

  for (const key of unknownKeys(value, ['label', 'title', 'body', 'note'])) {
    errors.push(`Secondary story contains unsupported key ${key}.`);
  }

  if (!text(value.label)) errors.push('Secondary story label is required.');
  else if (wordCount(value.label) > 4) errors.push('Secondary story label exceeds 4 words.');

  if (!text(value.title)) errors.push('Secondary story title is required.');
  else if (wordCount(value.title) > 12) errors.push('Secondary story title exceeds 12 words.');

  if (!text(value.body)) errors.push('Secondary story body is required and must be one text string.');
  else if (wordCount(value.body) > 220) errors.push('Secondary story body exceeds 220 words.');

  if (!value.note || typeof value.note !== 'object' || Array.isArray(value.note)) {
    errors.push('Secondary story note is required.');
  } else {
    for (const key of unknownKeys(value.note, ['label', 'text'])) {
      errors.push(`Secondary story note contains unsupported key ${key}.`);
    }
    if (!text(value.note.label)) errors.push('Secondary story note label is required.');
    else if (wordCount(value.note.label) > 4) errors.push('Secondary story note label exceeds 4 words.');
    if (!text(value.note.text)) errors.push('Secondary story note text is required.');
    else if (wordCount(value.note.text) > 18) errors.push('Secondary story note text exceeds 18 words.');
  }

  return { valid: errors.length === 0, errors };
}

export function assertValidFieldCardSecondaryStory(value, name = 'Field Card') {
  const result = validateFieldCardSecondaryStory(value);
  if (!result.valid) throw new Error(`${name} secondary story: ${result.errors.join('; ')}`);
  return value;
}
