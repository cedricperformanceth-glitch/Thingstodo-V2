import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateFieldCardQuickRead } from './lib/field-card-quick-read.mjs';

const editorial = JSON.parse(readFileSync(new URL('../src/content/field-card-quick-read-copy.json', import.meta.url), 'utf8'));
const component = readFileSync(new URL('../src/components/field-card/FieldCardQuickRead.astro', import.meta.url), 'utf8');
const fieldCard = readFileSync(new URL('../src/components/field-card/FieldCard.astro', import.meta.url), 'utf8');
const engine = readFileSync(new URL('../src/engines/field-card/field-card-engine.ts', import.meta.url), 'utf8');
const generator = readFileSync(new URL('./generate-city.mjs', import.meta.url), 'utf8');

for (const [id, quickRead] of Object.entries(editorial)) {
  const result = validateFieldCardQuickRead(quickRead);
  assert.equal(result.valid, true, `${id}: ${result.errors.join('; ')}`);
}

assert.equal(validateFieldCardQuickRead({
  time: { primary: 'Full day', secondary: 'minimum' },
  route: { primary: 'Route 12', secondary: 'East' },
  budget: { primary: '50K KIP', secondary: 'entry' },
}).valid, false, 'Quick Read must contain all four universal slots');

assert.equal(validateFieldCardQuickRead({
  time: { primary: 'Full day', secondary: 'minimum', label: 'TIME' },
  route: { primary: 'Route 12', secondary: 'East' },
  budget: { primary: '50K KIP', secondary: 'entry' },
  bestFor: { primary: 'Remote adventure', secondary: 'guided travel' },
}).valid, false, 'Quick Read editorial copy must not own universal labels');

assert.doesNotMatch(component, /xe-bang-fai|thakhek/i, 'Universal Quick Read component must not contain destination-specific branches or copy');
assert.match(component, />FIELD NOTES</, 'Quick Read must retain the unnumbered Field Notes editorial label');
assert.doesNotMatch(component, /01 \/ FIELD NOTES/, 'Field Notes header must not duplicate the item numbering system');
assert.match(component, /\{thing\.name\} \/ \{country\.name\}/, 'Quick Read header must expose dynamic activity and country context');
assert.match(component, /THE QUICK READ/, 'Quick Read must retain the section title');
for (const label of ['TIME', 'ROUTE', 'BUDGET', 'BEST FOR']) assert.match(component, new RegExp(label), `Quick Read must retain ${label}`);
for (const index of ['01', '02', '03', '04']) assert.match(component, new RegExp(`index: '${index}'`), `Quick Read must retain item index ${index}`);
assert.doesNotMatch(component, /border-radius|box-shadow/, 'Quick Read modules must not become UI cards');
assert.match(fieldCard, /<FieldCardHero[\s\S]*<FieldCardQuickRead/, 'Quick Read must render directly after the Hero');
assert.match(fieldCard, /<FieldCardQuickRead \{thing\} \{country\}/, 'Quick Read must receive country context from the universal Field Card');
assert.doesNotMatch(fieldCard, /FavoriteHeart|TripButton|field-card__utility|Open Google Maps/, 'Field Cards must not render the removed utility action strip');
assert.doesNotMatch(fieldCard, /fieldCard\.whyGo|>Why go</i, 'Field Cards must never render the removed Why go block');
assert.match(engine, /fieldCard\.quickRead/, 'Generated Quick Read content must be supported by the view engine');
assert.match(engine, /quickReadEditorial/, 'Manual editorial Quick Read overrides must be supported');
assert.match(engine, /fallbackQuickRead/, 'Activities without authored Quick Read copy must retain a deterministic fallback');
assert.match(generator, /candidate\.fieldCardQuickRead/, 'City generation must accept authored Field Card Quick Read copy');
assert.match(generator, /assertValidFieldCardQuickRead/, 'Authored Quick Read copy must be validated before generation');
assert.match(generator, /quickRead,\s*\n\s*whyGo:/, 'Validated Quick Read copy must be persisted into fieldCard.quickRead');

console.log(`Field Card Quick Read tests passed: ${Object.keys(editorial).length} authored Quick Read override(s) validated.`);
