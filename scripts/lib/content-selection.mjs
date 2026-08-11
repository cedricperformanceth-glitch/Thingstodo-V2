import { readFileSync } from 'node:fs';

const contentSelectionRules = JSON.parse(readFileSync(new URL('../../pipeline/contracts/content-selection.json', import.meta.url), 'utf8'));

export const CONTENT_SELECTION_RULES = contentSelectionRules;

export function selectionPlan(country, categories = []) {
  const rules = contentSelectionRules[country];
  if (!rules) return { searchArea: null, sourceStrategy: null, selectionPrinciples: null, categories: {} };
  const allowedCategories = new Set(categories);
  const categoryRules = Object.fromEntries(
    Object.entries(rules.categories ?? {})
      .filter(([category]) => allowedCategories.has(category))
      .map(([category, rule]) => [category, structuredClone(rule)]),
  );
  return {
    searchArea: structuredClone(rules.searchArea ?? null),
    sourceStrategy: structuredClone(rules.sourceStrategy ?? null),
    selectionPrinciples: structuredClone(rules.selectionPrinciples ?? null),
    categories: categoryRules,
  };
}
