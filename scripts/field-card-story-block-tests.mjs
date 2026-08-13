import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateFieldCardPrimaryStory } from './lib/field-card-primary-story.mjs';

const editorial = JSON.parse(readFileSync(new URL('../src/content/field-card-primary-story-copy.json', import.meta.url), 'utf8'));
const contract = JSON.parse(readFileSync(new URL('../pipeline/contracts/field-card-primary-story.json', import.meta.url), 'utf8'));
const component = readFileSync(new URL('../src/components/field-card/FieldCardStoryBlock.astro', import.meta.url), 'utf8');
const fieldCard = readFileSync(new URL('../src/components/field-card/FieldCard.astro', import.meta.url), 'utf8');
const hero = readFileSync(new URL('../src/components/field-card/FieldCardHero.astro', import.meta.url), 'utf8');
const engine = readFileSync(new URL('../src/engines/field-card/field-card-engine.ts', import.meta.url), 'utf8');
const generator = readFileSync(new URL('./generate-city.mjs', import.meta.url), 'utf8');
const typography = readFileSync(new URL('../src/styles/field-card-typography.css', import.meta.url), 'utf8');
const tokens = readFileSync(new URL('../src/core/design-system/tokens.css', import.meta.url), 'utf8');

for (const [id, story] of Object.entries(editorial)) {
  const result = validateFieldCardPrimaryStory(story);
  assert.equal(result.valid, true, `${id}: ${result.errors.join('; ')}`);
}

assert.equal(validateFieldCardPrimaryStory({ chapters: [{ title: 'Only one', body: 'Body' }], note: { label: 'NOTE', text: 'Text' } }).valid, false, 'Primary story must require exactly two chapters');
assert.equal(contract.presentation.alwaysPresent, true, 'Primary story block must be universal');
assert.equal(contract.editorial.chapters.count, 2, 'Primary story contract must always expose two chapter slots');
assert.match(contract.editorial.chapters.antiPattern, /Do not fill chapter one with route or chapter two with price by habit/i, 'Contract must forbid fixed route/price semantics');
assert.doesNotMatch(component, /xe-bang-fai|thakhek/i, 'Universal story component must not contain destination-specific branches or copy');
assert.doesNotMatch(component, /ROUTE NOTE/, 'Post-it label must be editorial data, not component copy');
assert.match(component, /story\.chapters\.map/, 'Story block must render exactly the authored chapter slots');
assert.match(component, /story\.note\.label/, 'Story block must render a variable post-it label');
assert.match(component, /story\.note\.text/, 'Story block must render variable post-it text');
assert.match(component, /Photo to add/, 'Story block must keep a manual-fill placeholder when its dedicated photo is missing');
assert.match(component, /width: min\(1000px, calc\(100% - 56px\)\)/, 'Story block must remain narrower than the Field Card canvas on desktop');
assert.match(component, /border-top:/, 'Story block must retain a top divider');
assert.match(component, /border-bottom:/, 'Story block must retain a bottom divider');
assert.doesNotMatch(component, /border-left:|border-right:/, 'Story block must not gain side borders');
assert.match(component, /background: #fffdf8/, 'Story block must use the light sheet background');
assert.match(fieldCard, /<FieldCardQuickRead[\s\S]*<FieldCardStoryBlock/, 'Primary story block must render directly after Quick Read');
assert.match(fieldCard, /body:has\(\.field-card\)[\s\S]*background: #f4f0e7/, 'Field Card routes must keep the V1 paper page background');
assert.match(hero, /linear-gradient\(rgb\(255 253 248 \/ \.96\)/, 'Field Card Hero must keep the light sheet background');
assert.match(engine, /primaryStoryEditorial/, 'View engine must support editorial primary-story overrides');
assert.match(engine, /thing\.fieldCard\.primaryStory/, 'View engine must support generated primary-story content');
assert.match(engine, /storyImage = gallery\[1\]/, 'Story block must request a distinct secondary Field Card image');
assert.match(generator, /candidate\.fieldCardPrimaryStory/, 'City generation must accept authored primary-story content');
assert.match(generator, /assertValidFieldCardPrimaryStory/, 'Primary-story generation input must be validated');
assert.match(tokens, /Newsreader/, 'Field Card title/editorial font must be loaded');
assert.match(tokens, /Manrope/, 'Field Card practical font must be loaded');
assert.match(typography, /field-card-title[\s\S]*font-weight:\s*600/, 'Titles must use the Newsreader 600 role');
assert.match(typography, /field-card-editorial[\s\S]*font-weight:\s*400/, 'Narrative and captions must use the Newsreader 400 role');
assert.match(typography, /field-card-practical[\s\S]*font-weight:\s*400/, 'Practical text and labels must use the Manrope 400 role');
assert.match(typography, /field-card-story-block__note p[\s\S]*field-card-handwritten/, 'Post-it text must use the handwritten field-note role');

console.log(`Field Card primary story contract passed: ${Object.keys(editorial).length} authored override(s) validated.`);
