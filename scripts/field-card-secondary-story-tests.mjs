import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateFieldCardSecondaryStory } from './lib/field-card-secondary-story.mjs';

const editorial = JSON.parse(readFileSync(new URL('../src/content/field-card-secondary-story-copy.json', import.meta.url), 'utf8'));
const contract = JSON.parse(readFileSync(new URL('../pipeline/contracts/field-card-secondary-story.json', import.meta.url), 'utf8'));
const component = readFileSync(new URL('../src/components/field-card/FieldCardSecondaryStory.astro', import.meta.url), 'utf8');
const fieldCard = readFileSync(new URL('../src/components/field-card/FieldCard.astro', import.meta.url), 'utf8');
const engine = readFileSync(new URL('../src/engines/field-card/field-card-engine.ts', import.meta.url), 'utf8');
const generator = readFileSync(new URL('./generate-city.mjs', import.meta.url), 'utf8');
const types = readFileSync(new URL('../src/core/models/types.ts', import.meta.url), 'utf8');

for (const [id, story] of Object.entries(editorial)) {
  const result = validateFieldCardSecondaryStory(story);
  assert.equal(result.valid, true, `${id}: ${result.errors.join('; ')}`);
}

const validStory = {
  label: 'CONDITIONS',
  title: 'Read the day before leaving',
  body: 'One editorial text belongs in this universal chapter slot.',
  note: { label: 'KEEP CLOSE', text: 'Reconfirm the detail locally.' },
};

assert.equal(validateFieldCardSecondaryStory({ ...validStory, body: ['One', 'Two'] }).valid, false, 'Secondary story must keep exactly one text string');
assert.equal(validateFieldCardSecondaryStory({ ...validStory, layout: 'custom' }).valid, false, 'Secondary story data must not own layout');
assert.equal(validateFieldCardSecondaryStory({ ...validStory, image: '/custom.jpg' }).valid, false, 'Secondary story data must not own media');
assert.equal(validateFieldCardSecondaryStory({ ...validStory, note: { ...validStory.note, position: 'left' } }).valid, false, 'Secondary story note must not own its position');

assert.equal(contract.presentation.alwaysPresent, true, 'Secondary story block must be universal');
assert.equal(contract.presentation.chapterCount, 1, 'Secondary story must expose exactly one chapter');
assert.equal(contract.presentation.chapterIndex, '03', 'Secondary story must own the structural chapter-three index');
assert.equal(contract.presentation.photo, false, 'Secondary story must not introduce a photo slot');
assert.match(contract.editorial.body.antiPattern, /Do not force this slot to be TIME/i, 'Contract must forbid fixed TIME semantics');
assert.equal(contract.editorial.contentOnlyShape.presentationKeysForbidden, true, 'Secondary story contract must keep presentation out of editorial data');

assert.doesNotMatch(component, /xe-bang-fai|thakhek/i, 'Universal secondary story component must not contain destination-specific branches or copy');
assert.doesNotMatch(component, />TIME</i, 'Universal secondary story component must not hardcode TIME');
assert.doesNotMatch(component, /<img|<figure/, 'Secondary story block must not own a photo');
assert.match(component, /03 ·/, 'Secondary story block must retain the structural chapter-three index');
assert.match(component, /story\.label/, 'Secondary story label must be editorial data');
assert.match(component, /story\.title/, 'Secondary story title must be editorial data');
assert.match(component, /story\.body/, 'Secondary story body must be editorial data');
assert.match(component, /story\.note\.label/, 'Secondary story post-it label must be editorial data');
assert.match(component, /story\.note\.text/, 'Secondary story post-it text must be editorial data');
assert.match(component, /background:\s*var\(--field-card-sheet\)/, 'Secondary story must render as a new light Field Card sheet');
assert.match(component, /font-family:\s*var\(--field-card-title\)[\s\S]*font-weight:\s*600/, 'Secondary story title must use Newsreader 600');
assert.match(component, /field-card-secondary-story__body[\s\S]*font-family:\s*var\(--field-card-editorial\)[\s\S]*font-weight:\s*400/, 'Secondary story narrative must use Newsreader 400');
assert.match(component, /field-card-secondary-story__label[\s\S]*font-family:\s*var\(--field-card-practical\)[\s\S]*font-weight:\s*400/, 'Secondary story label must use Manrope 400');
assert.match(component, /field-card-secondary-story__note p[\s\S]*font-family:\s*var\(--field-card-handwritten\)/, 'Secondary story post-it text must use the handwritten role');
assert.match(fieldCard, /<FieldCardStoryBlock[\s\S]*?<FieldCardSecondaryStory/, 'Secondary story must render directly after the Primary Story block');
assert.match(engine, /secondaryStoryEditorial/, 'View engine must support editorial secondary-story overrides');
assert.match(engine, /thing\.fieldCard\.secondaryStory/, 'View engine must support generated secondary-story content');
assert.match(engine, /fallbackSecondaryStory/, 'Legacy activities must retain a deterministic secondary-story fallback');
assert.match(types, /secondaryStory\?: FieldCardSecondaryStoryContent/, 'ThingToDo Field Card model must support secondary-story content');
assert.match(generator, /candidate\.fieldCardSecondaryStory/, 'City generation must accept authored secondary-story content');
assert.match(generator, /assertValidFieldCardSecondaryStory/, 'Secondary-story generation input must be validated');

console.log(`Field Card secondary story contract passed: ${Object.keys(editorial).length} authored override(s) validated.`);
