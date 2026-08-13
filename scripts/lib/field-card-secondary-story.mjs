const wordCount = (value) => String(value ?? '').trim().split(/\s+/).filter(Boolean).length;
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const object = (value) => value && typeof value === 'object' && !Array.isArray(value);
const unknownKeys = (value, allowed) => Object.keys(value).filter((key) => !allowed.includes(key));

const validateChapter = (chapter, index, errors) => {
  if (!object(chapter)) {
    errors.push(`Secondary story chapter ${index + 1} must be an object.`);
    return;
  }
  for (const key of unknownKeys(chapter, ['label', 'title', 'body'])) {
    errors.push(`Secondary story chapter ${index + 1} contains unsupported key ${key}.`);
  }
  if (!text(chapter.label)) errors.push(`Secondary story chapter ${index + 1} label is required.`);
  else if (wordCount(chapter.label) > 4) errors.push(`Secondary story chapter ${index + 1} label exceeds 4 words.`);
  if (!text(chapter.title)) errors.push(`Secondary story chapter ${index + 1} title is required.`);
  else if (wordCount(chapter.title) > 12) errors.push(`Secondary story chapter ${index + 1} title exceeds 12 words.`);
  if (!text(chapter.body)) errors.push(`Secondary story chapter ${index + 1} body is required and must be one text string.`);
  else if (wordCount(chapter.body) > 220) errors.push(`Secondary story chapter ${index + 1} body exceeds 220 words.`);
};

export function validateFieldCardSecondaryStory(value) {
  const errors = [];
  if (!object(value)) return { valid: false, errors: ['Secondary story must be an object.'] };

  for (const key of unknownKeys(value, ['chapters', 'beforeYouLeave'])) {
    errors.push(`Secondary story contains unsupported key ${key}.`);
  }

  if (!Array.isArray(value.chapters) || value.chapters.length !== 2) {
    errors.push('Secondary story must contain exactly two chapters.');
  } else {
    value.chapters.forEach((chapter, index) => validateChapter(chapter, index, errors));
  }

  const before = value.beforeYouLeave;
  if (!object(before)) {
    errors.push('Secondary story beforeYouLeave is required.');
  } else {
    for (const key of unknownKeys(before, ['title', 'body', 'note'])) {
      errors.push(`Secondary story beforeYouLeave contains unsupported key ${key}.`);
    }
    if (!text(before.title)) errors.push('Secondary story beforeYouLeave title is required.');
    else if (wordCount(before.title) > 12) errors.push('Secondary story beforeYouLeave title exceeds 12 words.');
    if (!text(before.body)) errors.push('Secondary story beforeYouLeave body is required and must be one text string.');
    else if (wordCount(before.body) > 220) errors.push('Secondary story beforeYouLeave body exceeds 220 words.');

    if (!object(before.note)) {
      errors.push('Secondary story beforeYouLeave note is required.');
    } else {
      for (const key of unknownKeys(before.note, ['label', 'text'])) {
        errors.push(`Secondary story beforeYouLeave note contains unsupported key ${key}.`);
      }
      if (!text(before.note.label)) errors.push('Secondary story beforeYouLeave note label is required.');
      else if (wordCount(before.note.label) > 4) errors.push('Secondary story beforeYouLeave note label exceeds 4 words.');
      if (!text(before.note.text)) errors.push('Secondary story beforeYouLeave note text is required.');
      else if (wordCount(before.note.text) > 18) errors.push('Secondary story beforeYouLeave note text exceeds 18 words.');
    }
  }

  return { valid: errors.length === 0, errors };
}

export function assertValidFieldCardSecondaryStory(value, name = 'Field Card') {
  const result = validateFieldCardSecondaryStory(value);
  if (!result.valid) throw new Error(`${name} secondary story: ${result.errors.join('; ')}`);
  return value;
}
