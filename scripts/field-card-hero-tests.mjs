import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateFieldCardHero } from './lib/field-card-hero.mjs';

const editorial = JSON.parse(readFileSync(new URL('../src/content/field-card-editorial.json', import.meta.url), 'utf8'));
const component = readFileSync(new URL('../src/components/field-card/FieldCardHero.astro', import.meta.url), 'utf8');
const engine = readFileSync(new URL('../src/engines/field-card/field-card-engine.ts', import.meta.url), 'utf8');
const generator = readFileSync(new URL('./generate-city.mjs', import.meta.url), 'utf8');

const authoredHeroes = Object.entries(editorial).filter(([, entry]) => entry.hero);
assert.ok(authoredHeroes.length > 0, 'The canonical editorial registry must retain authored Hero overrides.');

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
assert.match(engine, /thing\.fieldCard\.hero/, 'Generated Field Card Hero content must be supported by the view engine');
assert.match(engine, /getEditorialHero/, 'Manual editorial Hero overrides must be read from the canonical editorial registry');
assert.match(generator, /candidate\.fieldCardHero/, 'City generation must accept authored Field Card Hero copy');
assert.match(generator, /assertValidFieldCardHero/, 'Authored Hero copy must be validated before generation');
assert.match(generator, /fieldCard:\s*\{[\s\S]*?\n\s*hero,/, 'Validated Hero copy must be persisted into fieldCard.hero');

console.log(`Field Card Hero tests passed: ${authoredHeroes.length} canonical Hero override(s) found.`);
