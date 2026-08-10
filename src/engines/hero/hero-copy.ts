import type { City } from '../../core/models/types';
import { cityHeroCopyOverrides } from '../../content/city-hero-copy';

const wrapLines = (value: string, maxChars = 66, maxLines = 3) => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || !current) {
      current = candidate;
      continue;
    }

    lines.push(current);
    current = word;

    if (lines.length === maxLines - 1) break;
  }

  if (current && lines.length < maxLines) lines.push(current);

  if (lines.length === maxLines) {
    const used = lines.join(' ').split(/\s+/).length;
    if (used < words.length) lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[.,;:!?-]*$/, '')}…`;
  }

  return lines;
};

const generatedDrawingCaption = (city: City) => {
  const facts = city.hero.facts
    .map((fact) => fact.value.trim())
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .slice(0, 2);

  return facts.length ? facts.join(' · ') : `${city.name} · field notes`;
};

const generatedMessageLines = (city: City) => {
  const source = city.description.trim() || city.hero.subtitle.trim() || `${city.name} travel notes.`;
  return wrapLines(source);
};

/**
 * Hero editorial copy is destination content, not layout configuration.
 * Existing Laos copy is preserved exactly; every unlisted future destination
 * receives deterministic copy from its own City data with no destination branch.
 */
export const getCityHeroCopy = (city: City) => {
  const key = `${city.country}/${city.slug}`;
  const override = cityHeroCopyOverrides[key];

  return override ?? {
    drawingCaption: generatedDrawingCaption(city),
    messageLines: generatedMessageLines(city),
  };
};
