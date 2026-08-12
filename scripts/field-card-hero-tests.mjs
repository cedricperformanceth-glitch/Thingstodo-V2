import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateFieldCardHero } from './lib/field-card-hero.mjs';

const editorial = JSON.parse(readFileSync(new URL('../src/content/field-card-hero-copy.json', import.meta.url), 'utf8'));
const component = readFileSync(new URL('../src/components/field-card/FieldCardHero.astro', import.meta.url), 'utf8');
const engine = readFileSync(new URL('../src/engines/field-card/field-card-engine.ts', import.meta.url), 'utf8');
const generator = readFileSync(new URL('./generate-city.mjs', import.meta.url), 'utf8');

for (const [id, hero] of Object.entries(editorial)) {
  const result = validateFieldCardHero(hero);
  assert.equal(result.valid, true, `${id}: ${result.errors.join('; ')}`);
}

assert.equal(validateFieldCardHero({
  eyebrow: 'FIELD NOTE',
  aliases: ['One', 'Two'],
  description: 'Valid description',
  steps: ['One', 'Two', 'Three', 'Four'],
  rhythmNote: 'A note',
  photoNote: 'A photo note',
}).valid, false, 'Hero aliases must have exact cardinality');

assert.equal(validateFieldCardHero({
  eyebrow: 'FIELD NOTE',
  aliases: ['One', 'Two', 'Three'],
  description: 'Valid description',
  steps: ['One', 'Two', 'Three', 'Four'],
  rhythmNote: 'A note',
  photoNote: 'A photo note',
  title: 'Forbidden duplicate title',
}).valid, false, 'Hero must not duplicate the activity title');

assert.doesNotMatch(component, /xe-bang-fai|thakhek/i, 'Universal Hero component must not contain destination-specific branches or copy');
assert.match(component, /READ THE VISIT/, 'Universal Hero must retain the visit-axis structure');
assert.match(component, /FIELD NOTE/, 'Universal Hero must retain the field-note stamp');
assert.match(component, /Photo to add/, 'Universal Hero must preserve a visible missing-photo state');
assert.match(engine, /fieldCard\.hero/, 'Generated Field Card Hero content must be supported by the view engine');
assert.match(engine, /heroEditorial/, 'Manual editorial Hero overrides must be supported');
assert.match(generator, /candidate\.fieldCardHero/, 'City generation must accept authored Field Card Hero copy');
assert.match(generator, /assertValidFieldCardHero/, 'Authored Hero copy must be validated before generation');
assert.match(generator, /hero,\s*\n\s*whyGo:/, 'Validated Hero copy must be persisted into fieldCard.hero');

console.log(`Field Card Hero tests passed: ${Object.keys(editorial).length} authored Hero override(s) validated.`);
