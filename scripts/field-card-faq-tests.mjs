import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const contract = JSON.parse(readFileSync(new URL('../pipeline/contracts/field-card-faq.json', import.meta.url), 'utf8'));
const editorialFaq = JSON.parse(readFileSync(new URL('../src/content/field-card-faq-copy.json', import.meta.url), 'utf8'));
const component = readFileSync(new URL('../src/components/field-card/FieldCardFaq.astro', import.meta.url), 'utf8');
const fieldCard = readFileSync(new URL('../src/components/field-card/FieldCard.astro', import.meta.url), 'utf8');
const engine = readFileSync(new URL('../src/engines/field-card/field-card-engine.ts', import.meta.url), 'utf8');

assert.equal(contract.editorial.exactCount, 5, 'Field Card FAQ must contain exactly five questions');
assert.equal(contract.presentation.cards, false, 'FAQ must not regress to white dashboard cards');
assert.equal(contract.presentation.surface, 'page-background', 'FAQ must sit directly on the Field Card page background');
assert.equal(contract.presentation.position, 'immediately-before-practical-notebook', 'FAQ must sit immediately before the closing practical notebook');
assert.match(contract.editorial.selectionRule, /exactly five/i, 'Editorial AI contract must explicitly select five questions');
assert.match(contract.editorial.answerRule, /supported/i, 'FAQ answers must stay grounded in supported page facts');
assert.match(contract.generation.noForcedTopics, /Do not force/i, 'FAQ generation must not force irrelevant topics');

assert.doesNotMatch(component, /xe-bang-fai|thakhek/i, 'Universal FAQ component must not contain destination-specific branches or copy');
assert.match(component, /sourceItems[\s\S]*slice\(0, 5\)/, 'FAQ presentation must cap itself at five items');
assert.match(component, /QUESTIONS BEFORE GOING/, 'FAQ component must own the generic presentation eyebrow');
assert.match(component, /<span>\{thing\.name\},<\/span>[\s\S]*<span>without the guesswork<\/span>/, 'FAQ title must keep the activity name and generic subtitle on separate lines');
assert.match(component, /grid-template-columns:\s*var\(--faq-index-column\)\s+minmax\(0, 1fr\)/, 'FAQ number and question must use separate grid columns');
assert.doesNotMatch(component, /\.field-card-faq__index\s*\{[^}]*position:\s*absolute/s, 'FAQ number must not sit behind the question');
assert.match(component, /<details/, 'FAQ must use accessible expandable questions');
assert.match(component, /field-card-faq__index/, 'FAQ must use the faded index treatment');
assert.doesNotMatch(component, /background:\s*var\(--field-card-sheet\)/, 'FAQ must remain on the page background rather than a white sheet');

assert.match(engine, /field-card-faq-copy\.json/, 'Field Card engine must expose a reviewed FAQ editorial layer');
assert.match(engine, /const fallbackFaq/, 'Field Card engine must provide a generic FAQ fallback');
assert.equal((engine.match(/question:\s*'/g) ?? []).length, 5, 'Generic fallback must define exactly five questions');
assert.match(engine, /completeFaq\(editorialFaq\[thing\.id\]\)/, 'Reviewed FAQ copy must take precedence over generated FAQ content');
assert.match(engine, /completeFaq\(thing\.fieldCard\.faq\)/, 'A complete generated five-question FAQ must replace the fallback');
assert.match(engine, /const faq = resolveFaq\(thing\)/, 'Field Card view must always resolve FAQ content');

const xeBangFaiFaq = editorialFaq['thing-xe-bang-fai-cave'];
assert.equal(xeBangFaiFaq?.length, 5, 'Xe Bang Fai reviewed FAQ must contain exactly five questions');
assert.match(xeBangFaiFaq[0].question, /day trip from Thakhek/i, 'Xe Bang Fai FAQ must preserve the original day-trip question');
assert.match(xeBangFaiFaq[1].question, /rainy season/i, 'Xe Bang Fai FAQ must preserve the original season question');
assert.match(xeBangFaiFaq[2].question, /guide/i, 'Xe Bang Fai FAQ must preserve the original guide question');
assert.match(xeBangFaiFaq[3].question, /stay near/i, 'Xe Bang Fai FAQ must preserve the original accommodation question');
assert.match(xeBangFaiFaq[4].question, /boat trip/i, 'Xe Bang Fai FAQ must preserve the original boat-duration question');

const faqPosition = fieldCard.indexOf('<FieldCardFaq');
const practicalPosition = fieldCard.indexOf('<FieldCardPracticalNotes');
assert.ok(faqPosition >= 0, 'Field Card must render the FAQ component');
assert.ok(practicalPosition >= 0, 'Field Card must still render the practical notebook');
assert.ok(faqPosition < practicalPosition, 'FAQ must render immediately before the practical notebook');
assert.match(fieldCard, /items=\{view\.faq\}/, 'Field Card must use the resolved generic or authored FAQ');

console.log('Field Card FAQ contract passed.');
