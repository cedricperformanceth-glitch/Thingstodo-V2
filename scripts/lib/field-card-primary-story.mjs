const wordCount = (value) => String(value ?? '').trim().split(/\s+/).filter(Boolean).length;
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const unknownKeys = (value, allowed) => Object.keys(value).filter((key) => !allowed.includes(key));

export function validateFieldCardPrimaryStory(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { valid: false, errors: ['Primary story must be an object.'] };
  }

  for (const key of unknownKeys(value, ['chapters', 'note'])) {
    errors.push(`Primary story contains unsupported key ${key}.`);
  }

  if (!Array.isArray(value.chapters) || value.chapters.length !== 2) {
    errors.push('Primary story must contain exactly two chapters.');
  } else {
    value.chapters.forEach((chapter, index) => {
      if (!chapter || typeof chapter !== 'object' || Array.isArray(chapter)) {
        errors.push(`Chapter ${index + 1} must be an object.`);
        return;
      }
      for (const key of unknownKeys(chapter, ['label', 'title', 'body'])) {
        errors.push(`Chapter ${index + 1} contains unsupported key ${key}.`);
      }
      if (!text(chapter.label)) errors.push(`Chapter ${index + 1} label is required.`);
      else if (wordCount(chapter.label) > 4) errors.push(`Chapter ${index + 1} label exceeds 4 words.`);
      if (!text(chapter.title)) errors.push(`Chapter ${index + 1} title is required.`);
      else if (wordCount(chapter.title) > 12) errors.push(`Chapter ${index + 1} title exceeds 12 words.`);
      if (!text(chapter.body)) errors.push(`Chapter ${index + 1} body is required.`);
      else if (wordCount(chapter.body) > 220) errors.push(`Chapter ${index + 1} body exceeds 220 words.`);
    });
  }

  if (!value.note || typeof value.note !== 'object' || Array.isArray(value.note)) {
    errors.push('Primary story note is required.');
  } else {
    for (const key of unknownKeys(value.note, ['label', 'text'])) {
      errors.push(`Primary story note contains unsupported key ${key}.`);
    }
    if (!text(value.note.label)) errors.push('Primary story note label is required.');
    else if (wordCount(value.note.label) > 4) errors.push('Primary story note label exceeds 4 words.');
    if (!text(value.note.text)) errors.push('Primary story note text is required.');
    else if (wordCount(value.note.text) > 18) errors.push('Primary story note text exceeds 18 words.');
  }

  return { valid: errors.length === 0, errors };
}

export function assertValidFieldCardPrimaryStory(value, name = 'Field Card') {
  const result = validateFieldCardPrimaryStory(value);
  if (!result.valid) throw new Error(`${name} primary story: ${result.errors.join('; ')}`);
  return value;
}
