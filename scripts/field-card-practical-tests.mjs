import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateFieldCardPractical } from './lib/field-card-practical.mjs';

const contract = JSON.parse(readFileSync(new URL('../pipeline/contracts/field-card-practical.json', import.meta.url), 'utf8'));
const component = readFileSync(new URL('../src/components/field-card/FieldCardPracticalNotes.astro', import.meta.url), 'utf8');
const fieldCard = readFileSync(new URL('../src/components/field-card/FieldCard.astro', import.meta.url), 'utf8');
const engine = readFileSync(new URL('../src/engines/field-card/field-card-engine.ts', import.meta.url), 'utf8');
const generator = readFileSync(new URL('./generate-city.mjs', import.meta.url), 'utf8');

const valid = {
  items: [
    { label: 'Getting there', value: 'Rough final road', detail: 'Allow extra daylight for the last approach.' },
    { label: 'Best time', value: 'Dry season' },
    { label: 'Time needed', value: 'Allow a full day' },
    { label: 'What to bring', value: 'Shoes with grip' },
  ],
};

assert.equal(validateFieldCardPractical(valid).valid, true, 'Four applicable practical notes must be valid');
assert.equal(validateFieldCardPractical({ items: valid.items.slice(0, 3) }).valid, false, 'Generated practical notes must contain at least four items');
assert.equal(validateFieldCardPractical({ items: [...valid.items, ...valid.items, valid.items[0]] }).valid, false, 'Generated practical notes must contain at most six items');
assert.equal(validateFieldCardPractical({ ...valid, layout: 'cards' }).valid, false, 'Editorial data must not own practical-note layout');
assert.equal(validateFieldCardPractical({ items: [...valid.items.slice(0, 3), { label: 'Getting there', value: 'Duplicate subject' }] }).valid, false, 'Practical notes must not repeat labels');
assert.equal(validateFieldCardPractical({ items: valid.items.map((item, index) => index === 0 ? { ...item, detail: '' } : item) }).valid, false, 'Optional detail must be non-empty when supplied');

assert.equal(contract.presentation.cards, false, 'Practical summary must not regress to separate UI cards');
assert.equal(contract.presentation.emptySlots, false, 'Practical summary must never render filler slots');
assert.equal(contract.editorial.items.minCount, 4, 'Generated practical notes must start at four useful facts');
assert.equal(contract.editorial.items.maxCount, 6, 'Generated practical notes must stop at six useful facts');
assert.match(contract.generation.paidVsFreeRule, /If the activity is free, omit a cost item/i, 'Contract must explicitly protect free activities from filler cost facts');
assert.match(contract.editorial.items.selectionRule, /applicable/i, 'Contract must prioritize applicability over checklist completeness');

assert.doesNotMatch(component, /xe-bang-fai|thakhek/i, 'Universal practical component must not contain destination-specific branches or copy');
assert.match(component, /content\.items/, 'Practical component must render authored items');
assert.match(component, /PLAN YOUR VISIT/, 'Practical component must own the generic presentation eyebrow');
assert.match(component, /at a glance/, 'Practical component must own the generic activity title pattern');
assert.match(component, /grid-template-columns:\s*repeat\(2/, 'Practical component must use the two-column desktop field-sheet layout');
assert.match(component, /last-child:nth-child\(odd\)/, 'Practical component must adapt an odd final item without an empty slot');
assert.doesNotMatch(component, /border-radius|box-shadow/, 'Practical notes must not regress to boxed dashboard cards');

assert.match(fieldCard, /FieldCardPracticalNotes/, 'Field Card must render the universal practical-notes component');
assert.doesNotMatch(fieldCard, /<h2>Practical information<\/h2>/, 'Field Card must remove the old raw practical paragraph');
assert.doesNotMatch(fieldCard, /<h2>How to get there<\/h2>/, 'Field Card must remove the old raw access paragraph');
assert.doesNotMatch(fieldCard, /<h2>Useful notes<\/h2>/, 'Field Card must remove the old raw notes paragraph');
assert.match(engine, /field-card-practical-copy\.json/, 'Field Card engine must expose a reviewed practical editorial layer');
assert.match(engine, /thing\.fieldCard\.practicalNotes/, 'Field Card engine must accept generated practical content');
assert.match(engine, /costType === 'paid'/, 'Compatibility fallback may expose cost only for paid activities');
assert.doesNotMatch(engine, /costType === 'free'[^\n]*items\.push/, 'Compatibility fallback must not manufacture a cost note for free activities');
assert.match(generator, /fieldCardPractical/, 'City generator must persist the practical-notes contract');
assert.match(generator, /assertValidFieldCardPractical/, 'City generator must validate practical notes before persistence');

console.log('Field Card practical-notes contract passed.');
